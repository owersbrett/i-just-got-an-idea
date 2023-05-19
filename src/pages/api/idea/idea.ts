
import { Idea } from "@/common/types";
import { IdeaRepository } from "@/repository/ideaRepository";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res : NextApiResponse) {
    const { ideaStatement, keywords, userId } = req.query;
    const uid = userId as string;
    const statement = ideaStatement as string;
    const keyWords = keywords as string[];
    let idea = Idea.new(uid, statement, keyWords);
    res.status(200);
    idea = await IdeaRepository.create(idea);
    res.setHeader('Content-Type', 'application/json');
    res.json(idea);
    
  }
  