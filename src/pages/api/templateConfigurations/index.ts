import { NotificationRepository } from "@/repository/notificationRepository";
import { rateLimit } from "express-rate-limit";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

import { SessionRepository } from "@/repository/sessionRepository";
import { Session } from "@/common/types/session";
import { EntryRepository } from "@/repository/entryRepository";

import { TemplateConfigurationRepository } from "@/repository/templateConfigurationRepository";
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 10,
}); // limit each IP to 10 requests per windowMs

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("Template Configuration payload");
  try {
    if (req.method === "GET") {
      let templateConfigurations = await TemplateConfigurationRepository.getAll();
      return res.status(200).json({ templateConfigurations: templateConfigurations });
    }

    throw Error("No body");

    // return limiter(req, res, () => {
    //   return res.status(201).json({ message: "success" });
    // });
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
