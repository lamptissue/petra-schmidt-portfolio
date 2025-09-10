"use client";
import { useRef, useState, useEffect } from "react";
import { getDimensions } from "@/lib/getDimension";
import { useBlurBase } from "../hook/useBlurBase";
import Image from "next/image";

import Video from "../Video";
import Text from "../Text";
import Sidebar from "../Sidebar";
import { Cross, Arrow, Chevron } from "../Icons";

import "./styles.scss";

export default function Project({ blok, setActiveItem }: { blok: any; setActiveItem: any }) {
	const ref = useRef(null);

	const imageSrc = `${blok.backgroundImage.filename}/m/`;

	const blurImage = useBlurBase(blok.backgroundImage.filename);

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

				<div className={`project__content--image-container ${isPortrait && "portrait-image"}`}>
					<Image
						src={imageSrc}
						alt={blok.projectTitle}
						style={{
							objectFit: `${isPortrait ? "contain" : "cover"}`,
							objectPosition: "center",
						}}
						fill={true}
						sizes={`(max-width: 768px) ${isPortrait ? "45vw" : "100vw"}, ${isPortrait ? "45vw" : "100vw"}`}
						placeholder='blur'
						blurDataURL={blurImage}
					/>
				</div>
			</section>
			{isModalOpen && <ProjectModal handleModal={handleModal} blok={blok} />}
		</>
	);
}

export function ProjectModal({ handleModal, blok }: { handleModal: any; blok: any }) {
	const [currentSlide, setCurrentSlide] = useState(1);
	const [hideArrowCursor, setHideArrowCursor] = useState(false);
	const [windowSide, setWindowSide] = useState("");
	const [isNarrowScreen, setIsNarrowScreen] = useState(false);

	useEffect(() => {
		const mediaWatcher = window.matchMedia("(max-width: 768px)");

		const updateIsNarrowScreen = (e: any) => {
			setIsNarrowScreen(e.matches);
		};

		mediaWatcher.addEventListener("change", updateIsNarrowScreen);

		updateIsNarrowScreen(mediaWatcher);
		return function cleanup() {
			mediaWatcher.removeEventListener("change", updateIsNarrowScreen);
		};
	});

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
				combinedArray.push({
					text: item.text,
					type: "text",
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
				combinedArray.push({ type: "video", videoUrl: embedUrl });
			}
		});
	}

	const hasRichText = blok?.rich_text?.content?.some((node: any) =>
		node?.content?.some((inner: any) => inner?.text?.trim() !== "")
	);

	if (hasRichText) {
		combinedArray.push({ type: "richText" });
	}

	function getEmbedUrl(url: any) {
		const videoId = url.split("v=")[1] || url.split("/").pop();
		return `https://www.youtube.com/embed/${videoId}`;
	}

	const currentItem = combinedArray[currentSlide - 1];

	const blurImage = useBlurBase(currentItem.type === "image" ? currentItem.filename : undefined);

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
		<div className='project-modal__container'>
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
				{!isNarrowScreen && (
					<>
						<div
							className='left-arrow arrow__container'
							onClick={handlePreviousSlide}
							aria-label='Previous slide'></div>
						<div className='right-arrow arrow__container' onClick={handleNextSlide} aria-label='Next slide'></div>
					</>
				)}
				{combinedArray.length > 0 && (
					<>
						<div className='project-modal__content--container'>
							{currentItem.type === "image" && (
								<Image
									src={`${currentItem.filename}/m/fit-in/1600x0/filters:format(webp)`}
									fill={true}
									style={{
										objectFit: "contain",
									}}
									alt={currentItem.alt || ""}
									placeholder='blur'
									blurDataURL={blurImage}
								/>
							)}
							{currentItem.type === "video" && (
								<Video src={currentItem.videoUrl} setHideArrowCursor={setHideArrowCursor} />
							)}

							{(currentItem.type === "text" || currentItem.type === "richText") && (
								<Text textContent={currentItem.type === "text" ? currentItem.text : undefined} blok={blok} />
							)}
						</div>
					</>
				)}

				{isNarrowScreen && (
					<>
						<div onClick={handlePreviousSlide} className='chevron-container left-arrow '>
							<div className='chevron'>
								<Chevron />
							</div>
						</div>

						<div onClick={handleNextSlide} className='chevron-container right-arrow'>
							<div className='chevron'>
								<Chevron />
							</div>
						</div>
					</>
				)}
				{!hideArrowCursor && !isNarrowScreen && (
					<div className={`cursor ${windowSide === "right" ? "cursor-flipped" : ""}`} ref={cursor}>
						<Arrow />
					</div>
				)}
			</div>
		</div>
	);
}
