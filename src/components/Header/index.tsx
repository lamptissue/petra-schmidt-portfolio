import "./styles.scss";

export default function Header({ handleMenu }: { handleMenu: any }) {
	return (
		<header onClick={handleMenu} id='header'>
			<h1>
				Petra <br /> Schmidt
			</h1>
		</header>
	);
}
