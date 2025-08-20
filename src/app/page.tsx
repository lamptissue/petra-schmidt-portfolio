import Home from "./Home";
import { getStoryblokApi } from "@/lib/storyblok";

export default async function page() {
	const { data } = await fetchData();

	return <Home data={data.story} />;
}

export async function fetchData() {
	const storyblokApi = getStoryblokApi();
	return await storyblokApi.get(`cdn/stories/home`, { version: "draft" });
}
