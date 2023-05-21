import { v4 as uuidv4 } from "uuid";
import { Entry } from "./entry";
import { Template } from "./types";

export class Prompt {
    promptId!: string;
    templateId!: string;
    entryId!: string;
    askId!: string;
  
    body!: string;
  
    public static new(templates: Template[], currentTemplateIndex: number, entry: Entry): Prompt {
      const template = templates[currentTemplateIndex];
      if (templates.length === currentTemplateIndex + 1) {
      }
      return {
        promptId: uuidv4(),
        templateId: template.templateId,
        body: "What is your idea?",
      } as Prompt;
    }
  }