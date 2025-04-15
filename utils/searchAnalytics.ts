import {
	FilterState,
	SearchState,
} from "@/components/page-components/doctors/search-filter/SearchAndFilters";
import { ProviderType, ProviderSearchFilters } from "@/types/provider.d.types";

interface SearchEvent {
	query: string;
	filters: ProviderSearchFilters;
	timestamp: string;
	resultCount: number;
	selectedResult?: string;
	location?: {
		latitude: number;
		longitude: number;
	};
}

interface SearchTrend {
	query: string;
	count: number;
	successRate: number;
	averageResultCount: number;
}

const SEARCH_HISTORY_KEY = "search_history";
const MAX_HISTORY_ITEMS = 100;

export class SearchAnalytics {
	static logSearch(
		query: string,
		filters: ProviderSearchFilters,
		resultCount: number,
		selectedResult?: string
	): void {
		const searchEvent: SearchEvent = {
			query,
			filters,
			timestamp: new Date().toISOString(),
			resultCount,
			selectedResult,
		};

		// Get current location if available
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				searchEvent.location = {
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
				};
				this.saveSearchEvent(searchEvent);
			});
		} else {
			this.saveSearchEvent(searchEvent);
		}
	}

	static logResultSelection(searchId: string, providerId: string): void {
		const history = this.getSearchHistory();
		const updatedHistory = history.map((event) =>
			event.timestamp === searchId ?
				{ ...event, selectedResult: providerId }
			:	event
		);
		this.saveHistory(updatedHistory);
	}

	static getPopularSearches(timeframe: number = 7): SearchTrend[] {
		const history = this.getSearchHistory();
		const cutoffDate = new Date();
		cutoffDate.setDate(cutoffDate.getDate() - timeframe);

		const recentSearches = history.filter(
			(event) => new Date(event.timestamp) >= cutoffDate
		);

		const searchStats = new Map<
			string,
			{
				count: number;
				selections: number;
				totalResults: number;
			}
		>();

		recentSearches.forEach((event) => {
			const current = searchStats.get(event.query) || {
				count: 0,
				selections: 0,
				totalResults: 0,
			};

			searchStats.set(event.query, {
				count: current.count + 1,
				selections: current.selections + (event.selectedResult ? 1 : 0),
				totalResults: current.totalResults + event.resultCount,
			});
		});

		return Array.from(searchStats.entries())
			.map(([query, stats]) => ({
				query,
				count: stats.count,
				successRate: stats.selections / stats.count,
				averageResultCount: stats.totalResults / stats.count,
			}))
			.sort((a, b) => b.count - a.count);
	}

	static getPopularFilters(
		providerType: ProviderType
	): Partial<ProviderSearchFilters> {
		const history = this.getSearchHistory();
		const typeFilters = history.filter(
			(event) => event.filters.type === providerType
		);

		const filterCounts = {
			specialization: new Map<string, number>(),
			location: new Map<string, number>(),
			services: {
				homeVisit: 0,
				videoConsult: 0,
			},
		};

		typeFilters.forEach((event) => {
			if (event.filters.specialization) {
				const current =
					filterCounts.specialization.get(event.filters.specialization) || 0;
				filterCounts.specialization.set(
					event.filters.specialization,
					current + 1
				);
			}

			if (event.filters.location?.city) {
				const current =
					filterCounts.location.get(event.filters.location.city) || 0;
				filterCounts.location.set(event.filters.location.city, current + 1);
			}

			if (event.filters.services?.homeVisit) filterCounts.services.homeVisit++;
			if (event.filters.services?.videoConsult)
				filterCounts.services.videoConsult++;
		});

		return {
			specialization: this.getMostFrequent(filterCounts.specialization),
			location: {
				city: this.getMostFrequent(filterCounts.location),
			},
			services: {
				homeVisit: filterCounts.services.homeVisit > typeFilters.length / 2,
				videoConsult:
					filterCounts.services.videoConsult > typeFilters.length / 2,
			},
		};
	}

	static getSuggestedSearches(query: string): string[] {
		const history = this.getSearchHistory();
		return Array.from(
			new Set(
				history
					.filter((event) =>
						event.query.toLowerCase().includes(query.toLowerCase())
					)
					.map((event) => event.query)
			)
		).slice(0, 5);
	}

	private static saveSearchEvent(event: SearchEvent): void {
		const history = this.getSearchHistory();
		history.unshift(event);
		this.saveHistory(history.slice(0, MAX_HISTORY_ITEMS));
	}

	private static getSearchHistory(): SearchEvent[] {
		try {
			const history = localStorage.getItem(SEARCH_HISTORY_KEY);
			return history ? JSON.parse(history) : [];
		} catch {
			return [];
		}
	}

	private static saveHistory(history: SearchEvent[]): void {
		try {
			localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
		} catch (error) {
			console.error("Failed to save search history:", error);
		}
	}

	private static getMostFrequent<T>(map: Map<T, number>): T | undefined {
		let maxCount = 0;
		let mostFrequent: T | undefined;

		map.forEach((count, value) => {
			if (count > maxCount) {
				maxCount = count;
				mostFrequent = value;
			}
		});

		return mostFrequent;
	}
}
