import { StoryblokComponent, storyblokEditable } from "@storyblok/react";
// import { useEffect, useState } from "react";

const Page = ({ blok }: { blok: any }) => {
	// const [headerFontSize, setHeaderFontSize] = useState("90px");

	// useEffect(() => {
	// 	const mainElement = document.querySelector("main");

	// 	const handleScroll = () => {
	// 		console.log(mainElement.scrollY, "Scroll event detected");
	// 		if (window.scrollY > 700) {
	// 			setHeaderFontSize("30px");
	// 		} else {
	// 			setHeaderFontSize("90px");
	// 		}
	// 	};

	// 	mainElement.addEventListener("scroll", handleScroll);

	// 	return () => {
	// 		mainElement.removeEventListener("scroll", handleScroll);
	// 	};
	// }, []);

	return (
		<main {...storyblokEditable(blok)}>
			{blok.body ? blok.body.map((blok: any) => <StoryblokComponent blok={blok} key={blok._uid} />) : null}
		</main>
	);
};

export default Page;
