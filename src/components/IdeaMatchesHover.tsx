'use client';
import React, { useState, useEffect } from 'react';
import { IdeaMatch } from '../common/types/ideaMatch';
import { IdeaSubmission } from '../common/types/ideaSubmission';

interface IdeaMatchesHoverProps {
  userId?: string;
  ideaId?: string;
  isVisible: boolean;
  position: { x: number; y: number };
  totalIdeasCount: number;
}

interface MatchWithDetails {
  match: IdeaMatch;
  otherIdea?: IdeaSubmission;
}

const IdeaMatchesHover: React.FC<IdeaMatchesHoverProps> = ({ 
  userId, 
  ideaId, 
  isVisible, 
  position,
  totalIdeasCount 
}) => {
  const [matches, setMatches] = useState<MatchWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isVisible && userId && ideaId) {
      fetchMatches();
    }
  }, [isVisible, userId, ideaId]);

  const fetchMatches = async () => {
    if (!userId || !ideaId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/idea-matching/user-matches?userId=${userId}&ideaId=${ideaId}`);
      const data = await response.json();
      
      if (data.success) {
        // Transform the matches data for display
        const matchesWithDetails = data.matches.map((match: any) => ({
          match: {
            id: match.id,
            compatibilityScore: match.compatibilityScore,
            matchReasons: match.matchReasons,
            matchType: match.matchType,
            otherIdeaId: match.otherIdeaId,
            otherUserId: match.otherUserId,
            connectionStatus: match.connectionStatus,
            createdAt: new Date(match.createdAt)
          }
        }));
        
        setMatches(matchesWithDetails);
      } else {
        setError(data.error || 'Failed to fetch matches');
      }
    } catch (err) {
      console.error('Error fetching matches:', err);
      setError('Network error while fetching matches');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectionRequest = async (matchId: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/idea-matching/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          matchId,
          action: 'request'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Update the local state to reflect the connection request
        setMatches(prevMatches => 
          prevMatches.map(matchWithDetails => 
            matchWithDetails.match.id === matchId 
              ? {
                  ...matchWithDetails,
                  match: {
                    ...matchWithDetails.match,
                    connectionStatus: 'requested' as const
                  }
                }
              : matchWithDetails
          )
        );
        
        // Optional: Show success message to user
        console.log(data.message);
      } else {
        setError(data.error || 'Failed to send connection request');
      }
    } catch (err) {
      console.error('Error sending connection request:', err);
      setError('Network error while sending connection request');
    } finally {
      setLoading(false);
    }
  };

  const getMatchTypeColor = (matchType: string) => {
    switch (matchType) {
      case 'complementary': return 'text-green-400';
      case 'synergistic': return 'text-purple-400';
      case 'collaborative': return 'text-blue-400';
      default: return 'text-cyan-400';
    }
  };

  const getMatchTypeIcon = (matchType: string) => {
    switch (matchType) {
      case 'complementary': return '🤝';
      case 'synergistic': return '⚡';
      case 'collaborative': return '👥';
      default: return '✨';
    }
  };

  const getCompatibilityDescription = (score: number) => {
    if (score >= 80) return 'Excellent match';
    if (score >= 65) return 'Strong match';
    if (score >= 50) return 'Good match';
    return 'Potential match';
  };

  const nextBatchAt = Math.ceil(totalIdeasCount / 10) * 10;
  const ideasUntilNextBatch = nextBatchAt - totalIdeasCount;

  if (!isVisible) return null;

  return (
    <div 
      className="fixed z-50 bg-black/90 border border-white/20 rounded-lg p-4 max-w-md shadow-2xl backdrop-blur-sm"
      style={{ 
        left: position.x, 
        top: position.y,
        transform: 'translateY(-100%)' 
      }}
    >
      <div className="text-white">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          <h3 className="text-sm font-semibold">Idea Connections</h3>
        </div>

        {!userId || !ideaId ? (
          <div className="text-white/60 text-sm">
            <p>Submit an idea to discover compatible collaborators!</p>
            <div className="mt-2 text-xs">
              {totalIdeasCount > 0 ? (
                <>
                  <div>Total ideas collected: <span className="text-cyan-400">{totalIdeasCount}</span></div>
                  <div>Next matching batch in: <span className="text-yellow-400">{ideasUntilNextBatch}</span> ideas</div>
                </>
              ) : (
                <div>Be the first to submit an idea!</div>
              )}
            </div>
          </div>
        ) : loading ? (
          <div className="text-white/60 text-sm flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            <span>Finding your matches...</span>
          </div>
        ) : error ? (
          <div className="text-red-400 text-sm">
            <p>{error}</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-white/60 text-sm">
            <p>No matches found yet.</p>
            <div className="mt-2 text-xs">
              <div>Ideas need to be processed in batches of 10.</div>
              <div className="mt-1">
                Next batch in: <span className="text-yellow-400">{ideasUntilNextBatch}</span> ideas
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-xs text-white/60 mb-2">
              Found {matches.length} compatible idea{matches.length !== 1 ? 's' : ''}:
            </div>
            
            {matches.slice(0, 3).map((matchWithDetails, index) => {
              const { match } = matchWithDetails;
              return (
                <div key={match.id} className="bg-white/5 rounded p-3 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getMatchTypeIcon(match.matchType)}</span>
                      <span className={`text-xs font-semibold capitalize ${getMatchTypeColor(match.matchType)}`}>
                        {match.matchType}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-white/60">
                        {getCompatibilityDescription(match.compatibilityScore)}
                      </div>
                      <div className="text-lg font-bold text-cyan-400">
                        {match.compatibilityScore}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-white/80 space-y-1">
                    {match.matchReasons.slice(0, 2).map((reason, reasonIndex) => (
                      <div key={reasonIndex} className="flex items-start gap-1">
                        <span className="text-cyan-400 mt-0.5">•</span>
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                  
                  {match.connectionStatus === 'none' && (
                    <button 
                      className="mt-2 w-full bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-400/30 rounded px-2 py-1 text-xs text-cyan-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleConnectionRequest(match.id)}
                      disabled={loading}
                    >
                      {loading ? 'Connecting...' : 'Connect with this idea'}
                    </button>
                  )}
                  
                  {match.connectionStatus === 'requested' && (
                    <div className="mt-2 text-xs text-yellow-400 text-center">
                      Connection requested - waiting for response
                    </div>
                  )}
                  
                  {match.connectionStatus === 'connected' && (
                    <div className="mt-2 text-xs text-green-400 text-center flex items-center justify-center gap-1">
                      <span>✓</span>
                      <span>Connected - ready to collaborate!</span>
                    </div>
                  )}
                </div>
              );
            })}
            
            {matches.length > 3 && (
              <div className="text-xs text-white/60 text-center py-2">
                + {matches.length - 3} more matches available
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default IdeaMatchesHover;