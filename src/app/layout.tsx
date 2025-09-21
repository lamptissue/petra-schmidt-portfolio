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
	return (
		<html lang='en'>
			<body className={poppins.className}>{children}</body>
		</html>
	);
}
