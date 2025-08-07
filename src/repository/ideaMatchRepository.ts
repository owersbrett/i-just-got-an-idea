import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  getDoc,
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../../firebase/clientApp';
import { IdeaMatch, IdeaBatch, UserIdeaMatches, CreateIdeaMatchRequest } from '../common/types/ideaMatch';

export class IdeaMatchRepository {
  private static readonly MATCHES_COLLECTION = 'idea_matches';
  private static readonly BATCHES_COLLECTION = 'idea_batches';
  private static readonly USER_MATCHES_COLLECTION = 'user_idea_matches';

  // Create a new idea batch when we hit 10 submissions
  static async createBatch(ideaIds: string[]): Promise<string> {
    try {
      // Get the current batch count to determine batch number
      const batchesQuery = query(collection(db, this.BATCHES_COLLECTION));
      const batchesSnapshot = await getDocs(batchesQuery);
      const batchNumber = batchesSnapshot.size + 1;

      const batch: Partial<Omit<IdeaBatch, 'id'>> = {
        batchNumber,
        ideaIds,
        processingStarted: new Date(),
        status: 'pending',
        totalMatches: 0
      };

      const docRef = await addDoc(collection(db, this.BATCHES_COLLECTION), {
        ...batch,
        processingStarted: Timestamp.now()
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating idea batch:', error);
      throw error;
    }
  }

  // Update batch processing status
  static async updateBatchStatus(
    batchId: string, 
    status: 'pending' | 'processing' | 'completed' | 'error',
    totalMatches?: number
  ): Promise<void> {
    try {
      const updateData: any = { 
        status,
        ...(totalMatches !== undefined && { totalMatches }),
        ...(status === 'completed' && { processingCompleted: Timestamp.now() })
      };

      await updateDoc(doc(db, this.BATCHES_COLLECTION, batchId), updateData);
    } catch (error) {
      console.error('Error updating batch status:', error);
      throw error;
    }
  }

  // Create idea matches
  static async createMatches(matches: CreateIdeaMatchRequest[]): Promise<void> {
    try {
      const promises = matches.map(match => {
        const matchData = {
          ...match,
          createdAt: Timestamp.now(),
          connectionStatus: 'none'
        };
        return addDoc(collection(db, this.MATCHES_COLLECTION), matchData);
      });

      await Promise.all(promises);
    } catch (error) {
      console.error('Error creating idea matches:', error);
      throw error;
    }
  }

  // Get matches for a specific user's idea
  static async getUserMatches(userId: string, ideaId: string): Promise<IdeaMatch[]> {
    try {
      // Find matches where this user's idea is either idea1 or idea2
      const matches1Query = query(
        collection(db, this.MATCHES_COLLECTION),
        where('ideaId1', '==', ideaId),
        where('userId1', '==', userId),
        orderBy('compatibilityScore', 'desc'),
        limit(10)
      );

      const matches2Query = query(
        collection(db, this.MATCHES_COLLECTION),
        where('ideaId2', '==', ideaId),
        where('userId2', '==', userId),
        orderBy('compatibilityScore', 'desc'),
        limit(10)
      );

      const [matches1Snapshot, matches2Snapshot] = await Promise.all([
        getDocs(matches1Query),
        getDocs(matches2Query)
      ]);

      const allMatches = [
        ...matches1Snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
        })),
        ...matches2Snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
        }))
      ] as IdeaMatch[];

      // Sort by compatibility score and remove duplicates
      return allMatches
        .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
        .slice(0, 10);
    } catch (error) {
      console.error('Error getting user matches:', error);
      return [];
    }
  }

  // Get the latest batch that needs processing
  static async getLatestPendingBatch(): Promise<IdeaBatch | null> {
    try {
      const q = query(
        collection(db, this.BATCHES_COLLECTION),
        where('status', '==', 'pending'),
        orderBy('batchNumber', 'desc'),
        limit(1)
      );
      
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;

      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
        processingStarted: doc.data().processingStarted.toDate(),
        processingCompleted: doc.data().processingCompleted?.toDate() || undefined,
      } as IdeaBatch;
    } catch (error) {
      console.error('Error getting latest pending batch:', error);
      return null;
    }
  }

  // Check if we need to create a new batch (every 10 submissions)
  static async shouldCreateNewBatch(totalSubmissions: number): Promise<boolean> {
    try {
      // Check if we have a multiple of 10 submissions
      if (totalSubmissions % 10 !== 0 || totalSubmissions === 0) {
        return false;
      }

      // Check if we already have a batch for this submission count
      const batchNumber = Math.floor(totalSubmissions / 10);
      const q = query(
        collection(db, this.BATCHES_COLLECTION),
        where('batchNumber', '==', batchNumber)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.empty; // Create batch if none exists for this number
    } catch (error) {
      console.error('Error checking if should create new batch:', error);
      return false;
    }
  }

  // Get all matches in the system for debugging
  static async getAllMatches(): Promise<IdeaMatch[]> {
    try {
      const q = query(
        collection(db, this.MATCHES_COLLECTION),
        orderBy('compatibilityScore', 'desc'),
        limit(100)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      })) as IdeaMatch[];
    } catch (error) {
      console.error('Error getting all matches:', error);
      return [];
    }
  }

  // Update connection status between users
  static async updateConnectionStatus(
    matchId: string, 
    status: 'none' | 'requested' | 'connected'
  ): Promise<void> {
    try {
      await updateDoc(doc(db, this.MATCHES_COLLECTION, matchId), {
        connectionStatus: status
      });
    } catch (error) {
      console.error('Error updating connection status:', error);
      throw error;
    }
  }
}