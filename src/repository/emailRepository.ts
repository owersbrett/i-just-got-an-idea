import { QueryConstraints } from '../common/types';
import { Email } from '../common/types/email';
import { setDoc, updateDoc, deleteDoc, getDoc, query, where, doc, collection, getDocFromServer, getDocs } from "firebase/firestore";
import { db } from '../../firebase/clientApp';

export class EmailRepository {
    public static collection = 'emails';
    public static emailsCollection = collection(db, EmailRepository.collection);
    public static emailDocument = (documentId: string) => doc(db, EmailRepository.collection, documentId);

    public static async create(email: Email): Promise<Email> {
        const document = EmailRepository.emailDocument(email.id);
        await setDoc(document, email);
        return email;
    }

    public static async findByUid(uid: string): Promise<Email[]> {
        const queryDocs = query(EmailRepository.emailsCollection, where('uid', '==', uid));
        const snapshot = await getDocs(queryDocs);
        return snapshot.docs.map(doc => doc.data() as Email);
    }

    public static async findWhere(constraints: QueryConstraints[]): Promise<Email[]> {
        const queryDocs = query(EmailRepository.emailsCollection, ...constraints.map(constraint => where(constraint.fieldPath, constraint.filter, constraint.value)));
        const snapshot = await getDocs(queryDocs);
        return snapshot.docs.map(doc => doc.data() as Email);
    }

    public static async findById(id: string): Promise<Email | null> {
        const document = EmailRepository.emailDocument(id);
        const snapshot = await getDoc(document);
        return snapshot.exists() ? snapshot.data() as Email : null;
    }

    public static async update(email: Email): Promise<Email> {
        const document = EmailRepository.emailDocument(email.id);
        await updateDoc(document, { ...email });
        return email;
    }

    public static async delete(id: string): Promise<void> {
        const document = EmailRepository.emailDocument(id);
        await deleteDoc(document);
    }
}
