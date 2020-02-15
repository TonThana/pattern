const d3 = require("d3");

const main = () => {
	console.log("hello");
	draw();
};

const draw = () => {
	const visProper = d3.select("#vis-proper");
	visProper.selectAll("*").remove();
	const VISUAL_W = window.innerWidth * 0.5;
	const VISUAL_H = VISUAL_W;
	const svg = visProper.append("svg");
	svg.attr("width", VISUAL_W)
		.attr("height", VISUAL_H)
		.attr("id", "svg_container");

	const numEllipses = 50;
	let ellipse_id = [];
	for (let i = 0; i < numEllipses; i += 1) {
		ellipse_id.push(`el${i}`);
	}
	// top left (0,0)
	const center_x = VISUAL_W / 2;
	const center_y = VISUAL_H / 2;

	const max_ellipse_width = (VISUAL_W * 6) / 10;
	const max_ellipse_height = (VISUAL_W * 3) / 10;

	const min_ellipse_width = (VISUAL_W * 2) / 10;
	const min_ellipse_height = (VISUAL_W * 1) / 10;

	const ellipse_width_range = max_ellipse_width - min_ellipse_width;
	const ellipse_height_range = max_ellipse_height - min_ellipse_height;

	const ellipsesGroup = svg.append("g").attr("id", "ellipses-group");

	ellipse_id.forEach((id, index) => {
		const rx = (ellipse_width_range * (index + 1)) / numEllipses;
		const ry = (ellipse_height_range * (index + 1)) / numEllipses;
		ellipsesGroup

			.append("ellipse")
			.attr("id", id)
			.attr("class", "ellipses")
			.attr("cx", center_x)
			.attr("cy", center_y)
			.attr("rx", rx)
			.attr("ry", ry)
			.attr("fill", "none")
			.attr(
				"stroke",
				index === 20 ? " rgba(123,123,255, 1)" : "rgba(0,0,0,0.4)"
			)
			.attr(
				"transform",
				` rotate(${10 * (index + 1)}, ${center_x}, ${center_y})`
			)
			.attr("stroke-width", 1);
	});

	const ellipses = d3.selectAll(".ellipses");

	ellipseRepeat();
	function ellipseRepeat() {
		ellipses.each(function(_d, i) {
			let timeInterval = 50;
			let angle = 10 * (i + 1);

			const ellipse = d3.select(this);
			let direction = 1;
			setInterval(() => {
				angle -= 1 * direction;
				if (Math.abs(angle) === 360) {
					direction *= -1;
					angle = 0;
				}
				ellipse.attr(
					"transform",
					` rotate(${angle}, ${center_x}, ${center_y}) `
				);
			}, timeInterval);
		});
	}

	// const interpol_rotate = d3.interpolateString(
	// 	`rotate(0,${center_x},${center_y})`,
	// 	`rotate(-180,${center_x},${center_y})`
	// );
	// const interpol_rotate_back = d3.interpolateString(
	// 	`rotate(-180,${center_x},${center_y})`,
	// 	`rotate(0,${center_x},${center_y})`
	// );

	// function animateEllipses() {
	// 	ellipses.each(function(_d, i) {
	// 		d3.select(this)
	// 			.transition()
	// 			.duration(2500)
	// 			.attrTween("transform", () => interpol_rotate)
	// 			.transition()
	// 			.duration(2500)
	// 			.attr("transform", () => interpol_rotate_back)
	// 			.on("end", animateEllipses);
	// 	});
	// }
	// animateEllipses();
};

main();
