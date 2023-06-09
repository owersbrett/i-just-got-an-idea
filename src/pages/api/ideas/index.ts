
import { Idea } from "@/common/types/idea";
import { IdeaRepository } from "@/repository/ideaRepository";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res : NextApiResponse) {

    const { uid } = req.query;
    const userId = uid as string;
    const ideas = await IdeaRepository.findByuid(userId);
    res.status(200);
    res.setHeader('Content-Type', 'application/json');
    res.send({"ideas": ideas});
    
  }
  