import "./styles.scss";

export default function Header({ handleMenu, isLargeHeader }: { handleMenu: any; isLargeHeader: boolean }) {
	return (
		<header onClick={handleMenu} id='header' aria-label='menu'>
			<h1 className={`header-title ${isLargeHeader ? "header-title--large" : "header-title--small"}`}>
				Petra <br /> Schmidt
			</h1>
		</header>
	);
}
