import { Entry } from "../types/entry";
import { Notification } from "../types/notification";
import * as admin from 'firebase-admin';

export const handleErrorEntry = async (entry: Entry, message: string) => {
    let notification: Notification = Notification.new(entry.uid, message, "error");
    notification.level = "error";
    return admin.firestore().collection("notifications").doc(notification.notificationId).set(notification);
}