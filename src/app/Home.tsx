"use client";
import { useEffect, useState, useRef, useMemo } from "react";
import { useStoryblokState } from "@storyblok/react";

import Contact from "@/components/Contact";
import Header from "@/components/Header";
import LandingPage from "@/components/LandingPage";
import Menu from "@/components/Menu";
import Project from "@/components/Project";
import ScrollToTop from "@/components/ScrollToTop";

import { useBodyOverflow } from "@/components/hooks/useBodyOverflow";

export default function Home({ data }: { data: any }) {
	const landingPageColours = [
		["0, 100%, 84%", "153, 68%, 73%", "48, 67%, 68%", "0, 62%, 64%"],
		["200, 60%, 85%", "135, 50%, 80%", "300, 45%, 75%", "45, 70%, 80%"],
		["18, 100%, 70%", "83, 63%, 64%", "210, 59%, 83%", "100, 39%, 68%"],
		["81, 25%, 73%", "50, 56%, 81%", "284, 55%, 85%", "164, 35%, 64%"],
		["49, 78%, 51%", "29, 89%, 64%", "45, 68%, 67%", "100, 39%, 68%"],
	];

	useEffect(() => {
		const next = landingPageColours[Math.floor(Math.random() * landingPageColours.length)];

		const root = document.documentElement;
		root.style.setProperty("--background-color-1", next[0]);
		root.style.setProperty("--background-color-2", next[1]);
		root.style.setProperty("--background-color-3", next[2]);
		root.style.setProperty("--background-color-4", next[3]);

		return () => {
			root.style.removeProperty("--background-color-1");
			root.style.removeProperty("--background-color-2");
			root.style.removeProperty("--background-color-3");
			root.style.removeProperty("--background-color-4");
		};
	}, []);

	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
	const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
	const [activeItem, setActiveItem] = useState<string>("");
	const [isLargeHeader, setIsLargeHeader] = useState<boolean>(true);
	const [showScrollButton, setShowScrollButton] = useState<boolean>(false);

	const liveStory = useStoryblokState<any>(data);

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

	const landingBlok = liveStory?.content?.body.find((item: any) => item.component === "landingPage");

	const contactBlok = liveStory?.content?.body.find((item: any) => item.component === "contact");

	const projectBlok = liveStory?.content?.body
		.filter((item: any) => item.component === "project")
		.sort((a: any, b: any) => (b.year ?? 0) - (a.year ?? 0));

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
				<LandingPage blok={landingBlok} />
				{projectBlok?.map((item: any) => {
					return <Project key={item._uid} blok={item} setActiveItem={setActiveItem} />;
				})}
				<ScrollToTop showScrollButton={showScrollButton} scrollUp={handleScrollUp} />
			</main>
		</>
	);
}
