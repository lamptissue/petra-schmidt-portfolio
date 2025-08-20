import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import StoryblokProvider from "@/components/StoryblokProvider";

import "./global.scss";

const poppins = Poppins({
	weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
	title: "Petra Schmidt Portfolio",
	description: "",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<StoryblokProvider>
			<html lang='en'>
				<body className={poppins.className}>{children}</body>
			</html>
		</StoryblokProvider>
	);
}
