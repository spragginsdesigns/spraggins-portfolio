import Image from "next/image";
import styles from "./Portfolio.module.css";

export const lineCrushRelease = {
	category: "Sports research",
	platform: "Native iPad app",
	image: "/images/work/editorial-linecrush.webp",
	width: 825,
	height: 1100,
	alt: "The shipped LineCrush native iPad app, with a historical player-statistics chart and research navigation",
};

type ReleaseFrameProps = typeof lineCrushRelease & { priority?: boolean };

export default function ReleaseFrame({ category, platform, image, width, height, alt, priority }: ReleaseFrameProps) {
	return (
		<div className={styles.previewFrame}>
			<div className={styles.previewMargin} aria-hidden="true"><span>{category}</span><span>{platform}</span></div>
			<Image src={image} alt={alt} width={width} height={height}
				priority={priority} sizes="(max-width: 650px) 270px, (max-width: 1000px) 330px, 380px"
				className={styles.previewImage} />
		</div>
	);
}
