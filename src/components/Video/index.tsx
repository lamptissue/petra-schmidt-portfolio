import "./styles.scss";
import type { Dispatch, SetStateAction } from "react";

type Props = {
	src: string;
	setHideArrowCursor: Dispatch<SetStateAction<boolean>>;
};

export default function Video({ src, setHideArrowCursor }: Props) {
	return (
		<iframe
			src={src}
			title='YouTube video player'
			frameBorder={0}
			allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
			referrerPolicy='strict-origin-when-cross-origin'
			allowFullScreen
			onMouseEnter={() => setHideArrowCursor(true)}
			onMouseLeave={() => setHideArrowCursor(false)}
		/>
	);
}
