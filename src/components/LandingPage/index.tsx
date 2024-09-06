import { storyblokEditable } from "@storyblok/react";
import "./styles.scss";

const LandingPage = ({ blok, backgroundColours }: { blok: any; backgroundColours: any }) => {
	console.log("background", backgroundColours);
	return (
		// <section
		// 	{...storyblokEditable(blok)}
		// 	className='home-background'
		// 	style={{
		// 		backgroundColor: backgroundColours[0],
		// 		backgroundImage: `
		// 			radial-gradient(at 6% 13%, ${backgroundColours[1]} 0px, transparent 50%),
		// 			radial-gradient(at 80% 0%, ${backgroundColours[2]} 0px, transparent 50%),
		// 			radial-gradient(at 83% 76%, ${backgroundColours[3]} 0px, transparent 50%)
		// 		`,
		// 	}}>
		<section {...storyblokEditable(blok)} className='home-background'>
			<div className='introduction-paragraph'>
				<h6>{blok.text}</h6>
			</div>
			<div className='blur-container'></div>
			<p>{blok.title}</p>
		</section>
	);
};

export default LandingPage;
