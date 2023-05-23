import { v4 as uuidv4 } from "uuid";

export class Entry {
  sessionId!: string;
  entryId!: string;
  uid!: string;
  ideaId!: string ;
  content!: string;
  keywords!: string[];
  intent!: "auth" | "prompt" | "objection" | "default";
  type!: "idea" | "blogpost" | "keywords" | "follow-up" | "phone" | "email" | "entry" | "update" | "templateConfiguration";
  createdAt!: Date;
  updatedAt!: Date;

  public static auth(content: string, type: "phone" | "email", sessionId: string): Entry {
    return {
      entryId: uuidv4(),
      uid: "anonymous",
      ideaId: "idea",
      content: content,
      intent: "auth",
      type: type,
      createdAt: new Date(),
      updatedAt: new Date(),
      sessionId: sessionId,
      keywords: []
    } as Entry;
  }

  public static default(content: string, userId: string, ideaId: string, sessionId: string): Entry {
    return {
        entryId: uuidv4(),
        uid: userId,
        ideaId: ideaId,
        content: content,
        intent: "default",
        type: "entry",
        sessionId: sessionId,
        createdAt: new Date(),
        updatedAt: new Date(),
        keywords: []
    }
  }
}
