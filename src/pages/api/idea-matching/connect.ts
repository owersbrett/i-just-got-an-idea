import { NextApiRequest, NextApiResponse } from 'next';
import { IdeaMatchRepository } from '../../../repository/ideaMatchRepository';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== 'POST') {
            res.setHeader('Allow', ['POST']);
            return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
        }

        const { matchId, action } = req.body;

        if (!matchId || !action) {
            return res.status(400).json({ 
                error: 'Missing required fields: matchId and action' 
            });
        }

        if (!['request', 'accept', 'decline'].includes(action)) {
            return res.status(400).json({ 
                error: 'Invalid action. Must be: request, accept, or decline' 
            });
        }

        // Map action to connection status
        let connectionStatus: 'none' | 'requested' | 'connected';
        switch (action) {
            case 'request':
                connectionStatus = 'requested';
                break;
            case 'accept':
                connectionStatus = 'connected';
                break;
            case 'decline':
                connectionStatus = 'none';
                break;
            default:
                connectionStatus = 'none';
        }

        // Update the match connection status
        await IdeaMatchRepository.updateConnectionStatus(matchId, connectionStatus);

        // TODO: In a real app, you'd want to:
        // 1. Send notifications to both users
        // 2. Create a chat room or communication channel
        // 3. Share contact information if both users consent
        // 4. Log the connection activity

        let message = '';
        switch (action) {
            case 'request':
                message = 'Connection request sent! The other user will be notified.';
                break;
            case 'accept':
                message = 'Connection accepted! You can now collaborate on your ideas.';
                break;
            case 'decline':
                message = 'Connection declined.';
                break;
        }

        return res.status(200).json({
            success: true,
            action,
            connectionStatus,
            message
        });

    } catch (error) {
        console.error('Error handling connection request:', error);
        
        return res.status(500).json({ 
            error: 'Internal server error handling connection',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}