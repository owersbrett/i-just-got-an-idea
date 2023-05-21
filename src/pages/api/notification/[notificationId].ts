import { NotificationRepository } from "@/repository/notificationRepository";
import { rateLimit } from "express-rate-limit";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { QueryConstraints } from "@/common/types";
import { Notification } from "@/common/types/notification";
import { Timestamp, where } from "firebase/firestore";
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 10,
}); // limit each IP to 10 requests per windowMs

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("Handle this dismissal");
  try {
    console.log(req);
    if (req.body) {
      let notificationId = req.query.notificationId as string;
      let userId = req.query.userId as string;

      await NotificationRepository.update(userId, notificationId, { read: true });
    } else {
      throw Error("No body");
    }

    return limiter(req, res, () => {
      return res.status(201).json({ message: "success" });
    });
  } catch (error) {
    console.error(error);
    return res.status(499).send("Custom server error");
  }
};

const allowCors = (handler: Function) => async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  return await handler(req, res);
};

export default allowCors(handler);
