import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.unsplash.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "randomuser.me",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "source.unsplash.com",
				pathname: "/**",
			},
		],
		domains: [
			"github.com",
			"avatars.githubusercontent.com",
			"lh3.googleusercontent.com",
			"randomuser.me",
			"images.unsplash.com",
		],
		dangerouslyAllowSVG: true,
		contentDispositionType: "attachment",
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},
	typescript: {
		ignoreBuildErrors: true,
	},
};

export default nextConfig;
