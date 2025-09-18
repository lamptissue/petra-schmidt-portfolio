import { storyblokEditable } from "@storyblok/react";
import { Instagram, LinkedIn, Cross } from "../Icons";
import "./styles.scss";

type Props = {
	blok: any;
	isContactOpen: boolean;
	handleContact: () => void;
};

const Contact = ({ blok, isContactOpen, handleContact }: Props) => {
	const phoneNumber = blok?.phone && blok.phone;
	let formattedNumber = phoneNumber?.replace(/[^+\d]/g, "");

	formattedNumber = formattedNumber?.replace(/\(0\)/, "");

	return (
		<div className={`contact__container ${isContactOpen ? "contact__open" : ""}`} {...storyblokEditable(blok)}>
			<div className='contact__wrapper'>
				<button onClick={handleContact} className='contact__cross' aria-label='close'>
					<Cross />
				</button>
				<div className='text-block'>
					<p>{blok?.about}</p>
				</div>

				<div className='socials'>
					{blok?.phone && <a href={`tel:${formattedNumber}`}>{blok.phone}</a>}
					{blok?.email?.email && <a href={`mailto:${blok.email.email}`}>{blok?.email.email}</a>}
					<div className='socials__links'>
						{blok?.instagram?.url && (
							<a href={blok.instagram.url} target='_blank' rel='noopener noreferrer'>
								<Instagram />
							</a>
						)}
						{blok?.linkedin?.url && (
							<a href={blok.linkedin.url} target='_blank' rel='noopener noreferrer'>
								<LinkedIn />
							</a>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
export default Contact;
