import { useState, Fragment } from "react";
import { getDimensions } from "@/lib/getDimension";

import Image from "next/image";

import "./styles.scss";

interface Project {
	year: number;
	projectTitle: string;
	id: string;
}

export default function Menu({
	data,
	isMenuOpen,
	handleMenu,
	handleContact,
	isContactOpen,
	activeItem,
}: {
	data: any;
	isMenuOpen: any;
	handleMenu: any;
	handleContact: any;
	isContactOpen: any;
	activeItem: any;
}) {
	const [previewImage, setPreviewImage] = useState("");

	const handleClick = (projectId: string) => {
		handleMenu();
		const projectElement = document.getElementById(projectId);
		setPreviewImage("");
		if (projectElement) {
			setTimeout(() => {
				projectElement.scrollIntoView({ behavior: "smooth" });
			}, 800);
		}
	};

	const groupedProjects = data?.reduce((acc: any, project: any) => {
		const { year } = project;
		if (!acc[year]) {
			acc[year] = [];
		}
		acc[year].push({
			projectTitle: project.projectTitle,
			image: project.backgroundImage.filename,
			id: project._uid,
		});
		return acc;
	}, {});

	const sortedGroupedProjects = groupedProjects
		? (Object?.entries(groupedProjects)?.reverse() as [string, Project[]][])
		: [];

	return (
		<>
			<div className={`main-navigation ${isMenuOpen ? "open" : ""}`}>
				<div className='main-navigation__contact--container'>
					<span className='main-navigation__contact' onClick={handleContact}>
						Contact
					</span>
				</div>
				<div className='main-navigation__nav--wrapper'>
					<div className='main-navigation__nav'>
						{sortedGroupedProjects.map(([year, projects]) => (
							<Fragment key={year}>
								<div key={year} className='main-navigation__nav--year'>
									<h6>{year}</h6>
								</div>
								<div className='main-navigation__nav--project-break'>
									<ul>
										{projects.map((item: any) => (
											<li
												key={item.id}
												onMouseEnter={() => setPreviewImage(item.projectTitle)}
												onMouseLeave={() => setPreviewImage("")}
												className={activeItem === item.projectTitle ? "active" : ""}>
												<span onClick={() => handleClick(item.projectTitle)}>{item.projectTitle}</span>
											</li>
										))}
									</ul>
								</div>
							</Fragment>
						))}
					</div>
				</div>
			</div>

			{isMenuOpen && (
				<div className='preview__container' onClick={handleMenu}>
					{data.map((item: any) => {
						const isPortrait = getDimensions(item.backgroundImage.filename);
						return (
							<div
								className={`preview__image ${item.projectTitle === previewImage ? "active" : ""} ${
									isPortrait ? "preview-portrait" : "preview-landscape"
								}`}
								key={item._uid}>
								<Image
									fill={true}
									sizes='(max-width: 1200px) 50vw, 33vw'
									style={{
										objectFit: "cover",
									}}
									alt={item.backgroundImage.alt}
									src={`${item.backgroundImage.filename}/m/filters:format(webp)`}
								/>
							</div>
						);
					})}
				</div>
			)}

			<div className={`main-navigation__blurred-background ${isMenuOpen ? "blur" : ""}`}></div>
		</>
	);
}
