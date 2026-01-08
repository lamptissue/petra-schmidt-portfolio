import { Poppins } from "next/font/google";
import { RandomBackground } from "@/components/RandomBackground";

import "./global.scss";

const poppins = Poppins({
	weight: ["300", "400", "500", "600"],
	subsets: ["latin"],
	display: "swap",
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={poppins.className}>
				<RandomBackground />
				{children}
			</body>
		</html>
	);
}
