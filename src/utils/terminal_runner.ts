import { Entry } from "@/common/types/entry";
import { Idea } from "@/common/types/idea";
import { API } from "@/pages/api/api";
import authRepository from "@/repository/authRepository";
import axios from "axios";
import { User } from "firebase/auth";

export class TerminalRunner {
  public inputs: string[];
  public userId: string;
  public ideaId: string;
  public previousInput: string;
  public currentInput: string;
  public keywords: string[] = [];
  constructor() {
    this.inputs = [];
    this.userId = "";
    this.ideaId = "";
    this.currentInput = "";
    this.previousInput = "";
  }
  addInput = (input: string) => {
    this.inputs.push(input);
  };
  defaultFunction = () => {
    console.log("Default function called from TerminalRunner with input: ", this.currentInput);
    return { message: "No function found" };
  };

  ideaCommand = () => {
    const idea = Idea.new(this.userId, this.currentInput, this.keywords);
  };
  keywordCommand = () => {
    this.keywords = this.currentInput.split(" ");
  };
  logoutCommand = () => {
    authRepository.signOut();
  };
  loginCommand = () => {
    console.log("TODO extract login logic from ~/home-page/index.tsx")
  };

  createEntry = () => {
    console.log("Creating entry");
    const entry = Entry.default(this.currentInput, this.userId, this.ideaId);
    console.log(entry);
    axios
      .post("/api/entries", entry)
      .then((response) => {
        console.log("Response from createEntry: ", response);
      })
      .catch((error) => {
        console.log("Error from createEntry: ", error);
      });
  }

  run = async (user: User | null, defaultFunction: Function, input: string) => {
    try {
      if (user) {
        this.userId = user.uid;
      }
      if (this.previousInput.length > 0) {
        this.previousInput = input.trim();
        this.currentInput = input.trim();
        this.inputs.push(this.currentInput);
      } else {
        if (input.length > 0) {
          this.inputs.push(input);
          this.currentInput = input;
          let specialFunction = null;

          switch (this.currentInput) {
            case "logout":
              specialFunction = this.logoutCommand;
              break;
            case "login":
              specialFunction = this.loginCommand;
              break;
            case "idea":
              specialFunction = this.ideaCommand;
              break;
            case "keywords":
              specialFunction = this.keywordCommand;
              break;
            default:
              break;
          }
          if (specialFunction) {
            specialFunction();
          } else {
            this.defaultFunction();
          }
        } else {
          API.postError(this.userId, "No input provided");
        }
      }
      this.createEntry();
    } catch (e) {
      API.postError(this.userId, "Error running terminal command");
    }
  };

  public static createIdeas = async (input: string): Promise<Function> => {
    return async () => {
      console.log("Creating ideas");
    };
  };
}
