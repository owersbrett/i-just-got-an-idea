import { Entry } from "@/common/types/entry";
import { Idea } from "@/common/types/idea";
import { API } from "@/pages/api/api";
import authRepository from "@/repository/authRepository";
import axios from "axios";
import { User } from "firebase/auth";
import { v4 } from "uuid";

export class TerminalRunner {
  public inputs: string[];

  public uid: string;
  public sessionId: string;

  getEntryType = (): | "entry" | "idea" => {
    if (this.previousInput === "idea") {
      return "idea";
    }
    return "entry";
  }

  public ideaId: string;
  public previousInput: string;
  public currentInput: string;
  public keywords: string[] = [];
  constructor() {
    this.inputs = [];
    this.uid = "";
    this.sessionId = "";
    this.ideaId = "";
    this.currentInput = "";
    this.previousInput = "";
  }
  addInput = (input: string) => {
    this.inputs.push(input);
  };
  defaultFunction = () => {
    console.log("Default function called from TerminalRunner with input: ", this.currentInput);
    return { message: "" };
  };

  logoutCommand = () => {
    authRepository.signOut();
  };



  createEntry = () => {
    const entry: Entry = {
      sessionId: this.sessionId,
      entryId: v4(),
      uid: this.uid,
      ideaId: this.ideaId,
      content: this.currentInput,
      intent: "default",
      type: this.getEntryType(),
      createdAt: new Date(),
      updatedAt: new Date(),
      keywords: this.keywords
    } ;
    console.log("Creating entry");
    console.log(entry);
    axios
      .post("/api/entries", entry)
      .then((response) => {
        console.log("Response from createEntry: ", response);
      })
      .catch((error) => {
        console.error("Error from createEntry: ", error);
      });
  };

  run = async (user: User | null, defaultFunction: Function, input: string) => {
    try {
      if (user) {
        this.uid = user.uid;
      }
      if (this.previousInput.length > 0) {
        this.previousInput = input.trim();
        this.currentInput = input.trim();
        this.inputs.push(this.currentInput);
      } else {
        if (input.length > 0) {
          this.inputs.push(input);
          this.previousInput = this.currentInput;
          this.currentInput = input;
          switch (this.currentInput) {
            case "logout":
              return this.logoutCommand();
            default:
              break;
          }
          this.defaultFunction();
        } else {
          API.postError(this.uid, "No input provided");
        }
      }
      this.createEntry();
    } catch (e) {
      API.postError(this.uid, "Error running terminal command");
    }
  };

  public static createIdeas = async (input: string): Promise<Function> => {
    return async () => {
      console.log("Creating ideas");
    };
  };
}
