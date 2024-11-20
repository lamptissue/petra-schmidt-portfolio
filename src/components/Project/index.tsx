import { useRef, useState, useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import Sidebar from "../Sidebar";

import "react-lazy-load-image-component/src/effects/opacity.css";
import "./styles.scss";
import Chevron from "../Chevron";
import Video from "../Video";
import Text from "../Text";
import Arrow from "../Arrow";
import RichText from "../RichText";

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
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [windowSide, setWindowSide] = useState("");
	const [hideArrowCursor, setHideArrowCursor] = useState(false);

	const ref = useRef(null);

	const cursor = useRef<HTMLDivElement>(null);

	const imageSrc = blok.backgroundImage.filename;

	const handleOpenModal = () => {
		setIsModalOpen(true);
		document.body.style.position = "fixed";

		setIsHeaderVisible(false);
	};

	const handleCloseModal = () => {
		setCurrentSlide(1);
		setIsModalOpen(false);
		document.body.style.position = "";

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
	const body = document.querySelector("body");

	useEffect(() => {
		isModalOpen ? (body!.style.overflow = "hidden") : (body!.style.overflow = "auto");
	}, [isModalOpen]);

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

	useEffect(() => {
		preloadImages();
	}, []);

	const callbackFunction = (entries: any) => {
		const [entry] = entries;
		if (entry.isIntersecting) {
			setActiveItem(blok.projectTitle);
			// preloadImages();
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

	return (
		<section
			ref={ref}
			className='project__container'
			data-section
			style={{
				backgroundColor: `hsla(${backgroundColours[0]}, 0.5)`,
				backgroundImage: `radial-gradient(at 0% 79%, hsla(${backgroundColours[1]}, 0.7) 0px, transparent 50%)`,
			}}
			id={blok.projectTitle}>
			<div
				className={`project__title-wrapper ${
					isPortrait ? "project__title-shadow-portrait" : "project__title-shadow-landscape"
				} ${blok.modalDetail && blok.modalDetail.length >= 1 && "active-project-link"}`}>
				<h1
					className='text-h3'
					style={{ color: `${isPortrait ? "black" : ""}` }}
					onClick={blok.modalDetail && blok.modalDetail.length >= 1 ? handleOpenModal : undefined}
					id={blok.projectTitle}>
					{blok.projectTitle}
				</h1>
				<span style={{ color: `${isPortrait ? "black" : ""}` }}>{blok?.location}</span> <br />
				<span style={{ color: `${isPortrait ? "black" : ""}` }}>
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
				className='project-modal__container '
				style={{ display: isModalOpen ? "block" : "none" }}
				onMouseMove={(event) => handleMouseArrow(event)}>
				<Sidebar blok={blok} combinedArray={combinedArray} currentSlide={currentSlide} />
				<div
					className='project-modal__cross'
					aria-label='close'
					onClick={handleCloseModal}
					onMouseEnter={() => setHideArrowCursor(true)}
					onMouseLeave={() => setHideArrowCursor(false)}>
					<span></span>
					<span></span>
				</div>
				<div className='project-modal__content-container'>
					{combinedArray.length > 0 && (
						<>
							{currentItem.type === "image" && (
								<img src={`${currentItem.filename}/m/`} loading='lazy' alt={currentItem.alt} />
							)}
							{currentItem.type === "video" && (
								<Video src={currentItem.videoUrl} setHideArrowCursor={setHideArrowCursor} />
							)}
							{currentItem.type === "text" && <Text textContent={textContent} />}
							{currentItem.type === "richText" && <RichText blok={blok} />}
						</>
					)}
				</div>

				<div className='left-arrow arrow__container' onClick={handlePreviousSlide} aria-label='Previous slide'></div>
				<div className='right-arrow arrow__container' onClick={handleNextSlide} aria-label='Next slide'></div>

				<Chevron options={"left-boy"} onClick={handlePreviousSlide} aria-label='Previous slide' />
				<Chevron options={"right-boy"} onClick={handleNextSlide} aria-label='Next slide' />

				{!hideArrowCursor && (
					<div className={`cursor ${windowSide === "right" ? "cursor-flipped" : ""}`} ref={cursor}>
						<Arrow />
					</div>
				)}
			</div>
		</section>
	);
}
