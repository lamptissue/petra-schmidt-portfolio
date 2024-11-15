import "./styles.scss";
export default function Text({ textContent }: { textContent: any }) {
	return <div className='text-wrapper'>{textContent}</div>;
}
