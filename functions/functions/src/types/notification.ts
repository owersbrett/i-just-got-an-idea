import { v4 as uuidv4 } from "uuid";

export class Notification {
  notificationId!: string;
  uid!: string;
  level!: | "info" | "warning" | "error" | "success";

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
  dismissed!: boolean;
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
      level: "info",
      dismissed : false
    } as Notification;
  }
}
