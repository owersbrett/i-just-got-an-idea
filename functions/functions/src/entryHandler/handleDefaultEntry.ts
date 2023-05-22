import { Entry } from "../types/entry";
import { Notification } from "../types/notification";
import * as admin from 'firebase-admin';

export const handleDefaultEntry = async (entry: Entry) => {
    return true;
    let notification: Notification = Notification.new(entry.uid, `Successfully recorded your entry: ${entry.content}!`, "entry");
    notification.level = "success";
    return admin.firestore().collection("notifications").doc(notification.notificationId).set(notification);
}