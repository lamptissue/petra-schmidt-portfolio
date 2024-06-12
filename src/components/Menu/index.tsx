import { useEffect, useRef } from "react";

import "./styles.scss";

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

	// Group projects by year
	const groupedProjects = blok.reduce((acc: any, project: any) => {
		const { year } = project;
		if (!acc[year]) {
			acc[year] = [];
		}
		acc[year].push(project);
		return acc;
	}, {});

	return (
		<>
			<div className='main-navigation' ref={mainNavigation}>
				<div className='main-navigation__contact--container'>
					<span className='main-navigation__contact' onClick={handleContact}>
						Contact
					</span>
				</div>
				<div className='main-navigation__nav'>
					<table>
						<tbody>
							{Object.keys(groupedProjects).map((year) => (
								<tr key={year}>
									<td>{year}</td>
									<td>
										<ul>
											{groupedProjects[year].map((project: any) => (
												<li key={project.projectTitle}>{project.projectTitle}</li>
											))}
										</ul>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
			<div
				className='main-navigation__blurred-background'
				ref={blurredBackground}
				onClick={() => setIsMenuOpen(false)}></div>
		</>
	);
}
