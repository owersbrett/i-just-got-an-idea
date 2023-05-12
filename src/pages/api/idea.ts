import { Idea, User } from "@/common/types";
import { IdeaRepository } from "@/repository/ideaRepository";
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
  if (req.method === "POST") {
    const idea: Idea = req.body as Idea;
    await IdeaRepository.create(idea);
    return res.status(201).send({idea: idea});
  } else if (req.method === "GET") {
    let ideas: Idea[] = await IdeaRepository.findByUserId(req.query.userId as string);
    return res.status(200).send({ideas: ideas});
  }
};

const allowCors = (handler: Function) => async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  return await handler(req, res);
};

export default allowCors(handler);
