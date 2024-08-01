import React from "react";
import Header from "./Header";

interface LayoutProps {
	children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<main className="flex-grow">{children}</main>
			{/* Footer can be added here later */}
		</div>
	);
};

export default Layout;
