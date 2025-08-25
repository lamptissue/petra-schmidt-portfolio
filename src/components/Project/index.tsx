import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { getDimensions } from "@/lib/getDimension";

import Chevron from "../Chevron";
import Video from "../Video";
import Text from "../Text";
import Sidebar from "../Sidebar";

import { Cross, Arrow } from "../Icons";

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

	const handleModal = () => setIsModalOpen((prevState) => !prevState);

	return (
		<>
			<section
				className={`project__container ${
					isPortrait ? "project__container--portrait" : "project__container--landscape"
				} ${blok.modalDetail && blok.modalDetail.length >= 1 ? "background__click" : ""} `}
				data-section
				id={blok.projectTitle}
				onClick={blok.modalDetail && blok.modalDetail.length >= 1 && handleModal}
				ref={ref}>
				<div
					className={`project__title-wrapper  ${
						blok.modalDetail && blok.modalDetail.length >= 1 && "active-project-link"
					}`}>
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
					placeholder='blur'
					blurDataURL={blur}
				/>
			</section>
			{isModalOpen && <ProjectModal handleModal={handleModal} blok={blok} />}
		</>
	);
}

export function ProjectModal({ handleModal, blok }: { handleModal: any; blok: any }) {
	const [currentSlide, setCurrentSlide] = useState(1);
	const [hideArrowCursor, setHideArrowCursor] = useState(false);
	const [windowSide, setWindowSide] = useState("");

	const cursor = useRef<HTMLDivElement>(null);

	const combinedArray: any = [];

	if (blok.modalDetail) {
		blok.modalDetail.forEach((item: any) => {
			if (item.component === "projectModalImage") {
				combinedArray.push({
					type: "image",
					id: item.image.id,
					filename: item.image.filename,
					alt: item.image.alt,
				});
			} else if (item.component === "projectModalText") {
				const textLength = item.text.length > 1000 ? "long" : "short";
				combinedArray.push({
					...item,
					type: "text",
					textLength,
				});
			} else if (item.component === "multiasset") {
				item.image.forEach((img: any) => {
					combinedArray.push({
						type: "image",
						id: img.id,
						filename: img.filename,
					});
				});
			} else if (item.component === "project_modal_video") {
				const embedUrl = getEmbedUrl(item.video);
				combinedArray.push({
					type: "video",
					videoUrl: embedUrl,
				});
			}
		});
	}

	function getEmbedUrl(url: any) {
		const videoId = url.split("v=")[1] || url.split("/").pop();
		return `https://www.youtube.com/embed/${videoId}`;
	}

	if (
		blok.rich_text.content &&
		blok.rich_text.content.some((node: any) => {
			return node.content && node.content.some((innerNode: any) => innerNode.text && innerNode.text.trim() !== "");
		})
	) {
		combinedArray.push({
			type: "richText",
			data: blok.rich_text.content,
		});
	}

	const currentItem = combinedArray[currentSlide - 1];

	let textContent = null;

	if (currentItem.type === "text") {
		if (currentItem.textLength === "short") {
			const paragraphs = currentItem.text.split("\n\n");

			textContent = paragraphs.map((item: any, index: any) => (
				<p key={index} className={`${index.length < 1 ? "paragraph" : ""} align-${index % 2 ? "right" : "left"}`}>
					{item}
				</p>
			));
		} else {
			textContent = <p className='paragraph align-left'>{currentItem.text}</p>;
		}
	}

	const handleNextSlide = () =>
		currentSlide > combinedArray.length - 1 ? setCurrentSlide(1) : setCurrentSlide(currentSlide + 1);

	const handlePreviousSlide = () =>
		currentSlide > 1 ? setCurrentSlide(currentSlide - 1) : setCurrentSlide(combinedArray.length);

	const handleMouseArrow = (event: any) => {
		event.clientX > window.innerWidth / 2 ? setWindowSide("right") : setWindowSide("left");

		if (cursor.current) {
			cursor.current.style.top = event.clientY + "px";
			cursor.current.style.left = event.clientX + "px";
		}
	};

	useEffect(() => {
		document.addEventListener("mousemove", handleMouseArrow);
		return () => {
			document.removeEventListener("mousemove", handleMouseArrow);
		};
	}, []);

	return (
		<div className='project-modal__container '>
			<div
				className='project-modal__cross'
				aria-label='close'
				onClick={handleModal}
				onMouseEnter={() => setHideArrowCursor(true)}
				onMouseLeave={() => setHideArrowCursor(false)}>
				<Cross />
			</div>
			<div className='project-modal__wrapper'>
				<Sidebar blok={blok} combinedArray={combinedArray} currentSlide={currentSlide} />
				<div className='project-modal__content--wrapper'>
					<div className='left-arrow arrow__container' onClick={handlePreviousSlide} aria-label='Previous slide'></div>
					<div className='right-arrow arrow__container' onClick={handleNextSlide} aria-label='Next slide'></div>

					<div className='project-modal__content--container'>
						{combinedArray.length > 0 && (
							<>
								{currentItem.type === "image" && (
									<Image
										src={`${currentItem.filename}/m/`}
										fill={true}
										style={{
											objectFit: "contain",
										}}
										alt={currentItem.alt || ""}
									/>
								)}

								{currentItem.type === "video" && (
									<Video src={currentItem.videoUrl} setHideArrowCursor={setHideArrowCursor} />
								)}

								{(currentItem.type === "text" || currentItem.type === "richText") && (
									<Text
										textContent={currentItem.type === "text" ? textContent : ""}
										blok={currentItem.type === "richText" ? blok : ""}
									/>
								)}
							</>
						)}
					</div>

					<Chevron options={"left-boy"} onClick={handlePreviousSlide} aria-label='Previous slide' />
					<Chevron options={"right-boy"} onClick={handleNextSlide} aria-label='Next slide' />

					{!hideArrowCursor && (
						<div className={`cursor ${windowSide === "right" ? "cursor-flipped" : ""}`} ref={cursor}>
							<Arrow />
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
