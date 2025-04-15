interface Coordinates {
	latitude: number;
	longitude: number;
}

export const LocationService = {
	// Get user's current location
	getCurrentLocation(): Promise<Coordinates> {
		return new Promise((resolve, reject) => {
			if (!navigator.geolocation) {
				reject(new Error("Geolocation is not supported by your browser"));
				return;
			}

			navigator.geolocation.getCurrentPosition(
				(position) => {
					resolve({
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
					});
				},
				(error) => {
					reject(error);
				}
			);
		});
	},

	// Calculate distance between two points using Haversine formula
	calculateDistance(point1: Coordinates, point2: Coordinates): number {
		const R = 6371; // Earth's radius in kilometers
		const dLat = this.toRad(point2.latitude - point1.latitude);
		const dLon = this.toRad(point2.longitude - point1.longitude);
		const lat1 = this.toRad(point1.latitude);
		const lat2 = this.toRad(point2.latitude);

		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c;
	},

	// Convert degrees to radians
	toRad(degrees: number): number {
		return (degrees * Math.PI) / 180;
	},

	// Sort providers by distance from a given location
	sortProvidersByDistance(providers: any[], userLocation: Coordinates) {
		return [...providers].sort((a, b) => {
			const distanceA = this.calculateDistance(
				userLocation,
				a.location.coordinates
			);
			const distanceB = this.calculateDistance(
				userLocation,
				b.location.coordinates
			);
			return distanceA - distanceB;
		});
	},

	// Filter providers within a specific radius (in kilometers)
	filterProvidersByRadius(
		providers: any[],
		userLocation: Coordinates,
		radius: number
	) {
		return providers.filter((provider) => {
			const distance = this.calculateDistance(
				userLocation,
				provider.location.coordinates
			);
			return distance <= radius;
		});
	},

	// Get formatted address string
	formatAddress(location: {
		address: string;
		city: string;
		state: string;
		pincode: string;
	}): string {
		return `${location.address}, ${location.city}, ${location.state} - ${location.pincode}`;
	},

	// Check if a location is within service area
	isWithinServiceArea(
		providerLocation: Coordinates,
		userLocation: Coordinates,
		maxDistance: number
	): boolean {
		const distance = this.calculateDistance(providerLocation, userLocation);
		return distance <= maxDistance;
	},
};
