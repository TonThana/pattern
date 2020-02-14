const d3 = require("d3");

const main = () => {
	console.log("hello");
	draw();
};

const draw = () => {
	const visProper = d3.select("#vis-proper");
	visProper.selectAll("*").remove();
	const VISUAL_W = window.innerWidth * 0.5;
	const VISUAL_H = window.innerHeight * 0.5;
	const svg = visProper.append("svg");
	svg.attr("width", VISUAL_W)
		.attr("height", VISUAL_H)
		.attr("id", "svg_container");
};

main();
