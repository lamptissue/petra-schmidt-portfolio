export const getDimensions = (url: string) => {
	const assetUrl = url;
	const dimensions = {
		width: assetUrl.split("/")[5].split("x")[0],
		height: assetUrl.split("/")[5].split("x")[1],
	};
	return Number(dimensions.width) < Number(dimensions.height);
};
