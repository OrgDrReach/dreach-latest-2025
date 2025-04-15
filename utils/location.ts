import { Location } from "@/types/provider.d.types";

export interface LocationData {
	city: string;
	state: string;
	country: string;
	latitude: number;
	longitude: number;
}

export interface Coordinates {
	latitude: number;
	longitude: number;
}

export interface GeocodingResult {
	coordinates: Coordinates;
	formattedAddress: string;
	city: string;
	state: string;
	country: string;
	pincode: string;
}

const LOCATION_CACHE_KEY = "user_location";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function getUserLocation(): Promise<LocationData> {
	try {
		// Try IP geolocation first as it's more reliable
		const ipResponse = await fetch(
			"https://api.ipapi.com/api/check?access_key=YOUR_API_KEY"
		);
		const ipData = await ipResponse.json();

		if (ipData.city) {
			const locationData = {
				city: ipData.city,
				state: ipData.region_name,
				country: ipData.country_name,
				latitude: ipData.latitude,
				longitude: ipData.longitude,
			};

			// Cache the successful result
			localStorage.setItem(
				LOCATION_CACHE_KEY,
				JSON.stringify({
					data: locationData,
					timestamp: Date.now(),
				})
			);

			return locationData;
		}

		// Fallback to browser geolocation
		if ("geolocation" in navigator) {
			const position = await new Promise<GeolocationPosition>(
				(resolve, reject) => {
					navigator.geolocation.getCurrentPosition(resolve, reject, {
						enableHighAccuracy: true,
						timeout: 10000,
						maximumAge: 0,
					});
				}
			);

			// Use OpenStreetMap's Nominatim for reverse geocoding (free, no API key needed)
			const response = await fetch(
				`https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`,
				{
					headers: {
						Accept: "application/json",
						"User-Agent": "DrReach App", // Required by Nominatim
					},
				}
			);

			const data = await response.json();

			const locationData = {
				city:
					data.address.city || data.address.town || data.address.village || "",
				state: data.address.state || "",
				country: data.address.country || "",
				latitude: position.coords.latitude,
				longitude: position.coords.longitude,
			};

			// Cache the successful result
			localStorage.setItem(
				LOCATION_CACHE_KEY,
				JSON.stringify({
					data: locationData,
					timestamp: Date.now(),
				})
			);

			return locationData;
		}

		throw new Error("Geolocation not supported");
	} catch (error) {
		console.error("Location detection failed:", error);

		// Try to get cached location as last resort
		const cached = localStorage.getItem(LOCATION_CACHE_KEY);
		if (cached) {
			const { data } = JSON.parse(cached);
			return data;
		}

		// Return a default location if everything fails
		return {
			city: "Mumbai",
			state: "Maharashtra",
			country: "India",
			latitude: 19.076,
			longitude: 72.8777,
		};
	}
}

export class LocationService {
	private static readonly EARTH_RADIUS_KM = 6371;
	private static readonly MAX_HOME_VISIT_DISTANCE = 20; // kilometers

	static async getCurrentPosition(): Promise<Coordinates> {
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
				},
				{
					enableHighAccuracy: true,
					timeout: 5000,
					maximumAge: 0,
				}
			);
		});
	}

	static calculateDistance(point1: Coordinates, point2: Coordinates): number {
		const lat1 = this.toRadians(point1.latitude);
		const lon1 = this.toRadians(point1.longitude);
		const lat2 = this.toRadians(point2.latitude);
		const lon2 = this.toRadians(point2.longitude);

		const dLat = lat2 - lat1;
		const dLon = lon2 - lon1;

		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		return this.EARTH_RADIUS_KM * c;
	}

	static async geocodeAddress(address: string): Promise<GeocodingResult> {
		try {
			const response = await fetch(
				`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
					address
				)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
			);

			const data = await response.json();

			if (data.status !== "OK") {
				throw new Error("Geocoding failed");
			}

			const result = data.results[0];
			const { lat, lng } = result.geometry.location;

			const addressComponents = this.parseAddressComponents(
				result.address_components
			);

			return {
				coordinates: { latitude: lat, longitude: lng },
				formattedAddress: result.formatted_address,
				...addressComponents,
			};
		} catch (error) {
			throw new Error("Failed to geocode address");
		}
	}

	static isWithinHomeVisitRange(
		providerLocation: Location,
		patientLocation: Coordinates
	): boolean {
		const distance = this.calculateDistance(
			providerLocation.coordinates,
			patientLocation
		);
		return distance <= this.MAX_HOME_VISIT_DISTANCE;
	}

	static sortByDistance(
		locations: Location[],
		currentLocation: Coordinates
	): Location[] {
		return [...locations].sort((a, b) => {
			const distanceA = this.calculateDistance(a.coordinates, currentLocation);
			const distanceB = this.calculateDistance(b.coordinates, currentLocation);
			return distanceA - distanceB;
		});
	}

	static filterByRadius(
		locations: Location[],
		center: Coordinates,
		radiusKm: number
	): Location[] {
		return locations.filter((location) => {
			const distance = this.calculateDistance(location.coordinates, center);
			return distance <= radiusKm;
		});
	}

	static formatDistance(distanceKm: number): string {
		if (distanceKm < 1) {
			return `${Math.round(distanceKm * 1000)}m`;
		}
		return `${distanceKm.toFixed(1)}km`;
	}

	private static toRadians(degrees: number): number {
		return (degrees * Math.PI) / 180;
	}

	private static parseAddressComponents(components: any[]): {
		city: string;
		state: string;
		country: string;
		pincode: string;
	} {
		const result = {
			city: "",
			state: "",
			country: "",
			pincode: "",
		};

		components.forEach((component) => {
			if (component.types.includes("locality")) {
				result.city = component.long_name;
			} else if (component.types.includes("administrative_area_level_1")) {
				result.state = component.long_name;
			} else if (component.types.includes("country")) {
				result.country = component.long_name;
			} else if (component.types.includes("postal_code")) {
				result.pincode = component.long_name;
			}
		});

		return result;
	}
}
