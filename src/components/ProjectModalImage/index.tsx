import { storyblokEditable } from "@storyblok/react";

import "./styles.scss";

export default function ProjectModalImage({ blok }: { blok: any }) {
	return (
		<div {...storyblokEditable(blok)} className='projectModal'>
			<img src={blok.img} alt='' />
		</div>
	);
}
