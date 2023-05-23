
import { v4 as uuidv4 } from "uuid";

export enum ColorHexcodes {
  violet = "#8F00FF",
  indigo = "#9b5fe0",
  blue = "#16a4d8",
  green = "#8bd346",
  yellow = "#efdf48",
  orange = "#f9a52c",
  red = "#d64e12",
}

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
  color!: string;
  colorHex!: ColorHexcodes;
  level!: number;

  public static idea() {
    return {
      ideaId: "idea",
      uid: "anonymous",
      idea: "idea",
      description: "description",
      createdAt: new Date(),
      updatedAt: new Date(),
      active: true,
      index: 0,
      color: "Red",
      colorHex: ColorHexcodes.red,
      level: 0,
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
      createdAt: new Date(),
      updatedAt: new Date(),
      active: true,
      color: "Red",
      colorHex: ColorHexcodes.red,
      index: index,
      level: 0,
    } as Idea;
  }
}
