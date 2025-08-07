import React, { useState, useEffect } from 'react';

interface MessageEmailFormProps {
    handleIdeaSubmit: (title: string, description: string, email: string) => void;
}

// Random idea generator
const generateRandomIdea = () => {
    const titles = [
        "Quantum Coffee Brewing",
        "AI-Powered Plant Whisperer", 
        "Gravity-Defying Yoga Studio",
        "Time-Travel Tourist Agency",
        "Invisible Clothing Line",
        "Dream Recording Device",
        "Holographic Pet Companion",
        "Emotion-Based Music Generator",
        "Teleporting Food Delivery",
        "Memory Sharing Network",
        "Weather Control App",
        "Mind-Reading Study Buddy",
        "Levitating Transportation Pod",
        "Digital Scent Transmitter",
        "Personality-Matching AI Assistant"
    ];
    
    const descriptions = [
        "A revolutionary approach to brewing coffee using quantum mechanics to extract perfect flavor profiles from parallel universe beans.",
        "An AI system that translates plant chemical signals into human language, helping gardeners understand their plants' needs.",
        "A yoga studio with adjustable gravity fields, allowing practitioners to experience poses in zero gravity or increased gravity for enhanced strength training.",
        "A travel agency specializing in historically accurate time travel experiences with safety guarantees and timeline protection.",
        "Fashion line using advanced metamaterials to create truly invisible clothing for ultimate privacy and stealth applications.",
        "A device that records and stores dreams as digital files, allowing users to revisit, share, and analyze their subconscious experiences.",
        "Holographic pets that learn and adapt to their owners' personalities, providing companionship without the maintenance of real animals.",
        "Software that analyzes emotional states and generates personalized music in real-time to enhance or alter the listener's mood.",
        "Instant food delivery system using quantum teleportation to transport meals directly from restaurant to customer's table.",
        "A platform where people can safely share and experience each other's memories, creating deeper empathy and understanding.",
        "Mobile app that allows users to control local weather patterns in small areas for personal comfort and convenience.",
        "An AI tutor that reads students' thoughts to identify knowledge gaps and provide perfectly timed explanations and encouragement.",
        "Personal transportation pods that hover above traffic using magnetic levitation, revolutionizing urban mobility.",
        "Technology that captures and transmits scents digitally, allowing remote sharing of aromatic experiences across the internet.",
        "An AI assistant that perfectly matches users' personalities and communication styles, becoming more personalized over time."
    ];
    
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
    
    return {
        title: randomTitle,
        description: randomDescription,
        email: 'contact@ijustgotanidea.com'
    };
};

