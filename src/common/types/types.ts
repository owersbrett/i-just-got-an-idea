import { v4 as uuidv4 } from "uuid";
import { Entry } from "./entry";
import { Template } from "./templateConfiguration";

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
