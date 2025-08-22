import Home from "./Home";
import type { Metadata } from "next";
import { cache } from "react";
import { getStoryblokApi } from "@/lib/storyblok";

export async function generateMetadata(): Promise<Metadata> {
	const { data } = await fetchData();
	const story = data.story;

	return {
		title: story.content.title,
		description: story.content.description,
		keywords: story.content.tags,
		authors: [{ name: story.content.author }],
		openGraph: {
			title: story.content.title,
			description: story.content.description,
			images: [
				{
					url: story.content.image.filename,
					alt: story.content.title,
				},
			],
			url: story.content.url,
		},
		twitter: {
			title: story.content.title,
			description: story.content.description,
			images: [story.content.image.filename],
		},
	};
}

export default async function page() {
	const { data } = await fetchData();

	return <Home data={data.story} />;
}

const fetchData = cache(async () => {
	const storyblokApi = getStoryblokApi();
	return await storyblokApi.get(`cdn/stories/home`, { version: "draft" });
});
