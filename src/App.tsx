import { useStoryblok, StoryblokComponent } from "@storyblok/react";
import { useState } from "react";

import Header from "./components/Header";
import Menu from "./components/Menu";
import Contact from "./components/Contact";

function App() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isContactOpen, setIsContactOpen] = useState(false);

	let slug = window.location.pathname === "/" ? "home" : window.location.pathname.replace("/", "");

	const story = useStoryblok(slug, { version: "draft" });
	if (!story || !story.content) {
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

	const projectBlok = story.content.body.filter((item: any) => item.component === "project");

	return (
		<>
			<Header handleMenu={handleMenu} />
			<Menu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} handleContact={handleContact} blok={projectBlok} />
			<Contact isContactOpen={isContactOpen} blok={contactBlok} />
			<StoryblokComponent blok={story.content} />
		</>
	);
}
export default App;
