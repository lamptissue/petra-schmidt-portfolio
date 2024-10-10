import { useStoryblok } from "@storyblok/react";
import { Helmet, HelmetProvider } from "react-helmet-async";
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
	const prevWidth = useRef(window.innerWidth);

	useEffect(() => {
		const handleResize = () => {
			if (prevWidth.current !== window.innerWidth) {
				prevWidth.current = window.innerWidth;
				setBigSize(window.innerWidth < 768 ? "56" : "72");
				setSmallSize(window.innerWidth < 768 ? "24" : "32");
			}
		};
		window.addEventListener("resize", handleResize);

		handleResize();

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	useEffect(() => {
		const landingPageColours = [
			["0, 100%, 84%", "153, 68%, 73%", "48, 67%, 68%", "0, 62%, 64%"],
			["200, 60%, 85%", "135, 50%, 80%", "300, 45%, 75%", "45, 70%, 80%"],
			["18, 100%, 70%", "83, 63%, 64%", "210, 59%, 83%", "100, 39%, 68%"],
			["81, 25%, 73%", "50, 56%, 81%", "284, 55%, 85%", "164, 35%, 64%"],
			["49, 78%, 51%", "29, 89%, 64%", "45, 68%, 67%", "100, 39%, 68%"],
		];

		const getRandomIndex = (array: Array<any>) => {
			return Math.floor(Math.random() * array.length);
		};

		setBackgroundColour(landingPageColours[getRandomIndex(landingPageColours)]);
	}, []);
	``;

	useEffect(() => {
		if (activeItem === "" || isMenuOpen) {
			setHeaderSize(bigSize);
		} else if (activeItem !== "" && !isMenuOpen) {
			setHeaderSize(smallSize);
		}
	}, [isMenuOpen, activeItem, bigSize, smallSize]);

	const body = document.querySelector("body");

	useEffect(() => {
		isMenuOpen ? (body!.style.overflow = "hidden") : (body!.style.overflow = "auto");
	}, [isMenuOpen]);

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
			<HelmetProvider>
				<Helmet>
					<title>{story.content.title}</title>
					<meta name='description' content={story.content.description} />
					<meta name='keywords' content={story.content?.tags} />
					<meta name='author' content={story.content.author} />
					<meta property='og:title' content={story.content.title} />
					<meta property='og:description' content={story.content.description} />
					<meta property='og:image' content={story.content.image.filename} />
					<meta property='og:url' content={story.content.url} />
					<meta name='twitter:title' content={story.content.title} />
					<meta name='twitter:description' content={story.content.description} />
					<meta name='twitter:image' content={story.content.image.filename} />
				</Helmet>
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
			</HelmetProvider>
		</>
	);
}

export default App;
