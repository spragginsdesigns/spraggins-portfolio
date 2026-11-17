import React from "react";
import { bucketColor } from "./colors";

const BucketLegend: React.FC<{ buckets: string[]; className?: string; children?: React.ReactNode }> = ({
	buckets,
	className = "",
	children
}) => (
	<ul className={`flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground ${className}`}>
		{buckets.map((bucket) => (
			<li key={bucket} className="inline-flex items-center gap-1.5">
				<span
					aria-hidden="true"
					className="inline-block h-2.5 w-2.5 rounded-[2px]"
					style={{ backgroundColor: bucketColor(bucket) }}
				/>
				{bucket}
			</li>
		))}
		{children}
	</ul>
);

export default BucketLegend;
