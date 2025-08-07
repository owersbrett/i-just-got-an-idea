import { NextApiRequest, NextApiResponse } from 'next';
import { EmailRepository } from '../../../repository/emailRepository';
import { Email } from '../../../common/types/email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === 'POST') {
            const { uid, email } = req.body;
            
            if (!uid || !email) {
                return res.status(400).json({ error: 'Missing required fields: uid and email' });
            }

            const newEmail = Email.new(uid, email);
            const createdEmail = await EmailRepository.create(newEmail);
            
            res.status(201).json({ email: createdEmail });
        } else if (req.method === 'GET') {
            const { uid } = req.query;
            
            if (!uid || typeof uid !== 'string') {
                return res.status(400).json({ error: 'Missing or invalid uid parameter' });
            }

            const emails = await EmailRepository.findByUid(uid);
            res.status(200).json({ emails });
        } else {
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error('Emails API error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
