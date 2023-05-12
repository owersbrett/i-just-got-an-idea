
import { QueryConstraints, Entry } from '../common/types';
import { setDoc, updateDoc, deleteDoc, getDoc, query, where, doc}from "@firebase/firestore";
import { collection, getDocFromServer, getDocs } from "firebase/firestore";
import { firestore } from '../../firebase/clientApp';

export class EntryRepository {
    public static deleteAll() {
        throw new Error('Method not implemented.');
    }
    public static collection = 'users';
    public static notificationsCollection = collection(firestore, EntryRepository.collection);
    public static notificationDocument = (documentId: string) => doc(firestore, EntryRepository.collection, documentId);

    
    public static async create(entry: Entry): Promise<Entry> {
        const document = EntryRepository.notificationDocument(entry.userId);
        await setDoc(document, entry);
        return entry;
    }

    public static async findByUserIdAndIdeaId(userId: string, ideaId: string): Promise<Entry[]> {
        let userIdConstraint : QueryConstraints = {fieldPath: 'userId', filter: '==', value: userId};
        let ideaIdConstraint : QueryConstraints = {fieldPath: 'ideaId', filter: '==', value: ideaId};
        return EntryRepository.findWhere([userIdConstraint, ideaIdConstraint]);
    }
    
    public static async findByUserId(userId: string): Promise<Entry[]> {
        const queryDocs = query(EntryRepository.notificationsCollection, where('userId', '==', userId));
        const snapshot = await getDocs(queryDocs);
        return snapshot.docs.map(doc => doc.data() as Entry);
    }
    
    public static async findWhere(constraints: QueryConstraints[]) : Promise<Entry[]> {
        const queryDocs = query(EntryRepository.notificationsCollection, ...constraints.map(constraint => where(constraint.fieldPath, constraint.filter, constraint.value)));
        const snapshot = await getDocs(queryDocs);
        return snapshot.docs.map(doc => doc.data() as Entry);
    }
    
    public static async findById(id: string): Promise<Entry | null> {
        const document = EntryRepository.notificationDocument(id);
        const data = await getDoc(document);
        return data.data() as Entry;

    }
   
}
