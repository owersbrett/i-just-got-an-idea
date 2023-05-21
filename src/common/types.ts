import { Timestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
export interface QueryConstraints {
  fieldPath: string;
  filter: ">" | ">=" | "==" | "<" | "<=" | "!=";
  value: any;
}


