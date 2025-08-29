import { apiPlugin, storyblokInit } from "@storyblok/react/rsc";

import Contact from "../components/Contact";
import LandingPage from "@/components/LandingPage";
import Menu from "@/components/Menu";

export const getStoryblokApi = storyblokInit({
	accessToken: process.env.NEXT_PUBLIC_STORYBLOK_CONTENT_API_ACCESS_TOKEN,
	use: [apiPlugin],
	apiOptions: {
		region: "eu",
	},
	components: {
		contact: Contact,
		landingPage: LandingPage,
		menu: Menu,
	},
});
