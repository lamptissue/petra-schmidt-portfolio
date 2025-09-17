import { useEffect } from "react";

export const useBodyOverflow = (isHidden: boolean) => {
	useEffect(() => {
		const body = document.body;
		const originalOverflow = body.style.overflow;

		body.style.overflow = isHidden ? "hidden" : "auto";

		return () => {
			body.style.overflow = originalOverflow;
		};
	}, [isHidden]);
};
