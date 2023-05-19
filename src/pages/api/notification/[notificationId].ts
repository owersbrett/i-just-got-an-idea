import { NotificationRepository } from "@/repository/notificationRepository";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res : NextApiResponse) {
    const { notificationId, userId } = req.query;
    res.status(200);
    let notification = await NotificationRepository.update(userId as string, notificationId as string, {read: true});
    res.setHeader('Content-Type', 'application/json');
    res.json(notification);
  }
  