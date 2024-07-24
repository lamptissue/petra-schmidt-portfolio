import { useStoryblok } from "@storyblok/react";

import { useEffect, useState } from "react";

import Contact from "./components/Contact";
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import Menu from "./components/Menu";
import Project from "./components/Project";

function App() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isContactOpen, setIsContactOpen] = useState(false);
	const [isHeaderVisible, setIsHeaderVisible] = useState(true);
	const [backgroundColours, setBackgroundColour] = useState<string[]>([]);
	const [activeItem, setActiveItem] = useState("");

	const [headersize, setHeaderSize] = useState(72);

	useEffect(() => {
		const landingPageColours = [
			["pink", "cyan", "yellow"],
			["#E6E6FA", "#98FF98", "#FFDAB9"],
			["#7DF9FF", "#FF69B4", "#FF4500"],
			["#228B22", "#FFDB58", "#CB4154"],
		];

		const getRandomIndex = (array: any) => {
			return Math.floor(Math.random() * array.length);
		};

		setBackgroundColour(landingPageColours[getRandomIndex(landingPageColours)]);
	}, []);

	useEffect(() => {
		if (activeItem === "" || isMenuOpen) {
			setHeaderSize(72);
		} else if (activeItem !== "" && !isMenuOpen) {
			setHeaderSize(32);
		}
	}, [isMenuOpen, activeItem]);

	let slug = window.location.pathname === "/" ? "home" : window.location.pathname.replace("/", "");

	const story = useStoryblok(slug, { version: "draft" });
	if (!story || !story.content || !story.content.body) {
		return <div>Loading...</div>;
	}

	const handleHeaderSize = (e: any) => {
		if (e.target.scrollTop === 0 || e.target.scrollTop <= window.innerHeight - 200) {
			setActiveItem("");
			setHeaderSize(72);
		} else if (e.target.scrollTop >= window.innerHeight - 200) {
			setHeaderSize(32);
		}
	};

	const handleMenu = () => {
		if (isContactOpen) {
			setIsContactOpen(false);
			setTimeout(() => {
				setIsMenuOpen((prevState) => !prevState);
			}, 500);
		} else {
			setIsMenuOpen((prevState) => !prevState);
		}
	};

	const handleContact = () => {
		setIsContactOpen((prevState) => !prevState);
	};

	const contactBlok = story.content.body.find((item: any) => item.component === "contact");

	const landingBlok = story.content.body.find((item: any) => item.component === "landingPage");

	const projectBlok = story.content.body
		.filter((item: any) => item.component === "project")
		.sort((a: any, b: any) => b.year - a.year);

	return (
		<>
			<Menu
				isMenuOpen={isMenuOpen}
				setIsMenuOpen={setIsMenuOpen}
				handleContact={handleContact}
				blok={projectBlok}
				activeItem={activeItem}
			/>
			<Contact isContactOpen={isContactOpen} blok={contactBlok} />
			<main onScroll={(e) => handleHeaderSize(e)}>
				{isHeaderVisible && <Header handleMenu={handleMenu} headersize={headersize} />}
				<LandingPage blok={landingBlok} backgroundColours={backgroundColours} />
				{projectBlok.map((item: any) => {
					return (
						<Project
							key={item._uid}
							blok={item}
							setIsHeaderVisible={setIsHeaderVisible}
							backgroundColours={backgroundColours}
							setActiveItem={setActiveItem}
						/>
					);
				})}
			</main>
		</>
	);
}
export default App;
