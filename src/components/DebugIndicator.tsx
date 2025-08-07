import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { IdeaSubmissionRepository } from '@/repository/ideaSubmissionRepository';

interface ServiceStatus {
  firebase: 'connected' | 'disconnected' | 'testing';
  firestore: 'connected' | 'disconnected' | 'testing';
  auth: 'authenticated' | 'anonymous' | 'error';
}

interface ErrorLog {
  timestamp: string;
  service: string;
  error: string;
  details?: any;
}

interface DebugIndicatorProps {
  user?: any;
  orbEnergyLevel: number;
  onError?: (service: string, error: any, details?: any) => void;
}

export interface DebugIndicatorRef {
  logError: (service: string, error: any, details?: any) => void;
}

const DebugIndicator = forwardRef<DebugIndicatorRef, DebugIndicatorProps>(
  ({ user, orbEnergyLevel, onError }, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [services, setServices] = useState<ServiceStatus>({
    firebase: 'testing',
    firestore: 'testing', 
    auth: 'anonymous'
  });
  const [lastSubmissionTest, setLastSubmissionTest] = useState<string>('');
  const [errorLog, setErrorLog] = useState<ErrorLog[]>([]);
  const [showErrors, setShowErrors] = useState(false);
  const [firebaseConfig, setFirebaseConfig] = useState<any>({});

  // Load Firebase config for debugging
  useEffect(() => {
    // Client-side env vars need NEXT_PUBLIC_ prefix
    const config = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.IJGAI_FIREBASE_API_KEY || 'Not set',
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.IJGAI_FIREBASE_AUTH_DOMAIN || 'Not set',
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.IJGAI_FIREBASE_PROJECT_ID || 'Not set',
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.IJGAI_FIREBASE_STORAGE_BUCKET || 'Not set',
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.IJGAI_FIREBASE_MESSAGING_SENDER_ID || 'Not set',
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.IJGAI_FIREBASE_APP_ID || 'Not set',
    };
    
    console.log('Loading Firebase config from environment:', config);
    setFirebaseConfig(config);
  }, []);

  // Test Firebase connection on mount
  useEffect(() => {
    testFirebaseConnection();
  }, []);

  // Update auth status when user changes
  useEffect(() => {
    setServices(prev => ({
      ...prev,
      auth: user ? 'authenticated' : 'anonymous'
    }));
  }, [user]);

  // Expose logError function to parent component via ref
  useImperativeHandle(ref, () => ({
    logError
  }));

  // Error logging function
  const logError = (service: string, error: any, details?: any) => {
    const errorLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      service,
      error: error?.message || error?.toString() || 'Unknown error',
      details: {
        code: error?.code,
        stack: error?.stack,
        ...details
      }
    };
    
    setErrorLog(prev => [errorLog, ...prev.slice(0, 9)]); // Keep last 10 errors
    console.error(`[${service}] Error:`, error, details);
    
    // Call parent error handler if provided
    if (onError) {
      onError(service, error, details);
    }
  };

  const testFirebaseConnection = async () => {
    setServices(prev => ({ ...prev, firebase: 'testing', firestore: 'testing' }));

    try {
      // Validate Firebase config first
      const configIssues = [];
      if (firebaseConfig.projectId === 'Not set') configIssues.push('FIREBASE_PROJECT_ID missing');
      if (firebaseConfig.apiKey === 'Not set') configIssues.push('FIREBASE_API_KEY missing');
      if (firebaseConfig.authDomain === 'Not set') configIssues.push('FIREBASE_AUTH_DOMAIN missing');
      
      if (configIssues.length > 0) {
        throw new Error(`Firebase config incomplete: ${configIssues.join(', ')}`);
      }

      // Test Firestore connection by getting submission count
      const count = await IdeaSubmissionRepository.getTotalSubmissionCount();
      
      setServices(prev => ({
        ...prev,
        firebase: 'connected',
        firestore: 'connected'
      }));
      
      console.log('✅ Firebase connection successful, submission count:', count);
    } catch (error) {
      logError('Firebase Connection', error, { 
        config: firebaseConfig,
        userAgent: navigator.userAgent,
        url: window.location.href
      });
      
      setServices(prev => ({
        ...prev,
        firebase: 'disconnected',
        firestore: 'disconnected'
      }));
    }
  };

  const testSubmission = async () => {
    try {
      setLastSubmissionTest('Testing...');
      
      const testRequest = {
        message: `Debug test submission ${new Date().toISOString()}`,
        userId: user?.uid || 'debug-user',
        sessionId: 'debug-session'
      };
      
      console.log('Creating test submission with data:', testRequest);
      console.log('Firebase config check:', {
        hasApiKey: !!firebaseConfig.apiKey && firebaseConfig.apiKey !== 'Not set',
        hasProjectId: !!firebaseConfig.projectId && firebaseConfig.projectId !== 'Not set',
        projectId: firebaseConfig.projectId
      });
      
      const submissionId = await IdeaSubmissionRepository.createSubmission(testRequest);
      setLastSubmissionTest(`✅ Success: ${submissionId.substring(0, 8)}...`);
      console.log('✅ Test submission created successfully:', submissionId);
      
    } catch (error) {
      logError('Test Submission', error, { 
        testRequest: {
          message: `Debug test submission ${new Date().toISOString()}`,
          userId: user?.uid || 'debug-user',
          sessionId: 'debug-session'
        },
        userAuthenticated: !!user,
        timestamp: new Date().toISOString()
      });
      setLastSubmissionTest(`❌ Failed: ${error?.message || error}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'authenticated':
        return 'text-green-400';
      case 'disconnected':
      case 'error':
        return 'text-red-400';
      case 'anonymous':
        return 'text-yellow-400';
      case 'testing':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
      case 'authenticated':
        return '✅';
      case 'disconnected':
      case 'error':
        return '❌';
      case 'anonymous':
        return '👤';
      case 'testing':
        return '🔄';
      default:
        return '❓';
    }
  };

  // Toggle visibility with keyboard shortcut (Ctrl/Cmd + D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isVisible) {
    // Show minimal toggle button
    return (
      <div 
        className="fixed bottom-4 left-4 z-50 cursor-pointer opacity-30 hover:opacity-100 transition-opacity"
        onClick={() => setIsVisible(true)}
      >
        <div className={`bg-gray-900 border rounded px-2 py-1 text-xs flex items-center gap-1 ${
          errorLog.length > 0 ? 'border-red-500 text-red-400' : 'border-gray-600 text-gray-400'
        }`}>
          DEBUG
          {errorLog.length > 0 && (
            <span className="bg-red-500 text-white rounded-full text-xs px-1 leading-none">
              {errorLog.length}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-gray-900 border border-gray-600 rounded-lg p-4 text-xs text-gray-300 max-w-xs">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-blue-400">Debug Panel</h3>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-300 text-lg leading-none"
        >
          ×
        </button>
      </div>

      <div className="space-y-2">
        {/* Service Status */}
        <div>
          <strong className="text-yellow-400">Services:</strong>
          <div className="ml-2 space-y-1">
            <div className="flex justify-between">
              <span>Firebase:</span>
              <span className={getStatusColor(services.firebase)}>
                {getStatusIcon(services.firebase)} {services.firebase}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Firestore:</span>
              <span className={getStatusColor(services.firestore)}>
                {getStatusIcon(services.firestore)} {services.firestore}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Auth:</span>
              <span className={getStatusColor(services.auth)}>
                {getStatusIcon(services.auth)} {services.auth}
              </span>
            </div>
          </div>
        </div>

        {/* Orb Status */}
        <div>
          <strong className="text-yellow-400">Orb Energy:</strong>
          <div className="ml-2">
            <span className="text-cyan-400">{orbEnergyLevel}</span>
          </div>
        </div>

        {/* User Info */}
        <div>
          <strong className="text-yellow-400">User:</strong>
          <div className="ml-2 text-xs break-all">
            {user ? `${user.uid?.substring(0, 8)}...` : 'Anonymous'}
          </div>
        </div>

        {/* Test Buttons */}
        <div className="pt-2 border-t border-gray-700">
          <div className="space-y-1">
            <button
              onClick={testFirebaseConnection}
              className="w-full text-left text-blue-400 hover:text-blue-300 underline"
            >
              🔄 Test Connection
            </button>
            <button
              onClick={testSubmission}
              className="w-full text-left text-green-400 hover:text-green-300 underline"
            >
              📝 Test Submission
            </button>
          </div>
          {lastSubmissionTest && (
            <div className="text-xs mt-1 p-1 bg-gray-800 rounded">
              {lastSubmissionTest}
            </div>
          )}
        </div>

        {/* Error Log Section */}
        {errorLog.length > 0 && (
          <div className="pt-2 border-t border-gray-700">
            <div className="flex justify-between items-center mb-1">
              <strong className="text-red-400">Errors ({errorLog.length}):</strong>
              <button
                onClick={() => setShowErrors(!showErrors)}
                className="text-red-400 hover:text-red-300 text-xs"
              >
                {showErrors ? 'Hide' : 'Show'}
              </button>
            </div>
            
            {showErrors && (
              <div className="max-h-32 overflow-y-auto space-y-1">
                {errorLog.map((error, index) => (
                  <div key={index} className="bg-gray-800 p-2 rounded text-xs">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-red-400 font-bold">{error.service}</span>
                      <span className="text-gray-500 text-xs">
                        {new Date(error.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-red-300 mb-1 break-all">{error.error}</div>
                    {error.details?.code && (
                      <div className="text-yellow-300 text-xs">
                        Code: {error.details.code}
                      </div>
                    )}
                    {error.details && (
                      <details className="mt-1">
                        <summary className="text-gray-400 cursor-pointer text-xs">
                          Details
                        </summary>
                        <pre className="text-xs text-gray-400 mt-1 whitespace-pre-wrap break-all max-h-16 overflow-y-auto">
                          {JSON.stringify(error.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <button
              onClick={() => setErrorLog([])}
              className="text-gray-500 hover:text-gray-300 text-xs underline mt-1"
            >
              Clear Errors
            </button>
          </div>
        )}

        {/* Firebase Config Section */}
        <details className="pt-2 border-t border-gray-700">
          <summary className="text-yellow-400 cursor-pointer text-xs">
            Firebase Config
          </summary>
          <div className="mt-1 space-y-1 text-xs">
            {Object.entries(firebaseConfig).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-400">{key}:</span>
                <span className={`ml-2 break-all ${
                  value === 'Not set' ? 'text-red-400' : 'text-green-400'
                }`}>
                  {key === 'apiKey' && value !== 'Not set' 
                    ? `${value.substring(0, 8)}...` 
                    : value}
                </span>
              </div>
            ))}
          </div>
        </details>

        {/* Instructions */}
        <div className="pt-2 border-t border-gray-700 text-xs text-gray-500">
          <div>Press Ctrl/Cmd+D to toggle</div>
        </div>
      </div>
    </div>
  );
});

DebugIndicator.displayName = 'DebugIndicator';

export default DebugIndicator;