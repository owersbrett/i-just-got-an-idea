
import { QueryConstraints } from '../common/types';
import {  Entry } from '../common/types/entry';
import { setDoc, updateDoc, deleteDoc, getDoc, query, where, doc}from "@firebase/firestore";
import { collection, getDocFromServer, getDocs } from "firebase/firestore";
import { firestore } from '../../firebase/clientApp';

export class EntryRepository {
    public static deleteAll() {
        throw new Error('Method not implemented.');
    }
    public static collection = 'entries';
    public static notificationsCollection = collection(firestore, EntryRepository.collection);
    public static notificationDocument = (documentId: string) => doc(firestore, EntryRepository.collection, documentId);

    
    public static async create(entry: Entry): Promise<Entry> {
        try {
            const document = EntryRepository.notificationDocument(entry.entryId);
            let response = await setDoc(document, entry);
            return entry;
        } catch (e){
            console.error(e);
            throw new Error("Error creating entry");
        }
    }

    public static async findByuidAndIdeaId(uid: string, ideaId: string): Promise<Entry[]> {
        let uidConstraint : QueryConstraints = {fieldPath: 'uid', filter: '==', value: uid};
        let ideaIdConstraint : QueryConstraints = {fieldPath: 'ideaId', filter: '==', value: ideaId};
        return EntryRepository.findWhere([uidConstraint, ideaIdConstraint]);
    }
    
    public static async findByuid(uid: string): Promise<Entry[]> {
        const queryDocs = query(EntryRepository.notificationsCollection, where('uid', '==', uid));
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
