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
import { IdeaSubmission, CreateIdeaSubmissionRequest, SubmissionState } from '../common/types/ideaSubmission';

export class IdeaSubmissionRepository {
  private static readonly COLLECTION_NAME = 'idea_submissions';

  // Generate unique workflow run ID
  private static generateWorkflowRunId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `workflow_${timestamp}_${random}`;
  }

  // Create new idea submission
  static async createSubmission(request: CreateIdeaSubmissionRequest): Promise<string> {
    try {
      const primaryWorkflowRun = this.generateWorkflowRunId();
      
      const submission: Partial<Omit<IdeaSubmission, 'id'>> = {
        dateCreated: new Date(),
        dateExecuted: null,
        primaryWorkflowRun,
        state: SubmissionState.NEW,
        metadata: {}
      };

      // Only include defined fields to avoid Firestore undefined value errors
      if (request.email?.trim()) {
        submission.email = request.email.trim();
      }
      if (request.title?.trim()) {
        submission.title = request.title.trim();
      }
      if (request.description?.trim()) {
        submission.description = request.description.trim();
      }
      if (request.userId?.trim()) {
        submission.userId = request.userId.trim();
      }
      if (request.sessionId?.trim()) {
        submission.metadata!.sessionId = request.sessionId.trim();
      }
      if (typeof window !== 'undefined' && window.navigator.userAgent) {
        submission.metadata!.userAgent = window.navigator.userAgent;
      }

      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), {
        ...submission,
        dateCreated: submission.dateCreated,
      });

      // Immediately enqueue the submission
      await this.updateSubmissionState(docRef.id, SubmissionState.ENQUEUED);
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating idea submission:', error);
      
      // Re-throw the original error to preserve Firebase error codes and details
      throw error;
    }
  }

  // Update submission state
  static async updateSubmissionState(
    submissionId: string, 
    state: SubmissionState, 
    errorMessage?: string
  ): Promise<void> {
    try {
      const updateData: any = { 
        state,
        ...(errorMessage && { errorMessage }),
        ...(state === SubmissionState.PROCESSING && { dateExecuted: Timestamp.now() }),
      };

      await updateDoc(doc(db, this.COLLECTION_NAME, submissionId), updateData);
    } catch (error) {
      console.error('Error updating submission state:', error);
      throw new Error('Failed to update submission state');
    }
  }

  // Get submission by ID
  static async getSubmission(submissionId: string): Promise<IdeaSubmission | null> {
    try {
      const docSnap = await getDoc(doc(db, this.COLLECTION_NAME, submissionId));
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          dateCreated: data.dateCreated.toDate(),
          dateExecuted: data.dateExecuted ? data.dateExecuted.toDate() : null,
        } as IdeaSubmission;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting submission:', error);
      throw new Error('Failed to get submission');
    }
  }

  // Get total submission count for orb growth
  static async getTotalSubmissionCount(): Promise<number> {
    try {
      const q = query(collection(db, this.COLLECTION_NAME));
      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error('Error getting submission count:', error);
      return 0;
    }
  }

  // Get recent submissions for user
  static async getUserSubmissions(userId: string, limitCount: number = 10): Promise<IdeaSubmission[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('dateCreated', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dateCreated: doc.data().dateCreated.toDate(),
        dateExecuted: doc.data().dateExecuted ? doc.data().dateExecuted.toDate() : null,
      })) as IdeaSubmission[];
    } catch (error) {
      console.error('Error getting user submissions:', error);
      return [];
    }
  }

  // Listen to submission count changes for real-time orb growth
  static onSubmissionCountChange(callback: (count: number) => void) {
    const q = query(collection(db, this.COLLECTION_NAME));
    
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.size);
    }, (error) => {
      console.error('Error listening to submission count:', error);
      // Fall back to getting count without real-time updates
      this.getTotalSubmissionCount().then(count => {
        callback(count);
      }).catch(fallbackError => {
        console.error('Fallback count also failed:', fallbackError);
        // Use localStorage as last resort
        const savedCount = localStorage.getItem('orbEnergyLevel');
        callback(savedCount ? parseInt(savedCount, 10) : 0);
      });
    });
  }

  // Get submissions by state for monitoring
  static async getSubmissionsByState(state: SubmissionState): Promise<IdeaSubmission[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('state', '==', state),
        orderBy('dateCreated', 'desc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dateCreated: doc.data().dateCreated.toDate(),
        dateExecuted: doc.data().dateExecuted ? doc.data().dateExecuted.toDate() : null,
      })) as IdeaSubmission[];
    } catch (error) {
      console.error('Error getting submissions by state:', error);
      return [];
    }
  }
}