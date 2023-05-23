import { v4 } from "uuid";

export class Entry {
  sessionId!: string;
  entryId!: string;
  uid!: string;
  ideaId!: string ;
  keywords!: string[];
  content!: string;
  intent!: "auth" | "prompt" | "objection" | "default";
  type!: "idea" | "follow-up" | "phone" | "email" | "entry" | "keywords" | "update" | "templateConfiguration";
  createdAt!: Date;
  updatedAt!: Date;

  public static auth(content: string, type: "phone" | "email", sessionId: string): Entry {
    return {
      entryId: v4(),
      uid: "anonymous",
      ideaId: "idea",
      content: content,
      sessionId: sessionId,
      keywords: [],
      intent: "auth",
      type: type,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Entry;
  }

  public static default(content: string, userId: string, ideaId: string, sessionId: string): Entry {
    return {
        entryId: v4(),
        uid: userId,
        ideaId: ideaId,
        content: content,
        intent: "default",
        type: "entry",
        keywords: [],
        sessionId: sessionId,
        createdAt: new Date(),
        updatedAt: new Date()
    }
  }
}
