"use client";
import { useEffect, useState, useRef } from "react";
import type React from "react";
import { useStoryblokState, type ISbStoryData } from "@storyblok/react";

import Contact from "@/components/Contact";
import Header from "@/components/Header";
import LandingPage from "@/components/LandingPage";
import Menu from "@/components/Menu";
import Project from "@/components/Project";
import ScrollToTop from "@/components/ScrollToTop";

import { useBodyOverflow } from "@/components/hooks/useBodyOverflow";

type BaseBlok = { _uid: string; component: string } & Record<string, unknown>;
type LandingPageBlok = BaseBlok & { component: "landingPage"; text?: string; title?: string };
type ContactBlok = BaseBlok & { component: "contact"; phone?: string };
type ProjectBlok = BaseBlok & {
	component: "project";
	projectTitle: string;
	year?: number;
	backgroundImage?: { filename: string; alt?: string };
};
type BodyBlok = LandingPageBlok | ContactBlok | ProjectBlok;
type StoryContent = { body?: BodyBlok[] };

type HomeProps = { data: ISbStoryData<StoryContent> };

export default function Home({ data }: HomeProps) {
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
	const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
	const [activeItem, setActiveItem] = useState<string>("");
	const [isLargeHeader, setIsLargeHeader] = useState<boolean>(true);
	const [showScrollButton, setShowScrollButton] = useState<boolean>(false);

	const liveStory = useStoryblokState<StoryContent>(data);

	const refScrollUp = useRef<HTMLDivElement | null>(null);

	const handleScrollUp = () => {
		refScrollUp.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		if (activeItem === "" || isMenuOpen) {
			setIsLargeHeader(true);
		} else if (activeItem !== "" && !isMenuOpen) {
			setIsLargeHeader(false);
		}
	}, [isMenuOpen, activeItem]);

	const handlePageScroll = (e: React.UIEvent<HTMLElement>) => {
		const top = e.currentTarget.scrollTop;

		if (top <= window.innerHeight - 200) {
			setIsLargeHeader(true);
			setActiveItem("");
		} else {
			setIsLargeHeader(false);
		}

		top <= window.innerHeight * 2 ? setShowScrollButton(false) : setShowScrollButton(true);
	};

	useBodyOverflow(isMenuOpen);

	const handleMenu = () => {
		if (isContactOpen) {
			handleContact();

			if (window.innerWidth < 870) {
				setIsMenuOpen((prevState) => !prevState);
			} else {
				setTimeout(() => setIsMenuOpen((prevState) => !prevState), 500);
			}
		} else {
			setIsMenuOpen((prevState) => !prevState);
		}
	};

	const handleContact = () => setIsContactOpen((prevState) => !prevState);

	const rawBody = liveStory?.content?.body ?? [];
	const body: BodyBlok[] = Array.isArray(rawBody) ? (rawBody as BodyBlok[]) : [];

	const landingBlok = body.find((b): b is LandingPageBlok => b.component === "landingPage") ?? null;
	const contactBlok = body.find((b): b is ContactBlok => b.component === "contact") ?? null;

	const projectBlok: ProjectBlok[] = body
		.filter((b): b is ProjectBlok => b.component === "project")
		.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));

	return (
		<>
			<Header onMenuClick={handleMenu} isLargeHeader={isLargeHeader} />

			<Menu
				isMenuOpen={isMenuOpen}
				data={projectBlok}
				handleMenu={handleMenu}
				activeItem={activeItem}
				handleContact={handleContact}
			/>
			<Contact blok={contactBlok} isContactOpen={isContactOpen} handleContact={handleContact} />

			<main onScroll={(e) => handlePageScroll(e)}>
				<div ref={refScrollUp}></div>
				{landingBlok && <LandingPage blok={landingBlok} />}{" "}
				{projectBlok?.map((item) => {
					return <Project key={item._uid} blok={item as any} setActiveItem={setActiveItem} />;
				})}
				<ScrollToTop showScrollButton={showScrollButton} scrollUp={handleScrollUp} />
			</main>
		</>
	);
}
