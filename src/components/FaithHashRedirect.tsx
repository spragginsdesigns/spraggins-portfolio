"use client";

import { useEffect } from "react";

// The testimony used to be a homepage section. The shipped SureWord apps and older
// links still point at /#faith, and a hash never reaches the server, so the
// homepage forwards those visitors to the page itself.
const MOVED: Record<string, string> = {
	"#faith": "/faith",
	"#my-testimony": "/faith#my-testimony"
};

export default function FaithHashRedirect() {
	useEffect(() => {
		const target = MOVED[window.location.hash];
		if (target) window.location.replace(target);
	}, []);
	return null;
}
