const d3 = require("d3");

const { PI } = Math;
let shape = 0;
let lineGenerator;
let straightGenerator = d3.lineRadial().curve(d3.curveLinear);
lineGenerator = straightGenerator;
let curveGenerator = d3.lineRadial().curve(d3.curveBasisClosed);

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

    // initial data and line Generator
    let squareData = Array.from({ length: 20 }, (_, i) =>
        generateSquares(15 + i * 8 - i * 1)
    );

    const visGroup = svg
        .append("g")
        .attr("id", "visGroup")
        .attr(
            "transform",
            `translate(${center_x},${center_y}) rotate(0,${center_x},${center_y})`
        );

    visGroup
        .selectAll("g")
        .data(squareData)
        .enter()
        .append("g")
        .attr("class", "continuous-rotation")
        .append("path")
        .attr("class", "main-pattern")
        .attr("d", d => {
            return lineGenerator(d);
        })
        .attr("fill", "none")
        .attr("stroke", "rgb(0,0,0)")
        .attr("opacity", 1)
        .attr("stroke-width", 1);

    rotation();
    changeBasicShapes();
    // d3.select("svg").on("click", function() {});
};

export { drawV2 };

const generateSquares = radius => {
    const result = [];
    for (let i = 0; i < 5; i += 1) {
        result.push([((2 * PI) / 4) * (i + 1), radius]);
    }
    return result;
};

const generateTriangles = radius => {
    const result = [];
    for (let i = 0; i < 4; i += 1) {
        result.push([((2 * PI) / 3) * (i + 1), radius]);
    }
    return result;
};

const generateButterfly = radius => {
    // radius on PI and 3/2PI must be of different length
    const result = [];
    for (let i = 0; i < 5; i += 1) {
        result.push([
            ((2 * PI) / 4) * (i + 1),
            (i + 1) % 2 === 0 ? radius * 1.2 : radius
        ]);

        result.push([
            ((2 * PI) / 4) * (i + 3),
            (i + 1) % 2 === 0 ? radius * 1.2 : radius
        ]);
    }
    return result;
};

const generateEllipsesVertical = radius => {
    const result = [];
    for (let i = 0; i < 8; i += 1) {
        result.push([
            ((2 * PI) / 4) * (i + 1),
            (i + 1) % 2 === 0 ? radius * 1.2 : radius
        ]);
    }
    return result;
};

const generateEllipsesHorizontal = radius => {
    const result = [];
    for (let i = 0; i < 8; i += 1) {
        result.push([
            ((2 * PI) / 4) * (i + 1),
            (i + 1) % 2 === 1 ? radius * 1.2 : radius
        ]);
    }
    return result;
};

const rotation = () => {
    const allMainPath = d3.selectAll(".continuous-rotation");

    allMainPath.each(function(_d, i) {
        let angle = 50 * (i + 1);
        const group = d3.select(this);
        let direction = 1;

        setInterval(() => {
            angle -= 10 * direction;
            if (Math.abs(angle) === 750) {
                direction *= -1;
                angle = 0;
            }
            group.transition().attr("transform", ` rotate(${angle}) `);
        }, 100);
    });
};

const changeBasicShapes = () => {
    let then = Date.now();
    let now;
    let elapsed;
    let changeRxRyRate = 1500;
    let newData;

    const changeShapes = () => {
        requestAnimationFrame(changeShapes);
        now = Date.now();
        elapsed = now - then;

        if (elapsed > changeRxRyRate) {
            then = now - (elapsed % changeRxRyRate);
            if (shape === 0) {
                newData = Array.from({ length: 20 }, (_, i) =>
                    generateTriangles(15 + i * 8)
                );

                lineGenerator = straightGenerator;
                shape += 1;
            } else if (shape === 1) {
                newData = Array.from({ length: 20 }, (_, i) =>
                    generateSquares(15 + i * 8)
                );
                lineGenerator = straightGenerator;
                shape += 1;
            } else if (shape === 2) {
                newData = Array.from({ length: 20 }, (_, i) =>
                    generateButterfly(15 + i * 8)
                );
                // change line generator
                lineGenerator = straightGenerator;
                shape += 1;
            } else if (shape === 3) {
                newData = Array.from({ length: 20 }, (_, i) =>
                    generateEllipsesVertical(15 + i * 8)
                );
                // change line generator
                lineGenerator = curveGenerator;
                shape += 1;
            } else if (shape === 4) {
                newData = Array.from({ length: 20 }, (_, i) =>
                    generateEllipsesHorizontal(15 + i * 8)
                );
                // change line generator
                lineGenerator = curveGenerator;
                shape += 1;
            }

            const mainPattern = d3.selectAll("path").data(newData);

            mainPattern
                .enter()
                .append("path")
                .merge(mainPattern)
                .attr("class", "main-pattern")
                .attr("fill", "none")
                .attr("stroke", "rgb(0,0,0)")
                .attr("opacity", 0.5)
                .transition()
                .duration(1000)
                .delay((_d, i) => i * 50)
                .attr("opacity", 1)
                .attr("d", d => lineGenerator(d));

            // mainPattern.exit().remove();
            if (shape > 4) {
                shape = 0;
            }
            console.log(shape);
        }
    };
    requestAnimationFrame(changeShapes);
};
