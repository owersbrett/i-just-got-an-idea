
import { QueryConstraints } from '../common/types';

import { setDoc, updateDoc, deleteDoc, getDoc, query, where, doc, collection, getDocFromServer, getDocs } from "firebase/firestore";
import { db } from '../../firebase/clientApp';
import { TemplateConfiguration } from '../common/types/templateConfiguration';


export class TemplateConfigurationRepository {
    public static deleteAll() {
        throw new Error('Method not implemented.');
    }
    public static collection = 'templateConfigurations';
    public static templateConfigurationCollection = collection(db, TemplateConfigurationRepository.collection);
    public static templateConfigurationDocument = (documentId: string) => doc(db, TemplateConfigurationRepository.collection, documentId);

    
    public static async create(templateConfiguration: TemplateConfiguration): Promise<TemplateConfiguration> {
        const document = TemplateConfigurationRepository.templateConfigurationDocument(templateConfiguration.templateConfigurationId);
        await setDoc(document, templateConfiguration);
        return templateConfiguration;
    }

    public static async findByuid(uid: string): Promise<TemplateConfiguration[]> {
        const queryDocs = query(TemplateConfigurationRepository.templateConfigurationCollection, where('uid', '==', uid));
        const snapshot = await getDocs(queryDocs);
        return snapshot.docs.map(doc => doc.data() as TemplateConfiguration);
    }
    
    public static async findWhere(constraints: QueryConstraints[]) : Promise<TemplateConfiguration[]> {
        const queryDocs = query(TemplateConfigurationRepository.templateConfigurationCollection, ...constraints.map(constraint => where(constraint.fieldPath, constraint.filter, constraint.value)));
        const snapshot = await getDocs(queryDocs);
        return snapshot.docs.map(doc => doc.data() as TemplateConfiguration);
    }
    
    public static async findById(id: string): Promise<TemplateConfiguration | null> {
        const document = TemplateConfigurationRepository.templateConfigurationDocument(id);
        const data = await getDoc(document);
        return data.data() as TemplateConfiguration;

    }

    public static async getAll(): Promise<TemplateConfiguration[]> {
        const snapshot = await getDocs(TemplateConfigurationRepository.templateConfigurationCollection);
        return snapshot.docs.map(doc => doc.data() as TemplateConfiguration);
    }
   
}
