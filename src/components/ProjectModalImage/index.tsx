import { storyblokEditable } from "@storyblok/react";

import "./styles.scss";

export default function ProjectModalImage({ blok }: { blok: any }) {
	return (
		<div {...storyblokEditable(blok)} className='project-modal__main-content'>
			<img src={blok.image.filename} alt='' />
		</div>
	);
}
