
import { Idea } from "@/common/types/idea";
import { IdeaRepository } from "@/repository/ideaRepository";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res : NextApiResponse) {
    console.log("Tryiong to get idea")
    const { uid } = req.query;
    const idea: Idea[] = await IdeaRepository.findByuid(uid as string);
    if (idea){
        res.status(200);
        res.send(idea);
    } else {
        res.status(404);
        res.send("Not found");
    }
  }
  