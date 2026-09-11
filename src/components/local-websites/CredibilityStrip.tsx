import React from "react";
import { BadgeCheck, MapPin, Phone, Wrench } from "lucide-react";
import { LOCAL_SITES } from "@/lib/local-websites";

const items = [
	{
		icon: <MapPin className="h-3.5 w-3.5" />,
		label: `${LOCAL_SITES.city}, ${LOCAL_SITES.region} based`
	},
	{
		icon: <Wrench className="h-3.5 w-3.5" />,
		label: `${LOCAL_SITES.yearsDisplay} building sites for local businesses`
	}
];

/**
 * One-line trust strip shared by the homepage section and /local-websites.
 * Wraps onto two lines at 375px instead of overflowing.
 */
const CredibilityStrip: React.FC<{ className?: string }> = ({
	className = ""
}) => (
	<div
		className={`flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-xs sm:text-sm ${className}`}
	>
		{items.map((item) => (
			<span
				key={item.label}
				className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-card/50 px-3 py-1.5 text-muted-foreground"
			>
				<span className="text-primary">{item.icon}</span>
				{item.label}
			</span>
		))}
		<a
			href={LOCAL_SITES.googleProfileUrl}
			target="_blank"
			rel="noopener noreferrer"
			className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-card/50 px-3 py-1.5 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
		>
			<span className="text-primary">
				<BadgeCheck className="h-3.5 w-3.5" />
			</span>
			Google Business Profile
		</a>
		<a
			href={LOCAL_SITES.phoneTel}
			className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 font-semibold text-primary transition-colors hover:bg-primary/20"
		>
			<Phone className="h-3.5 w-3.5" />
			Call or text {LOCAL_SITES.phoneDisplay}
		</a>
	</div>
);

export default CredibilityStrip;
