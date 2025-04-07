import React from "react";
import { Metadata } from "next";
import Hero from "@/components/landing/Hero";
import Banner from "@/components/landing/Banner";
import InstantAppointment from "@/components/landing/appointment/InstantAppointment";

export const metadata: Metadata = {
	title: "Dreach.in",
	description:
		"Dreach.in is a platform for doctors and patients to connect and communicate.",
};

const Home: React.FC = () => {
	return (
		<main>
			<div>
				<Hero />
				<InstantAppointment />
				<Banner />
			</div>
		</main>
	);
};

export default Home;
