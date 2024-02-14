import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import {
  DiagramDataForParameterAndDeployment,
  ParameterDataForDeployment,
} from "@/backend/services/ProcessedValueService";

const MARGIN = { top: 30, right: 30, bottom: 50, left: 50 };

type DataPoint = Record<string, number>;
interface ChartProps {
  onBrushEnd: (x0: number, x1: number) => void;
  brushValue: {
    x0: number;
    x1: number;
  };
  data: {
    processed_value_id: number;
    processing_time: Date;
    value: number;
    parameter: string | null;
  }[];
  width: number;
  height: number;
  title: string;
  tickValue: number;
  x: string; // x and y props to define the key used from the data
  y: string | null;
  dataObj: ParameterDataForDeployment;
}

const Chart = ({
  data,
  width,
  height,
  title,
  x,
  y,
  tickValue,
  onBrushEnd,
  brushValue,
  dataObj,
}: ChartProps) => {
  const [xBrushEnd, setXBrushEnd] = useState(brushValue.x1);
  const [xBrushStart, setXBrushStart] = useState(brushValue.x0);
  const [activeBrush, setActiveBrush] = useState(false);
  const [yBrushEnd, setYBrushEnd] = useState<number[]>([]);
  const axesRef = useRef(null);
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  console.log(data);
  // data.map((d, i) => console.log(d.processing_time, d.value));

  useEffect(() => {
    setXBrushStart(brushValue.x0);
    setXBrushEnd(brushValue.x1);
  }, [brushValue.x0, brushValue.x1]);

  useEffect(() => {
    const svgElement = d3.select(axesRef.current).attr("class", "chart" + y);
    svgElement.selectAll("*").remove();

    // Y axis
    const [min, max] = d3.extent(data, (d) => d.value);
    console.log(min, max);
    const yScale = d3
      .scaleLinear()
      .domain(
        yBrushEnd.length === 0 ? [0, max || 0] : [yBrushEnd[0], yBrushEnd[1]]
      )
      .nice()
      .range([boundsHeight, 0]);

    // X axis
    const [xMin, xMax] = d3.extent(data, (d) => d.processing_time);
    const xScale = d3
      .scaleTime() // change to time scale when working with actual time data
      .domain(
        xBrushStart === 0 && xBrushEnd === 0
          ? [xMin, xMax]
          : [xBrushStart, xBrushEnd]
      )
      .nice()
      .range([0, boundsWidth]);

    // x axis generator
    const xAxisGenerator = d3.axisBottom(xScale).ticks(5);
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
      .attr("id", "yAxis" + y)
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

    let active = false;
    //add axis zoom selectors
    svgElement
      .append("rect")
      .attr("x", -9)
      .attr("y", MARGIN.top)
      .attr("width", MARGIN.left)
      .attr("height", boundsHeight)
      .attr("fill", "transparent")
      .on("mouseover", (event) => {
        d3.select("#yAnchor" + y)
          .attr("text-decoration", "underline")
          .attr("font-weight", 800);
      })
      .on("click", (event) => {
        d3.select("#yAnchor" + y).attr("font-weight", 600);
        setActiveBrush(!activeBrush);
        active = true;
        yBrushGroup.call(yBrush);
      })
      .on("mouseout", (event) => {
        if (active === false && activeBrush === false) {
          d3.select("#yAnchor" + y)
            .attr("text-decoration", "none")
            .attr("font-weight", 600);
        } else {
          d3.select("#yAnchor" + y).attr("font-weight", 600);
        }
      });

    // grouped graphs and translated
    const graphGroup = svgElement
      .append("g")
      .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`);
    // Add a clipPath: everything out of this area won't be drawn.

    // Apply the clip path to the group
    graphGroup.attr("clip-path", "url(#clip)");

    // building line
    const lineBuilder = d3
      .line()
      .x((d) => xScale(d.processing_time))
      .y((d) => yScale(d.value))
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

    const linePathTrack = graphGroup
      .append("g")
      .selectAll(".line")
      .data([data])
      .join("path")
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", 10)
      .attr("d", (d) =>
        lineBuilder(data.map((item) => ({ ...item, [y]: yScale.domain()[0] })))
      ).on("mouseover", (event) =>{
        const coordinates = d3.pointer(event);
        if(coordinates[1] === )
      });

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
      .area()
      .x((d) => xScale(d.processing_time))
      .y0(yScale(1))
      .y1((d) => yScale(d.value))
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

    const clip = svgElement
      .append("defs")
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", boundsWidth)
      .attr("height", boundsHeight)
      .attr("x", 0)
      .attr("y", 0);
    //text anchors
    svgElement
      .append("text")
      .attr("id", "yAnchor" + y)
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
      .attr("id", "xAnchor" + y)
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
      // Only trigger on left mouse button
      .on("end", (event) => {
        if (!event.selection) return; // ignore empty selections.
        const [x0, x1] = event.selection;
        onBrushEnd(xScale.invert(x0), xScale.invert(x1));
      });

    const yBrush = d3
      .brushY()
      .extent([
        [0, 0],
        [boundsWidth, boundsHeight],
      ])
      // Only trigger on left mouse button
      .on("end", (event) => {
        if (!event.selection) return; // ignore empty selections.
        const [y0, y1] = event.selection;
        setYBrushEnd([yScale.invert(y1), yScale.invert(y0)]);
      });

    // d3.select("#trackingRect" + y).on("mousemove", (event) => {
    //   const coordinates = d3.pointer(event);
    //   console.log(
    //     `x: ${xScale.invert(coordinates[0])}, y: ${yScale.invert(
    //       coordinates[1]
    //     )}`
    //   );
    //   // data.map((d, i) => {
    //   //   if (d.processing_time === xScale.invert(coordinates[0])) {
    //   //     console.log("foobar");
    //   //   }
    //   // });
    // });

    svgElement.on("dblclick", (event) => {
      onBrushEnd(0, 0);
      setYBrushEnd([]);
      setActiveBrush(false);
    });

    const xBrushGroup = graphGroup.append("g");
    const yBrushGroup = graphGroup.append("g");

    xBrushGroup.call(xBrush);
  }, [xBrushEnd, xBrushStart, yBrushEnd]);

  return (
    <div id="chartContainer" className="flex-auto inline-block">
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
