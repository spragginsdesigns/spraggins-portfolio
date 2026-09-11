import React from "react";
import { MessageSquare, Phone } from "lucide-react";
import { LOCAL_SITES } from "@/lib/local-websites";

/**
 * Primary call-to-action pair. Both links carry the number so an owner
 * reading on a phone can tap straight into a call or a text thread.
 */
const CallTextButtons: React.FC<{ className?: string }> = ({
	className = ""
}) => (
	<div className={`flex flex-col gap-3 sm:flex-row sm:flex-wrap ${className}`}>
		<a
			href={LOCAL_SITES.phoneTel}
			className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-semibold text-background transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25"
		>
			<Phone className="h-4 w-4" />
			Call {LOCAL_SITES.phoneDisplay}
		</a>
		<a
			href={LOCAL_SITES.phoneSms}
			className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-primary/40 bg-card/60 px-6 py-3 text-base font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/70"
		>
			<MessageSquare className="h-4 w-4" />
			Text {LOCAL_SITES.phoneDisplay}
		</a>
	</div>
);

export default CallTextButtons;
