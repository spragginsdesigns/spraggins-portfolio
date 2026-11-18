"use client";

import { useEffect } from "react";

// WebMCP: when the visitor's browser exposes document.modelContext, register
// the portfolio's read-only tools so their own agent can look up Austin's
// work directly. Browsers without it skip this entirely, including the fetch.

interface ToolDescriptor {
	name: string;
	description: string;
	inputSchema: Record<string, unknown>;
}

interface PageTool extends ToolDescriptor {
	annotations: { readOnlyHint: boolean; untrustedContentHint: boolean; consequentialHint: boolean };
	execute: (input: unknown, context: { signal: AbortSignal }) => Promise<string>;
}

interface ModelContext {
	registerTool(tool: PageTool, options: { signal: AbortSignal }): void | Promise<void>;
}

const ENDPOINT = "/api/portfolio-tools";

function isDescriptor(value: unknown): value is ToolDescriptor {
	if (typeof value !== "object" || value === null) return false;
	const tool = value as Record<string, unknown>;
	return typeof tool.name === "string" && typeof tool.description === "string" && typeof tool.inputSchema === "object" && tool.inputSchema !== null;
}

export function usePortfolioWebMcp() {
	useEffect(() => {
		const context = (document as Document & { modelContext?: ModelContext }).modelContext
			?? (navigator as Navigator & { modelContext?: ModelContext }).modelContext;
		if (!context?.registerTool) return;
		const lifecycle = new AbortController();

		void fetch(ENDPOINT, { signal: lifecycle.signal })
			.then((response) => response.ok ? response.json() : null)
			.then((body: { tools?: unknown } | null) => {
				const tools = Array.isArray(body?.tools) ? body.tools.filter(isDescriptor) : [];
				for (const tool of tools) {
					try {
						void Promise.resolve(context.registerTool({
							...tool,
							// GitHub READMEs and store text pass through these results.
							annotations: { readOnlyHint: true, untrustedContentHint: true, consequentialHint: false },
							execute: async (input, { signal }) => {
								const response = await fetch(ENDPOINT, {
									method: "POST",
									headers: { "Content-Type": "application/json" },
									body: JSON.stringify({ name: tool.name, arguments: input }),
									signal: AbortSignal.any([signal, lifecycle.signal])
								});
								return JSON.stringify(await response.json());
							}
						}, { signal: lifecycle.signal })).catch(() => {
							// An experimental API failing to register must not affect the page.
						});
					} catch {
						// Unsupported runtime: the page works as usual.
					}
				}
			})
			.catch(() => undefined);

		return () => lifecycle.abort();
	}, []);
}
