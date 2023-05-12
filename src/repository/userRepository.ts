
import { QueryConstraints, User } from '../common/types';
import { setDoc, updateDoc, deleteDoc, getDoc, query, where, doc}from "@firebase/firestore";
import { collection, getDocFromServer, getDocs } from "firebase/firestore";
import { firestore } from '../../firebase/clientApp';

export class UserRepository {
    public static async deleteAll() {
        throw new Error('Method not implemented.');
    }
    public static collection = 'users';
    public static notificationsCollection = collection(firestore, UserRepository.collection);
    public static notificationDocument = (documentId: string) => doc(firestore, UserRepository.collection, documentId);

    
    public static async create(user: User): Promise<User> {
        const document = UserRepository.notificationDocument(user.userId);
        await setDoc(document, user);
        return user;
    }

    public static async findByUserId(userId: string): Promise<User[]> {
        const queryDocs = query(UserRepository.notificationsCollection, where('userId', '==', userId));
        const snapshot = await getDocs(queryDocs);
        return snapshot.docs.map(doc => doc.data() as User);
    }
    
    public static async findWhere(constraints: QueryConstraints[]) : Promise<User[]> {
        const queryDocs = query(UserRepository.notificationsCollection, ...constraints.map(constraint => where(constraint.fieldPath, constraint.filter, constraint.value)));
        const snapshot = await getDocs(queryDocs);
        return snapshot.docs.map(doc => doc.data() as User);
    }
    
    public static async findById(id: string): Promise<User | null> {
        const document = UserRepository.notificationDocument(id);
        const data = await getDoc(document);
        return data.data() as User;

    }
   
}
