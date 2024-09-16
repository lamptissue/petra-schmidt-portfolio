// import { useRef, useState, useEffect } from "react";
// import { LazyLoadImage } from "react-lazy-load-image-component";
// import { richTextResolver } from "@storyblok/richtext";

// import "react-lazy-load-image-component/src/effects/opacity.css";
// import "./styles.scss";

// export default function Project({
// 	blok,
// 	setIsHeaderVisible,
// 	backgroundColours,
// 	setActiveItem,
// }: {
// 	blok: any;
// 	setIsHeaderVisible: any;
// 	backgroundColours: any;
// 	setActiveItem: any;
// }) {
// 	const [currentSlide, setCurrentSlide] = useState(1);
// 	const [isPortrait, setIsPortrait] = useState(false);
// 	const [backgroundColour, setBackgroundColor] = useState();
// 	const [isModalOpen, setIsModalOpen] = useState(false);
// 	const [windowSide, setWindowSide] = useState("");
// 	const [hideArrowCursor, setHideArrowCursor] = useState(false);

// 	const ref = useRef(null);
// 	const cursor = useRef<HTMLDivElement>(null);

// 	const imageSrc = blok.backgroundImage.filename;

// 	const main = document.querySelector("main");

// 	console.log("blok.rich_text", blok.rich_text);
// 	const handleOpenModal = () => {
// 		setIsModalOpen(true);
// 		main!.style.overflow = "hidden";
// 		setIsHeaderVisible(false);
// 	};

// 	const handleCloseModal = () => {
// 		setIsModalOpen(false);
// 		main!.style.overflow = "auto";
// 		setIsHeaderVisible(true);
// 	};

// 	const handleMouseArrow = (event: any) => {
// 		if (event.clientX > window.innerWidth / 2) {
// 			setWindowSide("right");
// 		} else {
// 			setWindowSide("left");
// 		}
// 		if (cursor.current) {
// 			cursor.current.style.top = event.clientY + "px";
// 			cursor.current.style.left = event.clientX + "px";
// 		}
// 	};

// 	useEffect(() => {
// 		document.addEventListener("mousemove", handleMouseArrow);
// 		return () => {
// 			document.removeEventListener("mousemove", handleMouseArrow);
// 		};
// 	}, []);

// 	const handleNextSlide = () => {
// 		if (currentSlide > combinedArray.length - 1) {
// 			setCurrentSlide(1);
// 		} else {
// 			setCurrentSlide(currentSlide + 1);
// 		}
// 	};

// 	const handlePreviousSlide = () => {
// 		if (currentSlide > 1) {
// 			setCurrentSlide(currentSlide - 1);
// 		} else {
// 			setCurrentSlide(combinedArray.length);
// 		}
// 	};

// 	const checkLandscape = (image: any) => {
// 		const img = new Image();
// 		img.src = image;

// 		img.onload = function (this: any) {
// 			if (this.width < this.height) {
// 				setIsPortrait(true);
// 			} else {
// 				setIsPortrait(false);
// 			}
// 		};
// 	};

// 	useEffect(() => {
// 		const randomNumber = Math.floor(Math.random() * backgroundColours.length);

// 		setBackgroundColor(isPortrait && backgroundColours[randomNumber]);
// 	}, [isPortrait]);

// 	useEffect(() => {
// 		checkLandscape(blok.backgroundImage.filename);
// 	}, [blok.backgroundImage.filename]);

// 	const callbackFunction = (entries: any) => {
// 		const [entry] = entries;
// 		if (entry.isIntersecting) {
// 			setActiveItem(blok.projectTitle);
// 		}
// 	};
// 	const options = {
// 		root: null,
// 		rootMargin: "0px",
// 		threshold: 1.0,
// 	};

// 	useEffect(() => {
// 		const observer = new IntersectionObserver(callbackFunction, options);
// 		if (ref.current) observer.observe(ref.current);

// 		return () => {
// 			if (ref.current) observer.unobserve(ref.current);
// 		};
// 	}, [ref, options]);

// 	const combinedArray: any = [];

// 	if (blok.modalDetail) {
// 		blok.modalDetail.forEach((item: any) => {
// 			if (item.component === "projectModalImage") {
// 				combinedArray.push({
// 					type: "image",
// 					id: item.image.id,
// 					filename: item.image.filename,
// 				});
// 			} else if (item.component === "projectModalText") {
// 				const textLength = item.text.length > 1000 ? "long" : "short";
// 				combinedArray.push({
// 					...item,
// 					type: "text",
// 					textLength,
// 				});
// 			} else if (item.component === "multiasset") {
// 				item.image.forEach((img: any) => {
// 					combinedArray.push({
// 						type: "image",
// 						id: img.id,
// 						filename: img.filename,
// 					});
// 				});
// 			}
// 		});
// 	}

