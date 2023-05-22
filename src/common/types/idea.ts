import { Timestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export class Idea {
  index!: number;
  ideaId!: string;
  uid!: string;
  idea: string | undefined;
  description: string | undefined;
  keywords!: string[];
  createdAt!: Timestamp;
  updatedAt!: Timestamp;
  active!: boolean;

  public static idea() {
    return {
      ideaId: "idea",
      uid: "anonymous",
      idea: "idea",
      description: "description",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      active: true,
      index: 0,
    } as Idea;
  }

  isEmpty(): boolean {
    return this.idea === "";
  }

  public static new(uid: string, idea: string, keywords: string[], index: number): Idea {
    return {
      ideaId: uuidv4(),
      uid: uid,
      idea: idea,
      keywords: keywords,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      active: true,
      index: index,
    } as Idea;
  }
}
