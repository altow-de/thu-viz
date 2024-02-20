import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
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
  const [yBrushEnd, setYBrushEnd] = useState([]);
  const axesRef = useRef(null);
  const selectionYRef = useRef<MutableRefObject<Object[]>>();
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;
  console.log(selectionYRef);
  useEffect(() => {
    setXBrushStart(brushValue.x0);
    setXBrushEnd(brushValue.x1);
  }, [brushValue.x0, brushValue.x1]);

  useEffect(() => {
    const svgElement = d3.select(axesRef.current).attr("class", "chart" + y);
    svgElement.selectAll("*").remove();

    // Y axis
    const [min, max] = d3.extent(data, (d) => d.value);
    const yScale = d3
      .scaleLinear()
      .domain(
        yBrushEnd.length === 0 ? [0, max || 0] : [yBrushEnd[0], yBrushEnd[1]]
      )
      .nice()
      .range([boundsHeight, 0]);

    // X axis
    const xMin = new Date(dataObj.time_start);
    const xMax = new Date(dataObj.time_end);
    const xScale = d3
      .scaleTime() // change to time scale when working with actual time data
      .domain(
        xBrushStart === 0 && xBrushEnd === 0
          ? [xMin, xMax]
          : [xBrushStart, xBrushEnd]
      )
      .range([0, boundsWidth]);

    // x axis generator
    const xAxisGenerator = d3.axisBottom(xScale).ticks(4);
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
    const yAxisGenerator = d3.axisLeft(yScale).ticks(min, 10, max); //ticks
    const generatedYAxis = svgElement
      .append("g")
      .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`)
      .attr("id", "yAxis" + y)
      .transition()
      .duration(1000)
      .call(yAxisGenerator)
      .attr("opacity", 0.6)
      .call((g) => g.select(".domain").attr("stroke-opacity", 0))
      .call((g) => g.selectAll(".tick line").attr("stroke-opacity", 0));

    const dashLine = svgElement
      .append("g")
      .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`)
      .attr("id", "yAxis" + y)
      .call(yAxisGenerator)
      .attr("opacity", 0.6)
      .call((g) => g.select(".domain").attr("stroke-opacity", 0))
      .call((g) =>
        g
          .selectAll(".tick line")
          .attr("stroke-opacity", 0)
          .clone()
          .attr("x2", boundsWidth)
          .attr("stroke-opacity", 0.2)
          .attr("stroke-dasharray", 2)
      );
    dashLine.selectAll("text").remove();

    // grouped graphs and translated
    const graphGroup = svgElement
      .append("g")
      .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`);
    const xbrushGroup = svgElement
      .append("g")
      .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`);
    const ybrushGroup = svgElement
      .append("g")
      .attr("transform", `translate(${12}, ${MARGIN.top})`);

    d3.selectAll(".brush .selection")
      .style("fill", "#69b3a2")
      .style("opacity", 0.5);

    // Apply the clip path to the group
    graphGroup.attr("clip-path", "url(#clipCharts)");

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
      //transition not working
      .attr("d", (d) =>
        lineBuilder(
          data.map((item) => ({ ...item, value: yScale.domain()[0] }))
        )
      );

    linePath.transition().duration(1000).attr("d", lineBuilder(data));

    // building area
    const areaBuilder = d3
      .area()
      .x((d) => xScale(d.processing_time))
      .y0(yScale(1))
      .y1((d) => yScale(d.value))
      .curve(d3.curveBasis);

    const areaPath = graphGroup
      .append("g")
      .attr("clip-path", "url(#clipCharts)")
      .selectAll(".area")
      .data([data])
      .join("path")
      .attr("fill", "url(#area-gradient)")
      .attr("stroke", "none")
      .attr("opacity", 0.8)
      //transition not working
      .attr("d", (d) =>
        areaBuilder(
          data.map((item) => ({ ...item, value: yScale.domain()[0] }))
        )
      );

    areaPath.transition().duration(1000).attr("d", areaBuilder(data));

    // CLIPS
    const yClip = svgElement
      .append("defs")
      .append("clipPath")
      .attr("id", "yclip")
      .append("rect")
      .attr("width", boundsWidth / 6)
      .attr("height", boundsHeight)
      .attr("x", 0)
      .attr("y", 0)
      .attr("cursor", "ns-resize");

    const clipCharts = svgElement
      .append("defs")
      .append("clipPath")
      .attr("id", "clipCharts")
      .append("rect")
      .attr("width", boundsWidth)
      .attr("height", boundsHeight)
      .attr("x", 0)
      .attr("y", 0)
      .attr("cursor", "ew-resize");

    //XBRUSH

    const children = generatedYAxis.selectAll("g").selectAll("*");
    const lastChild = children.filter((d, i, nodes) => i === nodes.length - 1);

    // Assign an id to the last child
    lastChild.attr("id", "highestYAnchor");

    const xBrush = d3
      .brushX()
      .extent([
        [0, 0],
        [boundsWidth, boundsHeight],
      ])

      .on("brush", (event) => {
        xBrushGroup.select(".overlay").attr("cursor", "none");
      })
      .on("end", (event) => {
        if (!event.selection) return; // ignore empty selections.
        const [x0, x1] = event.selection;
        const found1Data = data
          .reverse()
          .find((d) => xScale(d.processing_time) < x1);
        const found2Data = data
          .reverse()
          .find((d) => xScale(d.processing_time) > x0);
        setYBrushEnd([found2Data.value, found1Data.value]);
        onBrushEnd(xScale.invert(x0), xScale.invert(x1));
      });

    // YBRUSH
    const yBrush = d3
      .brushY()
      .extent([
        [0, 0],
        [boundsWidth, boundsHeight],
      ])

      .on("brush", (event) => {
        const [x, y] = d3.pointer(event, xBrushGroup.node());
        yBrushGroup
          .selectAll(".handle--n, .handle--s")
          .style("fill", "steelblue")
          .style("stroke", "steelblue")
          .style("stroke-width", 0.2);

        yBrushGroup.select(".overlay").attr("cursor", "none");
      })
      .on("end", (event) => {
        if (!event.selection) return; // ignore empty selections.
        const [y0, y1] = event.selection;
        setYBrushEnd([yScale.invert(y1), yScale.invert(y0)]);
        selectionYRef.push([yScale.invert(y1), yScale.invert(y0)]);
      });

    yBrush.handleSize(1.5);

    // calling brushes
    const yBrushGroup = ybrushGroup
      .attr("clip-path", "url(#yclip)")
      .append("g");
    const xBrushGroup = xbrushGroup
      .attr("clip-path", "url(#clipCharts)")
      .append("g");

    yBrushGroup.call(yBrush).select(".overlay").attr("cursor", "ns-resize");
    xBrushGroup.call(xBrush).select(".overlay").attr("cursor", "ew-resize");

    //reset
    svgElement.on("dblclick", (event) => {
      onBrushEnd(0, 0);
      setYBrushEnd([]);
      setActiveBrush(false);
    });

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

    //text anchors
    svgElement
      .append("text")
      .attr("id", "yAnchor" + y)
      .attr("text-anchor", "start")
      .attr("y", -10 + MARGIN.top)
      .attr("x", -22 + MARGIN.left)
      .text(y) //name of the y axis
      .attr("font-size", 10)
      .attr("font-weight", 600)
      .attr("fill", "#4883c8");

    svgElement
      .append("text")
      .attr("id", "xAnchor" + y)
      .attr("text-anchor", "start")
      .attr("y", boundsHeight + MARGIN.top)
      .attr("x", boundsWidth + 5 + MARGIN.left)
      .text(x) //name of the x axis
      .attr("font-size", 10)
      .attr("font-weight", 600)
      .attr("fill", "#4883c8");
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
