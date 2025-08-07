import { NextApiRequest, NextApiResponse } from 'next';
import { IdeaMatchRepository } from '../../../repository/ideaMatchRepository';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== 'GET') {
            res.setHeader('Allow', ['GET']);
            return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
        }

        const { userId, ideaId } = req.query;

        if (!userId || !ideaId) {
            return res.status(400).json({ 
                error: 'Missing required parameters: userId and ideaId' 
            });
        }

        // Get matches for this user's idea
        const matches = await IdeaMatchRepository.getUserMatches(
            userId as string, 
            ideaId as string
        );

        return res.status(200).json({
            success: true,
            userId,
            ideaId,
            matchCount: matches.length,
            matches: matches.map(match => ({
                id: match.id,
                compatibilityScore: match.compatibilityScore,
                matchReasons: match.matchReasons,
                matchType: match.matchType,
                otherIdeaId: match.ideaId1 === ideaId ? match.ideaId2 : match.ideaId1,
                otherUserId: match.userId1 === userId ? match.userId2 : match.userId1,
                connectionStatus: match.connectionStatus,
                createdAt: match.createdAt
            }))
        });

    } catch (error) {
        console.error('Error getting user matches:', error);
        
        return res.status(500).json({ 
            error: 'Internal server error getting user matches',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}