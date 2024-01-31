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
  { time: 9, pressure: 1304, temperature: 11.4, conductivity: 14 },
  { time: 10, pressure: 1498, temperature: 12.0, conductivity: 10 },
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
  const [xBrushEnd, setXBrushEnd] = useState(0);
  const [xBrushStart, setXBrushStart] = useState(0);
  const [yBrushEnd, setYBrushEnd] = useState(0);
  const [yBrushStart, setYBrushStart] = useState(0);
  const axesRef = useRef(null);
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  useEffect(() => {
    const svgElement = d3.select(axesRef.current);
    svgElement.selectAll("*").remove();

    // Y axis
    const [min, max] = d3.extent(data, (d: DataPoint) => d[y]);
    const yScale = d3
      .scaleLinear()
      .domain(yBrushStart === 0 ? [0, max || 0] : [yBrushStart, yBrushEnd])
      .nice()
      .range([boundsHeight, 0]);

    // X axis
    const [xMin, xMax] = d3.extent(data, (d: DataPoint) => d[x]);
    const xScale = d3
      .scaleLinear() // change to time scale when working with actual time data
      .domain(xBrushStart === 0 ? [0, xMax || 0] : [xBrushStart, xBrushEnd])
      .nice()
      .range([0, boundsWidth]);

    // x axis generator
    const xAxisGenerator = d3.axisBottom(xScale);
    svgElement
      .append("g")
      .attr(
        "transform",
        `translate(${MARGIN.left}, ${MARGIN.top + boundsHeight})`
      )
      .transition()
      .duration(1000)
      .call(xAxisGenerator)
      .attr("opacity", 0.6)
      .call((g) => g.select(".domain").attr("stroke-opacity", 0))
      .call((g) => g.selectAll(".tick line").attr("stroke-opacity", 0));

    // y axis generator
    const yAxisGenerator = d3.axisLeft(yScale).ticks(width / tickValue); //ticks
    svgElement
      .append("g")
      .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`)
      .call(yAxisGenerator)
      .attr("opacity", 0.6)
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

    // grouped graphs and translated
    const graphGroup = svgElement
      .append("g")
      .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`);
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

    // Apply the clip path to the group
    graphGroup.attr("clip-path", "url(#clip)");

    // building line
    const lineBuilder = d3
      .line<DataPoint>()
      .x((d) => xScale(d[x]))
      .y((d) => yScale(d[y]))
      .curve(d3.curveBasis);

    //line
    const linePath = graphGroup
      .append("g")
      .selectAll(".line")
      .data([data])
      .join("path")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", (d) =>
        lineBuilder(data.map((item) => ({ ...item, [y]: yScale.domain()[0] })))
      );

    linePath.transition().duration(1000).attr("d", lineBuilder(data));

    //lineargrad
    const lg = svgElement
      .append("defs")
      .append("linearGradient")
      .attr("id", "area-gradient")
      .attr("x1", "0")
      .attr("y1", "0")
      .attr("x2", "0")
      .attr("y2", "1");

    lg.append("stop").attr("offset", "0%").style("stop-color", "steelblue");

    lg.append("stop").attr("offset", "100%").style("stop-color", "white");

    // building area
    const areaBuilder = d3
      .area<DataPoint>()
      .x((d) => xScale(d[x]))
      .y0(yScale(1))
      .y1((d) => yScale(d[y]))
      .curve(d3.curveBasis);

    const areaPath = graphGroup
      .append("g")
      .attr("clip-path", "url(#clip)")
      .selectAll(".area")
      .data([data])
      .join("path")
      .attr("fill", "url(#area-gradient)")
      .attr("stroke", "none")
      .attr("opacity", 0.8)
      .attr("d", (d) =>
        areaBuilder(data.map((item) => ({ ...item, [y]: yScale.domain()[0] })))
      );

    areaPath.transition().duration(1000).attr("d", areaBuilder(data));

    //text anchors
    svgElement
      .append("text")
      .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`)
      .attr("text-anchor", "start")
      .attr("y", -10)
      .attr("x", -22)
      .text(y) //name of the y axis
      .attr("font-size", 10)
      .attr("font-weight", 600)
      .attr("fill", "#4883c8");
    svgElement
      .append("text")
      .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`)
      .attr("text-anchor", "start")
      .attr("y", boundsHeight)
      .attr("x", boundsWidth + 5)
      .text(x) //name of the x axis
      .attr("font-size", 10)
      .attr("font-weight", 600)
      .attr("fill", "#4883c8");

    const xBrush = d3
      .brushX()
      .extent([
        [0, 0],
        [boundsWidth, boundsHeight],
      ])
      .filter((event) => event.button === 0) // Only trigger on left mouse button
      .on("end", (event) => {
        svgElement.selectAll(".overlay").style("cursor", "grab");
        if (!event.selection) return; // ignore empty selections.
        const [x0, x1] = event.selection;
        setXBrushStart(xScale.invert(x0));
        setXBrushEnd(xScale.invert(x1));
      });

    const yBrush = d3
      .brushY()
      .extent([
        [0, 0],
        [boundsWidth, boundsHeight],
      ])
      .filter((event) => event.button === 2) // Only trigger on right mouse button
      .on("end", (event) => {
        if (!event.selection) return; // ignore empty selections.
        const [y0, y1] = event.selection;
        setYBrushStart(yScale.invert(y1));
        setYBrushEnd(yScale.invert(y0));
      });

    const touchBrush = d3
      .brush()
      .extent([
        [0, 0],
        [boundsWidth, boundsHeight],
      ])
      .filter((event) => event.button === 2) // Only trigger on right mouse button
      .on("end", (event) => {
        if (!event.selection) return; // ignore empty selections.
        const [y0, y1] = event.selection;
        setYBrushStart(yScale.invert(y1));
        setYBrushEnd(yScale.invert(y0));
      });
    svgElement.on("contextmenu", (event) => {
      event.preventDefault();
    });

    svgElement.on("dblclick", (event) => {
      const [resetXMin, resetXMax] = d3.extent(data, (d: DataPoint) => d[x]);
      const [resetYMin, resetYMax] = d3.extent(data, (d: DataPoint) => d[y]);
      setXBrushStart(resetXMin || 0);
      setXBrushEnd(resetXMax || 0);
      setYBrushStart(resetYMin || 0);
      setYBrushEnd(resetYMax || 0);
    });

    const xBrushGroup = graphGroup.append("g");
    const yBrushGroup = graphGroup.append("g");

    svgElement.on("mousedown", (event) => {
      if ("mousedown" && event.button === 0) {
        xBrushGroup.call(xBrush);
      } else if (event.button === 2) {
        yBrushGroup.call(yBrush);
      }
    });
  }, [width, data, xBrushEnd, xBrushStart, yBrushStart, yBrushEnd]);

  return (
    <div id="chartContainer" className="flex-auto inline-block justify-center">
      <div className="pl-7 text-sm text-danube-600 font-semibold">{title}</div>
      <svg
        ref={axesRef}
        width={width}
        height={height}
        style={{ display: "block", margin: "auto" }}
      ></svg>
    </div>
  );
};

export default Chart;
