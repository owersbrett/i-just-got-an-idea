
import { Idea } from "@/common/types/idea";
import { IdeaRepository } from "@/repository/ideaRepository";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res : NextApiResponse) {
  console.log("Nothing?")
    const { ideaStatement, keywords, uid } = req.query;
    const userId = uid as string;
    const statement = ideaStatement as string;
    const keyWords = keywords as string[];
    let idea = Idea.new(userId, statement, keyWords);
    res.status(200);
    idea = await IdeaRepository.create(idea);
    res.setHeader('Content-Type', 'application/json');
    res.json(idea);
    
  }
  