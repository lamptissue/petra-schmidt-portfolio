import { useStoryblok } from "@storyblok/react";
import { useEffect, useState, useRef } from "react";
import Contact from "./components/Contact";
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import Menu from "./components/Menu";
import Project from "./components/Project";
import ScrollToTop from "./components/ScrollToTop";

function App() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isContactOpen, setIsContactOpen] = useState(false);
	const [isHeaderVisible, setIsHeaderVisible] = useState(true);
	const [backgroundColours, setBackgroundColour] = useState<string[]>([]);
	const [activeItem, setActiveItem] = useState("");
	const [headersize, setHeaderSize] = useState(72);
	const [showScrollButton, setShowScrollButton] = useState(false);
	const refScrollUp = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const landingPageColours = [
			["#B8A9C9", "#D5C3AA", "#C7D3D4", "#EDE6D8"],
			["#A4C4C9", "#E3D5B4", "#B8C2A8", "#F4E1D2"],
			["#CAD2C5", "#E6CCB2", "#DCE2E1", "#F4EBE7"],
			["#A3B9B3", "#E1D3C4", "#CFD8D3", "#FAF3DD"],
			["#BDC3B2", "#DED9C0", "#BFC5C3", "#FFF0E1"],
			["#C5C6C7", "#DFDAC6", "#B1C2C9", "#F8E9D2"],
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
		return;
	}

	const handlePageScroll = (e: any) => {
		if (e.target.scrollTop === 0 || e.target.scrollTop <= window.innerHeight - 200) {
			setActiveItem("");
			setHeaderSize(72);
		} else if (e.target.scrollTop >= window.innerHeight - 200) {
			setHeaderSize(32);
		}

		if (e.target.scrollTop === 0 || e.target.scrollTop <= window.innerHeight * 2) {
			setShowScrollButton(false);
		} else if (e.target.scrollTop > 1000) {
			setShowScrollButton(true);
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

	const handleScrollUp = () => {
		refScrollUp.current?.scrollIntoView({ behavior: "smooth" });
	};

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

			<ScrollToTop showScrollButton={showScrollButton} scrollUp={handleScrollUp} />
			<main onScroll={(e) => handlePageScroll(e)}>
				{isHeaderVisible && <Header handleMenu={handleMenu} headersize={headersize} />}
				<div ref={refScrollUp}></div>
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
