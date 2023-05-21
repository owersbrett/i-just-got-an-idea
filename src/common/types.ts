import { Timestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
export interface QueryConstraints {
  fieldPath: string;
  filter: ">" | ">=" | "==" | "<" | "<=" | "!=";
  value: any;
}


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
export class Notification {
  notificationId!: string;
  uid!: string;
  ideaId: string | undefined;
  content!: string;
  notificationType!:
    | "idea"
    | "jargon"
    | "user"
    | "session"
    | "trend"
    | "goal"
    | "objection"
    | "task"
    | "advertisement"
    | "notification"
    | "image"
    | "destination"
    | "entry"
    | "ask"
    | "cheer"
    | "offering"
    | "error"
    | "media"
    | "environment"
    | "informational";
  createdAt!: Date;
  read!: boolean;
  public static new(
    uid: string,
    content: string,
    type:
      | "idea"
      | "jargon"
      | "user"
      | "session"
      | "trend"
      | "goal"
      | "error"
      | "objection"
      | "task"
      | "advertisement"
      | "notification"
      | "image"
      | "destination"
      | "entry"
      | "ask"
      | "cheer"
      | "offering"
      | "media"
      | "environment"
  ): Notification {
    return {
      notificationId: uuidv4(),
      uid: uid,
      content: content,
      notificationType: type,
      createdAt: new Date(),
      read: false,
    } as Notification;
  }
}
export class Environment {
  environmentId!: string;
  defaultTemplateConfigurationId!: string;

  public static new(): Environment {
    return {
      environmentId: uuidv4(),
      defaultTemplateConfigurationId: "1",

    } as Environment;
  }
}
export class TemplateConfiguration {
  templateConfigurationId!: string;
  uid!: string;
  ideaId!: string;
  currentTemplateIndex!: number;
  templateIds!: string[];
  createdAt!: Date;
  updatedAt!: Date;

  public static default(uid: string, ideaId: string): TemplateConfiguration {
    return {
      templateConfigurationId: uuidv4(),
      uid: uid,
      ideaId: ideaId,
      currentTemplateIndex: 0,
      templateIds: ["1", "11", "111", "1111", "11111", "111111", "1111111", "11111111", "111111111", "1111111111"],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as TemplateConfiguration;
  }
}

export class Template {
  templateId!: string;
  body!: string;
  public static new(): Template {
    return {
      templateId: uuidv4(),
      body: "What is your idea?",
    } as Template;
  }
}

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

export class Informational {
  informationalId!: string;
  templateId!: string;
  entryId!: string;
  askId!: string;

  body!: string;

  public static new(templates: Template[], currentTemplateIndex: number, entry: Entry): Informational {
    const template = templates[currentTemplateIndex];
    if (templates.length === currentTemplateIndex + 1) {
    }
    return {
      informationalId: uuidv4(),
      templateId: template.templateId,
      body: "What is your idea?",
    } as Informational;
  }
}

interface Session {
  id: string;
  uid: string;
  ideaId: string;
  startTime: Date;
  endTime: Date | null;
  isActive: boolean;
}

export class Jargon {
  jargonId!: string;
  uid!: string;
  ideaId!: string;
  term!: string;
  definition!: string;
  createdAt!: Date;
  updatedAt!: Date;
  public static new(uid: string, ideaId: string, term: string, definition: string): Jargon {
    return {
      jargonId: uuidv4(),
      uid: uid,
      ideaId: ideaId,
      term: term,
      definition: definition,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Jargon;
  }
}
export class Cheer {
  cheerId!: string;
  uid!: string;
  ideaId!: string;
  content!: string;
  createdAt!: Date;
  updatedAt!: Date;
  public static new(uid: string, ideaId: string, content: string): Cheer {
    return {
      cheerId: uuidv4(),
      uid: uid,
      ideaId: ideaId,
      content: content,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Cheer;
  }
}
export class Objection {
  objectionId!: string;
  uid!: string;
  ideaId!: string;
  content!: string;
  createdAt!: Date;
  updatedAt!: Date;
  public static new(uid: string, ideaId: string, content: string): Objection {
    return {
      objectionId: uuidv4(),
      uid: uid,
      ideaId: ideaId,
      content: content,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Objection;
  }
}
export class Task {
  taskId!: string;
  uid!: string;
  ideaId!: string;
  content!: string;
  createdAt!: Date;
  updatedAt!: Date;
  public static new(uid: string, ideaId: string, content: string): Task {
    return {
      taskId: uuidv4(),
      uid: uid,
      ideaId: ideaId,
      content: content,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Task;
  }
}

export class Trend {
  trendId!: string;
  uid!: string;
  ideaId!: string;
  content!: string;
  createdAt!: Date;
  updatedAt!: Date;
  public static new(uid: string, ideaId: string, content: string): Trend {
    return {
      trendId: uuidv4(),
      uid: uid,
      ideaId: ideaId,
      content: content,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Trend;
  }
}

export class Goal {
  goalId!: string;
  uid!: string;
  ideaId!: string;
  content!: string;
  createdAt!: Date;
  updatedAt!: Date;
  public static new(uid: string, ideaId: string, content: string): Goal {
    return {
      goalId: uuidv4(),
      uid: uid,
      ideaId: ideaId,
      content: content,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Goal;
  }
}
export class Advertisement {
  advertisementId!: string;
  uid!: string;
  ideaId!: string;
  content!: string;
  createdAt!: Date;
  updatedAt!: Date;
  public static new(uid: string, ideaId: string, content: string): Advertisement {
    return {
      advertisementId: uuidv4(),
      uid: uid,
      ideaId: ideaId,
      content: content,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Advertisement;
  }
}

export class FollowUp {
  followUpId!: string;
  uid!: string;
  ideaId!: string;
  content!: string;
  createdAt!: Date;
  updatedAt!: Date;
  public static new(uid: string, ideaId: string, content: string): FollowUp {
    return {
      followUpId: uuidv4(),
      uid: uid,
      ideaId: ideaId,
      content: content,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as FollowUp;
  }
}

export class Entry {
  entryId!: string;
  uid!: string;
  ideaId: string | undefined;
  content!: string;
  intent!: "auth" | "prompt" | "objection"
  type!: "idea" | "follow-up"  | "phone"  | "email";
  createdAt!: Date;
  updatedAt!: Date;

  public static auth( content: string, type: "phone" | "email"): Entry {
    return {
      entryId: uuidv4(),
      uid: "anonymous",
      ideaId: undefined,
      content: content,
      intent: "auth",
      type: type,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Entry;
  }

}


export class Ask {
  askId!: string;
  uid!: string;
  ideaId!: string;
  content!: string;
  createdAt!: Date;
  updatedAt!: Date;
  public static new(uid: string, ideaId: string, content: string): Ask {
    return {
      askId: uuidv4(),
      uid: uid,
      ideaId: ideaId,
      content: content,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Ask;
  }
}
