import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { Entry } from "./types/entry";
import { Notification } from "./types/notification";
import { Idea } from "./types/idea";

exports.onEntryCreated = functions.firestore.document("entries/{entryId}").onCreate(async (entrySnapshot) => {
  let entry = entrySnapshot.data() as Entry;
  if (entry.type === "idea") {
    let userIdeas = await admin.firestore().collection("ideas").where("uid", "==", entry.uid).get();
    let ideas = userIdeas.docs.map((doc) => doc.data() as Idea);
    let nextIndex = 1;
    ideas.sort((a,b) => b.index - a.index)
    
    if (ideas.length > 0) {
      let idea = ideas[0];
      nextIndex = idea.index + 1;
    }


    let idea: Idea = Idea.new(entry.uid, entry.content, entry.keywords, nextIndex);
    let ideaPrommise = admin.firestore().collection("ideas").doc(idea.ideaId).set(idea);
    let ideaNotification = Notification.new(entry.uid, "Got your idea!", "idea");
    ideaNotification.level = "success";
    let ideaNotificationPromise = admin
      .firestore()
      .collection("notifications")
      .doc(ideaNotification.notificationId)
      .set(ideaNotification);
    let entryNotification = Notification.new(entry.uid, "Recorded your entry: " + entry.content, "entry");
    entryNotification.level = "info";
    let entryNotificationPromise = admin
      .firestore()
      .collection("notifications")
      .doc(entryNotification.notificationId)
      .set(entryNotification);
    return await Promise.all([ideaPrommise, ideaNotificationPromise, entryNotificationPromise]);
  } else {
    let notification: Notification = Notification.new(entry.uid, `Recorded your entry: ${entry.content}!`, "entry");
    return admin.firestore().collection("notifications").doc(notification.notificationId).set(notification);
  }
});
