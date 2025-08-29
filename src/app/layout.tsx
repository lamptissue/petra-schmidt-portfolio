import { Poppins } from "next/font/google";

import "./global.scss";

const poppins = Poppins({
	weight: ["300", "400", "500", "600"],
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const landingPageColours = [
		["0, 100%, 84%", "153, 68%, 73%", "48, 67%, 68%", "0, 62%, 64%"],
		["200, 60%, 85%", "135, 50%, 80%", "300, 45%, 75%", "45, 70%, 80%"],
		["18, 100%, 70%", "83, 63%, 64%", "210, 59%, 83%", "100, 39%, 68%"],
		["81, 25%, 73%", "50, 56%, 81%", "284, 55%, 85%", "164, 35%, 64%"],
		["49, 78%, 51%", "29, 89%, 64%", "45, 68%, 67%", "100, 39%, 68%"],
	];

	const getRandomIndex = (array: Array<any>) => {
		return Math.floor(Math.random() * array.length);
	};

	const bgColor = landingPageColours[getRandomIndex(landingPageColours)];

	const varbg: React.CSSProperties = {
		["--background-color-1" as any]: bgColor[0],
		["--background-color-2" as any]: bgColor[1],
		["--background-color-3" as any]: bgColor[2],
		["--background-color-4" as any]: bgColor[3],
	};

	return (
		<html lang='en' style={varbg}>
			<body className={poppins.className}>{children}</body>
		</html>
	);
}
