import "./styles.scss";

export default function Sidebar({
	blok,
	currentSlide,
	combinedArray,
}: {
	blok: any;
	currentSlide: any;
	combinedArray: any;
}) {
	return (
		<div className='project-modal__sidebar'>
			<span>{blok.projectTitle}</span>
			<span>{blok.title}</span>

			{blok.modalDetail && combinedArray.length > 0 && (
				<span>
					{currentSlide}/{combinedArray.length}
				</span>
			)}
		</div>
	);
}
