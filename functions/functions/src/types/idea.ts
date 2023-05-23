import { Timestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";


let violet = "#8F00FF";
let indigo = "#9b5fe0";
let blue = "#16a4d8";
let green = "#8bd346";
let yellow = "#efdf48";
let orange = "#f9a52c";
let red = "#d64e12";

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
  color!: | typeof red | typeof orange | typeof yellow | typeof green | typeof blue | typeof indigo | typeof violet;
  level! : number;

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
      color: red,
      level: 0
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
      level: 0,
    } as Idea;
  }
}
