import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./assets/styles/global.scss";

import { storyblokInit, apiPlugin } from "@storyblok/react";

import Page from "./components/Page.tsx";
import LandingPage from "./components/LandingPage/index.tsx";
import Project from "./components/Project/index.tsx";
import Contact from "./components/Contact/index.tsx";

storyblokInit({
	accessToken: "nAlDc5PyQaezeHY0WgXsswtt",
	use: [apiPlugin],
	components: {
		page: Page,
		landingPage: LandingPage,
		project: Project,
		contact: Contact,
	},
});

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
