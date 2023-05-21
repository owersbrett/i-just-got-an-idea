import { v4 as uuidv4 } from "uuid";
export class Entry {
  entryId!: string;
  uid!: string;
  ideaId: string | undefined;
  content!: string;
  intent!: "auth" | "prompt" | "objection";
  type!: "idea" | "follow-up" | "phone" | "email";
  createdAt!: Date;
  updatedAt!: Date;
  public static new(uid: string, ideaId: string | undefined, content: string): Entry {
    return {
      entryId: uuidv4(),
      uid: uid,
      ideaId: ideaId,
      content: content,
      intent: "prompt",
      type: "idea",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Entry;
  }
  public static auth(content: string, type: "phone" | "email"): Entry {
    return {
      entryId: uuidv4(),
      uid: "anonymous",
      ideaId: undefined,
      content: content,
      intent: "auth",
      type: type,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Entry;
  }
}
