import { NextApiRequest, NextApiResponse } from 'next';
import { IdeaSubmissionRepository } from '../../../repository/ideaSubmissionRepository';
import { IdeaMatchRepository } from '../../../repository/ideaMatchRepository';
import { IdeaMatchingService } from '../../../services/ideaMatchingService';
import { SubmissionState } from '../../../common/types/ideaSubmission';
import { ServerRateLimitingService } from '../../../middleware/rateLimitMiddleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Rate limit batch processing to prevent abuse
    const rateLimitResult = ServerRateLimitingService.checkOnly(req, {
        windowMs: 10 * 60 * 1000, // 10 minute window
        maxAttempts: 3, // Max 3 batch processes per 10 minutes
        blockDurationMs: 30 * 60 * 1000, // 30 minute block
    });

    if (!rateLimitResult.allowed) {
        return res.status(429).json({
            error: 'Rate limit exceeded',
            message: 'Batch processing rate limit exceeded. Please wait before trying again.',
            retryAfter: rateLimitResult.retryAfter
        });
    }

    try {
        if (req.method !== 'POST') {
            res.setHeader('Allow', ['POST']);
            return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
        }

        console.log('Starting batch processing for idea matching...');

        // Get total submission count
        const totalSubmissions = await IdeaSubmissionRepository.getTotalSubmissionCount();
        console.log(`Total submissions: ${totalSubmissions}`);

        // Check if we need to create a new batch
        const shouldCreateBatch = await IdeaMatchRepository.shouldCreateNewBatch(totalSubmissions);
        
        if (!shouldCreateBatch) {
            return res.status(200).json({ 
                message: 'No batch processing needed', 
                totalSubmissions,
                nextBatchAt: Math.ceil(totalSubmissions / 10) * 10
            });
        }

        console.log('Creating new batch for processing...');

        // Get the latest 10 completed submissions
        const batchNumber = Math.floor(totalSubmissions / 10);
        const startIndex = (batchNumber - 1) * 10;
        
        // For now, we'll get all submissions and take the slice we need
        // In a real implementation, you'd want pagination/offset queries
        const allSubmissions = await IdeaSubmissionRepository.getSubmissionsByState(SubmissionState.ENQUEUED);
        const batchSubmissions = allSubmissions.slice(startIndex, startIndex + 10);

        if (batchSubmissions.length < 10) {
            return res.status(400).json({ 
                error: 'Insufficient submissions for batch processing',
                found: batchSubmissions.length,
                needed: 10
            });
        }

        console.log(`Processing batch of ${batchSubmissions.length} ideas...`);

        // Create batch record
        const batchId = await IdeaMatchRepository.createBatch(
            batchSubmissions.map(s => s.id)
        );

        // Update batch status to processing
        await IdeaMatchRepository.updateBatchStatus(batchId, 'processing');

        // Generate matches using our AI service
        const potentialMatches = IdeaMatchingService.generateMatchesForBatch(batchSubmissions);
        
        // Add batchId to all matches
        const matchesWithBatchId = potentialMatches.map(match => ({
            ...match,
            batchId
        }));

        console.log(`Generated ${matchesWithBatchId.length} potential matches`);

        // Save matches to database
        if (matchesWithBatchId.length > 0) {
            await IdeaMatchRepository.createMatches(matchesWithBatchId);
        }

        // Update batch status to completed
        await IdeaMatchRepository.updateBatchStatus(batchId, 'completed', matchesWithBatchId.length);

        console.log('Batch processing completed successfully');

        return res.status(200).json({
            success: true,
            batchId,
            batchNumber,
            ideasProcessed: batchSubmissions.length,
            matchesGenerated: matchesWithBatchId.length,
            topMatches: matchesWithBatchId.slice(0, 5).map(match => ({
                score: match.compatibilityScore,
                type: match.matchType,
                reasons: match.matchReasons
            }))
        });

    } catch (error) {
        console.error('Error in batch processing:', error);
        
        return res.status(500).json({ 
            error: 'Internal server error during batch processing',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}