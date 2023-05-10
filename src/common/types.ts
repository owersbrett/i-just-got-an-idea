interface User {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  interface Session {
    id: string;
    userId: string;
    ideaId: string;
    startTime: Date;
    endTime: Date | null;
    isActive: boolean;
  }
  
  interface Idea {
    id: string;
    userId: string;
    title: string;
    description: string;
    keywords: string[];
    createdAt: Date;
    updatedAt: Date;
  }

  interface Jargon {
    id: string;
    term: string;
    definition: string;
    createdAt: Date;
    updatedAt: Date;
  }

  interface Goal {
    id: string;
    ideaId: string;
    title: string;
    description: string;
    status: 'not_started' | 'in_progress' | 'completed';
    createdAt: Date;
    updatedAt: Date;
  }

  interface Task {
    id: string;
    goalId: string;
    title: string;
    description: string;
    status: 'not_started' | 'in_progress' | 'completed';
    createdAt: Date;
    updatedAt: Date;
  }
  
  interface Notification {
    id: string;
    userId: string;
    content: string;
    type: 'informational' | 'warning' | 'error';
    createdAt: Date;
    read: boolean;
  }
  interface Objection {
    id: string;
    userId: string;
    content: string;
    status: 'open' | 'resolved';
    createdAt: Date;
    updatedAt: Date;
  }

  interface Trend {
    id: string;
    keyword: string;
    result: string;
    createdAt: Date;
  }

  interface Advertisement {
    id: string;
    userId: string;
    content: string;
    metadata: {
      mediaUrl: string;
      mediaType: string;
    };
    createdAt: Date;
  }

  interface Image {
  id: string;
  ideaId: string;
  userId: string;
  url: string;
  createdAt: Date;
}

interface Entry {
    id: string;
    userId: string;
    ideaId?: string;
    goalId?: string;
    taskState?: string;
    type: "prompt" | "follow-up" | "idea" | "objection";
    content: string;
    createdAt: Date;
  }
  
  interface Ask {
    id: string;
    userId: string;
    content: string;
    createdAt: Date;
  }
  

  interface Project {
    id: string;
    name: string;
    description: string;
    startDate: Date;
    endDate?: Date;
    status: "planned" | "inProgress" | "completed";
    owner: string;
    teamMembers: string[];
  }
  