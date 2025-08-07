import { QueryConstraints } from '../common/types';
import { Message } from '../common/types/message';
import { setDoc, updateDoc, deleteDoc, getDoc, query, where, doc, collection, getDocFromServer, getDocs } from "firebase/firestore";
import { db } from '../../firebase/clientApp';

export class MessageRepository {
    public static collection = 'messages';
    public static messagesCollection = collection(db, MessageRepository.collection);
    public static messageDocument = (documentId: string) => doc(db, MessageRepository.collection, documentId);

    public static async create(message: Message): Promise<Message> {
        const document = MessageRepository.messageDocument(message.id);
        // Using setDoc for upsert behavior - will create or update
        await setDoc(document, message);
        return message;
    }

    public static async upsert(message: Message): Promise<Message> {
        const document = MessageRepository.messageDocument(message.id);
        await setDoc(document, message);
        return message;
    }

    public static async findByUid(uid: string): Promise<Message[]> {
        const queryDocs = query(MessageRepository.messagesCollection, where('uid', '==', uid));
        const snapshot = await getDocs(queryDocs);
        return snapshot.docs.map(doc => doc.data() as Message);
    }

    public static async findWhere(constraints: QueryConstraints[]): Promise<Message[]> {
        const queryDocs = query(MessageRepository.messagesCollection, ...constraints.map(constraint => where(constraint.fieldPath, constraint.filter, constraint.value)));
        const snapshot = await getDocs(queryDocs);
        return snapshot.docs.map(doc => doc.data() as Message);
    }

    public static async findById(id: string): Promise<Message | null> {
        const document = MessageRepository.messageDocument(id);
        const snapshot = await getDoc(document);
        return snapshot.exists() ? snapshot.data() as Message : null;
    }

    public static async update(message: Message): Promise<Message> {
        const document = MessageRepository.messageDocument(message.id);
        await updateDoc(document, { ...message });
        return message;
    }

    public static async delete(id: string): Promise<void> {
        const document = MessageRepository.messageDocument(id);
        await deleteDoc(document);
    }
}
