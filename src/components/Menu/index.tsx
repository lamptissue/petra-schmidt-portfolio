import { useEffect, useRef, useState } from "react";

import "./styles.scss";

interface Project {
	year: number;
	projectTitle: string;
	_uid?: string;
}

export default function Menu({
	isMenuOpen,
	setIsMenuOpen,
	handleContact,
	blok,
}: {
	isMenuOpen: any;
	setIsMenuOpen: any;
	handleContact: any;
	blok: any;
}) {
	const mainNavigation = useRef<HTMLDivElement>(null);
	const blurredBackground = useRef<HTMLDivElement>(null);

	const [poop, setPoop] = useState("");

	useEffect(() => {
		if (isMenuOpen) {
			mainNavigation.current?.classList.add("open");
			if (blurredBackground.current) {
				blurredBackground.current.style.display = "block";
				setTimeout(() => {
					blurredBackground.current!.classList.add("blur");
				}, 100);
			}
		} else {
			mainNavigation.current?.classList.remove("open");
			if (blurredBackground.current) {
				blurredBackground.current.classList.remove("blur");
				setTimeout(() => {
					blurredBackground.current!.style.display = "none";
				}, 1000);
			}
		}
	}, [isMenuOpen]);

	const handleClick = (projectId: string) => {
		setIsMenuOpen(false); // Close the menu
		const projectElement = document.getElementById(projectId);
		setPoop("");
		if (projectElement) {
			setTimeout(() => {
				projectElement.scrollIntoView({ behavior: "smooth" });
			}, 500);
		}
	};

	const test = blok.map((item) => ({
		image: item.backgroundImage.filename,
		project: item.projectTitle,
	}));

	const groupedProjects = blok.reduce((acc: any, project: any) => {
		const { year } = project;
		if (!acc[year]) {
			acc[year] = [];
		}
		acc[year].push({ projectTitle: project.projectTitle, image: project.backgroundImage.filename, ...project });
		return acc;
	}, {});

	const sortedGroupedProjects = Object.entries(groupedProjects).reverse() as [string, Project[]][];

	const handleTest = (projectId: string) => {
		const match = test.find((testItem) => testItem.project === projectId);
		if (match) {
			setPoop(match.image);
		}
	};

	return (
		<>
			<div className='main-navigation' ref={mainNavigation}>
				<div className='main-navigation__contact--container'>
					<span className='main-navigation__contact' onClick={handleContact}>
						Contact
					</span>
				</div>
				<div className='main-navigation__nav'>
					{sortedGroupedProjects.map(([year, projects]) => (
						<>
							<div key={year} className='main-navigation__nav--year'>
								<h6>{year}</h6>
							</div>
							<div className='main-navigation__nav--project-break'>
								<ul>
									{projects.map((item: any) => (
										<li key={item._uid}>
											<span
												onClick={() => handleClick(item.projectTitle)}
												onMouseEnter={() => handleTest(item.projectTitle)}
												onMouseLeave={() => setPoop("")}>
												{item.projectTitle}
											</span>
										</li>
									))}
								</ul>
							</div>
						</>
					))}
				</div>
			</div>
			{poop && (
				<div className='preview__container'>
					<div className='preview__image'>
						<img src={`${poop}/m//filters:quality(10)`} loading='lazy' />
					</div>
				</div>
			)}
			<div
				className='main-navigation__blurred-background'
				ref={blurredBackground}
				onClick={() => setIsMenuOpen(false)}></div>
		</>
	);
}
