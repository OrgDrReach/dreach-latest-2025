interface AnalyticsEvent {
	name: string;
	timestamp: number;
	data: Record<string, any>;
	userId?: string;
	sessionId: string;
}

interface PerformanceMetric {
	name: string;
	value: number;
	timestamp: number;
	tags?: Record<string, string>;
}

export class AnalyticsService {
	private static readonly API_BASE = process.env.NEXT_PUBLIC_API_URL;
	private static sessionId = crypto.randomUUID();
	private static queue: AnalyticsEvent[] = [];
	private static isProcessing = false;
	private static initialized = false;

	static initialize(): void {
		if (this.initialized) return;
		this.initialized = true;

		// Process queue every 30 seconds
		setInterval(this.processQueue.bind(this), 30000);

		// Track performance metrics
		if (typeof window !== "undefined") {
			this.trackPerformance();
		}
	}

	static trackEvent(
		name: string,
		data: Record<string, any> = {},
		userId?: string
	): void {
		this.queue.push({
			name,
			timestamp: Date.now(),
			data,
			userId,
			sessionId: this.sessionId,
		});

		// Process immediately if queue gets too large
		if (this.queue.length >= 100) {
			this.processQueue();
		}
	}

	static trackError(error: Error, context: Record<string, any> = {}): void {
		this.trackEvent("error", {
			message: error.message,
			stack: error.stack,
			...context,
		});
	}

	static trackPageView(path: string, referrer?: string, userId?: string): void {
		this.trackEvent(
			"page_view",
			{
				path,
				referrer,
				userAgent: navigator.userAgent,
				screenSize: `${window.innerWidth}x${window.innerHeight}`,
			},
			userId
		);
	}

	static trackSearch(
		query: string,
		filters: Record<string, any>,
		resultCount: number,
		userId?: string
	): void {
		this.trackEvent(
			"search",
			{
				query,
				filters,
				resultCount,
			},
			userId
		);
	}

	static trackAppointment(
		action: "book" | "cancel" | "reschedule",
		appointmentId: string,
		data: Record<string, any>,
		userId?: string
	): void {
		this.trackEvent(
			`appointment_${action}`,
			{
				appointmentId,
				...data,
			},
			userId
		);
	}

	static trackPayment(
		action: "initiate" | "complete" | "fail" | "refund",
		amount: number,
		data: Record<string, any>,
		userId?: string
	): void {
		this.trackEvent(
			`payment_${action}`,
			{
				amount,
				...data,
			},
			userId
		);
	}

	static trackUserAction(
		action: string,
		data: Record<string, any>,
		userId?: string
	): void {
		this.trackEvent(`user_${action}`, data, userId);
	}

	private static async processQueue(): Promise<void> {
		if (this.isProcessing || this.queue.length === 0) return;

		this.isProcessing = true;
		const events = [...this.queue];
		this.queue = [];

		try {
			await fetch(`${this.API_BASE}/analytics/events`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ events }),
			});
		} catch (error) {
			// Put events back in queue on failure
			this.queue = [...events, ...this.queue];
			console.error("Failed to process analytics queue:", error);
		} finally {
			this.isProcessing = false;
		}
	}

	private static trackPerformance(): void {
		// Track page load performance
		window.addEventListener("load", () => {
			const navigation = performance.getEntriesByType(
				"navigation"
			)[0] as PerformanceNavigationTiming;

			const metrics: PerformanceMetric[] = [
				{
					name: "page_load_time",
					value: navigation.loadEventEnd - navigation.startTime,
					timestamp: Date.now(),
				},
				{
					name: "dom_interactive_time",
					value: navigation.domInteractive - navigation.startTime,
					timestamp: Date.now(),
				},
				{
					name: "first_contentful_paint",
					value:
						performance.getEntriesByName("first-contentful-paint")[0]
							?.startTime || 0,
					timestamp: Date.now(),
				},
			];

			this.sendPerformanceMetrics(metrics);
		});

		// Track client-side navigation performance
		const observer = new PerformanceObserver((list) => {
			const entries = list.getEntries() as PerformanceNavigationTiming[];
			entries.forEach((entry) => {
				this.sendPerformanceMetrics([
					{
						name: "navigation_time",
						value: entry.duration,
						timestamp: Date.now(),
						tags: {
							type: entry.type,
							url: entry.name,
						},
					},
				]);
			});
		});

		observer.observe({ entryTypes: ["navigation"] });
	}

	private static async sendPerformanceMetrics(
		metrics: PerformanceMetric[]
	): Promise<void> {
		try {
			await fetch(`${this.API_BASE}/analytics/performance`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ metrics }),
			});
		} catch (error) {
			console.error("Failed to send performance metrics:", error);
		}
	}
}