// 	if (
// 		blok.rich_text.content &&
// 		blok.rich_text.content.some((node: any) => {
// 			return node.content && node.content.some((innerNode: any) => innerNode.text && innerNode.text.trim() !== "");
// 		})
// 	) {
// 		combinedArray.push({
// 			type: "richText",
// 			data: blok.rich_text.content,
// 		});
// 	}

// 	let richtextHtml =
// 		blok.rich_text && blok.rich_text.content && Array.isArray(blok.rich_text.content)
// 			? richTextResolver().render(blok.rich_text)
// 			: null;

// 	// const test =
// 	// 	combinedArray.length > 0 &&
// 	// 	combinedArray[currentSlide - 1].type === "text" &&
// 	// 	combinedArray[currentSlide - 1].textLength === "short" &&
// 	// 	combinedArray[0].text.split("\n\n");
// 	// console.log("test", test ? test[0] : false);
// 	// TODO preload images/files in an array once the modal is clicked open

// 	// const [assetsLoaded, setAssetsLoaded] = useState<boolean>(false);

// 	// function preloadImage(src: string) {
// 	// 	return new Promise((resolve, reject) => {
// 	// 		const img = new Image();
// 	// 		img.onload = function () {
// 	// 			resolve(img);
// 	// 		};
// 	// 		img.onerror = img.onabort = function () {
// 	// 			reject(src);
// 	// 		};
// 	// 		img.src = src;
// 	// 	});
// 	// }

// 	// useEffect(() => {
// 	// 	let isCancelled = false;

// 	// 	async function effect() {
// 	// 		if (isCancelled) {
// 	// 			return;
// 	// 		}

// 	// 		const imagesPromiseList: Promise<any>[] = [];
// 	// 		for (const i of combinedArray) {
// 	// 			imagesPromiseList.push(preloadImage(i));
// 	// 		}

// 	// 		await Promise.all(imagesPromiseList);

// 	// 		if (isCancelled) {
// 	// 			return;
// 	// 		}

// 	// 		setAssetsLoaded(true);
// 	// 	}

// 	// 	effect();

// 	// 	return () => {
// 	// 		isCancelled = true;
// 	// 	};
// 	// }, []);

// 	// if (!assetsLoaded) {
// 	// 	console.log("Not loaded");
// 	// } else {
// 	// 	console.log(" loaded");
// 	// }

// 	return (
// 		<section
// 			ref={ref}
// 			className='project__container'
// 			data-section
// 			style={{ background: `hsla(${backgroundColour}, 0.5)` }}
// 			id={blok.projectTitle}>
// 			<h1
// 				className={`text-h3 ${blok.modalDetail && blok.modalDetail.length >= 1 ? "active-project-link" : ""} `}
// 				onClick={blok.modalDetail && blok.modalDetail.length >= 1 ? handleOpenModal : undefined}
// 				id={blok.projectTitle}>
// 				{blok.projectTitle}
// 			</h1>

// 			<LazyLoadImage
// 				effect='opacity'
// 				src={`${imageSrc}/m/`}
// 				className={isPortrait ? "project__image--portrait" : "project__image--landscape"}
// 				alt={blok.projectTitle}
// 			/>

// 			{/* Modal */}
// 			<div
// 				className='project-modal__container'
// 				style={{ display: isModalOpen ? "flex" : "none" }}
// 				onMouseMove={(event) => handleMouseArrow(event)}>
// 				<div className='project-modal__content-container'>
// 					{combinedArray.length > 0 && combinedArray[currentSlide - 1].type === "image" ? (
// 						<img src={`${combinedArray[currentSlide - 1].filename}/m/`} loading='lazy' />
// 					) : combinedArray.length > 0 && combinedArray[currentSlide - 1].type === "text" ? (
// 						// <div
// 						// 	className={`project-modal__text-area ${
// 						// 		combinedArray[currentSlide - 1].text.length < 1000
// 						// 			? "project-modal__text-area--short-text"
// 						// 			: "project-modal__text-area--long-text"
// 						// 	}`}>

// 						<div
// 							className={`project-modal__text-area ${
// 								combinedArray[currentSlide - 1].textLength === "short"
// 									? "project-modal__text-area--short-text"
// 									: "project-modal__text-area--long-text"
// 							}`}>
// 							<p>{combinedArray[currentSlide - 1].text}</p>
// 						</div>
// 					) : (
// 						combinedArray[currentSlide - 1].type === "richText" &&
// 						(richtextHtml ? (
// 							<div
// 								className='project-modal__text-area rich-text-content'
// 								dangerouslySetInnerHTML={{ __html: richtextHtml }}
// 							/>
// 						) : (
// 							""
// 						))
// 					)}
// 				</div>
// 				<div className='left-arrow arrow__container' onClick={handlePreviousSlide}></div>
// 				<div className='right-arrow arrow__container' onClick={handleNextSlide}></div>

