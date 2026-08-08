// Date-only strings ("YYYY-MM-DD") must render in UTC or they slide back a
// day for viewers west of UTC. Client-safe: no fs/path imports.
export function formatDate(
	dateString: string,
	style: "short" | "long" = "long"
): string {
	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: style === "short" ? "short" : "long",
		day: "numeric",
		timeZone: "UTC"
	});
}
