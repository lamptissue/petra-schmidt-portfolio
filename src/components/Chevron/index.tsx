import "./styles.scss";

export default function Chevron({ options, onClick }: { options?: string; onClick: any }) {
	return (
		<div onClick={onClick} className={`chevron-container ${options}`}>
			<span className='chevron'></span>
			<span className='chevron'></span>
		</div>
	);
}
