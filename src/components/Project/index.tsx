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
	const [hideArrowCursor, setHideArrowCursor] = useState(false);

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

	const callbackFunction = (entries: any) => {
		const [entry] = entries;
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
				combinedArray.push({
					type: "text",
					text: item.text,
				});
			} else if (item.component === "multiasset") {
				item.image.forEach((img: any) => {
					combinedArray.push({
						type: "image",
						id: img.id,
						filename: img.filename,
					});
				});
			}
		});
	}

	return (
		<section
			ref={ref}
			className='project__container'
			data-section
			style={{ background: isPortrait ? portraitBackground : "" }}
			id={blok.projectTitle}>
			<h1
				className={`text-h2 ${blok.modalDetail && blok.modalDetail.length >= 1 ? "active-project-link" : ""} `}
				onClick={blok.modalDetail && blok.modalDetail.length >= 1 ? handleOpenModal : undefined}
				id={blok.projectTitle}>
				{blok.projectTitle}
			</h1>

			<LazyLoadImage
				effect='opacity'
				src={imageSrc}
				className={isPortrait ? "project__image--portrait" : "project__image--landscape"}
				alt={blok.projectTitle}
			/>

			{/* Modal */}
			<div
				className='project-modal__container'
				style={{ display: isModalOpen ? "flex" : "none" }}
				onMouseMove={(event) => handleMouseArrow(event)}>
				{combinedArray.length > 0 && combinedArray[currentSlide - 1].type === "image" ? (
					<div className='combineTest'>
						<img src={combinedArray[currentSlide - 1].filename} loading='lazy' />
					</div>
				) : (
					combinedArray.length > 0 &&
					combinedArray[currentSlide - 1].type === "text" && (
						<div className='combineTest'>
							<p>{combinedArray[currentSlide - 1].text}</p>
						</div>
					)
				)}

				<div className='left-arrow arrow__container' onClick={handlePreviousSlide}></div>
				<div className='right-arrow arrow__container' onClick={handleNextSlide}></div>

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
						<svg width='51' height='9' fill='none' xmlns='http://www.w3.org/2000/svg'>
							<path d='M4.242 0 0 4.243l4.242 4.242V0Z' fill='#fff'></path>
							<path d='M2.242 4.243h48' stroke='#fff'></path>
						</svg>
					</div>
				)}
			</div>
		</section>
	);
}
