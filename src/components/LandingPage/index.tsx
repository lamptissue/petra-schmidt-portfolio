import { storyblokEditable } from "@storyblok/react";
import "./styles.scss";

const LandingPage = ({ blok, backgroundColours }: { blok: any; backgroundColours: any }) => {
	return (
		<section
			{...storyblokEditable(blok)}
			className='home-background'
			style={{
				backgroundColor: `hsl(${backgroundColours[0]})`,
				backgroundImage: `
					radial-gradient(at 6% 13%, hsl(${backgroundColours[1]}) 0px, transparent 50%),
					radial-gradient(at 80% 0%, hsl(${backgroundColours[2]}) 0px, transparent 50%),
					radial-gradient(at 83% 76%, hsl(${backgroundColours[3]}) 0px, transparent 50%)
				`,
			}}>
			<div className='introduction-paragraph'>
				<h2 className='text-h6'>{blok.text}</h2>
			</div>
			<div className='blur-container'></div>
			<p>{blok.title}</p>
		</section>
	);
};

export default LandingPage;
