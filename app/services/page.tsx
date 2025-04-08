import ServiceHero from "@/components/page-components/services/hero/ServiceHero";
import OurServices from "@/components/page-components/services/our-services/OurServices";
import React from "react";

export default function page() {
	return (
		<main>
			<div>
				<ServiceHero />
				<OurServices />
			</div>
		</main>
	);
}
