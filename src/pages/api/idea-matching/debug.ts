import { NextApiRequest, NextApiResponse } from 'next';
import { IdeaSubmissionRepository } from '../../../repository/ideaSubmissionRepository';
import { IdeaMatchRepository } from '../../../repository/ideaMatchRepository';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== 'GET') {
            res.setHeader('Allow', ['GET']);
            return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
        }

        // Get overall statistics
        const totalSubmissions = await IdeaSubmissionRepository.getTotalSubmissionCount();
        const shouldCreateBatch = await IdeaMatchRepository.shouldCreateNewBatch(totalSubmissions);
        const allMatches = await IdeaMatchRepository.getAllMatches();

        // Get batch information
        const nextBatchAt = Math.ceil(totalSubmissions / 10) * 10;
        const ideasUntilNextBatch = nextBatchAt - totalSubmissions;
        const currentBatchNumber = Math.floor(totalSubmissions / 10);
        const completedBatches = Math.floor(totalSubmissions / 10);

        return res.status(200).json({
            system_status: {
                total_submissions: totalSubmissions,
                should_create_batch: shouldCreateBatch,
                next_batch_at: nextBatchAt,
                ideas_until_next_batch: ideasUntilNextBatch,
                current_batch_number: currentBatchNumber,
                completed_batches: completedBatches
            },
            matching_stats: {
                total_matches: allMatches.length,
                matches_by_type: {
                    complementary: allMatches.filter(m => m.matchType === 'complementary').length,
                    similar: allMatches.filter(m => m.matchType === 'similar').length,
                    synergistic: allMatches.filter(m => m.matchType === 'synergistic').length,
                    collaborative: allMatches.filter(m => m.matchType === 'collaborative').length
                },
                average_compatibility_score: allMatches.length > 0 
                    ? Math.round(allMatches.reduce((sum, m) => sum + m.compatibilityScore, 0) / allMatches.length)
                    : 0,
                connections: {
                    none: allMatches.filter(m => m.connectionStatus === 'none').length,
                    requested: allMatches.filter(m => m.connectionStatus === 'requested').length,
                    connected: allMatches.filter(m => m.connectionStatus === 'connected').length
                }
            },
            recent_matches: allMatches.slice(0, 5).map(match => ({
                id: match.id,
                compatibility_score: match.compatibilityScore,
                match_type: match.matchType,
                connection_status: match.connectionStatus,
                reasons: match.matchReasons.slice(0, 2) // Top 2 reasons
            }))
        });

    } catch (error) {
        console.error('Error in debug endpoint:', error);
        
        return res.status(500).json({ 
            error: 'Internal server error in debug endpoint',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}