import { useRef, useState, useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { richTextResolver } from "@storyblok/richtext";

import "react-lazy-load-image-component/src/effects/opacity.css";
import "./styles.scss";

export default function Project({
	blok,
	setIsHeaderVisible,
	backgroundColours,
	setActiveItem,
}: {
	blok: any;
	setIsHeaderVisible: any;
	backgroundColours: any;
	setActiveItem: any;
}) {
	const [currentSlide, setCurrentSlide] = useState(1);
	const [isPortrait, setIsPortrait] = useState(false);
	const [backgroundColour, setBackgroundColor] = useState();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [windowSide, setWindowSide] = useState("");
	const [hideArrowCursor, setHideArrowCursor] = useState(false);

	const ref = useRef(null);
	const cursor = useRef<HTMLDivElement>(null);

	const imageSrc = blok.backgroundImage.filename;

	const main = document.querySelector("main");

	const handleOpenModal = () => {
		setIsModalOpen(true);
		main!.style.overflow = "hidden";
		setIsHeaderVisible(false);
	};

	const handleCloseModal = () => {
		setCurrentSlide(1);
		setIsModalOpen(false);
		main!.style.overflow = "auto";
		setIsHeaderVisible(true);
	};

	const handleMouseArrow = (event: any) => {
		if (event.clientX > window.innerWidth / 2) {
			setWindowSide("right");
		} else {
			setWindowSide("left");
		}
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

	const handleNextSlide = () => {
		if (currentSlide > combinedArray.length - 1) {
			setCurrentSlide(1);
		} else {
			setCurrentSlide(currentSlide + 1);
		}
	};

	const handlePreviousSlide = () => {
		if (currentSlide > 1) {
			setCurrentSlide(currentSlide - 1);
		} else {
			setCurrentSlide(combinedArray.length);
		}
	};

	const checkLandscape = (image: any) => {
		const img = new Image();
		img.src = image;

		img.onload = function (this: any) {
			if (this.width < this.height) {
				setIsPortrait(true);
			} else {
				setIsPortrait(false);
			}
		};
	};

	useEffect(() => {
		const randomNumber = Math.floor(Math.random() * backgroundColours.length);

		setBackgroundColor(isPortrait && backgroundColours[randomNumber]);
	}, [isPortrait]);

	useEffect(() => {
		checkLandscape(blok.backgroundImage.filename);
	}, [blok.backgroundImage.filename]);

	const preloadImages = () => {
		if (blok.modalDetail) {
			blok.modalDetail.forEach((item: any) => {
				if (item.component === "projectModalImage") {
					const img = new Image();
					img.src = `${item.image.filename}/m/`;
				} else if (item.component === "multiasset") {
					item.image.forEach((imgItem: any) => {
						const img = new Image();
						img.src = `${imgItem.filename}/m/`;
					});
				}
			});
		}
	};

	const callbackFunction = (entries: any) => {
		const [entry] = entries;
		if (entry.isIntersecting) {
			setActiveItem(blok.projectTitle);
			preloadImages();
		}
	};
	const options = {
		root: null,
		rootMargin: "0px",
		threshold: 1.0,
	};

	useEffect(() => {
		const observer = new IntersectionObserver(callbackFunction, options);
		if (ref.current) observer.observe(ref.current);

		return () => {
			if (ref.current) observer.unobserve(ref.current);
		};
	}, [ref, options]);

	const combinedArray: any = [];

	if (blok.modalDetail) {
		blok.modalDetail.forEach((item: any) => {
			if (item.component === "projectModalImage") {
				combinedArray.push({
					type: "image",
					id: item.image.id,
					filename: item.image.filename,
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

	let richtextHtml =
		blok.rich_text && blok.rich_text.content && Array.isArray(blok.rich_text.content)
			? richTextResolver().render(blok.rich_text)
			: null;

	const currentItem = combinedArray[currentSlide - 1];

	let textContent = null;

	if (currentItem.type === "text") {
		if (currentItem.textLength === "short") {
			const paragraphs = currentItem.text.split("\n\n");

			textContent = (
				<div className='project-modal__text-area project-modal__text-area--short-text'>
					{paragraphs[0] && <p className='align-left'>{paragraphs[0]}</p>}
					{paragraphs[1] && <p className='align-right'>{paragraphs[1]}</p>}
				</div>
			);
		} else {
			textContent = (
				<div className='project-modal__text-area project-modal__text-area--long-text'>
					<p>{currentItem.text}</p>
				</div>
			);
		}
	}

	return (
		<section
			ref={ref}
			className='project__container'
			data-section
			// style={{ background: `hsla(${backgroundColour}, 0.5)` }}
			style={{ background: "gray" }}
			// style={{
			// 	backgroundColor: `hsla(${backgroundColour}, 0.5)`,
			// 	backgroundImage:
			// 		`radial-gradient(at 0% 79%, hsla(240,100%,82%, 0.5) 0px, transparent 50%),` +
			// 		`radial-gradient(at 8% 16%, hsla(343,100%,76%,0.5) 0px, transparent 50%)`,
			// }}
			// style={{
			// 	backgroundColor: `hsla(${backgroundColour}, 0.5)`,
			// 	backgroundImage: `radial-gradient(at 0% 79%, hsla(240,100%,82%, 0.5) 0px, transparent 50%)`,
			// }}
			id={blok.projectTitle}>
			<div
				className={`project__title-wrapper ${
					isPortrait ? "project__title-shadow-portrait" : "project__title-shadow-landscape"
				} ${blok.modalDetail && blok.modalDetail.length >= 1 && "active-project-link"}`}>
				<h1
					className='text-h3'
					onClick={blok.modalDetail && blok.modalDetail.length >= 1 ? handleOpenModal : undefined}
					id={blok.projectTitle}>
					{blok.projectTitle}
				</h1>
				<span>{blok?.location}</span> <br />
				<span>
					{blok?.artist} - {blok?.year}
				</span>
			</div>
			<LazyLoadImage
				effect='opacity'
				src={`${imageSrc}/m/`}
				className={`${blok.modalDetail && blok.modalDetail.length >= 1 ? "background__click" : ""} ${
					isPortrait ? "project__image--portrait" : "project__image--landscape"
				}`}
				alt={blok.projectTitle}
				onClick={blok.modalDetail && blok.modalDetail.length >= 1 ? handleOpenModal : undefined}
			/>

			{/* Modal */}
			<div
				className='project-modal__container'
				style={{ display: isModalOpen ? "flex" : "none" }}
				onMouseMove={(event) => handleMouseArrow(event)}>
				<div className='project-modal__content-container'>
					{combinedArray.length > 0 && currentItem.type === "image" ? (
						<img src={`${currentItem.filename}/m/`} />
					) : currentItem.type === "text" ? (
						textContent
					) : currentItem.type === "richText" && richtextHtml ? (
						<div
							className='project-modal__text-area rich-text-content'
							dangerouslySetInnerHTML={{ __html: richtextHtml }}
						/>
					) : (
						currentItem.type === "video" && (
							<iframe
								width='80%'
								height='80%'
								src={currentItem.videoUrl}
								title='YouTube video player'
								frameBorder='0'
								allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
								referrerPolicy='strict-origin-when-cross-origin'
								allowFullScreen
								onMouseEnter={() => setHideArrowCursor(true)}
								onMouseLeave={() => setHideArrowCursor(false)}></iframe>
						)
					)}
				</div>

				<div className='left-arrow arrow__container' onClick={handlePreviousSlide}>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='24'
						height='24'
						viewBox='0 0 24 24'
						fill='none'
						stroke='#000'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'>
						<polyline points='6 9 12 15 18 9' />
					</svg>
				</div>
				<div className='right-arrow arrow__container' onClick={handleNextSlide}>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='24'
						height='24'
						viewBox='0 0 24 24'
						fill='none'
						stroke='#000'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'>
						<polyline points='6 9 12 15 18 9' />
					</svg>
				</div>

				<div className='project-modal__sidebar'>
					<span>{blok.projectTitle}</span>
					<span>{blok.title}</span>

					{blok.modalDetail && combinedArray.length > 0 && (
						<span>
							{currentSlide}/{combinedArray.length}
						</span>
					)}
				</div>

				<div
					className='project-modal__cross'
					onClick={handleCloseModal}
					onMouseEnter={() => setHideArrowCursor(true)}
					onMouseLeave={() => setHideArrowCursor(false)}></div>

				{!hideArrowCursor && (
					<div className={`cursor ${windowSide === "right" ? "cursor-flipped" : ""}`} ref={cursor}>
						<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 82.42 17.72' width='90' height='40' fill='none'>
							<path d='M3.6 9.94h76.84c1.93 0 1.93-3 0-3H3.6c-1.93 0-1.93 3 0 3Z' fill='#fff' />
							<path
								d='m2.54 9.5 6.04 6.04.86.86c.56.56 1.57.6 2.12 0s.59-1.53 0-2.12L5.52 8.24l-.86-.86c-.56-.56-1.57-.6-2.12 0s-.59 1.53 0 2.12Z'
								fill='#fff'
							/>
							<path
								d='M9.43.42 3.39 6.46l-.86.86c-.56.56-.6 1.57 0 2.12s1.53.59 2.12 0l6.04-6.04.86-.86c.56-.56.6-1.57 0-2.12s-1.53-.59-2.12 0Z'
								fill='#fff'
							/>
						</svg>
					</div>
				)}
			</div>
		</section>
	);
}
