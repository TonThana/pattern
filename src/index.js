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

	const numEllipses = 120;

	const lineDataPlaceholder = [];

	let elementGroupId = [];
	for (let i = 0; i < numEllipses; i += 1) {
		elementGroupId.push(`el${i}`);
		lineDataPlaceholder.push([{ x: 0, y: 0 }]);
	}

	const center_x = VISUAL_W / 2;
	const center_y = VISUAL_H / 2;

	const max_ellipse_width = (VISUAL_W * 7) / 10;
	const max_ellipse_height = (VISUAL_W * 3.5) / 10;

	const min_ellipse_width = (VISUAL_W * 2) / 10;
	const min_ellipse_height = (VISUAL_W * 1) / 10;

	const ellipse_width_range = max_ellipse_width - min_ellipse_width;
	const ellipse_height_range = max_ellipse_height - min_ellipse_height;

	const ellipsesGroup = svg.append("g").attr("id", "ellipses-group");

	ellipsesGroup
		.selectAll("g")
		.data(lineDataPlaceholder)
		.enter()
		.append("g")
		.attr("id", (_d, i) => elementGroupId[i])
		.attr("class", "element-group")
		.attr(
			"transform",
			(_d, index) =>
				`rotate(${10 * (index + 1)}, ${center_x}, ${center_y})`
		)
		.append("ellipse")
		.attr("class", "ellipses")
		.attr("cx", center_x)
		.attr("cy", center_y)
		.attr(
			"rx",
			(_d, index) => (ellipse_width_range * (index + 1)) / numEllipses
		)
		.attr(
			"ry",
			(_d, index) => (ellipse_height_range * (index + 1)) / numEllipses
		)
		.attr("fill", "none")
		.attr("stroke", "rgba(0,0,0,0.1)")
		.attr("stroke-width", 1);

	rotateAnimation(center_x, center_y);

	changeRxRyEllipses();
	drawLinesAnimate(center_x, center_y, min_ellipse_width, min_ellipse_height);
};

main();

function rotateAnimation(center_x, center_y) {
	const elementGroup = d3.selectAll(".element-group");
	let then = Date.now();
	let now;
	let elapsed;
	let changeRxRyRate = 500;
	const rotate = () => {
		requestAnimationFrame(rotate);
		now = Date.now();
		elapsed = now - then;
		if (elapsed > changeRxRyRate) {
			then = now - (elapsed % changeRxRyRate);
			elementGroup.each(function(_d, i) {
				let angle = 10 * (i + 1);
				const group = d3.select(this);
				let direction = 1;

				angle -= 1 * direction;
				if (Math.abs(angle) === 180) {
					direction *= -1;
					angle = 0;
				}
				group
					.transition()
					.attr(
						"transform",
						` rotate(${angle}, ${center_x}, ${center_y}) `
					);
			});
		}
	};
	requestAnimationFrame(rotate);
}

function drawLinesAnimate(
	center_x,
	center_y,
	min_ellipse_width,
	min_ellipse_height
) {
	let then = Date.now();
	let now;
	let elapsed;
	let changeRxRyRate = 500;
	const groups = d3.selectAll(".element-group");
	const drawLines = () => {
		requestAnimationFrame(drawLines);
		now = Date.now();
		elapsed = now - then;

		if (elapsed > changeRxRyRate) {
			then = now - (elapsed % changeRxRyRate);

			groups.each(function() {
				const element = d3.select(this);
				const ellipseChild = element.select("ellipse");
				// prepare points for lines
				const start_x = center_x + ellipseChild.attr("rx") / 1.2;
				const start_y = center_y + ellipseChild.attr("ry") / 1.2;
				const lineData = [
					{
						x: start_x,
						y: start_y,
					},
					{
						x: center_x + min_ellipse_width,
						y: center_y + min_ellipse_height,
					},
					{
						x: center_x,
						y: center_y,
					},
				];
				const lineFunction = d3
					.line()
					.x(d => d.x)
					.y(d => d.y);
				element
					.append("path")
					.attr("d", lineFunction(lineData))
					.attr("stroke", "black")
					.attr("stroke-width", 1)
					.attr("fill", "none")
					.attr("opacity", 1)
					.transition()
					.duration(500)
					.attr("opacity", 0.3)
					.remove();
			});
		}
	};
	requestAnimationFrame(drawLines);
}

function changeRxRyEllipses() {
	let then = Date.now();
	let now;
	let elapsed;
	let changeRxRyRate = 1000;
	const allEllipses = d3.selectAll(".ellipses");
	const changeRxRy = () => {
		requestAnimationFrame(changeRxRy);
		now = Date.now();
		elapsed = now - then;
		if (elapsed > changeRxRyRate) {
			then = now - (elapsed % changeRxRyRate);
			allEllipses.each(function(_d) {
				const ellipse = d3.select(this);
				const originalRy = ellipse.attr("ry");
				const originalRx = ellipse.attr("rx");
				ellipse
					.transition()
					.duration(300)
					.attr("ry", Math.random() * originalRy)
					.attr("rx", Math.random() * originalRx)
					.transition()
					.duration(300)
					.attr("ry", originalRy)
					.attr("rx", originalRx);
			});
		}
	};
	requestAnimationFrame(changeRxRy);
}
