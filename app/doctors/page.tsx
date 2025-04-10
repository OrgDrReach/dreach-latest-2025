"use client";

import React, { useState, useEffect } from "react";
import { getUserLocation, LocationData } from "@/utils/location";
import {
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
			</div>
		</main>
	);
}
