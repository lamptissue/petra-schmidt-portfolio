"use client";
import { useState, Fragment, useMemo } from "react";
import { getDimensions } from "@/lib/getDimension";
import { storyblokEditable } from "@storyblok/react";
import Image from "next/image";

import "./styles.scss";

type Props = {
	data: any;
	isMenuOpen: boolean;
	handleMenu: () => void;
	handleContact: () => void;
	activeItem: string;
};

type Grouped = Record<number, Array<{ projectTitle: string; image: string; id: string }>>;

export default function Menu({ data, isMenuOpen, handleMenu, handleContact, activeItem }: Props) {
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

	const groupedProjects = useMemo(() => {
		if (!Array.isArray(data)) return {} as Grouped;
		return data.reduce<Grouped>((acc, project) => {
			const year = project.year ?? 0;
			if (!acc[year]) acc[year] = [];
			if (project.backgroundImage) {
				acc[year].push({
					projectTitle: project.projectTitle,
					image: project.backgroundImage.filename,
					id: project._uid,
				});
			}
			return acc;
		}, {});
	}, [data]);

	const sortedGroupedProjects = groupedProjects
		? (Object?.entries(groupedProjects)?.reverse() as [string, Grouped[keyof Grouped]][])
		: [];

	return (
		<>
			<div {...storyblokEditable(data)} className={`main-navigation ${isMenuOpen ? "open" : ""}`}>
				<div className='main-navigation__contact--container'>
					<button
						className='main-navigation__contact'
						onClick={handleContact}
						aria-label='Open contact information'>
						Contact
					</button>
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
										{projects.map((item) => (
											<li
												key={item.id}
												tabIndex={0}
												role='button'
												onMouseEnter={() => setPreviewImage(item.projectTitle)}
												onMouseLeave={() => setPreviewImage("")}
												onFocus={() => setPreviewImage(item.projectTitle)}
												onBlur={() => setPreviewImage("")}
												onClick={() => handleClick(item.projectTitle)}
												onKeyDown={(e) => {
													if (e.key === "Enter" || e.key === " ") {
														e.preventDefault();
														handleClick(item.projectTitle);
													}
												}}>
												<span className={activeItem === item.projectTitle ? "active" : ""}>{item.projectTitle}</span>
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
						if (!item.backgroundImage) return null;
						const isPortrait = getDimensions(item.backgroundImage.filename);
						return (
							<div
								className={`preview__image ${item.projectTitle === previewImage ? "active-preview" : ""} ${
									isPortrait ? "preview-portrait" : "preview-landscape"
								}`}
								key={item._uid}>
								<Image
									fill={true}
									sizes='(max-width: 1200px) 50vw, 33vw'
									style={{
										objectFit: "cover",
									}}
									alt={item.backgroundImage.alt || ""}
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
