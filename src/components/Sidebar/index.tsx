import "./styles.scss";

type SidebarProps = {
	blok: { projectTitle: string; modalDetail?: unknown[] };
	currentSlide: number;
	combinedArray: unknown[];
};

export default function Sidebar({ blok, currentSlide, combinedArray }: SidebarProps) {
	return (
		<div className='project-modal__sidebar'>
			<span>{blok.projectTitle}</span>

			{blok.modalDetail && combinedArray.length > 0 && (
				<span>
					{currentSlide}/{combinedArray.length}
				</span>
			)}
		</div>
	);
}
