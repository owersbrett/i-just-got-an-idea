import { v4 as uuidv4 } from "uuid";

export class Entry {
  entryId!: string;
  uid!: string;
  ideaId!: string ;
  content!: string;
  intent!: "auth" | "prompt" | "objection" | "default";
  type!: "idea" | "follow-up" | "phone" | "email" | "default";
  createdAt!: Date;
  updatedAt!: Date;

  public static auth(content: string, type: "phone" | "email"): Entry {
    return {
      entryId: uuidv4(),
      uid: "anonymous",
      ideaId: "idea",
      content: content,
      intent: "auth",
      type: type,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Entry;
  }

  public static default(content: string, userId: string, ideaId: string): Entry {
    return {
        entryId: uuidv4(),
        uid: userId,
        ideaId: ideaId,
        content: content,
        intent: "default",
        type: "default",
        createdAt: new Date(),
        updatedAt: new Date()
    }
  }
}
