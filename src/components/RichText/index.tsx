import { richTextResolver } from "@storyblok/richtext";
import "./styles.scss";

export default function RichText({ blok }: { blok: any }) {
	let richtextHtml =
		blok.rich_text && blok.rich_text.content && Array.isArray(blok.rich_text.content)
			? richTextResolver().render(blok.rich_text)
			: null;
	return (
		<>
			{richtextHtml && (
				<div className='rich-wrapper'>
					<div className='rich-text-content' dangerouslySetInnerHTML={{ __html: richtextHtml }} />
				</div>
			)}
		</>
	);
}