// 				<div className='project-modal__sidebar'>
// 					<span>{blok.projectTitle}</span>
// 					<span>{blok.title}</span>

// 					{blok.modalDetail && combinedArray.length > 0 && (
// 						<span>
// 							{currentSlide}/{combinedArray.length}
// 						</span>
// 					)}
// 				</div>

// 				<div
// 					className='project-modal__cross'
// 					onClick={handleCloseModal}
// 					onMouseEnter={() => setHideArrowCursor(true)}
// 					onMouseLeave={() => setHideArrowCursor(false)}></div>

// 				{!hideArrowCursor && (
// 					<div className={`cursor ${windowSide === "right" ? "cursor-flipped" : ""}`} ref={cursor}>
// 						{/* <svg
// 							xmlns='http://www.w3.org/2000/svg '
// 							width='90'
// 							height='40'
// 							fill='none'
// 							data-name='Layer 1'
// 							viewBox='0 0 101.88 17.72'>
// 							<path
// 								fill='#fff'
// 								d='M3.6 9.94h84.03c3.88 0 7.8.17 11.67 0h.17c1.93 0 1.93-3 0-3H15.44c-3.88 0-7.8-.17-11.67 0H3.6c-1.93 0-1.93 3 0 3Z'
// 							/>
// 							<path
// 								fill='#fff'
// 								d='m2.54 9.5 6.04 6.04.86.86c.56.56 1.57.6 2.12 0s.59-1.53 0-2.12L5.52 8.24l-.86-.86c-.56-.56-1.57-.6-2.12 0s-.59 1.53 0 2.12Z'
// 							/>
// 							<path
// 								fill='#fff'
// 								d='M9.43.42 3.4 6.46l-.86.86c-.56.56-.6 1.57 0 2.12s1.53.59 2.12 0L10.7 3.4l.86-.86c.56-.56.6-1.57 0-2.12s-1.53-.59-2.12 0Z'
// 							/>
// 						</svg> */}

// 						<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 82.42 17.72' width='90' height='40' fill='none'>
// 							<path d='M3.6 9.94h76.84c1.93 0 1.93-3 0-3H3.6c-1.93 0-1.93 3 0 3Z' fill='#fff' />
// 							<path
// 								d='m2.54 9.5 6.04 6.04.86.86c.56.56 1.57.6 2.12 0s.59-1.53 0-2.12L5.52 8.24l-.86-.86c-.56-.56-1.57-.6-2.12 0s-.59 1.53 0 2.12Z'
// 								fill='#fff'
// 							/>
// 							<path
// 								d='M9.43.42 3.39 6.46l-.86.86c-.56.56-.6 1.57 0 2.12s1.53.59 2.12 0l6.04-6.04.86-.86c.56-.56.6-1.57 0-2.12s-1.53-.59-2.12 0Z'
// 								fill='#fff'
// 							/>
// 						</svg>
// 					</div>
// 				)}
// 			</div>
// 		</section>
// 	);
// }

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
			preloadImages(); // Start preloading images
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
			}
		});
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

	return (
		<section
			ref={ref}
			className='project__container'
			data-section
			style={{ background: `hsla(${backgroundColour}, 0.5)` }}
			id={blok.projectTitle}>
			<h1
				className={`text-h3 ${blok.modalDetail && blok.modalDetail.length >= 1 ? "active-project-link" : ""} `}
				onClick={blok.modalDetail && blok.modalDetail.length >= 1 ? handleOpenModal : undefined}
				id={blok.projectTitle}>
				{blok.projectTitle}
			</h1>

			<LazyLoadImage
				effect='opacity'
				src={`${imageSrc}/m/`}
				className={isPortrait ? "project__image--portrait" : "project__image--landscape"}
				alt={blok.projectTitle}
			/>

			{/* Modal */}
			<div
				className='project-modal__container'
				style={{ display: isModalOpen ? "flex" : "none" }}
				onMouseMove={(event) => handleMouseArrow(event)}>
				<div className='project-modal__content-container'>
					{combinedArray.length > 0 && combinedArray[currentSlide - 1].type === "image" ? (
						<img src={`${combinedArray[currentSlide - 1].filename}/m/`} />
					) : combinedArray.length > 0 && combinedArray[currentSlide - 1].type === "text" ? (
						<div
							className={`project-modal__text-area ${
								combinedArray[currentSlide - 1].textLength === "short"
									? "project-modal__text-area--short-text"
									: "project-modal__text-area--long-text"
							}`}>
							<p>{combinedArray[currentSlide - 1].text}</p>
						</div>
					) : (
						combinedArray[currentSlide - 1].type === "richText" &&
						(richtextHtml ? (
							<div
								className='project-modal__text-area rich-text-content'
								dangerouslySetInnerHTML={{ __html: richtextHtml }}
							/>
						) : (
							""
						))
					)}
				</div>
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
