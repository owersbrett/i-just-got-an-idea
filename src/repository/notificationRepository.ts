
import { QueryConstraints, Notification } from '../common/types';
import { setDoc, updateDoc, deleteDoc, getDoc, query, where, doc}from "@firebase/firestore";
import { collection, getDocFromServer, getDocs } from "firebase/firestore";
import { firestore } from '../../firebase/clientApp';

export class NotificationRepository {
    public static collection = 'notifications';
    public static notificationsCollection = collection(firestore, NotificationRepository.collection);
    public static notificationDocument = (documentId: string) => doc(firestore, NotificationRepository.collection, documentId);

    
    public static async create(notification: Notification): Promise<Notification> {
        const document = NotificationRepository.notificationDocument(notification.notificationId);
        await setDoc(document, notification);
        return notification;
    }

    public static async findByUserId(userId: string): Promise<Notification[]> {
        const queryDocs = query(NotificationRepository.notificationsCollection, where('userId', '==', userId));
        const snapshot = await getDocs(queryDocs);
        return snapshot.docs.map(doc => doc.data() as Notification);
    }
    
    public static async findWhere(constraints: QueryConstraints[]) : Promise<Notification[]> {
        const queryDocs = query(NotificationRepository.notificationsCollection, ...constraints.map(constraint => where(constraint.fieldPath, constraint.filter, constraint.value)));
        const snapshot = await getDocs(queryDocs);
        return snapshot.docs.map(doc => doc.data() as Notification);
    }
    
    public static async findById(id: string): Promise<Notification | null> {
        const document = NotificationRepository.notificationDocument(id);
        const data = await getDoc(document);
        return data.data() as Notification;

    }
    
    // public static async update(id: string, notification: Notification): Promise<Notification | null> {
    //     const foundNotification = await NotificationRepository.findById(id);
    //     if (foundNotification) {
    //         updateDoc(NotificationRepository.notificationDocument(id), notification);
    //     await Notification.update(notification, { where: { id } });
    //     return foundNotification;
    //     }
    //     return null;
    // }
    
    // public static async delete(id: number): Promise<number> {
    //     return await Notification.destroy({ where: { id } });
    // }
}

// const todosQuery = query(todosCollection,where('done','==',false),limit(10));
// // get the todos
// const querySnapshot = await getDocs(todosQuery);

// // map through todos adding them to an array
// const result: QueryDocumentSnapshot<DocumentData>[] = [];
// querySnapshot.forEach((snapshot) => {
// result.push(snapshot);
// });
// // set it to state
// setTodos(result);