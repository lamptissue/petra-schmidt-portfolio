import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { getDimensions } from "@/lib/getDimension";
import Sidebar from "../Sidebar";
import { Cross } from "../Icons";

import "./styles.scss";

export default function Project({ blok, setActiveItem }: { blok: any; setActiveItem: any }) {
	const TINY_PIXEL = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";

	const [blur, setBlur] = useState<string>(TINY_PIXEL);

	const ref = useRef(null);

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

	const callbackFunction = (entries: any) => {
		const [entry] = entries;
		if (entry.isIntersecting) {
			setActiveItem(blok.projectTitle);
		}
	};
	const options = {
		root: null,
		rootMargin: "0px",
		threshold: 0.5,
	};

	const isPortrait = getDimensions(imageSrc);
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(callbackFunction, options);
		if (ref.current) observer.observe(ref.current);

		return () => {
			if (ref.current) observer.unobserve(ref.current);
		};
	}, [ref, options]);

	const handleOpenModal = () => {
		setIsModalOpen(true);

		document.body.style.position = "fixed";
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		document.body.style.position = "";
	};

	return (
		<>
			<section
				className={`project__container ${
					isPortrait ? "project__container--portrait" : "project__container--landscape"
				} ${blok.modalDetail && blok.modalDetail.length >= 1 ? "background__click" : ""} `}
				data-section
				id={blok.projectTitle}
				onClick={blok.modalDetail && blok.modalDetail.length >= 1 ? handleOpenModal : undefined}
				ref={ref}>
				<div className='project__title-wrapper'>
					<h1 className='text-h3' id={blok.projectTitle}>
						{blok.projectTitle} {blok.modalDetail.length}
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
					placeholder='blur'
					blurDataURL={blur}
				/>
			</section>
			{isModalOpen && <ProjectModal handleCloseModal={handleCloseModal} blok={blok} />}
		</>
	);
}

export function ProjectModal({ handleCloseModal, blok }: { handleCloseModal: any; blok: any }) {
	return (
		<div className='project-modal__container '>
			<div className='project-modal__cross' aria-label='close' onClick={handleCloseModal}>
				<Cross />
			</div>
			<div className='project-modal__wrapper'>
				<Sidebar blok={blok} />
				<div className='content'></div>
			</div>
		</div>
	);
}
