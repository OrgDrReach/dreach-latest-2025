import React from "react";
import Image from "next/image";

const Banner: React.FC = () => {
	return (
		<main>
			<Image
				src={"/websiteImages/healthunity_banner.png"}
				alt="banner_image"
				width={1980}
        height={1400}
			/>
		</main>
	);
};

export default Banner;
