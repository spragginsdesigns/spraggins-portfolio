"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";

export default function CopyLinkButton({ url }: { url: string }) {
	const [copied, setCopied] = useState(false);

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			// Clipboard unavailable (permissions/insecure context) - fail silently
		}
	};

	return (
		<button
			onClick={copy}
			className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-card/50 border border-border/30 text-sm text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
			aria-label="Copy link to this post"
		>
			{copied ? (
				<>
					<Check className="w-4 h-4 text-primary" />
					<span className="text-primary">Copied</span>
				</>
			) : (
				<>
					<Link2 className="w-4 h-4" />
					<span>Copy link</span>
				</>
			)}
		</button>
	);
}
