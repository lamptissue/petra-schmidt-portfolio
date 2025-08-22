import "./styles.scss";

export default function Header({ onMenuClick, isLargeHeader }: { onMenuClick: () => void; isLargeHeader: any }) {
	return (
		<header id='header' aria-label='menu' onClick={onMenuClick}>
			<h1 className={`header-title ${isLargeHeader ? "header-title--large" : "header-title--small"}`}>
				Petra <br /> Schmidt
			</h1>
		</header>
	);
}
