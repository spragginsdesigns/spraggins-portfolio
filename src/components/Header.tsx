import React from "react";
import Link from "next/link";
import Image from "next/image";

const Header: React.FC = () => {
	return (
		<header className="bg-surface text-text shadow-md fixed w-full z-10">
			<div className="container mx-auto px-4 py-3 flex justify-between items-center">
				<Link href="/" className="flex items-center">
					<Image
						src="https://spraggins-designs.s3.us-east-1.amazonaws.com/images/sd-logo.webp"
						alt="Spraggins Designs Logo"
						width={40}
						height={40}
						className="mr-2"
					/>
					<span className="text-2xl font-heading font-bold text-primary">
						Spraggins Designs
					</span>
				</Link>
				<nav>
					<ul className="flex space-x-6">
						{["Home", "About", "Projects", "Skills", "Contact"].map((item) => (
							<li key={item}>
								<Link
									href={item === "Home" ? "/" : `#${item.toLowerCase()}`}
									className="hover:text-primary transition-colors text-lg font-medium"
								>
									{item}
								</Link>
							</li>
						))}
					</ul>
				</nav>
			</div>
		</header>
	);
};

export default Header;
