import React from "react";
import { RNChildProp } from "@/@types/interface/Interface";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Dreach.in | Doctors",
	description:
		"Dreach.in is a platform for doctors and patients to connect and communicate.",
};

const layout: React.FC = ({ children }: RNChildProp) => {
	return (
		<main>
			<div>{children}</div>
		</main>
	);
};

export default layout;
