import { VscVerifiedFilled } from "react-icons/vsc";
import {
	FaStar,
	FaClock,
	FaLanguage,
	FaRupeeSign,
	FaBriefcaseMedical,
	FaCheckCircle,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Staff } from "@/types/staff.types";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface StaffCardProps {
	staff: Staff;
	onBook?: (staffId: string) => void;
}

export const StaffCard: React.FC<StaffCardProps> = ({ staff, onBook }) => {
	return (
		<Card className="overflow-hidden hover:shadow-lg transition-shadow relative">
			{/* Update verification badge */}
			<div className="absolute top-2 right-2">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger>
							<div className="relative">
								{/* Icon container */}
								<div
									// className={`rounded-full p-0.2
									//   ${
									// 		staff.isVerified
									// 			? "border-2 border-yellow-400 glow"
									// 			: " border-2 border-gray-300 animate-pulse"
									// 	}
									//     `}
									className={`rounded-full p-0.2 ${
										staff.isVerified ? "" : "animate-pulse"
									}`}>
									<VscVerifiedFilled
										className={`text-2xl ${
											staff.isVerified ? "text-blue-600" : "text-gray-300"
										}`}
									/>
								</div>
							</div>
						</TooltipTrigger>
						<TooltipContent>
							{staff.isVerified ? (
								<div>
									<p className="font-semibold text-sm">Verified Professional</p>
									{staff.certifications && staff.certifications.length > 0 && (
										<div className="mt-1">
											<p className="text-sm font-medium">Certifications:</p>
											<ul className="text-xs list-disc pl-4">
												{staff.certifications.map((cert, index) => (
													<li key={index}>{cert}</li>
												))}
											</ul>
										</div>
									)}
								</div>
							) : (
								<p>Verification pending</p>
							)}
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>

			<div className="p-4">
				<div className="flex items-start gap-4">
					<img
						src={staff.image}
						alt={staff.name}
						className="w-20 h-20 rounded-full object-cover"
					/>
					<div>
						<h3 className="font-semibold text-lg">{staff.name}</h3>
						<p className="text-gray-600 text-sm font-semibold">{staff.role}</p>
						<p className="text-gray-500 text-sm">
							<span className={`font-semibold`}>Availability:</span>{" "}
							{staff.availability.join(", ")}
						</p>
						<div className="flex items-center gap-2 mt-1">
							<FaStar className="text-yellow-400" />
							<span className="text-sm font-medium">{staff.rating}</span>
							<span className="text-gray-500 text-sm">
								({staff.totalRatings} ratings)
							</span>
						</div>
					</div>
				</div>

				<div className="mt-4 space-y-2">
					<div className="flex items-center gap-2 text-sm text-gray-600">
						<FaBriefcaseMedical className="text-gray-400" />
						<span>
							{staff.specializations?.join(", ") || "No specializations listed"}
						</span>
					</div>

					<div className="flex items-center gap-2 text-sm text-gray-600">
						<FaClock className="text-gray-400" />
						<span>{staff.experience} experience</span>
					</div>

					<div className="flex items-center gap-2 text-sm text-gray-600">
						<FaLanguage className="text-gray-400" />
						<span>{staff.languages.join(", ")}</span>
					</div>

					<div className="flex items-center gap-2 text-sm text-gray-600">
						<FaRupeeSign className="text-gray-400" />
						<span>
							₹{staff.price.hourly}/hour • ₹{staff.price.daily}/day
						</span>
					</div>
				</div>

				<Button className="w-full mt-4" onClick={() => onBook?.(staff.id)}>
					Book Now
				</Button>
			</div>
		</Card>
	);
};
