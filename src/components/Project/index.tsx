import { StoryblokComponent } from "@storyblok/react";
import { useRef, useState, useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
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
	const [portraitBackground, setPortraitBackground] = useState();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [windowSide, setWindowSide] = useState("");
	const [isCursorOverCross, setIsCursorOverCross] = useState(false);
	const [isIntersecting, setIsIntersecting] = useState(false);
	const ref = useRef(null);

	const cursor = useRef<HTMLDivElement>(null);

	const imageSrc = blok.backgroundImage.filename;

	const handleOpenModal = () => {
		setIsModalOpen(true);
		document.body.style.overflowY = "hidden";
		setIsHeaderVisible(false);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		document.body.style.overflowY = "auto";
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
		if (currentSlide > blok.modalDetail.length - 1) {
			setCurrentSlide(1);
		} else {
			setCurrentSlide(currentSlide + 1);
		}
	};

	const handlePreviousSlide = () => {
		if (currentSlide > 1) {
			setCurrentSlide(currentSlide - 1);
		} else {
			setCurrentSlide(blok.modalDetail.length);
		}
	};

	useEffect(() => {
		const randomNumber = Math.floor(Math.random() * backgroundColours.length);
		setPortraitBackground(backgroundColours[randomNumber]);
	}, []);

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

	console.log(isIntersecting);
	const callbackFunction = (entries: any) => {
		const [entry] = entries;
		setIsIntersecting(entry.isIntersecting);
		if (entry.isIntersecting) {
			setActiveItem(blok.projectTitle);
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

	return (
		<section
			ref={ref}
			className='project__container'
			data-section
			style={isPortrait ? { background: portraitBackground } : {}}
			id={blok.projectTitle}>
			<LazyLoadImage
				effect='opacity'
				src={imageSrc}
				className={isPortrait ? "project__image--portrait" : "project__image--landscape"}
				alt=''
			/>

			<h1
				className={`text-h2 ${blok.modalDetail && blok.modalDetail.length >= 1 ? "hov-test" : ""} `}
				onClick={blok.modalDetail && blok.modalDetail.length >= 1 ? handleOpenModal : undefined}
				id={blok.projectTitle}>
				{blok.projectTitle}
			</h1>
			{/* Modal */}
			<div
				className={`project-modal__container ${isModalOpen ? "project-modal__container--open" : ""}`}
				onMouseMove={(event) => handleMouseArrow(event)}>
				<div className='project-modal__background'></div>
				<div className='left-arrow__container' onClick={handlePreviousSlide}></div>
				<div className='right-arrow__container' onClick={handleNextSlide}></div>
				<div className='project-modal__sidebar'>
					<span>{blok.projectTitle}</span>
					<span>{blok.title}</span>
					{blok.modalDetail && (
						<span>
							{currentSlide}/{blok.modalDetail.length}
						</span>
					)}
				</div>

				<div className='project-modal__main-content'>
					{blok.modalDetail && blok.modalDetail.length > 0 && (
						<StoryblokComponent blok={blok.modalDetail[currentSlide - 1]} />
					)}
					{!isCursorOverCross && (
						<div className={`cursor ${windowSide === "right" ? "cursor-flipped" : ""}`} ref={cursor}>
							<svg width='51' height='9' fill='none' xmlns='http://www.w3.org/2000/svg'>
								<path d='M4.242 0 0 4.243l4.242 4.242V0Z' fill='#fff'></path>
								<path d='M2.242 4.243h48' stroke='#fff'></path>
							</svg>
						</div>
					)}
				</div>
				<div
					onMouseEnter={() => setIsCursorOverCross(true)}
					onMouseLeave={() => setIsCursorOverCross(false)}
					className='cross-test'>
					<a className='project-modal__cross' onClick={handleCloseModal}></a>
				</div>
			</div>
		</section>
	);
}
