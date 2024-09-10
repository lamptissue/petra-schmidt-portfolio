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
	const [bigSize, setBigSize] = useState(window.innerWidth < 768 ? "56" : "72");
	const [smallSize, setSmallSize] = useState(window.innerWidth < 768 ? "24" : "32");

	const [headersize, setHeaderSize] = useState(bigSize);
	const [showScrollButton, setShowScrollButton] = useState(false);
	const refScrollUp = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleResize = () => {
			setBigSize(window.innerWidth < 768 ? "56" : "72");
			setSmallSize(window.innerWidth < 768 ? "24" : "32");
		};
		window.addEventListener("resize", handleResize);

		handleResize();

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	useEffect(() => {
		const landingPageColours = [
			["0,100%,84%", "30,66%,66%", "36,45%,51%", "0,62%,64%"],
			["200, 60%, 85%", "135, 50%, 80%", "300, 45%, 75%", "45, 70%, 80%"],
			["306,62%,76%", "233,65%,62%", "35,97%,69%", "220,100%,80%"],
			["330, 60%, 85%", "120, 40%, 85%", "210, 35%, 90%", "285, 55%, 85%"],
			["50, 60%, 50%", "30, 70%, 55%", "100, 30%, 70%", "240, 20%, 85%"],
		];

		const getRandomIndex = (array: Array<any>) => {
			return Math.floor(Math.random() * array.length);
		};

		setBackgroundColour(landingPageColours[getRandomIndex(landingPageColours)]);
		// setBackgroundColour(landingPageColours[0]);
	}, []);

	useEffect(() => {
		if (activeItem === "" || isMenuOpen) {
			setHeaderSize(bigSize);
		} else if (activeItem !== "" && !isMenuOpen) {
			setHeaderSize(smallSize);
		}
	}, [isMenuOpen, activeItem, bigSize, smallSize]);

	let slug = window.location.pathname === "/" ? "home" : window.location.pathname.replace("/", "");

	const story = useStoryblok(slug, { version: "draft" });
	if (!story || !story.content || !story.content.body) {
		return;
	}

	const handlePageScroll = (e: any) => {
		if (e.target.scrollTop === 0 || e.target.scrollTop <= window.innerHeight - 200) {
			setActiveItem("");
			setHeaderSize(bigSize);
		} else if (e.target.scrollTop >= window.innerHeight - 200) {
			setHeaderSize(smallSize);
		}

		if (e.target.scrollTop === 0 || e.target.scrollTop <= window.innerHeight * 2) {
			setShowScrollButton(false);
		} else if (e.target.scrollTop > 1000) {
			setShowScrollButton(true);
		}
	};

	const handleMenu = () => {
		if (isContactOpen) {
			handleContact();
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
				handleContact={handleContact}
				blok={projectBlok}
				activeItem={activeItem}
				handleMenu={handleMenu}
			/>
			<Contact isContactOpen={isContactOpen} blok={contactBlok} />

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
				{isHeaderVisible && !isMenuOpen && (
					<ScrollToTop showScrollButton={showScrollButton} scrollUp={handleScrollUp} />
				)}
			</main>
		</>
	);
}

export default App;
