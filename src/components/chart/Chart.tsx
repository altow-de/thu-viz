import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import {
  DiagramDataForParameterAndDeployment,
  ParameterDataForDeployment,
} from "@/backend/services/ProcessedValueService";

const MARGIN = { top: 30, right: 30, bottom: 50, left: 50 };

type DataType = {
  processed_value_id: number;
  measuring_time: Date;
  value: number;
  parameter: string | null;
}[];

interface ChartProps {
  onXBrushEnd: (x0: number, x1: number) => void;
  onLoggerChange: ParameterDataForDeployment[];
  brushValue: number[];
  data: DataType;
  width: number;
  title: string;
  xAxisTitle: string; // x and y props to define the key used from the data
  yAxisTitle: string | null;
  dataObj: ParameterDataForDeployment;
}

const Chart = ({
  data,
  width,
  title,
  xAxisTitle,
  yAxisTitle,
  onXBrushEnd,
  brushValue,
  dataObj,
  onLoggerChange,
}: ChartProps) => {
  const [xBrushEnd, setXBrushEnd] = useState<number[]>([
    brushValue[0],
    brushValue[1],
  ]);
  const [yBrushEnd, setYBrushEnd] = useState<number[]>([]);
  const axesRef = useRef(null);
  let selectionRef = useRef(new Array()); // saves last zoom selection

  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = 300 - MARGIN.top - MARGIN.bottom;

  useEffect(() => {
    setXBrushEnd([brushValue[0], brushValue[1]]);
  }, [brushValue[0], brushValue[1]]);

  useEffect(() => {
    onXBrushEnd(0, 0);
    setYBrushEnd([]);
  }, [onLoggerChange]);

  useEffect(() => {
    const svgElement = d3
      .select(axesRef.current)
      .attr("class", "chart" + yAxisTitle);
    svgElement.selectAll("*").remove();

    const logger = d3.group(
      data,
      (d) => d.measuring_time,
      (d) => d.value
    );

    // Y axis
    const [min, max]: number[] | undefined[] = d3.extent(data, (d) => d.value);
    const yScale = d3
      .scaleLinear()
      .domain(
        yBrushEnd.length === 0 ? [min, max || 0] : [yBrushEnd[0], yBrushEnd[1]]
      )
      .nice()
      .range([boundsHeight, 0]);

    // X axis
    const xMin = new Date(dataObj.time_start);
    const xMax = new Date(dataObj.time_end);
    const xScale = d3
      .scaleTime() // change to time scale when working with actual time data
      .domain(xBrushEnd[0] === 0 ? [xMin, xMax] : [xBrushEnd[0], xBrushEnd[1]])
      .range([0, boundsWidth]);

    // x axis generator
    const xAxisGenerator = d3.axisBottom(xScale).ticks(6);
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
    const yAxisGenerator = d3.axisLeft(yScale).ticks(min, 10, max);
    const generatedYAxis = svgElement
      .append("g")
      .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`)
      .attr("id", "yAxis" + yAxisTitle);

    generatedYAxis
      .transition()
      .duration(1000)
      .call(yAxisGenerator)
      .attr("opacity", 0.6)
      .call((g) => g.select(".domain").attr("stroke-opacity", 0))
      .call((g) => g.selectAll(".tick line").attr("stroke-opacity", 0));

    const dashLine = generatedYAxis
      .append("g")
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
      )
      .selectAll("text")
      .remove();

    // grouped graphs and translated
    const graphGroup = svgElement
      .append("g")
      .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`);

    // Apply the clip path to the group
    graphGroup.attr("clip-path", "url(#clipCharts)");

    //building area
    const areaBuilder = d3
      .area()
      .x((d) => xScale(d.measuring_time))
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
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("opacity", 0.8)
      // transition effect
      .attr("d", (d) =>
        areaBuilder(
          data.map((item) => ({ ...item, value: yScale.domain()[0] }))
        )
      );

    areaPath.transition().duration(1000).attr("d", areaBuilder(data));

    // CLIPS
    const yBrushArea = svgElement
      .append("defs")
      .append("clipPath")
      .attr("id", "yclip")
      .append("rect")
      .attr("width", boundsWidth / 6)
      .attr("height", boundsHeight)
      .attr("x", 0)
      .attr("y", 0);

    const xBrushArea = svgElement
      .append("defs")
      .append("clipPath")
      .attr("id", "clipCharts")
      .append("rect")
      .attr("width", boundsWidth)
      .attr("height", boundsHeight)
      .attr("x", 0)
      .attr("y", 0);

    //XBRUSH
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
        if (!event.selection) return;
        const [x0, x1] = event.selection.map(xScale.invert);
        onXBrushEnd(x0, x1);
        selectionRef.current.push([x0, x1]);
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
        if (!event.selection) return;
        const [y0, y1] = event.selection.map(yScale.invert);
        setYBrushEnd([y1, y0]);
        selectionRef.current.push([y1, y0]);
      });

    yBrush.handleSize(1.5);

    // calling brushes
    const yBrushGroup = svgElement
      .append("g")
      .attr("transform", `translate(${12}, ${MARGIN.top})`)
      .attr("clip-path", "url(#yclip)")
      .append("g");
    const xBrushGroup = svgElement
      .append("g")
      .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`)
      .attr("clip-path", "url(#clipCharts)")
      .append("g");

    yBrushGroup.call(yBrush).select(".overlay").attr("cursor", "ns-resize");
    xBrushGroup.call(xBrush).select(".overlay").attr("cursor", "ew-resize");

    //reset
    svgElement.on("dblclick", (event) => {
      onXBrushEnd(0, 0);
      setYBrushEnd([]);
      selectionRef.current = [];
    });

    svgElement.on("contextmenu", (event) => {
      event.preventDefault();
    });

    //single zoom reset on right click
    svgElement.on("mousedown", (event) => {
      console.log(selectionRef.current);
      if (selectionRef.current.length === 0) return;
      if (event.button === 2) {
        const removedZoom = selectionRef.current.pop();
        if (typeof removedZoom[0] === "number") {
          const lastYZoom = selectionRef.current.findLast(
            (item) => typeof item[0] === "number"
          );
          if (lastYZoom) {
            setYBrushEnd([lastYZoom[0], lastYZoom[1]]);
          } else {
            setYBrushEnd([]);
          }
        } else {
          const lastXZoom = selectionRef.current.findLast(
            (item) => typeof item[0] !== "number"
          );
          if (lastXZoom) {
            onXBrushEnd(lastXZoom[0], lastXZoom[1]);
          } else {
            onXBrushEnd(0, 0);
          }
        }
      }
    });

    //lineargradient
    const linearGradient = svgElement
      .append("defs")
      .append("linearGradient")
      .attr("id", "area-gradient")
      .attr("x1", "0")
      .attr("y1", "0")
      .attr("x2", "0")
      .attr("y2", "1");

    linearGradient
      .append("stop")
      .attr("offset", "0%")
      .style("stop-color", "steelblue");

    linearGradient
      .append("stop")
      .attr("offset", "100%")
      .style("stop-color", "white");

    //axis text anchors
    svgElement
      .append("text")
      .attr("id", "yAnchor" + yAxisTitle)
      .attr("text-anchor", "start")
      .attr("y", -10 + MARGIN.top)
      .attr("x", -22 + MARGIN.left)
      .text(yAxisTitle) //name of the y axis
      .attr("font-size", 10)
      .attr("font-weight", 600)
      .attr("fill", "#4883c8");

    svgElement
      .append("text")
      .attr("id", "xAnchor" + yAxisTitle)
      .attr("text-anchor", "start")
      .attr("y", boundsHeight + MARGIN.top)
      .attr("x", boundsWidth + 5 + MARGIN.left)
      .text(xAxisTitle) //name of the x axis
      .attr("font-size", 10)
      .attr("font-weight", 600)
      .attr("fill", "#4883c8");
  }, [xBrushEnd, yBrushEnd]);

  return (
    <div id="chartContainer" className="flex-auto inline-block">
      <div className="pl-7 text-sm text-danube-600 font-semibold">{title}</div>
      <svg
        ref={axesRef}
        width={width}
        height={300}
        style={{ display: "block", margin: "auto" }}
      ></svg>
    </div>
  );
};

export default Chart;
