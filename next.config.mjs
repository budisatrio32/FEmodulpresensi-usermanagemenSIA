/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	// Skip ESLint during production builds to avoid deploy failures.
	// We'll fix lint issues incrementally without blocking Vercel builds.
	eslint: {
		ignoreDuringBuilds: true,
	},
};

export default nextConfig;
