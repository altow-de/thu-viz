import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";

const MARGIN = { top: 30, right: 30, bottom: 50, left: 50 };
const data: {
  pressure: number;
  time: number;
  temperature: number;
  conductivity: number;
}[] = [
  { time: 0, pressure: 1000, temperature: 10.4, conductivity: 20 },
  { time: 1, pressure: 1200, temperature: 12.7, conductivity: 24 },
  { time: 2, pressure: 1400, temperature: 13.2, conductivity: 26 },
  { time: 3, pressure: 1324, temperature: 10.9, conductivity: 29 },
  { time: 4, pressure: 1125, temperature: 11.3, conductivity: 30 },
  { time: 5, pressure: 1627, temperature: 15.2, conductivity: 23 },
  { time: 6, pressure: 1409, temperature: 14.4, conductivity: 22 },
  { time: 7, pressure: 1023, temperature: 12.9, conductivity: 21 },
  { time: 8, pressure: 1234, temperature: 10.1, conductivity: 20 },
  { time: 9, pressure: 1304, temperature: 11.4, conductivity: 24 },
  { time: 10, pressure: 1498, temperature: 12.0, conductivity: 22 },
];

type DataPoint = Record<string, number>;
type ChartProps = {
  width: number;
  height: number;
  title: string;
  tickValue: number;
  x: string; // x and y props to define the key used from the data
  y: string;
};

const Chart = ({ width, height, title, x, y, tickValue }: ChartProps) => {
  const axesRef = useRef(null);
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // Y axis
  const [min, max] = d3.extent(data, (d: DataPoint) => d[y]);
  const yScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([0, max || 0])
      .nice()
      .range([boundsHeight, 0]);
  }, [data, height]);

  // X axis
  const [xMin, xMax] = d3.extent(data, (d: DataPoint) => d[x]);
  const xScale = useMemo(() => {
    return d3
      .scaleLinear() // change to time scale when working with actual time data
      .domain([0, xMax || 0])
      .nice()
      .range([0, boundsWidth]);
  }, [data, width]);

  useEffect(() => {
    const svgElement = d3.select(axesRef.current);
    // remove everything from previous data rendering
    svgElement.selectAll("*").remove();
    // x axis generator
    const xAxisGenerator = d3.axisBottom(xScale);
    svgElement
      .append("g")
      .attr("transform", "translate(0," + boundsHeight + ")")
      .call(xAxisGenerator)
      .call((g) => g.select(".domain").remove())
      .call((g) => g.selectAll(".tick line").attr("stroke-opacity", 0));

    // y axis generator
    const yAxisGenerator = d3.axisLeft(yScale).ticks(tickValue);
    svgElement
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
      .attr("text-anchor", "start")
      .attr("y", -10)
      .attr("x", -22)
      .text(y) //name of the y axis
      .attr("font-size", 10)
      .attr("font-weight", 600)
      .attr("fill", "#4883c8");

    svgElement
      .append("text")
      .attr("text-anchor", "start")
      .attr("y", boundsHeight)
      .attr("x", boundsWidth + 5)
      .text(x) //name of the x axis
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
        if (!event.selection) return; // ignore empty selections.
        //code for zoom behavior
      });

    svgElement.append("g").call(brush);
  }, [xScale, yScale, boundsHeight, boundsWidth, data]);

  // building area
  let areaBuilder = d3
    .area<DataPoint>()
    .x((d) => xScale(d[x]))
    .y0(yScale(0))
    .y1((d) => yScale(d[y]))
    .curve(d3.curveBasis);
  const areaPath = areaBuilder(data);
  if (!areaPath) {
    return null;
  }
  // building line
  const lineBuilder = d3
    .line<DataPoint>()
    .x((d) => xScale(d[x]))
    .y((d) => yScale(d[y]))
    .curve(d3.curveBasis);
  const linePath = lineBuilder(data);
  if (!linePath) {
    return null;
  }

  return (
    <div className="inline-block">
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
