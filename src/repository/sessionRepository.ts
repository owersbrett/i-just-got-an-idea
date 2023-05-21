
import { QueryConstraints } from '../common/types';
import {  Session } from '../common/types/session';
import { setDoc, updateDoc, deleteDoc, getDoc, query, where, doc}from "@firebase/firestore";
import { collection, getDocFromServer, getDocs } from "firebase/firestore";
import { firestore } from '../../firebase/clientApp';

export class SessionRepository {
    public static deleteAll() {
        throw new Error('Method not implemented.');
    }
    public static collection = 'sessions';
    public static notificationsCollection = collection(firestore, SessionRepository.collection);
    public static notificationDocument = (documentId: string) => doc(firestore, SessionRepository.collection, documentId);

    
    public static async upsert(session: Session): Promise<Session> {
        if (await SessionRepository.findById(session.sessionId)) {
            await SessionRepository.update(session);
        } else {
            await SessionRepository.create(session);
        }

        return session;
    }
    public static async update(session: Session): Promise<Session> {
        const document = SessionRepository.notificationDocument(session.sessionId);
        await updateDoc(document, session as any);
        return session;
    }
    public static async create(session: Session): Promise<Session> {
        const document = SessionRepository.notificationDocument(session.sessionId);
        await setDoc(document, session);
        return session;
    }

    public static async findByuid(uid: string): Promise<Session[]> {
        const queryDocs = query(SessionRepository.notificationsCollection, where('uid', '==', uid));
        const snapshot = await getDocs(queryDocs);
        return snapshot.docs.map(doc => doc.data() as Session);
    }
    
    public static async findWhere(constraints: QueryConstraints[]) : Promise<Session[]> {
        const queryDocs = query(SessionRepository.notificationsCollection, ...constraints.map(constraint => where(constraint.fieldPath, constraint.filter, constraint.value)));
        const snapshot = await getDocs(queryDocs);
        return snapshot.docs.map(doc => doc.data() as Session);
    }
    
    public static async findById(id: string): Promise<Session | null> {
        const document = SessionRepository.notificationDocument(id);
        const data = await getDoc(document);
        return data.data() as Session;

    }
   
}
