import { NextApiRequest, NextApiResponse } from 'next';
import { IdeaSubmissionRepository } from '../../../repository/ideaSubmissionRepository';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === 'GET') {
            // Get total count of idea submissions for the orb
            const count = await IdeaSubmissionRepository.getTotalSubmissionCount();
            res.status(200).json({ count });
        } else {
            res.setHeader('Allow', ['GET']);
            res.status(405).json({ error: `Method ${req.method} Not Allowed` });
        }
    } catch (error) {
        console.error('Error handling idea submissions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
