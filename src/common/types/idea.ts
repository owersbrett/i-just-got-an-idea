import { v4 as uuidv4 } from "uuid";

export class Idea {
    ideaId!: string;
    uid!: string;
    ideaStatement: string | undefined;
    ideaStatementResponse: string | undefined;
    keywords!: string[];
    createdAt!: Date;
    updatedAt!: Date;
    active!: boolean;
  
    public static idea(){
      return {
        ideaId: "idea",
        uid: "anonymous",
      
        ideaStatementResponse: "That's a great idea! You'll probably want to choose a framework. Or I could pick, something like Next.js or Angular. Is there one you would prefer?",
        createdAt: new Date(),
        updatedAt: new Date(),
        active: true,
      } as Idea;
    }
  
    isEmpty(): boolean {
      return this.ideaStatement === "";
    }
  
    public static new(
      uid: string,
      ideaStatement: string,
      keywords: string[]
    ): Idea {
      return {
        ideaId: uuidv4(),
        uid: uid,
        ideaStatement: ideaStatement,
        ideaStatementResponse: undefined,
        keywords: keywords,
        createdAt: new Date(),
        updatedAt: new Date(),
        active: true,
      } as Idea;
    }
  }