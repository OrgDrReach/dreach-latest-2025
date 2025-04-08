"use client";
import React, { useState } from "react";
import Image from "next/image";
import Book from "@/components/landing/Book";
import { delay } from "@/lib/utils";

const ServiceHero: React.FC = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [showModal, setShowModal] = React.useState(false);
	const [isButtonVisible, setIsButtonVisible] = React.useState(false);

	React.useEffect(() => {
		const loadButton = async () => {
			await delay(1000);
			setIsButtonVisible(true);
		};
		loadButton();
	}, []);
	const handleClick = async () => {
		setIsLoading(true);
		await delay(500); // Reduced delay for better UX
		setShowModal((prev) => !prev); // Toggle instead of always setting to true
		setIsLoading(false);
	};

	return (
		<main className="relative min-h-[600px] bg-gradient-to-br from-white to-[#f8fdff] dark:from-slate-900 dark:to-slate-800">
			{/* Background Pattern */}
			<div className="absolute inset-0 bg-[url('/assets/pattern-bg.svg')] opacity-5 dark:opacity-10"></div>

			{/* Content Container */}
			<div className="relative container mx-auto px-4 py-20">
				<div className="grid lg:grid-cols-2 gap-16 items-center">
					{/* Left Content */}
					<div className="space-y-8">
						<h1 className="text-5xl md:text-6xl font-bold leading-tight">
							<span className="text-[#125872] dark:text-white">
								Healthcare Solutions
							</span>{" "}
							<br />
							<span className="text-[#31ADDB] dark:text-[#31ADDB]">
								Made for You
							</span>
						</h1>

						<p className="text-xl max-w-xl text-[#125872]/80 dark:text-white/80">
							Healthcare made accessible, convenient, and comprehensive.
							Experience medical care that puts you first.
						</p>

						<div className="flex flex-wrap gap-4">
							{isButtonVisible && (
								<div
									onClick={handleClick}
									className="px-8 py-4 rounded-lg transition-all duration-300
                  bg-[#31ADDB] text-white hover:bg-[#125872]
                  shadow-lg hover:shadow-xl dark:hover:bg-[#31ADDB]/80 cursor-pointer">
									{isLoading ?
										"Loading..."
									:	<Book onClick={showModal ? handleClick : undefined} />}
								</div>
							)}
							<button
								className="px-8 py-4 rounded-lg transition-all duration-300
                border-2 border-[#31ADDB] text-[#31ADDB]
                hover:bg-[#31ADDB]/5
                dark:border-[#31ADDB] dark:text-[#31ADDB]
                dark:hover:bg-[#31ADDB]/10">
								Learn More
							</button>
						</div>
					</div>

					{/* Right Content - Stats */}
					<div className="grid grid-cols-2 gap-6">
						{[
							{ number: "24/7", text: "Available Support" },
							{ number: "100+", text: "Healthcare Experts" },
							{ number: "50k+", text: "Happy Patients" },
							{ number: "15+", text: "Years Experience" },
						].map((stat, index) => (
							<div
								key={index}
								className="p-8 rounded-xl 
                  bg-white/50 backdrop-blur-sm
                  dark:bg-white/5 dark:backdrop-blur-sm
                  transition-all duration-300 hover:transform hover:scale-105
                  border border-[#31ADDB]/20 dark:border-[#31ADDB]/20
                  shadow-lg hover:shadow-xl">
								<h3 className="text-4xl font-bold text-[#31ADDB]">
									{stat.number}
								</h3>
								<p className="mt-2 text-lg text-[#125872] dark:text-white/80">
									{stat.text}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</main>
	);
};

export default ServiceHero;
