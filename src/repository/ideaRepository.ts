
import { QueryConstraints } from '../common/types';
import {  Idea } from '../common/types/idea';
import { setDoc, updateDoc, deleteDoc, getDoc, query, where, doc}from "@firebase/firestore";
import { collection, getDocFromServer, getDocs } from "firebase/firestore";
import { firestore } from '../../firebase/clientApp';

export class IdeaRepository {
    public static deleteAll() {
        throw new Error('Method not implemented.');
    }
    public static collection = 'ideas';
    public static notificationsCollection = collection(firestore, IdeaRepository.collection);
    public static notificationDocument = (documentId: string) => doc(firestore, IdeaRepository.collection, documentId);

    
    public static async create(idea: Idea): Promise<Idea> {
        const document = IdeaRepository.notificationDocument(idea.uid);
        await setDoc(document, idea);
        return idea;
    }

    public static async findByuid(uid: string): Promise<Idea[]> {
        const queryDocs = query(IdeaRepository.notificationsCollection, where('uid', '==', uid));
        const snapshot = await getDocs(queryDocs);
        return snapshot.docs.map(doc => doc.data() as Idea);
    }
    
    public static async findWhere(constraints: QueryConstraints[]) : Promise<Idea[]> {
        const queryDocs = query(IdeaRepository.notificationsCollection, ...constraints.map(constraint => where(constraint.fieldPath, constraint.filter, constraint.value)));
        const snapshot = await getDocs(queryDocs);
        return snapshot.docs.map(doc => doc.data() as Idea);
    }
    
    public static async findById(id: string): Promise<Idea | null> {
        const document = IdeaRepository.notificationDocument(id);
        const data = await getDoc(document);
        return data.data() as Idea;

    }
   
}
