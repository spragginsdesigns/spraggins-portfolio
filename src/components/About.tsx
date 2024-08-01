import React from "react";
import Image from "next/image";

const About: React.FC = () => {
	return (
		<section id="about" className="bg-surface text-text py-20">
			<div className="container mx-auto px-4">
				<h2 className="text-4xl font-heading font-bold mb-12 text-center">
					About Me
				</h2>
				<div className="flex flex-col md:flex-row items-center justify-between">
					<div className="md:w-1/2 mb-8 md:mb-0">
						<Image
							src="/images/sd-logo-banner.png"
							alt="Spraggins Designs Banner"
							width={600}
							height={300}
							className="rounded-lg shadow-xl"
						/>
					</div>
					<div className="md:w-1/2 md:pl-12">
						<p className="text-lg mb-6 text-text-secondary">
							Hello, I&apos;m Austin Spraggins, a passionate web developer and
							security analyst based in California. With a strong background in
							both programming and cybersecurity, I bring a unique perspective
							to creating robust and secure web applications.
						</p>
						<p className="text-lg mb-6 text-text-secondary">
							My journey in tech started with a fascination for how things work
							in the digital world. This curiosity led me to pursue an Associate
							Degree in Web Development and I&apos;m currently working towards a
							Bachelor&apos;s in Computer Science.
						</p>
						<p className="text-lg text-text-secondary">
							When I&apos;m not coding or analyzing security protocols, you can
							find me creating content for my YouTube channel or spending
							quality time with my family. I&apos;m always excited to take on
							new challenges and contribute to innovative projects.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
};

export default About;
