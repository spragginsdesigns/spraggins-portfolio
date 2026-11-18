"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FMT, STATS } from "@/lib/stats";
import { formatLongDate } from "@/lib/work-ledger";

const ITEMS: { value: string; label: string }[] = [
	{ value: FMT.fleetIssues, label: "issues closed" },
	{ value: FMT.fleetJobsCommits, label: "jobs with shipped commits" },
	{ value: FMT.fleetCompletion, label: "of admitted work closed" }
];

const WorkScale: React.FC = () => (
	<motion.section
		id="fleet-output"
		aria-labelledby="fleet-output-heading"
		initial={{ opacity: 0, y: 16 }}
		whileInView={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5 }}
		viewport={{ once: true }}
		className="mt-10 rounded-2xl border border-primary/20 bg-card/30 p-6 backdrop-blur-sm md:p-8"
	>
		<div className="mb-6">
			<h3 id="fleet-output-heading" className="font-heading text-xl font-bold md:text-2xl">
				C2 and the LineCrush agent fleet
			</h3>
			<p className="mt-1 text-sm text-muted-foreground">
				I built the LineCrush agent fleet and C2, the system I use to run it. The fleet investigates issues,
				builds and verifies changes, and ships them to production.
			</p>
		</div>
		<dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
			{ITEMS.map((item) => (
				<div key={item.label} className="flex flex-col-reverse justify-end border-l border-primary/30 pl-4">
					<dt className="mt-1 text-xs leading-snug text-muted-foreground">{item.label}</dt>
					<dd className="font-heading text-2xl font-bold text-foreground md:text-3xl">{item.value}</dd>
				</div>
			))}
		</dl>
		<p className="mt-6 text-xs leading-relaxed text-muted-foreground">
			Fleet job ledger from {FMT.fleetSince} through {formatLongDate(STATS.verifiedDate)}.{" "}
			<Link href="/blog/2026-08-08-no-humans-in-the-merge-loop" className="font-medium text-primary underline-offset-4 hover:underline">
				How the fleet ships to production
			</Link>
		</p>
	</motion.section>
);

export default WorkScale;
