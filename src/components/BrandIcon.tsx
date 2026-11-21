import Image from "next/image";

const icons = {
	linecrush: "linecrush.webp",
	sureword: "sureword.webp",
	studio: "studio.webp",
	"two-cities": "two-cities.webp",
	"hoe-ink": "hoe-ink.png",
	gievs: "gievs.webp",
	steam: "steam.ico",
	itch: "itch-icon.svg",
	github: "github.svg",
	linkedin: "linkedin.ico",
	gitwork: "gitwork.svg",
	x: "x.png",
	npm: "npm.svg",
	chatgpt: "chatgpt.svg",
	google: "google.ico"
} as const;

type Brand = keyof typeof icons;

const hosts: Record<string, Brand> = {
	"linecrush.com": "linecrush",
	"games.linecrush.com": "studio",
	"sureword.app": "sureword",
	"twocitiesoffroad.com": "two-cities",
	"hoeink.vercel.app": "hoe-ink",
	"gievs.com": "gievs",
	"store.steampowered.com": "steam",
	"spragginsdesigns.itch.io": "itch",
	"itch.io": "itch",
	"github.com": "github",
	"linkedin.com": "linkedin",
	"gitwork.dev": "gitwork",
	"twitter.com": "x",
	"x.com": "x",
	"npmjs.com": "npm",
	"chatgpt.com": "chatgpt",
	"google.com": "google",
	"share.google": "google"
};

const portfolioPaths: Record<string, Brand> = {
	"/work/linecrush": "linecrush",
	"/work/sureword": "sureword",
	"/work/game-development": "studio",
	"/games": "studio"
};

const storeListings = new Map<string, Brand>([
	["id6774968606", "linecrush"],
	["id6820260211", "sureword"],
	["com.linecrush.android", "linecrush"],
	["com.spragginsdesigns.sureword", "sureword"]
]);

function getDestination(href: string) {
	try {
		return new URL(href, "https://www.spragginsdesigns.xyz");
	} catch {
		return null;
	}
}

export function BrandIcon({ href, size = 20 }: { href: string; size?: number }) {
	const url = getDestination(href);
	if (!url) return null;
	const host = url.hostname.replace(/^www\./, "");
	const brand = findBrand(url, host);
	if (!brand) return null;

	return (
		<Image
			src={`/images/brands/${icons[brand]}`}
			alt=""
			width={size}
			height={size}
			unoptimized
			className="shrink-0 object-contain"
			style={{ width: size, height: size }}
		/>
	);
}

function findBrand(url: URL, host: string): Brand | undefined {
	if (host === "apps.apple.com") return storeListings.get(url.pathname.split("/").pop() ?? "");
	if (host === "play.google.com") return storeListings.get(url.searchParams.get("id") ?? "");
	const destinations = host === "spragginsdesigns.xyz" ? portfolioPaths : hosts;
	const key = host === "spragginsdesigns.xyz" ? url.pathname : host;
	return Object.prototype.hasOwnProperty.call(destinations, key) ? destinations[key] : undefined;
}

const storeBadges = {
	"apps.apple.com": { file: "app-store.svg", width: 120, label: "Download on the App Store" },
	"play.google.com": { file: "google-play.png", width: 135, label: "Get it on Google Play" },
	"store.steampowered.com": { file: "steam.svg", width: 131, label: "View on Steam" },
	"spragginsdesigns.itch.io": { file: "itch.svg", width: 130, label: "Available on itch.io" }
} as const;

function getStoreBadge(href: string) {
	const host = getDestination(href)?.hostname;
	return host && Object.prototype.hasOwnProperty.call(storeBadges, host)
		? storeBadges[host as keyof typeof storeBadges]
		: null;
}

export function StoreBadge({ href, product, className }: { href: string; product: string; className?: string }) {
	const badge = getStoreBadge(href);
	if (!badge) return null;

	const googlePlay = badge.file === "google-play.png";

	return (
		<a href={href} aria-label={`${product} · ${badge.label}`} className={className}>
			<span className="flex h-10 items-center justify-center overflow-hidden" style={{ width: badge.width }}>
				<Image
					src={`/images/brands/${badge.file}`}
					alt=""
					width={googlePlay ? 154 : badge.width}
					height={googlePlay ? 60 : 40}
					unoptimized
					className="max-w-none shrink-0"
				/>
			</span>
		</a>
	);
}
