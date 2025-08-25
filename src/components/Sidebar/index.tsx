import "./styles.scss";

export default function Sidebar({ blok }: { blok: any }) {
	return (
		<div className='project-modal__sidebar'>
			<span>{blok.projectTitle}</span>

			{blok.modalDetail.length > 0 && <span>1/{blok.modalDetail.length}</span>}
		</div>
	);
}
