interface RateLimitConfig {
	windowMs: number; // Time window in milliseconds
	maxRequests: number; // Maximum number of requests allowed in the window
}

interface RateLimit {
	remaining: number; // Number of requests remaining
	reset: number; // Timestamp when the rate limit resets
}

interface RateLimitBucket {
	count: number;
	resetAt: number;
}

export class RateLimitService {
	private static buckets = new Map<string, RateLimitBucket>();
	private static endpoints: Record<string, RateLimitConfig> = {
		"search-providers": {
			windowMs: 60 * 1000, // 1 minute
			maxRequests: 30,
		},
		"book-appointment": {
			windowMs: 5 * 60 * 1000, // 5 minutes
			maxRequests: 10,
		},
		"verify-documents": {
			windowMs: 15 * 60 * 1000, // 15 minutes
			maxRequests: 50,
		},
		"upload-file": {
			windowMs: 5 * 60 * 1000, // 5 minutes
			maxRequests: 20,
		},
	};

	static configure(endpoints: Record<string, RateLimitConfig>): void {
		this.endpoints = { ...this.endpoints, ...endpoints };
	}

	static checkRateLimit(
		endpoint: string,
		identifier: string
	): RateLimit | null {
		const config = this.endpoints[endpoint];
		if (!config) return null;

		const key = `${endpoint}:${identifier}`;
		const now = Date.now();
		const bucket = this.buckets.get(key);

		// If no bucket exists or it has expired, create a new one
		if (!bucket || now >= bucket.resetAt) {
			this.buckets.set(key, {
				count: 0,
				resetAt: now + config.windowMs,
			});
			return {
				remaining: config.maxRequests,
				reset: now + config.windowMs,
			};
		}

		// Check if rate limit is exceeded
		if (bucket.count >= config.maxRequests) {
			return {
				remaining: 0,
				reset: bucket.resetAt,
			};
		}

		// Update bucket and return remaining requests
		bucket.count++;
		return {
			remaining: config.maxRequests - bucket.count,
			reset: bucket.resetAt,
		};
	}

	static async withRateLimit<T>(
		endpoint: string,
		identifier: string,
		action: () => Promise<T>
	): Promise<T> {
		const rateLimit = this.checkRateLimit(endpoint, identifier);

		if (rateLimit?.remaining === 0) {
			const retryAfter = Math.ceil((rateLimit.reset - Date.now()) / 1000);
			throw new Error(
				`Rate limit exceeded. Try again in ${retryAfter} seconds`
			);
		}

		return action();
	}

	static getRateLimitHeaders(
		endpoint: string,
		identifier: string
	): Record<string, string> {
		const rateLimit = this.checkRateLimit(endpoint, identifier);
		if (!rateLimit) return {};

		const config = this.endpoints[endpoint];
		return {
			"X-RateLimit-Limit": config?.maxRequests.toString() || "0",
			"X-RateLimit-Remaining": rateLimit.remaining.toString(),
			"X-RateLimit-Reset": (rateLimit.reset / 1000).toString(),
		};
	}

	static clearBucket(endpoint: string, identifier: string): void {
		const key = `${endpoint}:${identifier}`;
		this.buckets.delete(key);
	}

	static clearAllBuckets(): void {
		this.buckets.clear();
	}

	// Cleanup expired buckets periodically
	static {
		setInterval(() => {
			const now = Date.now();
			for (const [key, bucket] of this.buckets.entries()) {
				if (now >= bucket.resetAt) {
					this.buckets.delete(key);
				}
			}
		}, 60 * 1000); // Run cleanup every minute
	}
}
