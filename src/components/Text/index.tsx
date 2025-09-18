"use client";
import { richTextResolver } from "@storyblok/richtext";
import "./styles.scss";

type RichTextJSON = Record<string, unknown>;

type Props = {
	textContent?: string;
	blok: { rich_text?: RichTextJSON };
};

export default function Text({ textContent, blok }: Props) {
	const html = blok.rich_text ? String(richTextResolver().render(blok.rich_text as any)) : null;

	return (
		<div className='text-wrapper'>
			{textContent ? (
				<div>{textContent}</div>
			) : (
				blok?.rich_text && <div className='rich-text-content' dangerouslySetInnerHTML={{ __html: html ?? "" }} />
			)}
		</div>
	);
}
