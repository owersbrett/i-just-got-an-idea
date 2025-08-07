export interface IdeaMatch {
  id: string;
  batchId: string; // Groups ideas processed together (every 10)
  ideaId1: string; // First idea submission ID
  ideaId2: string; // Second idea submission ID
  compatibilityScore: number; // 0-100 compatibility score
  matchReasons: string[]; // AI-generated reasons why they match
  matchType: 'complementary' | 'similar' | 'synergistic' | 'collaborative';
  createdAt: Date;
  userId1?: string; // User who submitted idea 1 (if available)
  userId2?: string; // User who submitted idea 2 (if available)
  connectionStatus?: 'none' | 'requested' | 'connected';
}

export interface IdeaBatch {
  id: string;
  batchNumber: number; // Sequential batch number (1, 2, 3...)
  ideaIds: string[]; // Array of 10 idea submission IDs
  processingStarted: Date;
  processingCompleted?: Date;
  status: 'pending' | 'processing' | 'completed' | 'error';
  totalMatches: number; // Number of matches generated
}

export interface UserIdeaMatches {
  userId: string;
  ideaId: string; // Their idea submission ID
  topMatches: IdeaMatch[]; // Their best matches, sorted by compatibility score
  lastUpdated: Date;
}

export interface CreateIdeaMatchRequest {
  batchId: string;
  ideaId1: string;
  ideaId2: string;
  compatibilityScore: number;
  matchReasons: string[];
  matchType: 'complementary' | 'similar' | 'synergistic' | 'collaborative';
  userId1?: string;
  userId2?: string;
}