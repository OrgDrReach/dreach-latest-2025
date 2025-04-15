import { create } from "zustand";
import { userApi } from "@/lib/api";
import { handleAPIError } from "@/lib/errors";
import { reviewSchema } from "@/Zod/api.schemas";

interface Review {
	id: string;
	providerId: string;
	userId: string;
	rating: number;
	comment?: string;
	createdAt: string;
	updatedAt: string;
	verified: boolean;
}

interface ReviewsStore {
	reviews: Review[];
	loading: boolean;
	error: string | null;
	addReview: (reviewData: {
		providerId: string;
		rating: number;
		comment?: string;
	}) => Promise<void>;
	fetchReviews: (providerId: string) => Promise<void>;
	getAverageRating: (providerId: string) => number;
	getRatingDistribution: (providerId: string) => { [key: number]: number };
}

export const useReviewsStore = create<ReviewsStore>((set, get) => ({
	reviews: [],
	loading: false,
	error: null,

	addReview: async (reviewData) => {
		set({ loading: true, error: null });
		try {
			// Validate review data using Zod schema
			const validatedData = reviewSchema.parse(reviewData);

			const response = await userApi.addReview(validatedData);
			set((state) => ({
				reviews: [...state.reviews, response],
				loading: false,
			}));
		} catch (error) {
			const apiError = handleAPIError(error);
			set({ error: apiError.message, loading: false });
			throw error;
		}
	},

	fetchReviews: async (providerId: string) => {
		set({ loading: true, error: null });
		try {
			const response = await userApi.getServiceProvider(providerId);
			set({ reviews: response.reviews || [], loading: false });
		} catch (error) {
			const apiError = handleAPIError(error);
			set({ error: apiError.message, loading: false });
		}
	},

	getAverageRating: (providerId: string) => {
		const providerReviews = get().reviews.filter(
			(review) => review.providerId === providerId
		);
		if (providerReviews.length === 0) return 0;

		const sum = providerReviews.reduce((acc, review) => acc + review.rating, 0);
		return sum / providerReviews.length;
	},

	getRatingDistribution: (providerId: string) => {
		const providerReviews = get().reviews.filter(
			(review) => review.providerId === providerId
		);

		const distribution: { [key: number]: number } = {
			1: 0,
			2: 0,
			3: 0,
			4: 0,
			5: 0,
		};

		providerReviews.forEach((review) => {
			distribution[review.rating]++;
		});

		return distribution;
	},
}));
