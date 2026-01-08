"use client";

import { useEffect } from "react";

const landingPageColours = [
	["0, 100%, 84%", "153, 68%, 73%", "48, 67%, 68%", "0, 62%, 64%"],
	["200, 60%, 85%", "135, 50%, 80%", "300, 45%, 75%", "45, 70%, 80%"],
	["18, 100%, 70%", "83, 63%, 64%", "210, 59%, 83%", "100, 39%, 68%"],
	["81, 25%, 73%", "50, 56%, 81%", "284, 55%, 85%", "164, 35%, 64%"],
	["49, 78%, 51%", "29, 89%, 64%", "45, 68%, 67%", "100, 39%, 68%"],
];

export function RandomBackground() {
	useEffect(() => {
		const randomIndex = Math.floor(Math.random() * landingPageColours.length);
		const bgColor = landingPageColours[randomIndex];

		document.documentElement.style.setProperty("--background-color-1", bgColor[0]);
		document.documentElement.style.setProperty("--background-color-2", bgColor[1]);
		document.documentElement.style.setProperty("--background-color-3", bgColor[2]);
		document.documentElement.style.setProperty("--background-color-4", bgColor[3]);
	}, []);

	return null;
}
