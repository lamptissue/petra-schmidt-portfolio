import { useEffect, useRef } from "react";

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

	const groupedProjects = blok.reduce((acc: any, project: any) => {
		const { year } = project;
		if (!acc[year]) {
			acc[year] = [];
		}
		acc[year].push({ projectTitle: project.projectTitle, ...project });
		return acc;
	}, {});

	const sortedGroupedProjects = Object.entries(groupedProjects).reverse() as [string, Project[]][];

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
						<div key={year}>
							<p>{year}</p>
							<ul>
								{projects.map((item: any) => (
									<li key={item._uid}>{item.projectTitle}</li>
								))}
							</ul>
						</div>
					))}
					{/* <table>
						<tbody>
							{sortedGroupedProjects.map(([year, projects]) => (
								<tr key={year}>
									<td>{year}</td>
									<td>
										<ul>
											{projects.map((project) => (
												<li key={project._uid}>{project.projectTitle}</li>
											))}
										</ul>
									</td>
								</tr>
							))}
						</tbody>
					</table> */}
				</div>
			</div>
			<div
				className='main-navigation__blurred-background'
				ref={blurredBackground}
				onClick={() => setIsMenuOpen(false)}></div>
		</>
	);
}
