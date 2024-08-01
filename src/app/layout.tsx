import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Layout from "../components/Layout";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
	weight: ["400", "500", "700"],
	subsets: ["latin"],
	variable: "--font-poppins"
});

export const metadata: Metadata = {
	title: "Austin Spraggins - Portfolio",
	description: "The Official Portfolio of Austin Spraggins"
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={`${inter.variable} ${poppins.variable}`}>
			<body className="font-sans bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
				<Layout>{children}</Layout>
			</body>
		</html>
	);
}
