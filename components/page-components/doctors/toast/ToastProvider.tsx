"use client";

import React from "react";
import { RNChildProp } from "@/@types/interface/Interface";
import { Toaster } from "sonner";

const ToastProvider: React.FC<RNChildProp> = ({ children }: RNChildProp) => {
	return (
		<>
			<Toaster richColors closeButton position="top-right" />
			<div>{children}</div>
		</>
	);
};

export default ToastProvider;
