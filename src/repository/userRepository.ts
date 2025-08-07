
import { QueryConstraints } from '../common/types';
import { setDoc, updateDoc, deleteDoc, getDoc, query, where, doc, collection, getDocFromServer, getDocs } from "firebase/firestore";
import { db } from '../../firebase/clientApp';
import { User, UserCredential } from 'firebase/auth';

export class UserRepository {
    public static async deleteAll() {
        throw new Error('Method not implemented.');
    }
    public static collection = 'users';
    public static notificationsCollection = collection(db, UserRepository.collection);
    public static notificationDocument = (documentId: string) => doc(db, UserRepository.collection, documentId);
    
    public static getAndOrCreateUser(userCredential: UserCredential) {
        if (userCredential){
            let uid = userCredential.user.uid;
            return UserRepository.findById(uid).then((user) => {
                if (user){
                    return user;
                } else {
                    let newUser : User =userCredential.user;
                    return UserRepository.create(newUser).then((user) => {
                        return user;
                    });
                }
            });
        }
    }

    
    public static async create(user: User): Promise<User> {
        const document = UserRepository.notificationDocument(user.uid);
        await setDoc(document, user);
        return user;
    }

    public static async findByuid(uid: string): Promise<User[]> {
        const queryDocs = query(UserRepository.notificationsCollection, where('uid', '==', uid));
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
