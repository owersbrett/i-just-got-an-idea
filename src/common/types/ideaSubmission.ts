export enum SubmissionState {
  NEW = 'new',
  ENQUEUED = 'enqueued', 
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  ERROR = 'error'
}

export interface IdeaSubmission {
  id: string;
  email?: string;
  title?: string;
  description?: string;
  dateCreated: Date;
  dateExecuted?: Date | null;
  primaryWorkflowRun: string;
  state: SubmissionState;
  userId?: string;
  errorMessage?: string;
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
    sessionId?: string;
  };
}

export interface CreateIdeaSubmissionRequest {
  email?: string;
  title?: string;
  description?: string;
  userId?: string;
  sessionId?: string;
}