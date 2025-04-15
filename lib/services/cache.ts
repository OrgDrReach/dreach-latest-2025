interface CacheConfig {
	ttl: number; // Time to live in milliseconds
	maxSize: number; // Maximum number of items in cache
}

interface CacheItem<T> {
	value: T;
	timestamp: number;
	ttl: number;
}

export class CacheService {
	private static cache = new Map<string, CacheItem<any>>();
	private static readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

	static async get<T>(
		key: string,
		fetcher: () => Promise<T>,
		ttl: number = this.DEFAULT_TTL
	): Promise<T> {
		const item = this.cache.get(key);
		const now = Date.now();

		if (item && now - item.timestamp < item.ttl) {
			return item.value;
		}

		const value = await fetcher();
		this.set(key, value, ttl);
		return value;
	}

	static set<T>(key: string, value: T, ttl: number = this.DEFAULT_TTL): void {
		this.cache.set(key, {
			value,
			timestamp: Date.now(),
			ttl,
		});
	}

	static invalidate(key: string): void {
		this.cache.delete(key);
	}

	static invalidateByPrefix(prefix: string): void {
		for (const key of this.cache.keys()) {
			if (key.startsWith(prefix)) {
				this.cache.delete(key);
			}
		}
	}

	static invalidateAll(): void {
		this.cache.clear();
	}

	static getCacheSize(): number {
		return this.cache.size;
	}

	static cleanup(): void {
		const now = Date.now();
		for (const [key, item] of this.cache.entries()) {
			if (now - item.timestamp >= item.ttl) {
				this.cache.delete(key);
			}
		}
	}
}

// Cache keys constants
export const CacheKeys = {
	// User related
	user: (id: string) => `user:${id}`,
	userPreferences: (id: string) => `user:${id}:preferences`,
	userAppointments: (id: string) => `user:${id}:appointments`,

	// Doctor related
	doctor: (id: string) => `doctor:${id}`,
	doctorSchedule: (id: string) => `doctor:${id}:schedule`,
	doctorReviews: (id: string) => `doctor:${id}:reviews`,
	doctorSearch: (query: string) => `doctor:search:${query}`,

	// Hospital related
	hospital: (id: string) => `hospital:${id}`,
	hospitalDoctors: (id: string) => `hospital:${id}:doctors`,

	// Lab related
	lab: (id: string) => `lab:${id}`,
	labTests: (id: string) => `lab:${id}:tests`,

	// Appointment related
	appointment: (id: string) => `appointment:${id}`,
	appointmentSlots: (doctorId: string, date: string) =>
		`appointment:slots:${doctorId}:${date}`,

	// Chat related
	chatMessages: (roomId: string) => `chat:messages:${roomId}`,
	chatRooms: (userId: string) => `chat:rooms:${userId}`,

	// Location related
	locationSearch: (query: string) => `location:search:${query}`,
	nearbyDoctors: (lat: number, lng: number) =>
		`location:nearby:doctors:${lat},${lng}`,

	// Search related
	searchResults: (type: string, query: string) => `search:${type}:${query}`,
	searchSuggestions: (query: string) => `search:suggestions:${query}`,

	// Payment related
	paymentMethods: (userId: string) => `payment:methods:${userId}`,
	transactions: (userId: string) => `payment:transactions:${userId}`,

	// Verification related
	verificationStatus: (providerId: string) =>
		`verification:status:${providerId}`,
	verificationDocuments: (providerId: string) =>
		`verification:documents:${providerId}`,
} as const;

// Start periodic cache cleanup
if (typeof window !== "undefined") {
	// Run cleanup every minute
	setInterval(() => CacheService.cleanup(), 60 * 1000);
}
