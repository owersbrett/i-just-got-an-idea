'use client';
// import Placeholder from "@/components/PlaceholderComponent";
import React, { useContext, useEffect, useRef, useState } from "react";

import { Idea } from "@/common/types/idea";
import { Entry } from "@/common/types/entry";
import { Notification } from "@/common/types/notification";
import { Message } from "@/common/types/message";
import { Email } from "@/common/types/email";
import "../../styles/Common.css";
import "../../styles/TerminalInput.css";

import CentralOctahedron from "../../components/CentralOctahedron";
import { UserContext } from "../auth-page/UserContext";
import { EntryParser } from "@/common/entryParser";
import axios, { AxiosError } from "axios";
import { AxiosResponse } from "axios";
import authRepository from "@/repository/authRepository";
import { ConfirmationResult, RecaptchaVerifier } from "firebase/auth";
import { auth } from "../../../firebase/clientApp";
import { UserRepository } from "@/repository/userRepository";
import DismissableNotificationStack from "@/components/DismissableNotificationStack";
import MessageEmailForm from "@/components/MessageEmailForm";
import { API, SuccessCallback, ErrorCallback } from "../api/api";
import { TerminalRunner } from "@/utils/terminal_runner";
import { SessionContext } from "../auth-page/SessionContext";
import { IntervalConfig } from "@/common/intervalConfig";
import { TemplateConfiguration } from "@/common/types/templateConfiguration";
import { IdeaSubmissionRepository } from "@/repository/ideaSubmissionRepository";
import { CreateIdeaSubmissionRequest } from "@/common/types/ideaSubmission";
import DebugIndicator, { DebugIndicatorRef } from "@/components/DebugIndicator";
import IdeaMatchesHover from "@/components/IdeaMatchesHover";
const HomePage: React.FC = () => {
    const debugRef = useRef<DebugIndicatorRef>(null);
    const [terminalRunner, setTerminalRunner] = useState<TerminalRunner>(new TerminalRunner());
    const [history, setHistory] = useState<string>("");
    const { user } = useContext(UserContext);
    const [templateConfigurations, setTemplateConfigurations] = useState([] as TemplateConfiguration[]);
    const { session } = useContext(SessionContext);
    const [terminalValue, setTerminalValue] = useState('');
    const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
    
    // Enhanced orb growth system - starts extremely small
    const [orbEnergyLevel, setOrbEnergyLevel] = useState(0); // Start at 0 always
    const [orbSize, setOrbSize] = useState(0.005); // Start almost invisible
    const [orbColor, setOrbColor] = useState('blue'); // blue -> cyan -> white -> gold
    const [isAnimatingSubmit, setIsAnimatingSubmit] = useState(false);
    const [showGrowthBurst, setShowGrowthBurst] = useState(false);
    const [showDistantPulse, setShowDistantPulse] = useState(false);
    const [isClient, setIsClient] = useState(false); // Track client-side rendering
    
    // Spiral idea paths system
    const [spiralDots, setSpiralDots] = useState<Array<{id: string, timestamp: number}>>([]);
    const [cosmicPixels, setCosmicPixels] = useState<Array<{id: string, timestamp: number}>>([]);
    
    // Idea matches hover system
    const [showMatchesHover, setShowMatchesHover] = useState(false);
    const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
    const [userIdeaId, setUserIdeaId] = useState<string | null>(null);

    const [keywords, setKeywords] = useState([] as string[]);
    const [ideas, setIdeas] = useState([] as Idea[]);
    const [idea, setIdea] = useState(null as Idea | null);
    const [notifications, setNotifications] = useState([] as Notification[]);
    const [helperText, setHelperText] = useState('I just got an idea...');

    const parseIdeas: SuccessCallback = (response: AxiosResponse<any>) => {
        try {
            console.log("parsing ideas")
            console.log("ideasLength: " + ideas.length);

            if (response.data) {
                let currentIdeas = response.data.ideas as Idea[];
                if (currentIdeas.length != ideas.length) {
                    console.log("ideasLength:" + ideas.length)
                    console.log("currentIdeas length:" + currentIdeas.length)
                    console.log("setting ideas")
                    setIdeas(currentIdeas);
                    console.log(ideas.length)
                    console.log(currentIdeas.length)

                }
            }
        } catch (e) {
            console.error(e)
        }
    }
    const parseIdeasFailed: ErrorCallback = (response: AxiosError<any>) => {
        console.error(response);
        if (user) {
            API.postError(user.uid, "Error parsing ideas")
        }
    }


    const fetchIdeas = async () => { // Removed uid parameter since we don't need it
        const pollingEndpoint = `/api/idea-submissions`; // Changed to idea-submissions  
        let response = await API.get(pollingEndpoint, "Error getting idea submissions: ");
        if (response.data) {
            let currentCount = response.data.count as number;
            if (currentCount !== undefined) {
                let shouldSetIdeas = currentCount != ideas.length;
                console.log("Should set ideas: " + shouldSetIdeas);
                console.log("Current count from API: " + currentCount);
                console.log("Current ideas length: " + ideas.length);
                if (shouldSetIdeas) {
                    // Create fake ideas array to match count for display purposes
                    const fakeIdeas = Array(currentCount).fill(0).map((_, index) => 
                        Idea.new('anonymous', `Idea ${index + 1}`, [], index)
                    );
                    setIdeas(fakeIdeas);
                    
                    // Update orb energy level to match submission count
                    setOrbEnergyLevel(currentCount);
                }
            }
        }
    }








    const startPolling = () => { // Removed uid parameter
        fetchIdeas();

        setInterval(() => fetchIdeas(), IntervalConfig.minute);
    }
    const fetchConfigurationTemplates = async () => {
        const endpoint = `/api/templateConfigurations`
        let response = await API.get(endpoint, "Error getting template configurations: ");
        console.log("configuration templates queried!")
        if (response.data) {
            console.log(response.data);
            let data = response.data.templateConfigurations as TemplateConfiguration[];
            if (data) {
                setTemplateConfigurations(data);
            }
        }
    }


    // Calculate orb properties based on energy level - very gradual pixel-by-pixel growth
    const calculateOrbProperties = (energy: number) => {
        let size, color, intensity;
        
        // Start extremely small - barely visible
        if (energy === 0) {
            size = 0.001; // Almost completely invisible
            color = 'blue';
            intensity = 0.02; // Very dim
        } else if (energy <= 50) {
            // Each idea adds about 1 pixel of light - very gradual growth
            size = 0.001 + (energy * 0.003); // 0.001 -> 0.151 (tiny growth)
            color = 'blue';
            intensity = 0.02 + (energy * 0.005); // 0.02 -> 0.27 (very gradual)
        } else if (energy <= 100) {
            // First major milestone - becomes cyan, more visible
            size = 0.151 + ((energy - 50) * 0.008); // 0.151 -> 0.551
            color = 'cyan';
            intensity = 0.27 + ((energy - 50) * 0.008); // 0.27 -> 0.67
        } else if (energy <= 200) {
            // Second milestone - white light, clearly visible
            size = 0.551 + ((energy - 100) * 0.01); // 0.551 -> 1.551
            color = 'white';
            intensity = 0.67 + ((energy - 100) * 0.005); // 0.67 -> 1.17
        } else if (energy <= 500) {
            // Third milestone - golden light, impressive
            size = 1.551 + ((energy - 200) * 0.008); // 1.551 -> 3.951
            color = 'gold';
            intensity = Math.min(1.17 + ((energy - 200) * 0.003), 2.0); // 1.17 -> 2.0 max
        } else {
            // Maximum reached - massive golden orb
            size = Math.min(3.951 + ((energy - 500) * 0.002), 8.0); // Continues growing slowly
            color = 'gold';
            intensity = 2.0;
        }
        
        return { size, color, intensity };
    };

    useEffect(() => {
        if (user) {
            terminalRunner.sessionId = session.sessionId;
            // fetchConfigurationTemplates(); // Not needed for central octahedron
        }
        // Always start polling for idea submissions count (regardless of user auth)
        startPolling();
    }, [user]);

    // Client-side initialization to avoid hydration errors
    useEffect(() => {
        setIsClient(true);
        // Load persistent energy level from localStorage only on client
        const saved = localStorage.getItem('orbEnergyLevel');
        if (saved) {
            setOrbEnergyLevel(parseInt(saved, 10));
        }
        // Load user's idea ID if available
        const savedIdeaId = localStorage.getItem('userIdeaId');
        if (savedIdeaId) {
            setUserIdeaId(savedIdeaId);
        }
    }, []);

    // Temporarily disable real-time listener to prevent refresh issues
    // TODO: Re-enable once Firebase connection is stable
    /* 
    useEffect(() => {
        let unsubscribe: (() => void) | null = null;
        let timeoutId: NodeJS.Timeout;
        
        const setupListener = () => {
            try {
                unsubscribe = IdeaSubmissionRepository.onSubmissionCountChange((count) => {
                    setOrbEnergyLevel(prevLevel => prevLevel === count ? prevLevel : count);
                });
            } catch (error) {
                console.error('Failed to setup Firestore listener:', error);
                timeoutId = setTimeout(setupListener, 5000);
            }
        };

        timeoutId = setTimeout(setupListener, 1000);

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            if (unsubscribe) unsubscribe();
        };
    }, []);
    */

    // Update orb properties when energy level changes
    useEffect(() => {
        const { size, color } = calculateOrbProperties(orbEnergyLevel);
        
        // Only update if values actually changed
        setOrbSize(prevSize => Math.abs(prevSize - size) > 0.01 ? size : prevSize);
        setOrbColor(prevColor => prevColor !== color ? color : prevColor);
        
        // Save to localStorage (debounced to prevent excessive writes) - only on client
        if (isClient) {
            let timeoutId: NodeJS.Timeout;
            timeoutId = setTimeout(() => {
                localStorage.setItem('orbEnergyLevel', orbEnergyLevel.toString());
            }, 500);
            
            return () => {
                if (timeoutId) clearTimeout(timeoutId);
            };
        }
    }, [orbEnergyLevel, isClient]);




    const authenticate = async (input: string) => {
        if (!confirmation) {
            let phoneNumberValid = EntryParser.isPhoneNumberValid(input);
            if (phoneNumberValid) {
                await verifyRecaptcha(input);
            } else {
                API.postError("Invalid phone number. Please try again.", "session");
                console.error("Invalid phone number. this should create a notification");
            }
        } else {
            let userCredential = await authRepository.signIn(confirmation, input);
            UserRepository.getAndOrCreateUser(userCredential);
        }
    }



    function verifyRecaptcha(phoneNumber: string) {
        const recaptchaContainer = document.getElementById('recaptcha-container') ?? '';

        return new Promise((resolve, reject) => {
            const recaptchaVerifier = new RecaptchaVerifier(recaptchaContainer, {
                size: 'normal', // Use 'compact' for a smaller widget
                callback: async (_: any) => {
                    let confirmation = await authRepository.sendPhoneNumberAuthCode(phoneNumber, recaptchaVerifier);
                    setConfirmation(confirmation);
                    resolve(confirmation);
                },
                'expired-callback': () => {
                    reject(new Error('reCAPTCHA verification expired'));
                },
            }, auth);

            recaptchaVerifier.render();
        });
    }

    let onSelectIdea = (idea: Idea | null) => {
        setIdea(idea);
        terminalRunner.update(idea);
    }

    const triggerSubmitAnimation = () => {
        setIsAnimatingSubmit(true);
        setShowGrowthBurst(true);
        
        // Add new spiral dot
        const newDot = {
            id: `dot-${Date.now()}-${Math.random()}`,
            timestamp: Date.now()
        };
        setSpiralDots(prev => [...prev, newDot]);
        
        // Add cosmic pixel that converges to center
        const newPixel = {
            id: `pixel-${Date.now()}-${Math.random()}`,
            timestamp: Date.now()
        };
        setCosmicPixels(prev => [...prev, newPixel]);
        
        // Remove old dots after 8 seconds (animation duration)
        setTimeout(() => {
            setSpiralDots(prev => prev.filter(dot => dot.id !== newDot.id));
        }, 8000);
        
        // Remove cosmic pixels after 12 seconds
        setTimeout(() => {
            setCosmicPixels(prev => prev.filter(pixel => pixel.id !== newPixel.id));
        }, 12000);
        
        // Add pixel of light animation to the orb
        const orbElement = document.querySelector('.growing-orb');
        if (orbElement) {
            orbElement.classList.add('pixel-growth');
            setTimeout(() => {
                orbElement.classList.remove('pixel-growth');
            }, 1000);
        }
        
        // Growth burst animation sequence
        setTimeout(() => {
            setShowGrowthBurst(false);
        }, 1000);
        
        // End submission animation
        setTimeout(() => {
            setIsAnimatingSubmit(false);
        }, 1500);
    };

    const handleIdeaSubmission = async (title?: string, description?: string, email?: string) => {
        try {
            // Validate that at least one field is provided
            if (!title?.trim() && !description?.trim() && !email?.trim()) {
                throw new Error("Either title, description or email must be provided");
            }
            

            triggerSubmitAnimation();

            const submissionRequest: CreateIdeaSubmissionRequest = {
                title: title?.trim() || undefined,
                description: description?.trim() || undefined,
                email: email?.trim() || undefined,
                userId: user?.uid || undefined,
                sessionId: session?.sessionId || undefined,
            };

            // Create submission via API endpoint (with server-side rate limiting)
            const response = await fetch('/api/idea-submissions/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(submissionRequest)
            });

            const result = await response.json();

            if (!response.ok) {
                // Handle rate limiting and other errors
                if (response.status === 429) {
                    throw new Error(`Rate limit exceeded: ${result.message}. Try again in ${Math.ceil((result.retryAfter || 60) / 60)} minutes.`);
                } else {
                    throw new Error(result.message || result.error || 'Failed to submit idea');
                }
            }

            const submissionId = result.submissionId;
            
            // Store the user's idea ID for later match retrieval
            if (user?.uid && submissionId) {
                setUserIdeaId(submissionId);
                // Store in localStorage as backup
                localStorage.setItem('userIdeaId', submissionId);
            }
            
            console.log(`Idea submission created successfully: ${submissionId}`);
            console.log('Submission details:', submissionRequest);
            console.log(`Remaining attempts: ${result.remainingAttempts}`);

            // Delay the idea count refresh to allow form fade animation to complete
            setTimeout(async () => {
                await fetchIdeas();
                
                // Check if we should trigger batch processing (every 10 submissions)
                const newCount = await IdeaSubmissionRepository.getTotalSubmissionCount();
                if (newCount % 10 === 0 && newCount > 0) {
                    console.log(`Triggering batch processing for ${newCount} submissions`);
                    triggerBatchProcessing();
                }
            }, 2500); // Wait for fade animation to complete (2000ms) plus buffer
            
        } catch (error) {
            console.error("Failed to submit idea:", error);
            
            // Log detailed error information to debug panel
            if (debugRef.current) {
                debugRef.current.logError('Idea Submission', error, {
                    submissionRequest: {
                        title: title?.trim() || undefined,
                        description: description?.trim() || undefined,
                        email: email?.trim() || undefined,
                        userId: user?.uid || undefined,
                        sessionId: session?.sessionId || undefined,
                    },
                    userAuthenticated: !!user,
                    timestamp: new Date().toISOString(),
                    url: window.location.href,
                    userAgent: navigator.userAgent
                });
            }
            
            // Show user-friendly error message
            const errorMessage = (error as any)?.message || error?.toString() || 'Unknown error';
            alert(`Failed to submit your idea: ${errorMessage}. Please try again.`);
        }
    };

    // Handle mouse hover over "Ideas collected:" text
    const handleMouseEnter = (event: React.MouseEvent) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setHoverPosition({ x: rect.left, y: rect.top });
        setShowMatchesHover(true);
    };

    const handleMouseLeave = () => {
        setShowMatchesHover(false);
    };

    // Trigger batch processing for idea matching
    const triggerBatchProcessing = async () => {
        try {
            console.log('Triggering batch processing API call...');
            const response = await fetch('/api/idea-matching/process-batch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const result = await response.json();
            if (result.success) {
                console.log(`Batch processing completed: ${result.matchesGenerated} matches generated`);
            } else {
                console.log('Batch processing result:', result.message || result.error);
            }
        } catch (error) {
            console.error('Error triggering batch processing:', error);
        }
    };

    const handleIdeaSubmit = async (title: string, description: string, email: string) => {
        try {
            handleIdeaSubmission(title, description, email);
        } catch (error) {
            console.error("Failed to submit message:", error);
            // Even errors get absorbed by the black hole
        }
    };




  // Simplified: Just return black background for dancing stars
  const getBackgroundClass = () => {
    return 'background-glow-container'; // Always just black
  };    return (
        <div className="min-h-screen w-full relative" style={{backgroundColor: 'transparent'}}>
            {/* Enhanced Multi-Layer Orb Growth System */}
            <div className={getBackgroundClass()}>
                {/* Dancing idea stars - more appear as energy increases */}
                {isClient && ideas.length > 0 && (
                    <>
                        <div className="idea-star star-1 dim" />
                        <div className="idea-star star-2" />
                        <div className="idea-star star-3 dim" />
                    </>
                )}
                {isClient && ideas.length > 1 && (
                    <>
                        <div className="idea-star star-4" />
                        <div className="idea-star star-5 dim" />
                        <div className="idea-star star-6" />
                    </>
                )}
                {isClient && ideas.length > 2 && (
                    <>
                        <div className="idea-star star-7 bright" />
                        <div className="idea-star star-8 dim" />
                        <div className="idea-star star-9" />
                    </>
                )}
                {isClient && ideas.length > 3 && (
                    <>
                        <div className="idea-star star-10 bright" />
                        <div className="idea-star star-11" />
                        <div className="idea-star star-12 bright" />
                    </>
                )}
                
                {/* Dynamic submission stars - appear on each new idea submission */}
                {cosmicPixels.map((pixel, index) => (
                    <div
                        key={pixel.id}
                        className="idea-star bright"
                        style={{
                            top: `${Math.random() * 80 + 10}%`,
                            left: `${Math.random() * 80 + 10}%`,
                            animationDelay: '0s'
                        }}
                    />
                ))}
                
                {/* Spiral idea paths */}
                <div className="spiral-container">
                    {spiralDots.map((dot, index) => (
                        <div
                            key={dot.id}
                            className={`idea-dot ${index % 2 === 0 ? 'spiral-clockwise' : 'spiral-counterclockwise'}`}
                            style={{
                                animationDelay: '0s',
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%)'
                            }}
                        />
                    ))}
                </div>
                
                {/* Constellation of distant stars - only appears after significant growth */}
                {orbEnergyLevel > 20 && (
                    <div className="star-constellation" style={{ opacity: Math.min((orbEnergyLevel - 20) * 0.02, 0.6) }}>
                        <div className="distant-star star-1" />
                        <div className="distant-star star-2" />
                        <div className="distant-star star-3" />
                        <div className="distant-star star-4" />
                        <div className="distant-star star-5" />
                        {orbEnergyLevel > 50 && (
                            <>
                                <div className="distant-star star-6" />
                                <div className="distant-star star-7" />
                                <div className="distant-star star-8" />
                                <div className="distant-star star-9" />
                                <div className="distant-star star-10" />
                            </>
                        )}
                    </div>
                )}
                
                {/* Main growing orb with multiple layers - only show after client hydration */}
                {isClient && (
                    <div 
                        className={`growing-orb orb-${orbColor} ${showGrowthBurst ? 'growth-burst' : ''}`}
                        style={{ 
                            transform: `translate(-50%, -50%) scale(${orbSize})`,
                            opacity: calculateOrbProperties(orbEnergyLevel).intensity
                        }}
                    >
                        {/* Core - The bright center */}
                        <div className="orb-core" />
                        
                        {/* Mid layer - Creates depth and dimension */}
                        <div className="orb-mid-layer" />
                        
                        {/* Outer glow - Atmospheric effect */}
                        <div className="orb-outer-glow" />
                        
                        {/* Floating energy particles around the orb - only visible after some growth */}
                        {orbEnergyLevel > 10 && (
                            <>
                                <div className="energy-particle particle-1" style={{ 
                                    top: '10%', 
                                    left: '20%',
                                    transform: `translate(-50%, -50%) scale(${Math.max(orbSize * 0.5, 0.1)})`
                                }} />
                                <div className="energy-particle particle-2" style={{ 
                                    top: '30%', 
                                    right: '15%',
                                    transform: `translate(50%, -50%) scale(${Math.max(orbSize * 0.7, 0.1)})`
                                }} />
                                <div className="energy-particle particle-3" style={{ 
                                    bottom: '25%', 
                                    left: '25%',
                                    transform: `translate(-50%, 50%) scale(${Math.max(orbSize * 0.6, 0.1)})`
                                }} />
                            </>
                        )}
                        
                        {/* More particles for higher energy */}
                        {orbEnergyLevel > 25 && (
                            <>
                                <div className="energy-particle particle-4" style={{ 
                                    top: '60%', 
                                    right: '30%',
                                    transform: `translate(50%, -50%) scale(${Math.max(orbSize * 0.4, 0.1)})`
                                }} />
                                <div className="energy-particle particle-5" style={{ 
                                    bottom: '40%', 
                                    right: '10%',
                                    transform: `translate(50%, 50%) scale(${Math.max(orbSize * 0.8, 0.1)})`
                                }} />
                                <div className="energy-particle particle-6" style={{ 
                                    top: '20%', 
                                    left: '70%',
                                    transform: `translate(-50%, -50%) scale(${Math.max(orbSize * 0.5, 0.1)})`
                                }} />
                            </>
                        )}
                    </div>
                )}
                
                {/* Light ray from form to orb during submission */}
                {isAnimatingSubmit && (
                    <div 
                        className="idea-ray-to-orb"
                        style={{
                            position: 'absolute',
                            top: '10%',
                            right: '12%',
                            width: '2px',
                            height: '200px',
                            background: `linear-gradient(to bottom, 
                                rgba(${orbColor === 'blue' ? '147, 197, 253' : 
                                       orbColor === 'cyan' ? '165, 243, 252' : 
                                       orbColor === 'white' ? '255, 255, 255' : '255, 235, 59'}, 0.9) 0%, 
                                transparent 100%)`,
                            borderRadius: '1px',
                            filter: 'blur(1px)',
                            animation: 'ideaToOrbRay 1.5s ease-out forwards',
                            transform: 'rotate(225deg)',
                            transformOrigin: 'top center'
                        }}
                    />
                )}
                
                {/* Energy ripples on submission */}
                {showGrowthBurst && (
                    <>
                        <div className="energy-ripple ripple-1" />
                        <div className="energy-ripple ripple-2" />
                        <div className="energy-ripple ripple-3" />
                    </>
                )}
                
                {/* Particle streams during submission */}
                {isAnimatingSubmit && (
                    <>
                        <div className="idea-particle stream-1" />
                        <div className="idea-particle stream-2" />
                        <div className="idea-particle stream-3" />
                        <div className="idea-particle stream-4" />
                        <div className="idea-particle stream-5" />
                    </>
                )}
            </div>
            
            <div className="vw-100">
                <CentralOctahedron ideaCount={ideas.length} />
            </div>

            <div className="absolute bottom-24 sm:bottom-32 left-4 right-4 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 z-10">
                <MessageEmailForm 
                    handleIdeaSubmit={handleIdeaSubmit}
                />
            </div>
            
            {/* Growth indicator for low energy levels - only show after client hydration */}
            {isClient && orbEnergyLevel < 50 && (
                <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 z-10 text-white/60 text-xs sm:text-sm">
                    <div 
                        className="cursor-help hover:text-cyan-400 transition-colors duration-200 inline-block border-b border-dotted border-white/30 hover:border-cyan-400/50"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        Ideas collected: {ideas.length}
                    </div>
                    <div className="text-xs opacity-75 hidden sm:block">Each idea adds a pixel of light to the cosmic void</div>
                </div>
            )}
            
            {/* Milestone messages - only show after client hydration */}
            {isClient && orbEnergyLevel === 50 && (
                <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 z-10 text-cyan-300 text-xs sm:text-sm animate-pulse">
                    <div>✨ First light emerges! The orb awakens...</div>
                </div>
            )}
            {isClient && orbEnergyLevel === 100 && (
                <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 z-10 text-white text-xs sm:text-sm animate-pulse">
                    <div>🌟 A beacon forms in the darkness!</div>
                </div>
            )}
            {isClient && orbEnergyLevel === 200 && (
                <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 z-10 text-yellow-300 text-xs sm:text-sm animate-pulse">
                    <div>💫 Golden radiance spreads across the void!</div>
                </div>
            )}
            {/* Mode display removed */}
            <div className="absolute bottom-0 right-0 z-0 fall-through">
                <DismissableNotificationStack initialNotifications={notifications} />
            </div>

            <div id="recaptcha-container"></div>
            
            {/* Debug Panel - Only show if debug mode is enabled and after client hydration */}
            {isClient && process.env.NEXT_PUBLIC_DEBUG_MODE === 'true' && (
                <>
                    <DebugIndicator 
                        ref={debugRef}
                        user={user} 
                        orbEnergyLevel={orbEnergyLevel}
                    />
                    {/* Debug controls for testing orb growth */}
                    <div className="absolute top-4 sm:top-8 left-4 sm:left-8 z-20 bg-black/80 p-2 sm:p-4 rounded text-white text-xs">
                        <div>Debug: Orb Energy = {orbEnergyLevel}</div>
                        <div>Size = {orbSize.toFixed(3)}</div>
                        <div>Color = {orbColor}</div>
                        <div className="flex gap-1 sm:gap-2 mt-2">
                            <button 
                                onClick={() => setOrbEnergyLevel(prev => prev + 1)}
                                className="bg-blue-500 px-1 sm:px-2 py-1 rounded text-xs"
                            >
                                +1
                            </button>
                            <button 
                                onClick={() => setOrbEnergyLevel(prev => prev + 10)}
                                className="bg-cyan-500 px-1 sm:px-2 py-1 rounded text-xs"
                            >
                                +10
                            </button>
                            <button 
                                onClick={() => setOrbEnergyLevel(0)}
                                className="bg-red-500 px-1 sm:px-2 py-1 rounded text-xs"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </>
            )}
            
            {/* Idea Matches Hover Component */}
            <IdeaMatchesHover
                userId={user?.uid}
                ideaId={userIdeaId || undefined}
                isVisible={showMatchesHover}
                position={hoverPosition}
                totalIdeasCount={ideas.length}
            />
        </div>
    );
};

export default HomePage;
