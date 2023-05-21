import { NotificationRepository } from "@/repository/notificationRepository";
import axios from "axios";
import { rateLimit } from "express-rate-limit";
import { NextApiRequest, NextApiResponse } from "next";
import { Notification, QueryConstraints } from "@/common/types";
import { Timestamp, where } from "firebase/firestore";
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 10,
}); // limit each IP to 10 requests per windowMs

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log("Handle this");
  try {
    let notifications: Notification[] = [];
    if (req.body) {
        console.log(req.body);
      let mostRecentNotification: Notification = req.body as Notification;
      let uid = mostRecentNotification.uid;
      let userQuery: QueryConstraints = {
        fieldPath: "uid",
        filter: "==",
        value: uid,
      };
    //   const comparisonTimestamp = Timestamp.fromDate(mostRecentNotification.createdAt);

    //   let dateQuery: QueryConstraints = {
    //     fieldPath: "createdAt",
    //     filter: ">",
    //     value: comparisonTimestamp,
    //   };


      notifications = await NotificationRepository.findWhere([userQuery]);
    //   notifications = await NotificationRepository.findWhere([userQuery, dateQuery]);
    } else {
      console.log("No body");
    }

    return limiter(req, res, () => {
      return res.status(200).json({ notifications: notifications });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
};

const allowCors = (handler: Function) => async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  return await handler(req, res);
};

export default allowCors(handler);
