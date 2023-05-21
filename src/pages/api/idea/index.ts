
import { Idea } from "@/common/types/idea";
import { IdeaRepository } from "@/repository/ideaRepository";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res : NextApiResponse) {
    const { uid } = req.query;
    const userId = uid as string;
    res.status(200);
    res.json({"ideas": [], "uid": userId});
    
  }
  