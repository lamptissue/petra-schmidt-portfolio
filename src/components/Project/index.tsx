// import { StoryblokComponent } from "@storyblok/react";
import { useRef, useState, useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/opacity.css";
import "./styles.scss";
// import ProjectModalImage from "../ProjectModalImage";

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
		if (currentSlide > blok.modalDetail.length - 1) {
			// if (currentSlide > blok.modalDetail.length - 1 || currentSlide > blok.modalDetail[0].image.length - 1) {
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

	// if (blok.modalDetail && blok.modalDetail.length > 0) {
	// 	if (blok.modalDetail[0].image.length > 0) {
	// 		console.log("multiboiii");
	// 	} else {
	// 		console.log("just single bloks");
	// 	}
	// } else {
	// 	console.log("No images found in modalDetail");
	// }

	// if (blok.modalDetail && blok.modalDetail.length > 0) {
	// 	if (blok.modalDetail[0].component === "multiasset") {
	// 		console.log("component");
	// 	} else {
	// 		console.log("ya wrong");
	// 	}
	// }
	// const poo = blok.modalDetail && blok.modalDetail.filter((item) => item.component === "multiasset");

	// Check modalDetail if it is empty
	// check if there is a component named multi asset
	// Create new array of information?

	// const combinedArray = [];

	// // Iterate over the modalDetail array and process each item
	// if (blok.modalDetail) {
	// 	blok.modalDetail.forEach((item) => {
	// 		if (item.component === "projectModalImage") {
	// 			combinedArray.push({
	// 				type: "image",
	// 				id: item.image.id,
	// 				filename: item.image.filename,
	// 			});
	// 		} else if (item.component === "projectModalText") {
	// 			combinedArray.push({
	// 				type: "text",
	// 				text: item.text,
	// 			});
	// 		} else if (item.component === "multiasset") {
	// 			item.image.forEach((img) => {
	// 				combinedArray.push({
	// 					type: "image",
	// 					id: img.id,
	// 					filename: img.filename,
	// 				});
	// 			});
	// 		}
	// 	});
	// }

	// console.log("combinedArray", combinedArray);
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
				{/* {blok.modalDetail && blok.modalDetail.length > 0 && (
					// <ProjectModalImage blok={blok.modalDetail[currentSlide - 1]} />
					<StoryblokComponent
						blok={blok.modalDetail[currentSlide - 1]}
						// onMouseEnter={() => setHideArrowCursor(true)}
						// onMouseLeave={() => setHideArrowCursor(false)}
					/>
				)} */}

				{/* {blok.modalDetail &&
					blok.modalDetail.length > 0 &&
					(blok.modalDetail[0].image && blok.modalDetail[0].image.length > 0 ? (
						// blok.modalDetail[0].image.map((item, index) => (
						// 	<img key={index} src={item.filename[currentSlide - 1]} alt={item.alt || "Image"} />
						// ))

						<img src={blok.modalDetail[0].image[currentSlide].filename} />
					) : (
						<StoryblokComponent blok={blok.modalDetail[currentSlide - 1]} />
					))} */}
				{/* {combinedArray.length > 0 && <p>hello</p>} */}

				<div className='left-arrow arrow__container' onClick={handlePreviousSlide}></div>
				<div className='right-arrow arrow__container' onClick={handleNextSlide}></div>

				<div className='project-modal__sidebar'>
					<span>{blok.projectTitle}</span>
					<span>{blok.title}</span>

					{blok.modalDetail && blok.modalDetail.length > 0 ? (
						blok.modalDetail[0].component === "multiasset" ? (
							<span>
								{currentSlide}/{blok.modalDetail[0].image.length}
							</span>
						) : (
							<span>
								{currentSlide}/{blok.modalDetail.length}
							</span>
						)
					) : null}
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
