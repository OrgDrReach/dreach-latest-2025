import { useState, useEffect } from "react";

export const BREAKPOINTS = {
	mobile: 640,
	tablet: 768,
	laptop: 1024,
	desktop: 1280,
} as const;

interface DeviceInfo {
	isMobile: boolean;
	isTablet: boolean;
	isLaptop: boolean;
	isDesktop: boolean;
	orientation: "portrait" | "landscape";
	touchEnabled: boolean;
}

export function useMobile(): DeviceInfo {
	const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
		isMobile: false,
		isTablet: false,
		isLaptop: false,
		isDesktop: true,
		orientation: "landscape",
		touchEnabled: false,
	});

	useEffect(() => {
		const updateDeviceInfo = () => {
			const width = window.innerWidth;
			const height = window.innerHeight;

			setDeviceInfo({
				isMobile: width <= BREAKPOINTS.mobile,
				isTablet: width > BREAKPOINTS.mobile && width <= BREAKPOINTS.tablet,
				isLaptop: width > BREAKPOINTS.tablet && width <= BREAKPOINTS.laptop,
				isDesktop: width > BREAKPOINTS.laptop,
				orientation: height > width ? "portrait" : "landscape",
				touchEnabled: "ontouchstart" in window || navigator.maxTouchPoints > 0,
			});
		};

		// Initial check
		updateDeviceInfo();

		// Add event listeners
		window.addEventListener("resize", updateDeviceInfo);
		window.addEventListener("orientationchange", updateDeviceInfo);

		// Cleanup
		return () => {
			window.removeEventListener("resize", updateDeviceInfo);
			window.removeEventListener("orientationchange", updateDeviceInfo);
		};
	}, []);

	return deviceInfo;
}

interface ViewportInfo {
	width: number;
	height: number;
	scrollY: number;
	scrollX: number;
}

export function useViewport(): ViewportInfo {
	const [viewport, setViewport] = useState<ViewportInfo>({
		width: 0,
		height: 0,
		scrollY: 0,
		scrollX: 0,
	});

	useEffect(() => {
		const updateViewport = () => {
			setViewport({
				width: window.innerWidth,
				height: window.innerHeight,
				scrollY: window.scrollY,
				scrollX: window.scrollX,
			});
		};

		// Initial check
		updateViewport();

		// Add event listeners
		window.addEventListener("resize", updateViewport);
		window.addEventListener("scroll", updateViewport);

		// Cleanup
		return () => {
			window.removeEventListener("resize", updateViewport);
			window.removeEventListener("scroll", updateViewport);
		};
	}, []);

	return viewport;
}

export function useResponsiveValue<T>(values: {
	mobile: T;
	tablet: T;
	laptop: T;
	desktop: T;
}): T {
	const { isMobile, isTablet, isLaptop } = useMobile();

	if (isMobile) return values.mobile;
	if (isTablet) return values.tablet;
	if (isLaptop) return values.laptop;
	return values.desktop;
}

export const getDeviceType = (): "mobile" | "tablet" | "desktop" => {
	const ua = navigator.userAgent;
	if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
		return "tablet";
	}
	if (
		/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
			ua
		)
	) {
		return "mobile";
	}
	return "desktop";
};
