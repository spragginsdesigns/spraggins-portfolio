/**
 * Single source of truth for the Spraggins Designs local-business website
 * offer. Both the homepage section and the /local-websites page read from
 * here so the price, phone number, and copy never drift apart.
 */

export const LOCAL_SITES = {
	businessName: "Spraggins Designs",
	phoneDisplay: "559-818-0467",
	phoneTel: "tel:+15598180467",
	phoneSms: "sms:+15598180467",
	email: "spragginsdesigns@gmail.com",
	city: "Fresno",
	region: "CA",
	yearsDisplay: "almost 10 years",
	buildPrice: "$379",
	buildPriceValue: "379",
	hostingPrice: "$19 a month",
	hostingPriceValue: "19",
	sampleUrl: "https://gievs.com",
	sampleLabel: "gievs.com",
	pageUrl: "https://www.spragginsdesigns.xyz/local-websites"
} as const;

export const SAMPLE_SITES = [
	{
		name: "Sample site",
		url: "https://gievs.com",
		label: "gievs.com",
		note: "The base sample every demo starts from"
	},
	{
		name: "Walters & Associates",
		url: "https://gievs.com/walters-associates",
		label: "gievs.com/walters-associates",
		note: "Professional services demo"
	},
	{
		name: "Woodward Park Optometric Group",
		url: "https://gievs.com/woodward-park-optometric-group",
		label: "gievs.com/woodward-park-optometric-group",
		note: "Medical office demo"
	}
] as const;

export const CREDIBILITY_ITEMS = [
	`${LOCAL_SITES.city} based`,
	`${LOCAL_SITES.yearsDisplay} building sites for local businesses`,
	`Call or text ${LOCAL_SITES.phoneDisplay}`
] as const;

export interface OfferItem {
	title: string;
	description: string;
}

export const WHAT_YOU_GET: OfferItem[] = [
	{
		title: "Built from your listings and photos",
		description:
			"I start with your Google listing, your photos, your hours, and the services you already offer. You don't have to write anything from scratch."
	},
	{
		title: "Reads right on a phone",
		description:
			"Most of your customers will find you from their phone, so I design for the phone first and make sure it holds up on a desktop too."
	},
	{
		title: "Google friendly",
		description:
			"Fast, clean pages with your name, address, hours, and services marked up the way Google wants to see them."
	},
	{
		title: "Contact form to your email",
		description:
			"A customer fills out a short form and it lands in your inbox. Tap to call and tap to text on every page."
	},
	{
		title: "Domain, hosting, and SSL handled",
		description:
			"Your domain name, the hosting, and the padlock in the address bar are all covered by hosting. Nothing for you to set up."
	},
	{
		title: "No contract",
		description:
			"Month to month. If you ever want to leave, the site and the domain are yours and I'll help you move them."
	}
];

export const HOW_IT_LANDS: OfferItem[] = [
	{
		title: "Text me your business name",
		description:
			"Or fill out the short form below. That's all I need to get started."
	},
	{
		title: "I build it and send you a link",
		description:
			"I put the site together from your listings and photos and send you a link to look over on your phone."
	},
	{
		title: "You approve it and it goes live",
		description:
			"Once you're happy with it, it goes live on your domain. Usually within a day."
	}
];

export const FAQ_ITEMS: OfferItem[] = [
	{
		title: "Do I own the website?",
		description:
			"Yes. The site, the domain, the photos, and the words on the page are yours. If you ever want to leave, I'll hand over the files and point the domain wherever you tell me."
	},
	{
		title: "Can I use a domain I already have?",
		description:
			"Yes. If you already own a domain, I'll connect it. If you don't, I'll register one for you and it's covered by the monthly hosting."
	},
	{
		title: "What if I want changes later?",
		description:
			"Text me. Small changes like new hours or a photo swap are quick. Anything bigger, like a whole new page, I'll quote up front before I start."
	},
	{
		title: "What does the hosting cover?",
		description: `${LOCAL_SITES.hostingPrice} covers your domain, hosting, SSL (the padlock), the contact form, and keeping the site online. No contract, cancel any time.`
	}
];
