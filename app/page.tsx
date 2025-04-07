import React from "react";
import { Metadata } from "next";
import Hero from "@/components/landing/Hero";
import Banner from "@/components/landing/Banner";
import InstantAppointment from "@/components/landing/appointment/InstantAppointment";
import StartupIndia from "@/components/landing/startupIndia/StartupIndia";
import About from "@/components/landing/about/About";
import DoctorCTA from "@/components/landing/doctor/DoctorCTA";

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
				<StartupIndia />
				<About />
				<DoctorCTA />
				<Banner />
			</div>
		</main>
	);
};

export default Home;
