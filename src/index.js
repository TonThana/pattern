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
	let elementGroupId = [];
	for (let i = 0; i < numEllipses; i += 1) {
		elementGroupId.push(`el${i}`);
	}
	// top left (0,0)
	const center_x = VISUAL_W / 2;
	const center_y = VISUAL_H / 2;

	const max_ellipse_width = (VISUAL_W * 7) / 10;
	const max_ellipse_height = (VISUAL_W * 3.5) / 10;

	const min_ellipse_width = (VISUAL_W * 2) / 10;
	const min_ellipse_height = (VISUAL_W * 1) / 10;

	const ellipse_width_range = max_ellipse_width - min_ellipse_width;
	const ellipse_height_range = max_ellipse_height - min_ellipse_height;

	const ellipsesGroup = svg.append("g").attr("id", "ellipses-group");

	elementGroupId.forEach((id, index) => {
		const rx = (ellipse_width_range * (index + 1)) / numEllipses;
		const ry = (ellipse_height_range * (index + 1)) / numEllipses;
		ellipsesGroup
			.append("g")
			.attr("id", id)
			.attr("class", "element-group")
			.attr(
				"transform",
				` rotate(${10 * (index + 1)}, ${center_x}, ${center_y})`
			)
			.append("ellipse")
			.attr("class", "ellipses")
			.attr("cx", center_x)
			.attr("cy", center_y)
			.attr("rx", rx)
			.attr("ry", ry)
			.attr("fill", "none")
			.attr("stroke", "rgba(0,0,0,0.1)")
			.attr("stroke-width", 1);
	});

	const elementGroup = d3.selectAll(".element-group");

	ellipseRepeat();
	function ellipseRepeat() {
		elementGroup.each(function(_d, i) {
			let timeInterval = 50;
			let angle = 10 * (i + 1);

			const ellipse = d3.select(this);
			let direction = 1;
			setInterval(() => {
				angle -= 1 * direction;
				if (Math.abs(angle) === 720) {
					direction *= -1;
					angle = 0;
				}

				ellipse.attr(
					"transform",
					` rotate(${angle}, ${center_x}, ${center_y}) `
				);
			}, timeInterval);
		});

		setInterval(() => {
			elementGroupId.sort(() => {
				return Math.random() - 0.5;
			});
			for (let i = 0; i <= 20; i += 1) {
				const element = d3.select(`#${elementGroupId[i]}`);
				const ellipseChild = element.select("ellipse");

				element
					.append("circle")
					.attr("fill", random_rgba())
					.attr("r", 2)
					.attr("cx", center_x + ellipseChild.attr("rx") / 2)
					.attr("cy", center_y + ellipseChild.attr("ry") / 2)
					.attr("opacity", 1)
					.transition()
					.duration(100)
					.attr("opacity", 0)
					.remove();
			}
		}, 100);
	}
};

function random_rgba() {
	var o = Math.round,
		r = Math.random,
		s = 255;
	return (
		"rgba(" +
		o(r() * s) +
		"," +
		o(r() * s) +
		"," +
		o(r() * s) +
		"," +
		r().toFixed(1) +
		")"
	);
}

main();
