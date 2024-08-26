import { storyblokEditable } from "@storyblok/react";
import "./styles.scss";

const LandingPage = ({ blok, backgroundColours }: { blok: any; backgroundColours: any }) => {
	return (
		<section {...storyblokEditable(blok)} className='home-background' style={{ background: backgroundColours[3] }}>
			<div className='introduction-paragraph'>
				<h6>{blok.text}</h6>
			</div>
			<div className='blur-container'></div>
			<div className='box1' style={{ background: backgroundColours[0] }}></div>
			<div className='box2' style={{ background: backgroundColours[1] }}></div>
			<div className='box3' style={{ background: backgroundColours[2] }}></div>
			<p>{blok.title}</p>
		</section>
	);
};

export default LandingPage;
