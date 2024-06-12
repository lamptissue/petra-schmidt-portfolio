import { storyblokEditable } from "@storyblok/react";
import { useEffect, useRef } from "react";

import "./styles.scss";
const Contact = ({ blok, isContactOpen }: { blok: any; isContactOpen: any }) => {
	const contactContainer = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isContactOpen) {
			contactContainer.current?.classList.add("contact--open");
		} else {
			contactContainer.current?.classList.remove("contact--open");
		}
	}, [isContactOpen]);

	return (
		<div className='contact__container' ref={contactContainer} {...storyblokEditable(blok)}>
			<div className='contact__wrapper'>
				<p>{blok.about}</p>
				<p>
					<a href={blok.social.url} target='_blank' rel='noopener noreferrer'>
						{blok.social.url}
					</a>
				</p>
				<p>
					<a href={`mailto:${blok.email.email}`}>{blok.email.email}</a>
				</p>
				<p>{blok.phone}</p>
			</div>
		</div>
	);
};
export default Contact;
