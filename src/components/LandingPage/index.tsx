import { storyblokEditable } from "@storyblok/react";
import "./styles.scss";

const LandingPage = ({ blok }: { blok: any }) => {
	return (
		<section {...storyblokEditable(blok)} className='home-background'>
			<div className='introduction-paragraph'>
				<h6>{blok.text}</h6>
			</div>
			<div className='blur-container'></div>
			<div className='box1'></div>
			<div className='box2'></div>
			<div className='box3'></div>
			<p>{blok.title}</p>
		</section>
	);
};

export default LandingPage;
