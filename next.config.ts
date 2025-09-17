import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [new URL("https://a.storyblok.com/**")],
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
};

export default nextConfig;