const MessageEmailForm: React.FC<MessageEmailFormProps> = ({ handleIdeaSubmit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [luminousGlow, setLuminousGlow] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isFadedOut, setIsFadedOut] = useState(false);

    // Gentle luminous pulsing effect
    useEffect(() => {
        const interval = setInterval(() => {
            setLuminousGlow(true);
            setTimeout(() => setLuminousGlow(false), 3000);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    const handleLightbulbClick = () => {
        if (isGenerating) return;
        
        setIsGenerating(true);
        
        // Add a slight delay for effect
        setTimeout(() => {
            const randomIdea = generateRandomIdea();
            setTitle(randomIdea.title);
            setDescription(randomIdea.description);
            setEmail(randomIdea.email);
            setIsGenerating(false);
        }, 300);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((title.trim() || description.trim() || email.trim()) && !isSubmitting) {
            setIsSubmitting(true);
            
            // Submit message if either title or description exists
            await handleIdeaSubmit(title.trim(), description.trim(), email.trim());
            
            // Immediately fade out the form
            setIsFadedOut(true);
            
            // Clear all fields after fade starts
            setTimeout(() => {
                setTitle('');
                setDescription('');
                setEmail('');
            }, 300);
            
            // Fade back in and reset submitting state after 2 seconds
            setTimeout(() => {
                setIsFadedOut(false);
            }, 2000);
            
            // Reset submitting state slightly after fade-in starts
            setTimeout(() => {
                setIsSubmitting(false);
            }, 2100);
        }
    };

    return (
        <div className={`relative bg-gray-900 border-2 rounded-lg p-3 sm:p-4 w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto transition-opacity duration-500 min-h-[300px] sm:min-h-[320px] ${
            luminousGlow ? 'border-blue-400 shadow-lg shadow-blue-400/30 luminous-trail' : 'border-gray-600'
        } ${isSubmitting ? 'tunnel-journey' : ''} ${isFadedOut ? 'opacity-0' : 'opacity-100'}`}>
            
            {/* Luminescent glow effect */}
            <div className={`absolute inset-0 rounded-lg transition-opacity duration-3000 ${
                luminousGlow ? 'opacity-10' : 'opacity-0'
            } bg-gradient-to-r from-blue-500/20 via-cyan-400/20 to-white/10`}></div>
            
            
            <form onSubmit={handleSubmit} className="relative z-10 space-y-2 sm:space-y-3">
                <div className="text-center mb-3 sm:mb-4">
                    <h3 className={`text-lg sm:text-xl font-light transition-all duration-1000 ${
                        luminousGlow ? 'text-blue-300' : 'text-gray-300'
                    }`}>
                        <button 
                            onClick={handleLightbulbClick}
                            className={`cursor-pointer hover:scale-110 transition-all duration-200 bg-transparent border-none text-2xl sm:text-3xl ${
                                isGenerating ? 'animate-pulse scale-125' : ''
                            }`}
                            title="Click to generate a random idea!"
                            type="button"
                            disabled={isSubmitting || isGenerating}
                        >
                            💡
                        </button>
                        
                        <p>✨ I ✨</p>
                        
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1 sm:mt-2 px-2 min-h-[2.5rem] flex items-center justify-center">
                        {
                         'I just got an idea!'}
                    </p>
                </div>

                {/* Title input */}
                <div>
                    <label htmlFor="title" className="block text-xs sm:text-sm font-light text-blue-200 mb-1 sm:mb-2">
                        Idea
                    </label>
                    <input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="What it is?"
                        className={`w-full px-2 sm:px-3 py-2 text-sm sm:text-base bg-gray-800 border rounded-md text-cyan-100 placeholder-gray-500 focus:outline-none transition-all duration-500 ${
                            luminousGlow 
                                ? 'border-blue-400 shadow-md shadow-blue-400/20' 
                                : 'border-gray-500 focus:border-cyan-400 focus:shadow-md focus:shadow-cyan-400/20'
                        }`}
                        disabled={isSubmitting}
                    />
                </div>

                {/* Description input */}
                <div>
                    <label htmlFor="description" className="block text-xs sm:text-sm font-light text-blue-200 mb-1 sm:mb-2">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Tell me more!"
                        className={`w-full px-2 sm:px-3 py-2 text-sm sm:text-base bg-gray-800 border rounded-md text-cyan-100 placeholder-gray-500 focus:outline-none transition-all duration-500 resize-none h-16 ${
                            luminousGlow 
                                ? 'border-blue-400 shadow-md shadow-blue-400/20' 
                                : 'border-gray-500 focus:border-cyan-400 focus:shadow-md focus:shadow-cyan-400/20'
                        }`}
                        disabled={isSubmitting}
                    />
                </div>

                {/* Email input */}
                <div>
                    <label htmlFor="email" className="block text-xs sm:text-sm font-light text-blue-200 mb-1 sm:mb-2">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="contact@me.com"
                        className={`w-full px-2 sm:px-3 py-2 text-sm sm:text-base bg-gray-800 border rounded-md text-cyan-100 placeholder-gray-500 focus:outline-none transition-all duration-500 ${
                            luminousGlow 
                                ? 'border-blue-400 shadow-md shadow-blue-400/20' 
                                : 'border-gray-500 focus:border-cyan-400 focus:shadow-md focus:shadow-cyan-400/20'
                        }`}
                        disabled={isSubmitting}
                    />
                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    disabled={isSubmitting || (!title.trim() && !description.trim() && !email.trim())}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white font-light rounded-md focus:outline-none transition-all duration-700 transform ${
                        isSubmitting 
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-500 border-2 border-blue-300 text-blue-100 scale-105 shadow-lg shadow-blue-400/40 cursor-not-allowed' 
                            : (!title.trim() && !description.trim() && !email.trim())
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                : luminousGlow
                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-400 border-2 border-blue-300 shadow-lg shadow-blue-400/50 scale-105'
                                    : 'bg-gradient-to-r from-gray-600 to-blue-600 border-2 border-cyan-500 hover:shadow-lg hover:shadow-cyan-400/40 hover:scale-105'
                    }`}
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center">
                            <span className="animate-pulse mr-2">💫</span>
                            LET THERE BE LIGHT
                        </span>
                    ) : (
                        <span className="flex items-center justify-center">

א
                        </span>
                    )}
                </button>
            </form>
        </div>
    );
};

export default MessageEmailForm;
