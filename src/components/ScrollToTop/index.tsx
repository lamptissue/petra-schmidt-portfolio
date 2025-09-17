import "./styles.scss";
import { ArrowUp } from "../Icons";

type Props = {
	showScrollButton: boolean;
	scrollUp: () => void;
};

export default function ScrollToTop({ showScrollButton, scrollUp }: Props) {
	return (
		<button onClick={scrollUp} className={`scroll__icon ${showScrollButton ? "show" : ""}`}>
			<ArrowUp />
		</button>
	);
}
