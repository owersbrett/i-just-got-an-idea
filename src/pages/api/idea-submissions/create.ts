import { NextApiRequest, NextApiResponse } from 'next';
import { IdeaSubmissionRepository } from '../../../repository/ideaSubmissionRepository';
import { CreateIdeaSubmissionRequest } from '../../../common/types/ideaSubmission';
import { ServerRateLimitingService } from '../../../middleware/rateLimitMiddleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Apply rate limiting first
    const rateLimitConfig = {
        windowMs: 60 * 1000, // 1 minute window
        maxAttempts: 3, // Max 3 submissions per minute
        blockDurationMs: 10 * 60 * 1000, // 10 minute block for violations
        keyGenerator: (req: NextApiRequest) => {
            // Create identifier from IP, User Agent, and session info
            const forwarded = req.headers['x-forwarded-for'];
            const ip = forwarded 
                ? (Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0].trim())
                : req.socket.remoteAddress;
            
            const userAgent = req.headers['user-agent'] || '';
            const sessionId = req.body?.sessionId || 'anonymous';
            
            return `submit_${ip}_${sessionId}_${userAgent.slice(0, 20)}`;
        }
    };

    const rateLimitResult = ServerRateLimitingService.checkOnly(req, rateLimitConfig);

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', rateLimitConfig.maxAttempts);
    res.setHeader('X-RateLimit-Remaining', rateLimitResult.remaining);
    res.setHeader('X-RateLimit-Reset', new Date(rateLimitResult.resetTime).toISOString());

    if (!rateLimitResult.allowed) {
        if (rateLimitResult.retryAfter) {
            res.setHeader('Retry-After', rateLimitResult.retryAfter);
        }
        
        return res.status(429).json({
            error: 'Rate limit exceeded',
            message: 'Too many idea submissions. Please wait before submitting again.',
            retryAfter: rateLimitResult.retryAfter,
            resetTime: rateLimitResult.resetTime,
            remainingAttempts: rateLimitResult.remaining
        });
    }

    try {
        if (req.method !== 'POST') {
            res.setHeader('Allow', ['POST']);
            return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
        }

        const submissionRequest: CreateIdeaSubmissionRequest = req.body;

        // Basic validation
        if (!submissionRequest.title?.trim() && 
            !submissionRequest.description?.trim() && 
            !submissionRequest.email?.trim()) {
            return res.status(400).json({ 
                error: 'At least one field (title, description, or email) must be provided' 
            });
        }

        // Additional spam detection
        const content = `${submissionRequest.title || ''} ${submissionRequest.description || ''}`;
        
        // Check for obvious spam patterns
        if (isSpamContent(content)) {
            // Record this as a violation for more aggressive rate limiting
            return res.status(400).json({
                error: 'Content flagged as spam',
                message: 'Your submission appears to be spam and has been blocked.'
            });
        }

        // Create submission
        const submissionId = await IdeaSubmissionRepository.createSubmission(submissionRequest);

        return res.status(201).json({
            success: true,
            submissionId,
            message: 'Idea submitted successfully',
            remainingAttempts: rateLimitResult.remaining - 1
        });

    } catch (error) {
        console.error('Error creating idea submission:', error);
        
        return res.status(500).json({ 
            error: 'Internal server error',
            message: 'Failed to submit your idea. Please try again later.'
        });
    }
}

// Basic spam detection
function isSpamContent(content: string): boolean {
    const spamPatterns = [
        /viagra|cialis|pharmacy/i,
        /\$\$\$|\$\d+/g, // Money patterns
        /click here|visit now|buy now/i,
        /urgent|immediate|limited time/i,
        /(.)\\1{10,}/g, // Repeated characters
        /http[s]?:\/\/[^\s]{3,}/g, // URLs (more than basic)
    ];
    
    // Check for excessive repetition
    if (content.length > 0) {
        const words = content.toLowerCase().split(/\s+/);
        const uniqueWords = new Set(words);
        
        // If less than 20% unique words and content is long, likely spam
        if (words.length > 20 && uniqueWords.size / words.length < 0.2) {
            return true;
        }
    }
    
    // Check spam patterns
    for (const pattern of spamPatterns) {
        if (pattern.test(content)) {
            return true;
        }
    }
    
    // Check for excessive length (likely spam)
    if (content.length > 2000) {
        return true;
    }
    
    return false;
}