import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaMapMarkerAlt, FaVideo, FaPhoneAlt, FaUserMd } from "react-icons/fa";
import { IDoctor, EDoctorConsultMode } from "@/types/doctor.d.types";
import { Provider, EProviderType } from "@/types/provider.d.types";
import ImageViewer from "@/components/images/ImageViewer";

interface DoctorCardProps {
	doctor: Provider & IDoctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
	const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
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
		<>
			{/* Increased max-width and adjusted padding */}
			<div className="group w-full max-w-sm mx-auto p-4 rounded-xl bg-white/90 dark:bg-gray-900/95 backdrop-blur-sm border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgba(76,192,244,0.08)]">
				<div className="flex flex-col gap-4">
					{/* Increased Image Height */}
					<div className="relative">
						<div
							className="relative w-full h-52 rounded-xl overflow-hidden ring-1 ring-[#4cc0f4]/20 dark:ring-[#4cc0f4]/30 transition-all duration-300 group-hover:ring-2 group-hover:ring-[#4cc0f4]/50 cursor-pointer"
							onClick={() => setIsImageViewerOpen(true)}>
							<Image
								src={profileImage || "/default-doctor.jpg"}
								alt={name}
								fill
								className="object-cover transition-transform duration-500 group-hover:scale-110"
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
								priority={false}
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

							{/* Adjusted Status Badge */}
							{status === "ONLINE" && (
								<div className="absolute top-3 right-3 px-3 py-1 bg-emerald-500/90 backdrop-blur-sm text-white text-sm font-medium rounded-full shadow-lg flex items-center gap-1.5">
									<span className="w-2 h-2 bg-white rounded-full animate-pulse" />
									Available
								</div>
							)}
						</div>
					</div>

					{/* Increased Text Sizes for Doctor Info */}
					<div className="space-y-2">
						<h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">
							{name}
						</h2>
						<div className="flex flex-wrap items-center gap-2 text-sm">
							<span className="text-[#4cc0f4] font-semibold">
								{specialization[0]}
							</span>
							{specialization.length > 1 && (
								<span className="text-[#4cc0f4] font-semibold">
									+{specialization.length - 1}
								</span>
							)}
						</div>
					</div>

					{/* Increased Stats Size */}
					<div className="grid grid-cols-3 gap-3 text-center">
						{[
							{ value: experience, label: "Yrs" },
							{ value: rating || "N/A", label: "Rating" },
							{ value: consultMode.length, label: "Services" },
						].map((stat, index) => (
							<div
								key={index}
								className="p-2.5 border border-gray-100 dark:border-gray-800 rounded-lg bg-gray-50/80 dark:bg-gray-800/50">
								<div className="text-lg font-bold text-[#125872] dark:text-[#4cc0f4]">
									{stat.value}
								</div>
								<div className="text-sm text-gray-500 dark:text-gray-400">
									{stat.label}
								</div>
							</div>
						))}
					</div>

					{/* Increased Location Text Size */}
					<div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400">
						<FaMapMarkerAlt className="text-gray-400 flex-shrink-0 text-base" />
						<span className="truncate">
							{primaryAddress.city}, {primaryAddress.state}
						</span>
					</div>

					{/* Larger Action Buttons */}
					<div className="flex gap-3 mt-2">
						{contact.phone[0] && (
							<button
								onClick={() =>
									(window.location.href = `tel:${contact.phone[0]}`)
								}
								className="flex-1 px-4 py-2.5 bg-[#4cc0f4] hover:bg-[#4cc0f4]/90 text-white rounded-lg text-base font-medium transition-all duration-300 flex items-center justify-center gap-2">
								<FaPhoneAlt className="text-sm" />
								Call
							</button>
						)}
						<Link
							href={{
								pathname: "/appointment",
								query: { doctorId: id },
							}}
							className="flex-1">
							<button className="w-full px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg text-base font-medium transition-all duration-300">
								Book
							</button>
						</Link>
					</div>
				</div>
			</div>

			{/* Image Viewer Modal - Increased Image Size */}
			<ImageViewer
				isOpen={isImageViewerOpen}
				onClose={() => setIsImageViewerOpen(false)}>
				<Image
					src={profileImage || "/default-doctor.jpg"}
					alt={name}
					width={600}
					height={400}
					className="object-contain rounded-xl"
				/>
			</ImageViewer>
		</>
	);
};

export default DoctorCard;
