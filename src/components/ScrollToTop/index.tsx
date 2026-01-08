import "./styles.scss";
import { ArrowUp } from "../Icons";

type Props = {
	showScrollButton: boolean;
	scrollUp: () => void;
};

export default function ScrollToTop({ showScrollButton, scrollUp }: Props) {
	return (
		<button
			onClick={scrollUp}
			aria-label='scroll to the top of the page'
			className={`scroll__icon ${showScrollButton ? "show" : ""}`}>
			<ArrowUp />
		</button>
	);
}
