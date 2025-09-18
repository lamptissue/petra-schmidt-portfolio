import { storyblokEditable } from "@storyblok/react";
import "./styles.scss";

type LandingPageBlok = {
	text?: string;
	title?: string;
	_editable?: string;
};

export default function LandingPage({ blok }: { blok: LandingPageBlok }) {
	return (
		<section {...storyblokEditable(blok)} className='home-background'>
			<div className='introduction-paragraph'>
				<h2 className='text-h6'>{blok?.text}</h2>
			</div>
			<div className='blur-container'></div>
			<p>{blok?.title}</p>
		</section>
	);
}
