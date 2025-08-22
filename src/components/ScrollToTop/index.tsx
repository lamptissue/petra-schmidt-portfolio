import "./styles.scss";
import { ArrowUp } from "../Icons";

export default function ScrollToTop({ showScrollButton, scrollUp }: { showScrollButton: any; scrollUp: any }) {
	return (
		<button onClick={scrollUp} className={`scroll__icon ${showScrollButton ? "show" : ""}`}>
			<ArrowUp />
		</button>
	);
}
