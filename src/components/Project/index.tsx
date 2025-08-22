import { useEffect, useState } from "react";
import Image from "next/image";

import "./styles.scss";

const TINY_PIXEL = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";

export default function Project({ blok }: { blok: any }) {
	const [blur, setBlur] = useState<string>(TINY_PIXEL);
	const imageSrc = `${blok.backgroundImage.filename}/m/`;

	useEffect(() => {
		let aborted = false;

		// Ask Storyblok for a tiny version (16px wide, low quality, webp if possible)
		const tinyUrl = `${imageSrc}16x0/filters:quality(20):format(webp)`;

		(async () => {
			try {
				const res = await fetch(`/api/blur?url=${encodeURIComponent(tinyUrl)}`);
				if (!res.ok) return;
				const { base64 } = await res.json();
				if (!aborted && typeof base64 === "string") setBlur(base64);
			} catch {}
		})();

		return () => {
			aborted = true;
		};
	}, [imageSrc]);

	return (
		<section className='project__container' data-section id={blok.projectTitle}>
			<div className='project__title-wrapper'>
				<h1 className='text-h3' id={blok.projectTitle}>
					{blok.projectTitle}
				</h1>
				<span>{blok?.location}</span>
				<br />
				<span>
					{blok?.artist} - {blok?.year}
				</span>
			</div>

			<Image
				src={imageSrc}
				alt={blok.projectTitle}
				width={1600}
				height={1067}
				className='project__image'
				placeholder='blur'
				blurDataURL={blur}
			/>
		</section>
	);
}
