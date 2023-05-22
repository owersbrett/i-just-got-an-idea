import { Entry } from "../types/entry";
import { Notification } from "../types/notification";
import { Idea } from "../types/idea";
import * as admin from 'firebase-admin';
import { handleErrorEntry } from "./handleErrorEntry";


export const handleIdeaEntry = async (entry: Entry) => {
    try {

        let userIdeas = await admin.firestore().collection("ideas").where("uid", "==", entry.uid).get();
        let ideas = userIdeas.docs.map((doc) => doc.data() as Idea);
        let nextIndex = 1;
        ideas.sort((a, b) => b.index - a.index);
      
        if (ideas.length > 0) {
          let idea = ideas[0];
          nextIndex = idea.index + 1;
        }
      
        let idea: Idea = Idea.new(entry.uid, entry.content, entry.keywords, nextIndex);
        let ideaPromise = admin.firestore().collection("ideas").doc(idea.ideaId).set(idea);
        let ideaNotification = Notification.new(entry.uid, idea.idea ?? "", "idea");
        ideaNotification.level = "success";
        let ideaNotificationPromise = admin
          .firestore()
          .collection("notifications")
          .doc(ideaNotification.notificationId)
          .set(ideaNotification);
        return await Promise.all([ideaPromise, ideaNotificationPromise]);
    } catch (e){
        return handleErrorEntry(entry, "Error handling idea entry");
    }
  };