import { useStoryblok } from "@storyblok/react";

import { useState } from "react";

import Header from "./components/Header";
import Menu from "./components/Menu";
import Contact from "./components/Contact";
import Project from "./components/Project";
import LandingPage from "./components/LandingPage";

function App() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isContactOpen, setIsContactOpen] = useState(false);
	const [isHeaderVisible, setIsHeaderVisible] = useState(true); // State to control header visibility

	let slug = window.location.pathname === "/" ? "home" : window.location.pathname.replace("/", "");

	const story = useStoryblok(slug, { version: "draft" });
	if (!story || !story.content || !story.content.body) {
		return <div>Loading...</div>;
	}

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

	console.log(projectBlok);

	return (
		<>
			<Menu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} handleContact={handleContact} blok={projectBlok} />
			<Contact isContactOpen={isContactOpen} blok={contactBlok} />
			<main>
				{isHeaderVisible && <Header handleMenu={handleMenu} />}
				<LandingPage blok={landingBlok} />
				{projectBlok.map((item: any) => {
					return <Project key={item._uid} blok={item} setIsHeaderVisible={setIsHeaderVisible} />;
				})}
			</main>
		</>
	);
}
export default App;
