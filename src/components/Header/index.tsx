import "./styles.scss";

export default function Header({ handleMenu, headersize }: { handleMenu: any; headersize: any }) {
	return (
		<header onClick={handleMenu} id='header'>
			<h1 className='header-title' style={{ fontSize: `${headersize}px` }}>
				Petra <br /> Schmidt
			</h1>
		</header>
	);
}
