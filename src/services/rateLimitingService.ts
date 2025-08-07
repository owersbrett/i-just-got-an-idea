export interface RateLimitInfo {
  attempts: number;
  firstAttempt: number; // timestamp
  lastAttempt: number; // timestamp
  blockedUntil?: number; // timestamp when block expires
  penaltyLevel: number; // 0 = no penalty, increases with violations
}

export interface RateLimitResult {
  allowed: boolean;
  remainingAttempts: number;
  resetTime: number; // when the rate limit resets
  blockedUntil?: number; // if blocked, when it expires
  message: string;
}

export class RateLimitingService {
  // Rate limit configurations
  private static readonly LIMITS = {
    // Basic rate limiting - per IP/session
    SUBMISSIONS_PER_MINUTE: 2,
    SUBMISSIONS_PER_HOUR: 10,
    SUBMISSIONS_PER_DAY: 25,
    
    // Progressive penalties
    PENALTY_MULTIPLIERS: [1, 2, 5, 15, 30, 60], // minutes to block
    MAX_PENALTY_LEVEL: 5,
    
    // Time windows (in milliseconds)
    MINUTE: 60 * 1000,
    HOUR: 60 * 60 * 1000,
    DAY: 24 * 60 * 60 * 1000,
    
    // Cleanup
    CLEANUP_AFTER: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  // Client-side rate limiting (localStorage)
  static checkClientRateLimit(identifier: string = 'default'): RateLimitResult {
    const now = Date.now();
    const key = `rateLimit_${identifier}`;
    
    try {
      const stored = localStorage.getItem(key);
      let rateLimitInfo: RateLimitInfo = stored 
        ? JSON.parse(stored)
        : {
            attempts: 0,
            firstAttempt: now,
            lastAttempt: now,
            penaltyLevel: 0
          };

      // Check if currently blocked
      if (rateLimitInfo.blockedUntil && now < rateLimitInfo.blockedUntil) {
        return {
          allowed: false,
          remainingAttempts: 0,
          resetTime: rateLimitInfo.blockedUntil,
          blockedUntil: rateLimitInfo.blockedUntil,
          message: `Rate limit exceeded. Try again in ${Math.ceil((rateLimitInfo.blockedUntil - now) / 1000 / 60)} minutes.`
        };
      }

      // Clean expired blocks
      if (rateLimitInfo.blockedUntil && now >= rateLimitInfo.blockedUntil) {
        rateLimitInfo.blockedUntil = undefined;
      }

      // Check rate limits
      const violatesRateLimit = this.checkTimeWindowViolations(rateLimitInfo, now);
      
      if (violatesRateLimit.violated) {
        // Apply penalty
        const penaltyMinutes = this.LIMITS.PENALTY_MULTIPLIERS[
          Math.min(rateLimitInfo.penaltyLevel, this.LIMITS.MAX_PENALTY_LEVEL)
        ];
        
        rateLimitInfo.penaltyLevel = Math.min(
          rateLimitInfo.penaltyLevel + 1, 
          this.LIMITS.MAX_PENALTY_LEVEL
        );
        rateLimitInfo.blockedUntil = now + (penaltyMinutes * 60 * 1000);
        
        localStorage.setItem(key, JSON.stringify(rateLimitInfo));
        
        return {
          allowed: false,
          remainingAttempts: 0,
          resetTime: rateLimitInfo.blockedUntil,
          blockedUntil: rateLimitInfo.blockedUntil,
          message: violatesRateLimit.message + ` Blocked for ${penaltyMinutes} minutes due to repeated violations.`
        };
      }

      // Calculate remaining attempts
      const remainingAttempts = Math.min(
        this.LIMITS.SUBMISSIONS_PER_MINUTE - this.countAttemptsInWindow(rateLimitInfo, now, this.LIMITS.MINUTE),
        this.LIMITS.SUBMISSIONS_PER_HOUR - this.countAttemptsInWindow(rateLimitInfo, now, this.LIMITS.HOUR),
        this.LIMITS.SUBMISSIONS_PER_DAY - this.countAttemptsInWindow(rateLimitInfo, now, this.LIMITS.DAY)
      );

      return {
        allowed: true,
        remainingAttempts: Math.max(remainingAttempts, 0),
        resetTime: now + this.LIMITS.MINUTE,
        message: `${remainingAttempts} submissions remaining in current time window.`
      };

    } catch (error) {
      console.error('Error checking client rate limit:', error);
      // If there's an error, allow the request but log it
      return {
        allowed: true,
        remainingAttempts: this.LIMITS.SUBMISSIONS_PER_MINUTE,
        resetTime: now + this.LIMITS.MINUTE,
        message: 'Rate limit check failed, proceeding with caution.'
      };
    }
  }

  // Record a submission attempt
  static recordClientAttempt(identifier: string = 'default'): void {
    const now = Date.now();
    const key = `rateLimit_${identifier}`;
    
    try {
      const stored = localStorage.getItem(key);
      let rateLimitInfo: RateLimitInfo = stored 
        ? JSON.parse(stored)
        : {
            attempts: 0,
            firstAttempt: now,
            lastAttempt: now,
            penaltyLevel: 0
          };

      rateLimitInfo.attempts += 1;
      rateLimitInfo.lastAttempt = now;
      
      // Reset penalty level if they've been good for a while (1 hour)
      if (now - rateLimitInfo.lastAttempt > this.LIMITS.HOUR) {
        rateLimitInfo.penaltyLevel = Math.max(0, rateLimitInfo.penaltyLevel - 1);
      }

      localStorage.setItem(key, JSON.stringify(rateLimitInfo));
    } catch (error) {
      console.error('Error recording client attempt:', error);
    }
  }

  // Check time window violations
  private static checkTimeWindowViolations(rateLimitInfo: RateLimitInfo, now: number): {
    violated: boolean;
    message: string;
  } {
    const minuteAttempts = this.countAttemptsInWindow(rateLimitInfo, now, this.LIMITS.MINUTE);
    const hourAttempts = this.countAttemptsInWindow(rateLimitInfo, now, this.LIMITS.HOUR);
    const dayAttempts = this.countAttemptsInWindow(rateLimitInfo, now, this.LIMITS.DAY);

    if (minuteAttempts >= this.LIMITS.SUBMISSIONS_PER_MINUTE) {
      return {
        violated: true,
        message: `Too many submissions per minute (${minuteAttempts}/${this.LIMITS.SUBMISSIONS_PER_MINUTE}).`
      };
    }

    if (hourAttempts >= this.LIMITS.SUBMISSIONS_PER_HOUR) {
      return {
        violated: true,
        message: `Too many submissions per hour (${hourAttempts}/${this.LIMITS.SUBMISSIONS_PER_HOUR}).`
      };
    }

    if (dayAttempts >= this.LIMITS.SUBMISSIONS_PER_DAY) {
      return {
        violated: true,
        message: `Daily submission limit reached (${dayAttempts}/${this.LIMITS.SUBMISSIONS_PER_DAY}).`
      };
    }

    return { violated: false, message: '' };
  }

  // Count attempts in a specific time window
  private static countAttemptsInWindow(rateLimitInfo: RateLimitInfo, now: number, windowMs: number): number {
    // This is a simplified implementation - in a real app you'd want to track individual attempts
    // For now, we'll estimate based on average rate
    const windowStart = now - windowMs;
    
    if (rateLimitInfo.firstAttempt > windowStart) {
      // All attempts are within the window
      return rateLimitInfo.attempts;
    } else if (rateLimitInfo.lastAttempt < windowStart) {
      // No attempts in this window
      return 0;
    } else {
      // Some attempts in window - estimate based on time distribution
      const totalTimespan = rateLimitInfo.lastAttempt - rateLimitInfo.firstAttempt;
      if (totalTimespan === 0) return rateLimitInfo.attempts;
      
      const windowOverlap = rateLimitInfo.lastAttempt - Math.max(windowStart, rateLimitInfo.firstAttempt);
      const estimatedAttempts = Math.ceil((windowOverlap / totalTimespan) * rateLimitInfo.attempts);
      
      return Math.min(estimatedAttempts, rateLimitInfo.attempts);
    }
  }

  // Get rate limit status for UI display
  static getRateLimitStatus(identifier: string = 'default'): {
    isNearLimit: boolean;
    remainingAttempts: number;
    nextResetIn: number; // seconds
    penaltyLevel: number;
  } {
    const result = this.checkClientRateLimit(identifier);
    const now = Date.now();
    
    const key = `rateLimit_${identifier}`;
    const stored = localStorage.getItem(key);
    const rateLimitInfo: RateLimitInfo = stored 
      ? JSON.parse(stored)
      : { attempts: 0, firstAttempt: now, lastAttempt: now, penaltyLevel: 0 };

    return {
      isNearLimit: result.remainingAttempts <= 2,
      remainingAttempts: result.remainingAttempts,
      nextResetIn: Math.ceil((result.resetTime - now) / 1000),
      penaltyLevel: rateLimitInfo.penaltyLevel
    };
  }

  // Clean up old rate limit data
  static cleanupOldData(): void {
    const now = Date.now();
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith('rateLimit_')) {
        try {
          const stored = localStorage.getItem(key);
          if (stored) {
            const rateLimitInfo: RateLimitInfo = JSON.parse(stored);
            
            // Remove very old entries
            if (now - rateLimitInfo.lastAttempt > this.LIMITS.CLEANUP_AFTER) {
              localStorage.removeItem(key);
            }
          }
        } catch (error) {
          // Remove corrupted entries
          localStorage.removeItem(key);
        }
      }
    });
  }
}