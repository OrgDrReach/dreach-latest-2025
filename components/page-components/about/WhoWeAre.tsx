import Link from "next/link";
import Image from "next/image";
import {
	FaArrowRight,
	FaUserMd,
	FaHospital,
	FaAward,
	FaCheckCircle,
} from "react-icons/fa";

const WhoWeAre = () => {
	const stats = [
		{
			icon: <FaUserMd className="text-3xl" />,
			count: "50+",
			label: "Expert Doctors",
		},
		{
			icon: <FaHospital className="text-3xl" />,
			count: "1000+",
			label: "Happy Patients",
		},
		{
			icon: <FaAward className="text-3xl" />,
			count: "15+",
			label: "Years Experience",
		},
	];

	const highlights = [
		"24/7 Virtual Medical Support",
		"Experienced Healthcare Professionals",
		"Advanced Telemedicine Platform",
		"Affordable Healthcare Solutions",
	];

	return (
		<section className={`who-we-are`}>
			<div className={`who-we-are-container`}>
				<div className={`text-center mb-16`}>
					<h2>Who We Are</h2>
          <div className={`who-we-are-separator`}></div>
				</div>
			</div>
		</section>
	);
};

export default WhoWeAre;
