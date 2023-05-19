
import { Entry } from "@/common/types";
import { EntryRepository } from "@/repository/entryRepository";

import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res : NextApiResponse) {
    const { userId, ideaId, content } = req.query;
    const userIdQuery = userId as string;
    const ideaIdQuery = ideaId as string;
    const contentQuery = content as string;
    let entry = Entry.new(userIdQuery, ideaIdQuery, contentQuery);
    res.status(200);
    entry = await EntryRepository.create(entry);
    res.setHeader('Content-Type', 'application/json');
    res.json(entry);
    
  }
  