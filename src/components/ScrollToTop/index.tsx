import "./styles.scss";

export default function ScrollToTop({ showScrollButton, scrollUp }: { showScrollButton: any; scrollUp: any }) {
	return (
		// <div style={{ display: showScrollButton ? "block" : "none" }} className='scroll__container'>
		// 	<button onClick={scrollUp} className='scroll__it'>
		// <div style={{ display: showScrollButton ? "block" : "none" }} className='scroll__container'>
		<button onClick={scrollUp} className='scroll__it' style={{ display: showScrollButton ? "flex" : "none" }}>
			<svg viewBox='0 0 12 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M5.46969 0.46967C5.76258 0.176777 6.23746 0.176777 6.53035 0.46967L11.3033 5.24264C11.5962 5.53553 11.5962 6.01041 11.3033 6.3033C11.0104 6.59619 10.5356 6.59619 10.2427 6.3033L6.75002 2.81066V16H5.25002V2.81066L1.75738 6.3033C1.46449 6.59619 0.989614 6.59619 0.696721 6.3033C0.403827 6.01041 0.403827 5.53553 0.696721 5.24264L5.46969 0.46967Z'
					fill='currentColor'
				/>
			</svg>
		</button>
		// </div>
	);
}
