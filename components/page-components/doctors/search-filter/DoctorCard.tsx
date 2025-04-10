import React from "react";
import Link from "next/link";
import { FaMapMarkerAlt, FaVideo, FaPhoneAlt, FaUserMd } from "react-icons/fa";
import { IDoctor, EDoctorConsultMode } from "@/types/doctor.d.types";
import { Provider, EProviderType } from "@/types/provider.d.types";

interface DoctorCardProps {
	doctor: Provider & IDoctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
	const {
		name,
		specialization,
		degree,
		experience,
		profileImage,
		status,
		rating,
		address,
		contact,
		consultMode,
		id,
	} = doctor;

	// Get primary address
	const primaryAddress = address[0];

	return (
		<div className="group w-full max-w-4xl mx-auto p-5 rounded-[1.5rem] bg-white/90 dark:bg-gray-900/95 backdrop-blur-sm border-2 border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgba(76,192,244,0.08)]">
			<div className="flex flex-col lg:flex-row gap-6">
				{/* Left Section */}
				<div className="lg:w-72 flex flex-col gap-4">
					{/* Profile Image */}
					<div className="relative mx-auto lg:mx-0 p-3 border border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50">
						<div className="absolute inset-0 bg-gradient-to-b from-[#4cc0f4]/10 to-[#125872]/10 rounded-2xl blur-xl scale-95 group-hover:scale-110 transition-transform duration-500" />
						<div className="relative w-36 h-44 lg:w-full lg:h-64 rounded-xl overflow-hidden ring-1 ring-[#4cc0f4]/20 dark:ring-[#4cc0f4]/30 transition-all duration-300 group-hover:ring-2 group-hover:ring-[#4cc0f4]/50 group-hover:shadow-lg">
							<img
								className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
								src={profileImage || "/default-doctor.jpg"}
								alt={name}
								loading="lazy"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

							{/* Status Badge */}
							{status === "ONLINE" && (
								<div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-medium rounded-full shadow-lg flex items-center gap-1.5">
									<span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
									Available Now
								</div>
							)}
						</div>
					</div>

					{/* Quick Stats */}
					<div className="border border-gray-100 dark:border-gray-800 rounded-xl">
						<div className="flex items-center justify-between px-4 py-3 bg-gray-50/80 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
							{[
								{ value: experience, label: "Years" },
								{ value: rating || "N/A", label: "Rating" },
								{ value: consultMode.length, label: "Services" },
							].map((stat, index) => (
								<div key={index} className="flex-1 text-center">
									<div className="text-lg font-bold text-[#125872] dark:text-[#4cc0f4]">
										{stat.value}
									</div>
									<div className="text-xs font-medium text-gray-500 dark:text-gray-400">
										{stat.label}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Right Section */}
				<div className="flex-1 flex flex-col gap-4">
					{/* Doctor Info */}
					<div className="p-4 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-800/50">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
							{name}
						</h2>
						<div className="mt-1 flex flex-wrap items-center gap-2">
							<span className="text-[#4cc0f4] font-semibold">
								{specialization.join(", ")}
							</span>
							<span className="text-gray-400 text-sm">•</span>
							<span className="text-gray-600 dark:text-gray-400 text-sm">
								{degree.join(", ")}
							</span>
						</div>
					</div>

					{/* Info Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						<div className="flex items-center gap-3 p-3 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 hover:border-[#4cc0f4]/30 transition-colors duration-300">
							<FaMapMarkerAlt className="text-xl text-gray-400" />
							<div className="min-w-0">
								<div className="text-xs text-gray-500 dark:text-gray-400">
									Location
								</div>
								<div className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
									{primaryAddress.city}, {primaryAddress.state},{" "}
									{primaryAddress.country}
								</div>
							</div>
						</div>

						<div className="flex items-center gap-3 p-3 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 hover:border-[#4cc0f4]/30 transition-colors duration-300">
							<FaUserMd className="text-xl text-gray-400" />
							<div className="min-w-0">
								<div className="text-xs text-gray-500 dark:text-gray-400">
									Consult Mode
								</div>
								<div className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
									{consultMode
										.map((mode) => mode.replace(/_/g, " "))
										.join(", ")}
								</div>
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex gap-3 mt-1 p-3 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-800/50">
						{contact.phone[0] && (
							<button
								onClick={() =>
									(window.location.href = `tel:${contact.phone[0]}`)
								}
								className="flex-1 px-6 py-2.5 bg-[#4cc0f4] hover:bg-[#4cc0f4]/90 text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#4cc0f4]/20 active:scale-[0.98] flex items-center justify-center gap-2">
								<FaPhoneAlt className="text-sm" />
								Call Now
							</button>
						)}

						<Link
							href={{
								pathname: "/appointment",
								query: { doctorId: id },
							}}
							className="flex-1">
							<button className="w-full px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98]">
								Book Appointment
							</button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DoctorCard;
