import { Entry } from "@/common/types/entry";
import { EntryRepository } from "@/repository/entryRepository";
import { NotificationRepository } from "@/repository/notificationRepository";
import { UserRepository } from "@/repository/userRepository";
import axios from "axios";
import { rateLimit } from "express-rate-limit";
import { NextApiRequest, NextApiResponse } from "next";
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 10,
}); // limit each IP to 10 requests per windowMs

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === "POST") {
      const entry: Entry = req.body as Entry;
      await EntryRepository.create(entry);
      return res.status(201).send({entry: entry});
    } else if (req.method === "GET") {
      let entries: Entry[] = await EntryRepository.findByuid(req.query.uid as string);
      return res.status(200).send({ entries: entries });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).send({ error: error });
  }
};

const allowCors = (handler: Function) => async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  return await handler(req, res);
};

export default allowCors(handler);
