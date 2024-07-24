import { useState } from "react";

import "./styles.scss";

interface Project {
	year: number;
	projectTitle: string;
	id: string;
}

export default function Menu({
	isMenuOpen,
	setIsMenuOpen,
	handleContact,
	blok,
	activeItem,
}: {
	isMenuOpen: any;
	setIsMenuOpen: any;
	handleContact: any;
	blok: any;
	activeItem: any;
}) {
	const [previewImage, setPreviewImage] = useState("");

	const handleClick = (projectId: string) => {
		setIsMenuOpen(false);
		const projectElement = document.getElementById(projectId);
		setPreviewImage("");
		if (projectElement) {
			setTimeout(() => {
				projectElement.scrollIntoView({ behavior: "smooth" });
			}, 500);
		}
	};

	const projectDetails = blok.map((item: any) => ({
		image: item.backgroundImage.filename,
		project: item.projectTitle,
	}));

	const groupedProjects = blok.reduce((acc: any, project: any) => {
		const { year } = project;
		if (!acc[year]) {
			acc[year] = [];
		}
		acc[year].push({
			projectTitle: project.projectTitle,
			image: project.backgroundImage.filename,
			id: project._uid,
			// ...project,
		});
		return acc;
	}, {});

	const sortedGroupedProjects = Object.entries(groupedProjects).reverse() as [string, Project[]][];

	const handleSetProjectPreview = (projectId: string) => {
		const match = projectDetails.find((projectDetail: any) => projectDetail.project === projectId);
		if (match) {
			setPreviewImage(match.image);
		}
	};

	return (
		<>
			<div className={`main-navigation ${isMenuOpen ? "open" : ""}`}>
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
										<li key={item.id}>
											<span
												onClick={() => handleClick(item.projectTitle)}
												onMouseEnter={() => handleSetProjectPreview(item.projectTitle)}
												onMouseLeave={() => setPreviewImage("")}
												className={activeItem === item.projectTitle ? "active" : ""}>
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
			{previewImage && (
				<div className='preview__container'>
					<div className='preview__image'>
						<img src={`${previewImage}/m/filters:quality(40)`} loading='lazy' />
					</div>
				</div>
			)}

			<div
				className={`main-navigation__blurred-background ${isMenuOpen ? "blur" : ""}`}
				onClick={() => setIsMenuOpen(false)}></div>
		</>
	);
}
