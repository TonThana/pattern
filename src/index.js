const d3 = require("d3");
const { drawV2 } = require("./drawv2");

const main = () => {
	// console.log("hello");
	// drawv1();
	drawV2();
};

const drawv1 = () => {
	const visProper = d3.select("#vis-proper");
	visProper.selectAll("*").remove();
	const VISUAL_W = window.innerWidth * 0.5;
	const VISUAL_H = VISUAL_W;
	const svg = visProper.append("svg");
	svg.attr("width", VISUAL_W)
		.attr("height", VISUAL_H)
		.attr("id", "svg_container");

	const numEllipses = 20;

	const lineDataPlaceholder = [];

	let elementGroupId = [];
	for (let i = 0; i < numEllipses; i += 1) {
		elementGroupId.push(`el${i}`);
		lineDataPlaceholder.push([[{ x: 0, y: 0 }]]);
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
	drawLinesAnimate(center_x, center_y);
	changeRxRyEllipses();
	drawLinesAnimate(center_x, center_y);
};

main();

function rotateAnimation(center_x, center_y) {
	const elementGroup = d3.selectAll(".element-group");

	elementGroup.each(function(_d, i) {
		let angle = 5 * (i + 1);
		const group = d3.select(this);
		let direction = 1;
		setInterval(() => {
			angle -= 1 * direction;
			if (Math.abs(angle) === 720) {
				direction *= -1;
				angle = 0;
			}
			group
				.transition()
				.attr(
					"transform",
					` rotate(${angle}, ${center_x}, ${center_y}) `
				);
		}, 100);
	});
}

function drawLinesAnimate(cx, cy) {
	let then = Date.now();
	let now;
	let elapsed;
	let changeRxRyRate = 2000;
	const lineFunction = d3
		.line()
		.x(d => d.x)
		.y(d => d.y)
		.curve(d3.curveLinear);

	const drawLines = () => {
		requestAnimationFrame(drawLines);
		now = Date.now();
		elapsed = now - then;

		if (elapsed > changeRxRyRate) {
			then = now - (elapsed % changeRxRyRate);
			const groups = d3.selectAll(".element-group");
			groups.each(function() {
				if (Math.random() - 0.8 < 0) {
					return;
				}
				const element = d3.select(this);
				const ellipseChild = element.select("ellipse");

				// prepare points for lines
				const start_x =
					cx + (ellipseChild.attr("rx") / 1.2) * randomPosNeg();
				const start_y =
					cy + (ellipseChild.attr("ry") / 1.2) * randomPosNeg();

				const lineData = [[]];

				const width = cx - start_x;
				const widthSign = width < 0 ? -1 : 1;
				const height = cy - start_y;
				const heightSign = height < 0 ? -1 : 1;

				const numOfPoints = 4;

				for (let i = 0; i < numOfPoints; i += 1) {
					if (i === 0) {
						lineData[0].push({ x: start_x, y: start_y });
					} else if (i === numOfPoints - 1) {
						lineData[0].push({
							x: cx,
							y: cy,
						});
					}
				}

				element
					.selectAll(".line-path")
					.data(lineData)
					.enter()
					.append("path")
					.attr("d", d => lineFunction(d))
					.attr("fill", "none")
					.attr("opacity", 0.3)
					.transition()
					.duration(1000)
					.attr("stroke", "black")
					.attr("stroke-width", 1)
					.attr("fill", "none")
					.transition()
					.duration(1000)
					.attr("opacity", 0)
					.attr("fill", "none")
					.delay(0)
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

				const { rx, ry } = ellipseRxRYTransform(
					Math.floor(Math.random() * 3),
					originalRx,
					originalRy
				);
				ellipse
					.transition()
					.duration(500)
					.attr("ry", ry)
					.attr("rx", rx)
					.attr("opacity", Math.random().toFixed(1))
					.transition()
					.duration(500)
					.attr("ry", originalRy)
					.attr("rx", originalRx)
					.attr("opacity", Math.random().toFixed(1));
			});
		}
	};

	requestAnimationFrame(changeRxRy);
}

function randomPosNeg() {
	if (Math.random() - 0.5 < 0) {
		return -1;
	}
	return 1;
}

function ellipseRxRYTransform(selection, originalRx, originalRy) {
	const functions = {
		"0": {
			rx: originalRx,
			ry: originalRx,
		},

		"1": {
			rx: originalRy,
			ry: originalRy,
		},

		"2": {
			rx: Math.random() * originalRy,
			ry: Math.random() * originalRx,
		},
	};

	return functions[selection];
}
