import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				{/* Favicon Links */}
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="../../public/apple-icon-180x180.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="../../public/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="../../public/favicon-16x16.png"
				/>
				<link rel="manifest" href="/site.webmanifest" />
				<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
				<meta name="msapplication-TileColor" content="#da532c" />
				<meta name="theme-color" content="#ffffff" />

				{/* Primary Meta Tags */}
				<meta charSet="UTF-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
				/>
				<meta
					name="description"
					content="The Official Portfolio of Austin Spraggins"
				/>
				<meta name="author" content="Austin Spraggins" />
				<meta
					name="keywords"
					content="Austin Spraggins, Spraggins, Spraggins Designs, Austin Fresno CA, Spraggins Fresno CA, Austin Spraggins Fresno CA, Austin Fresno, Fresno Austin, Fresno Spraggins, Web Development, Full Stack Developer, React, Next.js, JavaScript, TypeScript, Software Engineer, Fresno CA, Portfolio, Austin Spraggins Portfolio, Austin Spraggins Resume, Austin Spraggins"
				/>

				{/* Open Graph / Facebook Meta Tags */}
				<meta property="og:url" content="https://www.spragginsdesigns.xyz/" />
				<meta property="og:type" content="website" />
				<meta property="og:title" content="Austin Spraggins - Portfolio" />
				<meta
					property="og:description"
					content="The Official Portfolio of Austin Spraggins"
				/>
				<meta
					property="og:image"
					content="https://opengraph.b-cdn.net/production/images/f29fdab1-e9de-40a5-a182-e4a65bc87c23.png?token=S8IzszoBZ_jScizh7hmeipzGo8t1TRrVUrbpzh36BDo&height=372&width=1200&expires=33258879249"
				/>

				{/* Twitter Meta Tags */}
				<meta name="twitter:card" content="summary_large_image" />
				<meta property="twitter:domain" content="spragginsdesigns.xyz" />
				<meta
					property="twitter:url"
					content="https://www.spragginsdesigns.xyz/"
				/>
				<meta name="twitter:title" content="Austin Spraggins - Portfolio" />
				<meta
					name="twitter:description"
					content="The Official Portfolio of Austin Spraggins"
				/>
				<meta
					name="twitter:image"
					content="https://opengraph.b-cdn.net/production/images/f29fdab1-e9de-40a5-a182-e4a65bc87c23.png?token=S8IzszoBZ_jScizh7hmeipzGo8t1TRrVUrbpzh36BDo&height=372&width=1200&expires=33258879249"
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}