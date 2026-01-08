import { Poppins } from "next/font/google";
import "./global.scss";

const poppins = Poppins({
	weight: ["300", "400", "500", "600"],
	subsets: ["latin"],
	display: "swap",
});

const backgroundScript = `
(function() {
  var colors = [
    ["0, 100%, 84%", "153, 68%, 73%", "48, 67%, 68%", "0, 62%, 64%"],
    ["200, 60%, 85%", "135, 50%, 80%", "300, 45%, 75%", "45, 70%, 80%"],
    ["18, 100%, 70%", "83, 63%, 64%", "210, 59%, 83%", "100, 39%, 68%"],
    ["81, 25%, 73%", "50, 56%, 81%", "284, 55%, 85%", "164, 35%, 64%"],
    ["49, 78%, 51%", "29, 89%, 64%", "45, 68%, 67%", "100, 39%, 68%"]
  ];
  var pick = colors[Math.floor(Math.random() * colors.length)];
  var root = document.documentElement;
  root.style.setProperty("--background-color-1", pick[0]);
  root.style.setProperty("--background-color-2", pick[1]);
  root.style.setProperty("--background-color-3", pick[2]);
  root.style.setProperty("--background-color-4", pick[3]);
})();
`;

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: backgroundScript }} />
			</head>
			<body className={poppins.className}>{children}</body>
		</html>
	);
}
