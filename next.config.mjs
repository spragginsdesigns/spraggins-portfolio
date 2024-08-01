/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
				port: "",
				pathname: "/**"
			},
			{
				protocol: "https",
				hostname: "icons.duckduckgo.com",
				port: "",
				pathname: "/ip3/**"
			},
			{
				protocol: "https",
				hostname: "raw.githubusercontent.com",
				port: "",
				pathname: "/**"
			}
		]
	},
	webpack: (config) => {
		config.resolve.alias.canvas = false;
		return config;
	}
};

export default nextConfig;
