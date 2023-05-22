import { Entry } from "../types/entry";
import { Notification } from "../types/notification";
import { Idea } from "../types/idea";
import * as admin from "firebase-admin";
import { handleErrorEntry } from "./handleErrorEntry";

export const handleKeywordsEntry = async (entry: Entry) => {
  if (entry.ideaId) {
    let ideaData = await admin.firestore().collection("ideas").doc(entry.ideaId).get();
    let idea = ideaData.data() as Idea;

    let ideaPrommise = admin.firestore().collection("ideas").doc(idea.ideaId).update({ keywords: entry.keywords, updatedAt: new Date() });
    let keywordsNotification = Notification.new(
      entry.uid,
      `Updated Idea: ${idea.idea} with keywords ${entry.keywords}`,
      "keywords"
    );
    keywordsNotification.level = "info";
    let keywordsNotificationPromise = admin
      .firestore()
      .collection("notifications")
      .doc(keywordsNotification.notificationId)
      .set(keywordsNotification);
    return await Promise.all([ideaPrommise, keywordsNotificationPromise]);
  } else {
    return handleErrorEntry(entry, "Error handling keywords entry");
  }
};
