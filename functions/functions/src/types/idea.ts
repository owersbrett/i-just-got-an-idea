import { v4 } from "uuid";

export class Idea {
    index!: number;
    ideaId!: string;
    uid!: string;
    idea: string | undefined;
    description: string | undefined;
    keywords!: string[];
    createdAt!: Date;
    updatedAt!: Date;
    active!: boolean;
  
    public static idea(){
      return {
        ideaId: "idea",
        uid: "anonymous",
        idea: "idea",
        description: "description",
        createdAt: new Date(),
        updatedAt: new Date(),
        active: true,
        index: 0
      } as Idea;
    }
  
    isEmpty(): boolean {
      return this.idea === "";
    }
  
    public static new(
      uid: string,
      idea: string,
      keywords: string[],
      index: number
    ): Idea {
      return {
        ideaId: v4(),
        uid: uid,
        idea: idea,
        keywords: keywords,
        createdAt: new Date(),
        updatedAt: new Date(),
        active: true,
        index: index
      } as Idea;
    }
  }