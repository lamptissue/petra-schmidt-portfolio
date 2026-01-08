"use client";
import { useRef, useState, useEffect, useMemo } from "react";
import Image from "next/image";

import { getDimensions } from "@/lib/getDimension";
import { useBlurBase } from "../hooks/useBlurBase";
import { useBodyOverflow } from "../hooks/useBodyOverflow";

import Video from "../Video";
import Text from "../Text";
import Sidebar from "../Sidebar";
import { Cross, Arrow, Chevron } from "../Icons";

import "./styles.scss";

type Asset = { filename: string; alt?: string; id?: string };
type ModalImage = { component: "projectModalImage"; image: Asset };
type ModalText = { component: "projectModalText"; text: string };
type ModalMulti = { component: "multiasset"; image: Asset[] };
type ModalVideo = { component: "project_modal_video"; video: string };
type ModalItem = ModalImage | ModalText | ModalMulti | ModalVideo;

type ProjectBlok = {
	_uid: string;
	projectTitle: string;
	location?: string;
	artist?: string;
	year?: number;
	backgroundImage: Asset;
	modalDetail?: ModalItem[];
	rich_text?: { [k: string]: unknown };
};

type ProjectProps = {
	blok: ProjectBlok;
	setActiveItem: (slug: string) => void;
	isFirst?: boolean;
};

export default function Project({ blok, setActiveItem, isFirst = false }: ProjectProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const ref = useRef<HTMLElement | null>(null);

	const imageSrc = `${blok.backgroundImage.filename}/m/`;
	const blurImage = useBlurBase(blok.backgroundImage.filename);
	const isPortrait = getDimensions(imageSrc);

	const callbackFunction: IntersectionObserverCallback = (entries) => {
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

	useEffect(() => {
		const observer = new IntersectionObserver(callbackFunction, options);
		if (ref.current) observer.observe(ref.current);

		return () => {
			if (ref.current) observer.unobserve(ref.current);
		};
	}, [ref, options]);

	useBodyOverflow(isModalOpen);

	const handleModal = () => setIsModalOpen((prevState) => !prevState);
	const hasModal = (blok.modalDetail?.length ?? 0) >= 1;

	return (
		<>
			<section
				className={`project__container ${
					isPortrait ? "project__container--portrait" : "project__container--landscape"
				} ${blok.modalDetail && blok.modalDetail.length >= 1 ? "background__click" : ""} `}
				data-section
				id={blok.projectTitle}
				onClick={hasModal ? handleModal : undefined}
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
						priority={isFirst}
					/>
				</div>
			</section>
			{isModalOpen && <ProjectModal handleModal={handleModal} blok={blok} />}
		</>
	);
}

type ModalRenderable =
	| { type: "image"; id?: string; filename: string; alt?: string }
	| { type: "text"; text: string }
	| { type: "video"; videoUrl: string }
	| { type: "richText" };

export function ProjectModal({ handleModal, blok }: { handleModal: () => void; blok: ProjectBlok }) {
	const [currentSlide, setCurrentSlide] = useState(1);
	const [hideArrowCursor, setHideArrowCursor] = useState<boolean>(false);
	const [windowSide, setWindowSide] = useState("");
	const [isNarrowScreen, setIsNarrowScreen] = useState(false);

	const cursor = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const mql = window.matchMedia("(max-width: 768px)");

		setIsNarrowScreen(mql.matches);

		const handler = (e: MediaQueryListEvent) => {
			setIsNarrowScreen(e.matches);
		};

		mql.addEventListener("change", handler);
		return () => mql.removeEventListener("change", handler);
	}, []);

	const combinedArray: ModalRenderable[] = useMemo(() => {
		const arr: ModalRenderable[] = [];

		(blok.modalDetail ?? []).forEach((item) => {
			switch (item.component) {
				case "projectModalImage":
					arr.push({ type: "image", id: item.image.id, filename: item.image.filename, alt: item.image.alt });
					break;
				case "projectModalText":
					arr.push({ type: "text", text: item.text });
					break;
				case "multiasset":
					item.image.forEach((img) => arr.push({ type: "image", id: img.id, filename: img.filename, alt: img.alt }));
					break;
				case "project_modal_video":
					arr.push({ type: "video", videoUrl: getEmbedUrl(item.video) });
					break;
			}
		});

		const hasRichText =
			!!blok?.rich_text && typeof blok.rich_text === "object" && JSON.stringify(blok.rich_text).length > 20; // cheap check to avoid empty nodes

		if (hasRichText) arr.push({ type: "richText" });
		return arr;
	}, [blok.modalDetail, blok.rich_text]);

	function getEmbedUrl(url: string) {
		const videoId = url.split("v=")[1] || url.split("/").pop();
		return `https://www.youtube.com/embed/${videoId}`;
	}

	const currentItem = combinedArray[currentSlide - 1];

	const blurImage = useBlurBase(currentItem.type === "image" ? currentItem.filename : undefined);

	const handleNextSlide = () =>
		currentSlide > combinedArray.length - 1 ? setCurrentSlide(1) : setCurrentSlide(currentSlide + 1);

	const handlePreviousSlide = () =>
		currentSlide > 1 ? setCurrentSlide(currentSlide - 1) : setCurrentSlide(combinedArray.length);

	const handleMouseArrow = (event: MouseEvent) => {
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

	// Handle ESC key and arrow key navigation
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				handleModal();
			} else if (e.key === "ArrowLeft") {
				handlePreviousSlide();
			} else if (e.key === "ArrowRight") {
				handleNextSlide();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleModal, handlePreviousSlide, handleNextSlide]);

	return (
		<div className='project-modal__container' role='dialog' aria-modal='true' aria-label={blok.projectTitle}>
			<button
				className='project-modal__cross'
				aria-label='Close modal'
				onClick={handleModal}
				onMouseEnter={() => setHideArrowCursor(true)}
				onMouseLeave={() => setHideArrowCursor(false)}>
				<Cross />
			</button>
			<div className='project-modal__wrapper'>
				<Sidebar blok={blok} combinedArray={combinedArray} currentSlide={currentSlide} />
				{!isNarrowScreen && (
					<>
						<button
							className='left-arrow arrow__container'
							onClick={handlePreviousSlide}
							aria-label='Previous slide'></button>
						<button className='right-arrow arrow__container' onClick={handleNextSlide} aria-label='Next slide'></button>
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
									sizes="(max-width: 768px) 100vw, 80vw"
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
						<button onClick={handlePreviousSlide} className='chevron-container left-arrow' aria-label='Previous slide'>
							<div className='chevron'>
								<Chevron />
							</div>
						</button>

						<button onClick={handleNextSlide} className='chevron-container right-arrow' aria-label='Next slide'>
							<div className='chevron'>
								<Chevron />
							</div>
						</button>
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
