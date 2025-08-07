import { NextApiRequest, NextApiResponse } from 'next';

// Simple in-memory store for server-side rate limiting
// In production, you'd want to use Redis or a database
interface RateLimitEntry {
  attempts: number;
  firstAttempt: number;
  lastAttempt: number;
  blockedUntil?: number;
  penaltyLevel: number;
}

class ServerRateLimitStore {
  private static store: Map<string, RateLimitEntry> = new Map();
  private static readonly CLEANUP_INTERVAL = 10 * 60 * 1000; // 10 minutes
  private static lastCleanup = Date.now();

  static get(key: string): RateLimitEntry | undefined {
    this.cleanupIfNeeded();
    return this.store.get(key);
  }

  static set(key: string, value: RateLimitEntry): void {
    this.store.set(key, value);
  }

  static delete(key: string): void {
    this.store.delete(key);
  }

  private static cleanupIfNeeded(): void {
    const now = Date.now();
    if (now - this.lastCleanup > this.CLEANUP_INTERVAL) {
      this.cleanup();
      this.lastCleanup = now;
    }
  }

  private static cleanup(): void {
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    
    for (const [key, entry] of this.store.entries()) {
      // Remove entries older than 1 hour with no recent activity
      if (entry.lastAttempt < oneHourAgo && (!entry.blockedUntil || entry.blockedUntil < now)) {
        this.store.delete(key);
      }
    }
  }
}

export interface ServerRateLimitConfig {
  windowMs: number;
  maxAttempts: number;
  blockDurationMs: number;
  skipSuccessfulRequests?: boolean;
  keyGenerator?: (req: NextApiRequest) => string;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfter?: number; // seconds to wait before retry
}

export class ServerRateLimitingService {
  private static readonly DEFAULT_CONFIG: ServerRateLimitConfig = {
    windowMs: 60 * 1000, // 1 minute
    maxAttempts: 5, // 5 attempts per minute
    blockDurationMs: 5 * 60 * 1000, // 5 minute block
    skipSuccessfulRequests: false,
  };

  static createRateLimitMiddleware(config: Partial<ServerRateLimitConfig> = {}) {
    const finalConfig = { ...this.DEFAULT_CONFIG, ...config };

    return (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
      const key = finalConfig.keyGenerator ? finalConfig.keyGenerator(req) : this.getClientIdentifier(req);
      const result = this.checkRateLimit(key, finalConfig);

      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', finalConfig.maxAttempts);
      res.setHeader('X-RateLimit-Remaining', result.remaining);
      res.setHeader('X-RateLimit-Reset', new Date(result.resetTime).toISOString());

      if (!result.allowed) {
        if (result.retryAfter) {
          res.setHeader('Retry-After', result.retryAfter);
        }
        
        res.status(429).json({
          error: 'Too Many Requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: result.retryAfter,
          resetTime: result.resetTime
        });
        return;
      }

      // Record successful attempt if not skipping
      if (!finalConfig.skipSuccessfulRequests) {
        this.recordAttempt(key, finalConfig);
      }

      next();
    };
  }

