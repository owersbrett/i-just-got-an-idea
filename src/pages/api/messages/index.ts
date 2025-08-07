import { NextApiRequest, NextApiResponse } from 'next';
import { MessageRepository } from '../../../repository/messageRepository';
import { Message } from '../../../common/types/message';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === 'POST') {
            console.log("Received POST data:", req.body);
            const { uid, title, description } = req.body;
            
            console.log("Extracted fields:", { uid, title, description });
            
            if (!uid) {
                console.log("Missing uid");
                return res.status(400).json({ error: 'Missing required field: uid' });
            }

            // At least one of title or description must be provided and non-empty
            if ((!title || !title.trim()) && (!description || !description.trim())) {
                console.log("Missing both title and description");
                return res.status(400).json({ error: 'At least one of title or description must be provided' });
            }

            const newMessage = Message.new(uid, title || '', description || '');
            console.log("Created message:", newMessage);
            const createdMessage = await MessageRepository.create(newMessage);
            
            res.status(201).json({ message: createdMessage });
        } else if (req.method === 'GET') {
            const { uid } = req.query;
            
            if (!uid || typeof uid !== 'string') {
                return res.status(400).json({ error: 'Missing or invalid uid parameter' });
            }

            const messages = await MessageRepository.findByUid(uid);
            res.status(200).json({ messages });
        } else {
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error('Messages API error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
