import { storyblokEditable } from "@storyblok/react";

import "./styles.scss";
const Contact = ({ blok, isContactOpen }: { blok: any; isContactOpen: any }) => {
	return (
		<div className={`contact__container ${isContactOpen ? "contact--open" : ""}`} {...storyblokEditable(blok)}>
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
