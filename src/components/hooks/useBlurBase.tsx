import { useState, useEffect, useMemo } from "react";

const TINY_PIXEL = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";

export function useBlurBase(image?: string) {
	const [blur, setBlur] = useState<string>(TINY_PIXEL);

	const tinyUrl = useMemo(() => {
		if (!image) return null;
		const imageSrc = `${image}/m/`;
		return `${imageSrc}16x0/filters:quality(20):format(webp)`;
	}, [image]);

	useEffect(() => {
		if (!tinyUrl) {
			setBlur(TINY_PIXEL);
			return;
		}

		let aborted = false;

		(async () => {
			try {
				const res = await fetch(`/api/blur?url=${encodeURIComponent(tinyUrl)}`);
				if (!res.ok) return;
				const { base64 } = await res.json();
				if (!aborted && typeof base64 === "string") setBlur(base64);
			} catch {}
		})();

		return () => {
			aborted = true;
		};
	}, [tinyUrl]);

	return blur;
}
