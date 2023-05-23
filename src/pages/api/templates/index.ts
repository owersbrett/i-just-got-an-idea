import { NotificationRepository } from "@/repository/notificationRepository";
import { rateLimit } from "express-rate-limit";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

import { SessionRepository } from "@/repository/sessionRepository";
import { Session } from "@/common/types/session";
import { EntryRepository } from "@/repository/entryRepository";
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 10,
}); // limit each IP to 10 requests per windowMs

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("Handling sessionId");
  try {
    if (req.body) {
      let body = req.body as Session;
      if (req.method === "POST") {
        await SessionRepository.upsert(body);
      } else if (req.method === "GET"){
        if (body.uid){
            let sessions = await SessionRepository.findByuid(body.uid);;
            let entries = await EntryRepository.findByuid(body.uid);
            return res.status(200).json({ sessions: sessions, entries: entries });
        }
      }
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
