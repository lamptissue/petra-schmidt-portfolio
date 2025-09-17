import "./styles.scss";

type HeaderProps = {
	onMenuClick: () => void;
	isLargeHeader: boolean;
};

export default function Header({ onMenuClick, isLargeHeader }: HeaderProps) {
	return (
		<header id='header' aria-label='menu' onClick={onMenuClick}>
			<h1 className={`header-title ${isLargeHeader ? "header-title--large" : "header-title--small"}`}>
				Petra <br /> Schmidt
			</h1>
		</header>
	);
}
