import { Poppins } from "next/font/google";

import "./global.scss";
import BgVars from "./Bgvars";

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
			<body className={poppins.className}>
				<BgVars>{children}</BgVars>
			</body>
		</html>
	);
}
