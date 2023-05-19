import { NotificationRepository } from '@/repository/notificationRepository';
import axios from 'axios';
import { rateLimit } from 'express-rate-limit';
import { NextApiRequest, NextApiResponse } from 'next';
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 min
    max: 10
}); // limit each IP to 10 requests per windowMs

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        return res.status(405).send('Method not allowed');
    }
    try {
        let userId = req.query.userId as string;
        const notifications = await NotificationRepository.findByUserId(userId);

        return limiter(req, res, () => {
            return res.status(200).json({ notifications: notifications });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal server error');
    }
}

const allowCors = (handler: Function) => async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    return await handler(req, res)
}

export default allowCors(handler)
