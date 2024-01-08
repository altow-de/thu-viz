import { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";

const MARGIN = { top: 30, right: 30, bottom: 50, left: 50 };
const data = [
  { x: 0, y: 80 },
  { x: 1, y: 90 },
  { x: 2, y: 12 },
  { x: 3, y: 34 },
  { x: 4, y: 53 },
  { x: 5, y: 52 },
  { x: 6, y: 9 },
  { x: 7, y: 18 },
  { x: 8, y: 78 },
  { x: 9, y: 28 },
  { x: 10, y: 34 },
];

type DataPoint = { x: number; y: number };
type LineChartProps = {
  width: number;
  height: number;
  title: string;
};

const Chart = ({ width, height, title }: LineChartProps) => {
  // bounds = area inside the graph axis = calculated by substracting the margins
  const axesRef = useRef(null);
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // Y axis
  const [min, max] = d3.extent(data, (d) => d.y);
  const yScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([0, max || 0])
      .range([boundsHeight, 0]);
  }, [data, height]);

  // X axis
  const [xMin, xMax] = d3.extent(data, (d) => d.x);
  const xScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([0, xMax || 0])
      .range([0, boundsWidth]);
  }, [data, width]);

  useEffect(() => {
    const svgElement = d3.select(axesRef.current);
    // remove everything from previous data rendering
    svgElement.selectAll("*").remove();

    const brushXScale = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([0, boundsWidth]);
    const brushYScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.y) ?? 0])
      .range([boundsHeight, 0]);
    // x axis generator
    const xAxisGenerator = d3.axisBottom(xScale);
    const xAxis = svgElement
      .append("g")
      .attr("transform", "translate(0," + boundsHeight + ")")
      .call(xAxisGenerator)
      .call((g) => g.select(".domain").remove())
      .call((g) => g.selectAll(".tick line").attr("stroke-opacity", 0));

    areaBuilder = areaBuilder
      .x((d) => xScale(d.x))
      .y0(yScale(0))
      .y1((d) => yScale(d.y));
    // y axis generator
    const yAxisGenerator = d3.axisLeft(yScale);
    const yAxis = svgElement
      .append("g")
      .call(yAxisGenerator)
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .selectAll(".tick line")
          .attr("stroke-opacity", 0)
          .clone()
          .attr("x2", boundsWidth)
          .attr("stroke-opacity", 0.2)
          .attr("stroke-dasharray", 2)
      );
    // axis names
    svgElement
      .append("text")
      .attr("text-anchor", "end")
      .attr("y", -10)
      .attr("x", -20)
      .text("mbar") //name of the y axis
      .attr("font-size", 10)
      .attr("font-weight", 600)
      .attr("fill", "#4883c8");

    // axis names
    svgElement
      .append("text")
      .attr("text-anchor", "start")
      .attr("y", boundsHeight)
      .attr("x", boundsWidth + 5)
      .text("time") //name of the y axis
      .attr("font-size", 10)
      .attr("font-weight", 600)
      .attr("fill", "#4883c8");

    // Add a clipPath: everything out of this area won't be drawn.
    const clip = svgElement
      .append("defs")
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", boundsWidth)
      .attr("height", boundsHeight)
      .attr("x", 0)
      .attr("y", 0);

    const brush = d3
      .brushX()
      .extent([
        [0, 0],
        [boundsWidth, boundsHeight],
      ])
      .on("end", (event) => {
        if (!event.selection) return; // Ignore empty selections.

        // Get the selected range.
        const [x0, x1] = event.selection.map(brushXScale.invert);

        // Update the scales with the new domain.
        xScale.domain([x0, x1]);

        // Redraw the graph with the updated scales.
        svgElement.select(".area").attr(
          "d",
          areaBuilder.x((d) => xScale(d.x))
        );

        // Clear the brush selection.
        svgElement.select<SVGGElement>(".brush").call(brush.move, null);
      });

    svgElement.append("g").call(brush);
  }, [xScale, yScale, boundsHeight, boundsWidth, data]);

  // building area
  let areaBuilder = d3
    .area<DataPoint>()
    .x((d) => xScale(d.x))
    .y0(yScale(0))
    .y1((d) => yScale(d.y));
  const areaPath = areaBuilder(data);
  if (!areaPath) {
    return null;
  }
  // building line
  const lineBuilder = d3
    .line<DataPoint>()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y));
  const linePath = lineBuilder(data);
  if (!linePath) {
    return null;
  }

  return (
    <div>
      <div className="pl-7 text-sm text-danube-600 font-semibold">{title}</div>
      <svg width={width} height={height}>
        <defs>
          <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="steelblue" />
            <stop offset="100%" stopColor="white" />
          </linearGradient>
        </defs>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        >
          <path
            d={areaPath}
            opacity={1}
            stroke="none"
            fill="url(#area-gradient)"
            strokeWidth={2}
          />
          <path d={linePath} stroke="steelblue" fill="none" strokeWidth={2} />
        </g>
        <g
          width={boundsWidth}
          height={boundsHeight}
          ref={axesRef}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        />
      </svg>
    </div>
  );
};

export default Chart;
