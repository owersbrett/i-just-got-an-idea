import { IdeaSubmission } from '../common/types/ideaSubmission';
import { CreateIdeaMatchRequest } from '../common/types/ideaMatch';

export class IdeaMatchingService {
  
  // Analyze compatibility between two ideas using AI-like scoring
  static analyzeCompatibility(idea1: IdeaSubmission, idea2: IdeaSubmission): {
    score: number;
    reasons: string[];
    matchType: 'complementary' | 'similar' | 'synergistic' | 'collaborative';
  } {
    let score = 0;
    let reasons: string[] = [];
    let matchType: 'complementary' | 'similar' | 'synergistic' | 'collaborative' = 'similar';

    const text1 = `${idea1.title || ''} ${idea1.description || ''}`.toLowerCase();
    const text2 = `${idea2.title || ''} ${idea2.description || ''}`.toLowerCase();

    // Skip if either idea is too short to analyze meaningfully
    if (text1.trim().length < 10 || text2.trim().length < 10) {
      return { score: 0, reasons: ['Insufficient content for meaningful comparison'], matchType: 'similar' };
    }

    // Extract keywords and themes
    const keywords1 = this.extractKeywords(text1);
    const keywords2 = this.extractKeywords(text2);
    
    // Category analysis
    const categories1 = this.categorizeIdea(text1);
    const categories2 = this.categorizeIdea(text2);

    // 1. Keyword overlap scoring (0-25 points)
    const keywordOverlap = this.calculateKeywordOverlap(keywords1, keywords2);
    if (keywordOverlap > 0.3) {
      score += Math.min(keywordOverlap * 25, 25);
      reasons.push(`Strong thematic overlap (${Math.round(keywordOverlap * 100)}% keyword similarity)`);
    }

    // 2. Category compatibility (0-25 points)
    const categoryMatch = this.calculateCategoryCompatibility(categories1, categories2);
    score += categoryMatch.score;
    if (categoryMatch.score > 10) {
      reasons.push(categoryMatch.reason);
      matchType = categoryMatch.matchType;
    }

    // 3. Complementary skills/needs analysis (0-30 points)
    const complementary = this.analyzeComplementarity(text1, text2);
    score += complementary.score;
    if (complementary.score > 15) {
      reasons.push(...complementary.reasons);
      if (complementary.score > 20) matchType = 'complementary';
    }

    // 4. Innovation potential (0-20 points)
    const innovation = this.analyzeInnovationPotential(text1, text2, keywords1, keywords2);
    score += innovation.score;
    if (innovation.score > 10) {
      reasons.push(...innovation.reasons);
      if (innovation.score > 15) matchType = 'synergistic';
    }

    // Ensure score is within bounds
    score = Math.min(Math.max(score, 0), 100);

    // Add minimum viable reasons if score is decent but reasons are sparse
    if (score > 30 && reasons.length < 2) {
      reasons.push('Ideas share common themes and could benefit from collaboration');
    }

    return { score: Math.round(score), reasons, matchType };
  }

  private static extractKeywords(text: string): string[] {
    // Remove common stop words and extract meaningful terms
    const stopWords = new Set([
      'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'as', 'is', 'are', 'was', 'were', 
      'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'can', 
      'may', 'might', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 
      'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'a', 'an', 'all', 'any', 'some', 
      'no', 'not', 'more', 'most', 'other', 'such', 'what', 'which', 'who', 'when', 'where', 'why', 'how'
    ]);

    return text
      .replace(/[^\w\s]/g, ' ') // Remove punctuation
      .split(/\s+/) // Split on whitespace
      .map(word => word.toLowerCase().trim())
      .filter(word => word.length > 2 && !stopWords.has(word))
      .slice(0, 20); // Limit to top 20 keywords
  }

