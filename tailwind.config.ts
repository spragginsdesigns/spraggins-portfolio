import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}"
	],
	theme: {
		extend: {
			colors: {
				background: "#121212",
				surface: "#1E1E1E",
				primary: "#61DBFB",
				secondary: "#FF6B6B",
				accent: "#4CAF50",
				text: "#FFFFFF",
				"text-secondary": "#B3B3B3"
			},
			fontFamily: {
				sans: ["var(--font-inter)"],
				heading: ["var(--font-poppins)"]
			}
		}
	},
	plugins: []
};
export default config;
