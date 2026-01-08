import "./styles.scss";

type HeaderProps = {
	onMenuClick: () => void;
	isLargeHeader: boolean;
	isMenuOpen?: boolean;
};

export default function Header({ onMenuClick, isLargeHeader, isMenuOpen = false }: HeaderProps) {
	return (
		<header id='header'>
			<button
				onClick={onMenuClick}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						onMenuClick();
					}
				}}
				aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
				aria-expanded={isMenuOpen}
				className={`header-title ${isLargeHeader ? "header-title--large" : "header-title--small"}`}>
				Petra <br /> Schmidt
			</button>
		</header>
	);
}
