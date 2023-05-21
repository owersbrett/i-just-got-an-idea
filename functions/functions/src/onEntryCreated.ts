import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { Entry } from "./types/entry";
import { Notification } from "./types/notification";

exports.onEntryCreated = functions.firestore.document("entries/{entryId}").onCreate(async (entrySnapshot) => {
  let entry = entrySnapshot.data() as Entry;
  let notification: Notification = Notification.new(entry.uid, `Successfully added ${entry.content}!`, "entry");
  return admin.firestore().collection("notifications").doc(notification.notificationId).set(notification);
});
