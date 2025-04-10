"use client";

import React, { useState, useEffect } from "react";
import { getUserLocation, LocationData } from "@/utils/location";
import SearchAndFilters, {
	SearchState,
	FilterState,
} from "@/components/page-components/doctors/search-filter/SearchAndFilters";
import DoctorHero from "@/components/page-components/doctors/hero/DoctorHero";
import DoctorFeatured from "@/components/page-components/doctors/featured/DoctorFeatured";

export default function page() {
	const [userLocation, setUserLocation] = useState<LocationData | null>(null);
	const [searchParams, setSearchParams] = useState({
		query: "",
		location: "",
		filters: {
			availableToday: false,
			nextThreeDays: false,
			femaleDoctors: false,
			maleDoctors: false,
			videoConsult: false,
		},
	});

	useEffect(() => {
		async function initLocation() {
			try {
				const location = await getUserLocation();
				setUserLocation(location);
			} catch (error) {
				console.error("Failed to get user location:", error);
			}
		}

		initLocation();
	}, []);

	const handleSearch = (searchData: SearchState, filterData: FilterState) => {
		setSearchParams({
			query: searchData.query,
			location: searchData.location,
			filters: {
				availableToday: filterData.availableToday,
				nextThreeDays: filterData.nextThreeDays,
				femaleDoctors: filterData.femaleDoctors,
				maleDoctors: filterData.maleDoctors,
				videoConsult: filterData.videoConsult,
			},
		});
	};

	return (
		<main className={`bg-gray-100 dark:bg-gray-900 min-h-screen`}>
			<div className={``}>
				<DoctorHero />
				<DoctorFeatured />
				<div className={`mb-8 px-4`}>
					<SearchAndFilters
						initialLocation={userLocation}
						onSearch={handleSearch}
						isSearching={false}
					/>
				</div>
			</div>
			<div className={`container mx-auto`}>
				<div className="py-8 lg:px-32 px-4">
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
						Available Doctors
					</h2>
					<p className="text-gray-600 dark:text-gray-300">
						Find and book appointments with the right doctor
					</p>
				</div>
			</div>
		</main>
	);
}
