import { storyblokEditable, StoryblokComponent } from "@storyblok/react";
import { useRef, useState } from "react";
import "./styles.scss";

export default function Project({ blok }: { blok: any }) {
	const projectContainer = useRef<HTMLDivElement>(null);
	const [currentSlide, setCurrentSlide] = useState(1);
	const header = document.getElementById("header");

	const handleOpenModal = () => {
		projectContainer.current?.classList.add("project-modal__container--open");
		document.body.style.overflowY = "hidden";
		header!.style.display = "none";
	};

	const handleCloseModal = () => {
		projectContainer.current?.classList.remove("project-modal__container--open");
		document.body.style.overflowY = "auto";
		header!.style.display = "block";
	};

	const handleNextSlide = () => {
		if (blok.modalDetail && currentSlide < blok.modalDetail.length - 1) {
			setCurrentSlide(currentSlide + 1);
		}
	};

	const handlePreviousSlide = () => {
		if (currentSlide > 0) {
			setCurrentSlide(currentSlide - 1);
		}
	};

	return (
		<section className='project__container' {...storyblokEditable(blok)}>
			<img loading='lazy' src={blok.backgroundImage.filename} className='project__image' />
			<h1 className='text-h2' onClick={handleOpenModal}>
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
						<StoryblokComponent blok={blok.modalDetail[currentSlide]} />
					)}
					{/* {blok.modalDetail
						? blok.modalDetail.map((blok: any) => <StoryblokComponent blok={blok} key={blok._uid} />)
						: null} */}
				</div>

				<a className='project-modal__cross' onClick={handleCloseModal}></a>
			</div>
		</section>
	);
}
