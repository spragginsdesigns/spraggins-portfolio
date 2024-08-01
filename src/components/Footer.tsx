import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
	return (
		<footer className="bg-surface text-text py-8">
			<div className="container mx-auto px-4">
				<div className="flex flex-col md:flex-row justify-between items-center">
					<div className="mb-4 md:mb-0">
						<p>&copy; 2024 Spraggins Designs. All rights reserved.</p>
					</div>
					<div className="flex space-x-4">
						<Link href="/" className="hover:text-primary transition-colors">
							Home
						</Link>
						<Link
							href="#about"
							className="hover:text-primary transition-colors"
						>
							About
						</Link>
						<Link
							href="#projects"
							className="hover:text-primary transition-colors"
						>
							Projects
						</Link>
						<Link
							href="#skills"
							className="hover:text-primary transition-colors"
						>
							Skills
						</Link>
						<Link
							href="#contact"
							className="hover:text-primary transition-colors"
						>
							Contact
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
