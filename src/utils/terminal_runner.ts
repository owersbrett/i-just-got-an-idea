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

  getEntryType = (): "entry" | "idea" | "blogpost" | "keywords" | "update" => {
    switch (this.previousInput) {
      case "idea":
        return "idea";
      case "blogpost":
        return "blogpost";
      case "keywords":
        return "keywords";
      case "update":
        return "update";
      default:
        return "entry";
    }
  };
  public idea: Idea | null;

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
    this.idea = null;
  }
  addInput = (input: string) => {
    this.inputs.push(input);
  };
  defaultFunction = () => {
    console.log("Default function called from TerminalRunner with input: ", this.currentInput);
    return { message: "" };
  };

  logoutCheck = () => {
    if (this.currentInput === "logout") {
      authRepository.signOut();
    }
  };

  update = (idea: Idea | null) => {
    this.idea = idea;
  }

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
      keywords: this.keywords,
    };
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

  setUserId(user: User | null) {
    if (user) {
      this.uid = user.uid;
    }
  }
  clearCheck(){
    if (this.currentInput === "clear"){
      this.inputs = [];
      this.previousInput = "";
      this.currentInput = "";
      this.keywords = [];
      return;
    }
  }
  keywordsCheck(){
    if (this.previousInput === "keywords"){
      this.keywords = this.currentInput.split(" ");
    }
  }

  ideaCheck(){
    if (this.idea){
      this.ideaId = this.idea.ideaId;
    }
  }
  checks(){
    this.keywordsCheck();
    this.clearCheck();
    this.logoutCheck();
    this.ideaCheck();
  }



  run = async (user: User | null, defaultFunction: Function, input: string) => {
    input = input.trim();
    try {
      this.setUserId(user);

      if (input) {
        this.inputs.push(input);
        this.currentInput = input;
        this.checks();

        this.createEntry();
        this.previousInput = this.currentInput;
        this.currentInput = "";
      } else {
        API.postError(this.uid, "No input provided");
      }
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
