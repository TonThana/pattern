const d3 = require("d3");

// playing with radial lines
const drawV2 = () => {
	const visProper = d3.select("#vis-proper");
	visProper.selectAll("*").remove();
	const VISUAL_W = window.innerWidth * 0.5;
	const VISUAL_H = VISUAL_W;
	const svg = visProper.append("svg");
	svg.attr("width", VISUAL_W)
		.attr("height", VISUAL_H)
		.attr("id", "svg_container");

	const center_x = VISUAL_W / 2;
	const center_y = VISUAL_H / 2;

	let spiralData = [generateSpiralData()];

	const radialLineGenerator = d3.lineRadial().curve(d3.curveBasisOpen);

	const visGroup = svg
		.append("g")
		.attr("id", "visGroup")
		.attr(
			"transform",
			`translate(${center_x},${center_y}) rotate(0,${center_x},${center_y})`
		);

	visGroup
		.selectAll("path")
		.data(spiralData)
		.enter()
		.append("path")
		.attr("d", d => radialLineGenerator(d))
		.attr("fill", "none")
		.attr("stroke", "rgb(0,0,0)");
};

export { drawV2 };

const generateSpiralData = () => {
	return Array.from({ length: 76 }, (_, i) => [
		(Math.PI / 3) * i, //angle in radians
		2 * i, // radius
	]);
};
