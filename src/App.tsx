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
		// const landingPageColours = [
		// 	["#B8A9C9", "#D5C3AA", "#C7D3D4", "#EDE6D8"],
		// 	["#A4C4C9", "#E3D5B4", "#B8C2A8", "#F4E1D2"],
		// 	["#CAD2C5", "#E6CCB2", "#DCE2E1", "#F4EBE7"],
		// 	["#A3B9B3", "#E1D3C4", "#CFD8D3", "#FAF3DD"],
		// 	["#BDC3B2", "#DED9C0", "#BFC5C3", "#FFF0E1"],
		// 	["#C5C6C7", "#DFDAC6", "#B1C2C9", "#F8E9D2"],
		// ];

		const landingPageColours = [
			// Set 1: Earthy Tones
			[
				"hsla(34, 70%, 45%, 1)", // Rich Earthy Orange
				"hsla(25, 55%, 42%, 1)", // Warm Clay
				"hsla(10, 35%, 40%, 1)", // Deep Brick Red
				"hsla(42, 50%, 38%, 1)", // Muted Golden Brown
			],
			// Set 2: Pastel Tones
			[
				"hsla(200, 60%, 85%, 1)", // Soft Sky Blue
				"hsla(135, 50%, 80%, 1)", // Light Mint Green
				"hsla(300, 45%, 75%, 1)", // Lavender Mist
				"hsla(45, 70%, 80%, 1)", // Pastel Cream
			],
			// Set 3: Earthy Tones
			[
				"hsla(60, 50%, 60%, 1)", // Muted Sand
				"hsla(20, 35%, 50%, 1)", // Rust Orange
				"hsla(75, 45%, 40%, 1)", // Olive Green
				"hsla(0, 20%, 35%, 1)", // Terracotta
			],
			// Set 4: Pastel Tones
			[
				"hsla(330, 60%, 85%, 1)", // Soft Blush Pink
				"hsla(120, 40%, 85%, 1)", // Pale Pastel Green
				"hsla(210, 35%, 90%, 1)", // Light Baby Blue
				"hsla(285, 55%, 85%, 1)", // Lilac
			],
			// Set 5: Earthy + Pastel Mix
			[
				"hsla(50, 60%, 50%, 1)", // Warm Mustard
				"hsla(30, 70%, 55%, 1)", // Burnt Sienna
				"hsla(100, 30%, 70%, 1)", // Pastel Sage
				"hsla(240, 20%, 85%, 1)", // Light Greyish Blue
			],
		];

		// 		background-color:hsla(0,100%,50%,0.69);
		// background-image:
		// radial-gradient(at 6% 13%, hsla(28,100%,74%,1) 0px, transparent 50%),
		// radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%),
		// radial-gradient(at 83% 76%, hsla(355,100%,93%,1) 0px, transparent 50%);

		const getRandomIndex = (array: any) => {
			return Math.floor(Math.random() * array.length);
		};

		// console.log("random it", getRandomIndex(landingPageColours));

		setBackgroundColour(landingPageColours[getRandomIndex(landingPageColours)]);
		// console.log(backgroundColours);
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

	// get the year
	// 	const result = []
	// 	let lastYear = null
	// 	const year = new Date(blok...).getFullYear()

	// 	const displayYear = year !== lastYear

	// 	postMessage.displayYear = displayYear
	// result.push(post)
	// 	lastYear = year

	return (
		<>
			<Menu
				isMenuOpen={isMenuOpen}
				setIsMenuOpen={setIsMenuOpen}
				handleContact={handleContact}
				blok={projectBlok}
				activeItem={activeItem}
				setIsContactOpen={setIsContactOpen}
				isContactOpen={isContactOpen}
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
				{isHeaderVisible
					? !isMenuOpen && <ScrollToTop showScrollButton={showScrollButton} scrollUp={handleScrollUp} />
					: ""}
			</main>
		</>
	);
}

export default App;