  private static checkRateLimit(key: string, config: ServerRateLimitConfig): RateLimitResult {
    const now = Date.now();
    const entry = ServerRateLimitStore.get(key) || {
      attempts: 0,
      firstAttempt: now,
      lastAttempt: now,
      penaltyLevel: 0
    };

    // Check if currently blocked
    if (entry.blockedUntil && now < entry.blockedUntil) {
      const retryAfter = Math.ceil((entry.blockedUntil - now) / 1000);
      return {
        allowed: false,
        limit: config.maxAttempts,
        remaining: 0,
        resetTime: entry.blockedUntil,
        retryAfter
      };
    }

    // Clean up expired blocks
    if (entry.blockedUntil && now >= entry.blockedUntil) {
      entry.blockedUntil = undefined;
    }

    // Count attempts in current window
    const windowStart = now - config.windowMs;
    let attemptsInWindow = 0;

    if (entry.firstAttempt > windowStart) {
      // All attempts are in current window
      attemptsInWindow = entry.attempts;
    } else if (entry.lastAttempt < windowStart) {
      // No attempts in current window
      attemptsInWindow = 0;
      // Reset the entry
      entry.attempts = 0;
      entry.firstAttempt = now;
    } else {
      // Some attempts in window - estimate based on distribution
      const totalTimespan = entry.lastAttempt - entry.firstAttempt;
      if (totalTimespan > 0) {
        const windowOverlap = entry.lastAttempt - Math.max(windowStart, entry.firstAttempt);
        attemptsInWindow = Math.ceil((windowOverlap / totalTimespan) * entry.attempts);
      } else {
        attemptsInWindow = entry.attempts;
      }
    }

    // Check if would exceed limit
    if (attemptsInWindow >= config.maxAttempts) {
      // Apply progressive penalty
      const penaltyMultiplier = Math.min(entry.penaltyLevel + 1, 5);
      const blockDuration = config.blockDurationMs * penaltyMultiplier;
      
      entry.blockedUntil = now + blockDuration;
      entry.penaltyLevel = Math.min(entry.penaltyLevel + 1, 10);
      
      ServerRateLimitStore.set(key, entry);
      
      const retryAfter = Math.ceil(blockDuration / 1000);
      return {
        allowed: false,
        limit: config.maxAttempts,
        remaining: 0,
        resetTime: entry.blockedUntil,
        retryAfter
      };
    }

    return {
      allowed: true,
      limit: config.maxAttempts,
      remaining: config.maxAttempts - attemptsInWindow - 1, // -1 for the current request
      resetTime: now + config.windowMs
    };
  }

  private static recordAttempt(key: string, config: ServerRateLimitConfig): void {
    const now = Date.now();
    const entry = ServerRateLimitStore.get(key) || {
      attempts: 0,
      firstAttempt: now,
      lastAttempt: now,
      penaltyLevel: 0
    };

    entry.attempts += 1;
    entry.lastAttempt = now;
    
    // Reset penalty level if they've been good for a while
    if (now - entry.lastAttempt > 60 * 60 * 1000) { // 1 hour
      entry.penaltyLevel = Math.max(0, entry.penaltyLevel - 1);
    }

    ServerRateLimitStore.set(key, entry);
  }

  private static getClientIdentifier(req: NextApiRequest): string {
    // Try multiple methods to identify the client
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded 
      ? (Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0].trim())
      : req.socket.remoteAddress;
    
    const userAgent = req.headers['user-agent'] || '';
    
    // Create a composite key using IP and user agent hash
    const userAgentHash = this.simpleHash(userAgent);
    
    return `${ip || 'unknown'}_${userAgentHash}`;
  }

  private static simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  // Utility function to check rate limit without recording
  static checkOnly(req: NextApiRequest, config: Partial<ServerRateLimitConfig> = {}): RateLimitResult {
    const finalConfig = { ...this.DEFAULT_CONFIG, ...config };
    const key = finalConfig.keyGenerator ? finalConfig.keyGenerator(req) : this.getClientIdentifier(req);
    return this.checkRateLimit(key, finalConfig);
  }
}

// Export a ready-to-use middleware for common scenarios
export const defaultRateLimiter = ServerRateLimitingService.createRateLimitMiddleware();

// Stricter rate limiter for sensitive operations
export const strictRateLimiter = ServerRateLimitingService.createRateLimitMiddleware({
  windowMs: 60 * 1000, // 1 minute
  maxAttempts: 2, // Only 2 attempts per minute
  blockDurationMs: 10 * 60 * 1000, // 10 minute block
});

// Very permissive rate limiter for general API calls
export const permissiveRateLimiter = ServerRateLimitingService.createRateLimitMiddleware({
  windowMs: 60 * 1000, // 1 minute
  maxAttempts: 20, // 20 attempts per minute
  blockDurationMs: 2 * 60 * 1000, // 2 minute block
});