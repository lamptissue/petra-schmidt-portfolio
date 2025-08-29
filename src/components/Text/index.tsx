"use client";
import { richTextResolver } from "@storyblok/richtext";
import "./styles.scss";

export default function Text({ textContent, blok }: { textContent: any; blok: any }) {
	let richtextHtml: any =
		blok.rich_text && blok.rich_text.content && Array.isArray(blok.rich_text.content)
			? richTextResolver().render(blok.rich_text)
			: null;
	return (
		<>
			{textContent ? (
				<div className='text-wrapper'>{textContent}</div>
			) : (
				blok?.rich_text && (
					<div className='rich-wrapper'>
						<div className='rich-text-content' dangerouslySetInnerHTML={{ __html: richtextHtml }} />
					</div>
				)
			)}
		</>
	);
}
