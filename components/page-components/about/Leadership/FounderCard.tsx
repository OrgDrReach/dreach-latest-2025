"use client";

import React, { useState } from "react";
import Image from "next/image";
import ImageViewer from "@/components/images/ImageViewer";

interface FounderCardProps {
	name: string;
	title: string;
	bio: string;
	imageSrc: string;
	socialLinks: { icon: string; url: string }[];
	reverse?: boolean;
	classNames?: string;
}

const FounderCard: React.FC<FounderCardProps> = ({
	name,
	title,
	bio,
	imageSrc,
	socialLinks,
	reverse = false,
	classNames = "",
}) => {
	const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

	return (
		<>
			<div
				className={`flex flex-col md:flex-row bg-[#135872] ${
					reverse ? "md:flex-row-reverse border-r-8" : "border-l-8"
				} border-[#5db9e3] rounded-lg overflow-hidden shadow-lg mb-12 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl`}>
				<div
					className="relative my-auto md:h-auto md:w-[400px] cursor-pointer overflow-hidden"
					onClick={() => setIsImageViewerOpen(true)}>
					<div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
						<span className="text-white text-sm bg-black/50 px-3 py-1 rounded-full">
							Click to expand
						</span>
					</div>
					<Image
						src={imageSrc}
						width={600}
						height={200}
						alt={`${name}, ${title}`}
						className="transition-transform duration-500 p-5 transform hover:scale-105"
					/>
				</div>
				<div className="lg:px-10 p-6 text-justify sm:text-start flex flex-col justify-center md:w-full">
					<h2 className="text-3xl mb-3 text-[#00feff] font-bold tracking-wide">
						{name}
					</h2>
					<p className="text-lg text-orange-500 font-semibold mb-4">{title}</p>
					<p
						className={`text-md text-gray-200 leading-relaxed mb-8 ${classNames}`}>
						{bio}
					</p>
					<div className="flex space-x-6">
						{socialLinks.map((link, index) => (
							<a
								key={index}
								href={link.url}
								target="_blank"
								rel="noopener noreferrer"
								className="text-[#00feff] text-xl transition-all duration-300 hover:text-orange-500 transform hover:-translate-y-1 hover:scale-110">
								<i className={`fab ${link.icon}`}></i>
							</a>
						))}
					</div>
				</div>
			</div>

			<ImageViewer
				isOpen={isImageViewerOpen}
				onClose={() => setIsImageViewerOpen(false)}>
				<Image
					src={imageSrc}
					width={1200}
					height={800}
					alt={`${name}, ${title}`}
					className="max-w-full max-h-[85vh] object-contain"
				/>
			</ImageViewer>
		</>
	);
};

export default FounderCard;