  private static categorizeIdea(text: string): string[] {
    const categories: { [key: string]: string[] } = {
      'technology': ['app', 'software', 'ai', 'machine', 'learning', 'code', 'programming', 'digital', 'tech', 'algorithm', 'data', 'computer', 'internet', 'web', 'mobile', 'automation', 'blockchain', 'crypto'],
      'business': ['startup', 'business', 'entrepreneur', 'company', 'market', 'customer', 'revenue', 'profit', 'sales', 'marketing', 'finance', 'investment', 'monetize', 'scale', 'growth'],
      'health': ['health', 'medical', 'wellness', 'fitness', 'nutrition', 'therapy', 'treatment', 'disease', 'patient', 'doctor', 'hospital', 'mental', 'physical', 'exercise'],
      'education': ['education', 'learning', 'teaching', 'school', 'student', 'course', 'training', 'knowledge', 'skill', 'academic', 'university', 'research'],
      'environment': ['environment', 'climate', 'green', 'sustainable', 'renewable', 'energy', 'carbon', 'pollution', 'recycling', 'conservation', 'eco'],
      'social': ['social', 'community', 'people', 'society', 'culture', 'networking', 'collaboration', 'relationship', 'communication', 'sharing'],
      'creative': ['art', 'design', 'creative', 'music', 'video', 'content', 'media', 'entertainment', 'game', 'story', 'writing'],
      'productivity': ['productivity', 'organization', 'management', 'efficiency', 'workflow', 'tool', 'system', 'process', 'optimization'],
      'food': ['food', 'cooking', 'recipe', 'restaurant', 'delivery', 'nutrition', 'meal', 'kitchen', 'dining'],
      'travel': ['travel', 'tourism', 'trip', 'vacation', 'destination', 'hotel', 'booking', 'transportation'],
      'finance': ['finance', 'money', 'payment', 'banking', 'investment', 'trading', 'budget', 'expense', 'income', 'savings']
    };

    const foundCategories: string[] = [];
    
    for (const [category, keywords] of Object.entries(categories)) {
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          foundCategories.push(category);
          break; // Only add category once
        }
      }
    }

    return foundCategories;
  }

  private static calculateKeywordOverlap(keywords1: string[], keywords2: string[]): number {
    if (keywords1.length === 0 || keywords2.length === 0) return 0;
    
    const set1 = new Set(keywords1);
    const set2 = new Set(keywords2);
    const intersection = new Set(Array.from(set1).filter(x => set2.has(x)));
    
    return intersection.size / Math.min(set1.size, set2.size);
  }

  private static calculateCategoryCompatibility(categories1: string[], categories2: string[]): {
    score: number;
    reason: string;
    matchType: 'complementary' | 'similar' | 'synergistic' | 'collaborative';
  } {
    const overlap = categories1.filter(cat => categories2.includes(cat));
    
    if (overlap.length > 0) {
      const score = Math.min(overlap.length * 15, 25);
      return {
        score,
        reason: `Both ideas focus on ${overlap.join(', ')} domain${overlap.length > 1 ? 's' : ''}`,
        matchType: 'similar'
      };
    }

    // Check for complementary categories
    const complementaryPairs = [
      ['technology', 'business'],
      ['health', 'technology'],
      ['education', 'technology'],
      ['creative', 'business'],
      ['environment', 'technology'],
      ['social', 'technology'],
      ['finance', 'technology'],
      ['food', 'business'],
      ['travel', 'technology']
    ];

    for (const [cat1, cat2] of complementaryPairs) {
      if ((categories1.includes(cat1) && categories2.includes(cat2)) ||
          (categories1.includes(cat2) && categories2.includes(cat1))) {
        return {
          score: 20,
          reason: `Complementary domains: ${cat1} and ${cat2} often work well together`,
          matchType: 'complementary'
        };
      }
    }

    return { score: 0, reason: '', matchType: 'similar' };
  }

  private static analyzeComplementarity(text1: string, text2: string): {
    score: number;
    reasons: string[];
  } {
    let score = 0;
    const reasons: string[] = [];

    // Look for complementary skills/needs patterns
    const needsPatterns = ['need', 'looking for', 'seeking', 'require', 'want', 'help with'];
    const skillsPatterns = ['expert in', 'experienced with', 'skilled at', 'can help', 'offering', 'provide'];

    const hasNeeds1 = needsPatterns.some(pattern => text1.includes(pattern));
    const hasSkills1 = skillsPatterns.some(pattern => text1.includes(pattern));
    const hasNeeds2 = needsPatterns.some(pattern => text2.includes(pattern));
    const hasSkills2 = skillsPatterns.some(pattern => text2.includes(pattern));

    // Perfect complementarity: one has skills, other has needs
    if ((hasSkills1 && hasNeeds2) || (hasSkills2 && hasNeeds1)) {
      score += 25;
      reasons.push('One idea offers skills that the other needs');
    }

    // Role complementarity patterns
    const rolePatterns = [
      ['technical', 'business'],
      ['developer', 'designer'],
      ['frontend', 'backend'],
      ['marketing', 'product'],
      ['creative', 'analytical']
    ];

    for (const [role1, role2] of rolePatterns) {
      if ((text1.includes(role1) && text2.includes(role2)) ||
          (text1.includes(role2) && text2.includes(role1))) {
        score += 15;
        reasons.push(`Complementary roles: ${role1} and ${role2}`);
        break;
      }
    }

    return { score: Math.min(score, 30), reasons };
  }

  private static analyzeInnovationPotential(
    text1: string, 
    text2: string, 
    keywords1: string[], 
    keywords2: string[]
  ): {
    score: number;
    reasons: string[];
  } {
    let score = 0;
    const reasons: string[] = [];

    // Innovation keywords
    const innovationWords = ['innovative', 'revolutionary', 'disruptive', 'breakthrough', 'cutting-edge', 'novel', 'unique', 'first', 'new'];
    const hasInnovation1 = innovationWords.some(word => text1.includes(word));
    const hasInnovation2 = innovationWords.some(word => text2.includes(word));

    if (hasInnovation1 || hasInnovation2) {
      score += 10;
      reasons.push('One or both ideas emphasize innovation');
    }

    // Cross-domain innovation potential
    const uniqueKeywords = Array.from(new Set([...keywords1, ...keywords2]));
    if (uniqueKeywords.length > (keywords1.length + keywords2.length) * 0.7) {
      score += 15;
      reasons.push('Combining these ideas could create cross-domain innovation');
    }

    // Scalability indicators
    const scalabilityWords = ['scale', 'global', 'platform', 'network', 'system', 'automation'];
    const hasScalability = scalabilityWords.some(word => text1.includes(word) || text2.includes(word));
    
    if (hasScalability) {
      score += 10;
      reasons.push('Ideas show potential for scalable impact');
    }

    return { score: Math.min(score, 20), reasons };
  }

  // Generate matches for a batch of ideas
  static generateMatchesForBatch(ideas: IdeaSubmission[]): CreateIdeaMatchRequest[] {
    const matches: CreateIdeaMatchRequest[] = [];
    
    // Compare every idea with every other idea in the batch
    for (let i = 0; i < ideas.length; i++) {
      for (let j = i + 1; j < ideas.length; j++) {
        const idea1 = ideas[i];
        const idea2 = ideas[j];
        
        const compatibility = this.analyzeCompatibility(idea1, idea2);
        
        // Only create matches with score > 30 to avoid noise
        if (compatibility.score > 30) {
          matches.push({
            batchId: '', // Will be set by the calling function
            ideaId1: idea1.id,
            ideaId2: idea2.id,
            compatibilityScore: compatibility.score,
            matchReasons: compatibility.reasons,
            matchType: compatibility.matchType,
            userId1: idea1.userId,
            userId2: idea2.userId
          });
        }
      }
    }

    // Sort matches by compatibility score (highest first)
    return matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  }
}