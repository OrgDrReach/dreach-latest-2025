"use client";

import React, { useState, useEffect } from "react";
import { getUserLocation, LocationData } from "@/utils/location";

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

	return (
		<main>
			<div>page</div>
		</main>
	);
}
