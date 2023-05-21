
import { NotificationRepository } from "@/repository/notificationRepository";
import { UserRepository } from "@/repository/userRepository";
import axios from "axios";
import { rateLimit } from "express-rate-limit";
import { User } from "firebase/auth";
import { NextApiRequest, NextApiResponse } from "next";
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 10,
}); // limit each IP to 10 requests per windowMs

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const user: User = req.body as User;
    await UserRepository.create(user);
    return res.status(201).send(user);
  } else if (req.method === "GET") {
      console.log("Getting user.");
    let user = await UserRepository.findById(req.query.uid as string);
    console.log("user", user);
    return res.status(200).send({user: user});
  }
};

const allowCors = (handler: Function) => async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  return await handler(req, res);
};

export default allowCors(handler);
