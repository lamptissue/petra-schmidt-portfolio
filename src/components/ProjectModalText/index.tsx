import { storyblokEditable } from "@storyblok/react";

import "./styles.scss";

export default function ProjectModalText({ blok }: { blok: any }) {
	return (
		<div {...storyblokEditable(blok)} className='projectModal'>
			{blok.text}
		</div>
	);
}
