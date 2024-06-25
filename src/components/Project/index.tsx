import { StoryblokComponent } from "@storyblok/react";
import { useRef, useState, useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/opacity.css";
import "./styles.scss";

export default function Project({ blok, setIsHeaderVisible }: { blok: any; setIsHeaderVisible: any }) {
	const projectContainer = useRef<HTMLDivElement>(null);
	const [currentSlide, setCurrentSlide] = useState(1);
	const [isPortrait, setIsPortrait] = useState(false);

	const imageSrc = blok.backgroundImage.filename;

	const handleOpenModal = () => {
		projectContainer.current?.classList.add("project-modal__container--open");
		document.body.style.overflowY = "hidden";
		setIsHeaderVisible(false);
	};

	const handleCloseModal = () => {
		projectContainer.current?.classList.remove("project-modal__container--open");
		document.body.style.overflowY = "auto";
		setIsHeaderVisible(true);
	};

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

	return (
		<section className='project__container'>
			<LazyLoadImage
				effect='opacity'
				src={imageSrc}
				className={isPortrait ? "project__image--portrait" : "project__image--landscape"}
				alt=''
			/>

			<h1 className='text-h2' onClick={handleOpenModal} id={blok.projectTitle}>
				{blok.projectTitle}
			</h1>

			<div className='project-modal__container' ref={projectContainer}>
				<div className='project-modal__background'></div>
				<div className='project-modal__sidebar'>
					<span>{blok.projectTitle}</span>
					<span>{blok.title}</span>
					{blok.modalDetail && (
						<span>
							{currentSlide}/{blok.modalDetail.length}
						</span>
					)}
				</div>
				<div className='left-arrow'>
					<button onClick={handlePreviousSlide}>CLICK ME TO GO LEFT</button>
				</div>
				<div className='right-arrow'>
					<button onClick={handleNextSlide}>CLICK ME TO GO RIGHT</button>
				</div>
				<div className='project-modal__main-content'>
					{blok.modalDetail && blok.modalDetail.length > 0 && (
						<StoryblokComponent blok={blok.modalDetail[currentSlide - 1]} />
					)}
				</div>
				<a className='project-modal__cross' onClick={handleCloseModal}></a>
			</div>
		</section>
	);
}
