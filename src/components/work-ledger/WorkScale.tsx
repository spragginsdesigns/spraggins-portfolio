"use client";

import React from "react";
import { motion } from "framer-motion";
import { FMT } from "@/lib/stats";

// Every figure comes from the verified stats module, never typed in here, so
// this strip stays in step with the rest of the site. Results and scale only.
const ITEMS: { value: string; label: string }[] = [
	{ value: FMT.fleetIssues, label: `issues closed by my agent fleet since ${FMT.fleetSince}` },
	{ value: FMT.fleetPerDay, label: "issues closed per day by the fleet" },
	{ value: FMT.apiHandlers, label: "API handlers in production" },
	{ value: FMT.postgresTables, label: "database tables" },
	{ value: FMT.productClients, label: "product clients shipped" },
	{ value: FMT.sports, label: "sports covered" }
];

const WorkScale: React.FC = () => (
	<motion.div
		initial={{ opacity: 0, y: 16 }}
		whileInView={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5 }}
		viewport={{ once: true }}
		className="rounded-2xl border border-border/50 bg-card/30 p-6 backdrop-blur-sm md:p-8"
	>
		<div className="mb-7">
			<h3 className="font-heading text-xl font-bold md:text-2xl">What those hours go into</h3>
			<p className="mt-1 text-sm text-muted-foreground">
				Running the LineCrush production platform and an autonomous agent fleet, end to end.
			</p>
		</div>
		<dl className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
			{ITEMS.map((item) => (
				<div key={item.label} className="flex flex-col-reverse justify-end border-l border-primary/30 pl-4">
					<dt className="mt-1 text-xs leading-snug text-muted-foreground">{item.label}</dt>
					<dd className="font-heading text-2xl font-bold text-foreground md:text-3xl">{item.value}</dd>
				</div>
			))}
		</dl>
	</motion.div>
);

export default WorkScale;
