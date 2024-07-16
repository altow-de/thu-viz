import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  DiagramDataForParameterAndDeployment,
  ParameterDataForDeployment,
} from "@/backend/services/ProcessedValueService";
import { ChartTitle, ChartUnits } from "@/frontend/constants";

const MARGIN = { top: 30, right: 30, bottom: 50, left: 50 };

interface ChartProps {
  onXBrushEnd: (x0: number, x1: number, brushSync: boolean) => void;
  onLoggerChange: ParameterDataForDeployment[];
  brushValue: number[];
  data: DiagramDataForParameterAndDeployment[];
  width: number;
  title: string;
  xAxisTitle: string; // x and y props to define the key used from the data
  yAxisTitle: string;
  dataObj: ParameterDataForDeployment;
  brushSync: boolean;
  sensor_id: number;
}

/**
 * A reusable chart component for displaying data with brushing and zooming functionality.
 * @param {Object} props - The props for the Chart component.
 * @param {Function} props.onXBrushEnd - Callback function for when the x brush ends.
 * @param {ParameterDataForDeployment[]} props.onLoggerChange - Data for the logger change event.
 * @param {number[]} props.brushValue - The initial brush values for the x-axis.
 * @param {DiagramDataForParameterAndDeployment[]} props.data - The data to be displayed in the chart.
 * @param {number} props.width - The width of the chart.
 * @param {string} props.title - The title of the chart.
 * @param {string} props.xAxisTitle - The title for the x-axis.
 * @param {string} props.yAxisTitle - The title for the y-axis.
 * @param {ParameterDataForDeployment} props.dataObj - The data object containing time start and end.
 * @param {boolean} props.brushSync - Flag to indicate if the brush should be synchronized.
 * @param {number} props.sensor_id - The ID of the sensor.
 * @returns {JSX.Element} - The rendered Chart component.
 */
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
  brushSync,
  sensor_id,
}: ChartProps): JSX.Element => {
  const [xBrushEnd, setXBrushEnd] = useState<number[]>([brushValue[0], brushValue[1]]);
  const [yBrushEnd, setYBrushEnd] = useState<number[]>([]);
  const axesRef = useRef<SVGSVGElement | null>(null);
  let selectionRef = useRef<[number, number][]>([]); // saves last zoom selection

  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = 300 - MARGIN.top - MARGIN.bottom;

  useEffect(() => {
    setXBrushEnd([brushValue[0], brushValue[1]]);
  }, [brushValue]);

  useEffect(() => {
    onXBrushEnd(0, 0, brushSync);
    setYBrushEnd([]);
  }, [onLoggerChange]);

  useEffect(() => {
    const svgElement = d3.select(axesRef.current).attr("class", "chart" + yAxisTitle);
    svgElement.selectAll("*").remove();

    // X axis
    const xMin = new Date(dataObj.time_start || "");
    const xMax = new Date(dataObj.time_end || "");

    const xScale = d3
      .scaleTime() // change to time scale when working with actual time data
      .domain(xBrushEnd[0] === 0 ? [xMin, xMax] : [xBrushEnd[0], xBrushEnd[1]])
      .range([0, boundsWidth]);

    // Y axis
    const filteredData = data.filter(
      (d) => d.measuring_time >= xScale.domain()[0] && d.measuring_time <= xScale.domain()[1]
    );
    const yData = filteredData.length > 0 || xBrushEnd[0] > 0 ? filteredData : data;
    const [calculatedMin, calculatedMax] = d3.extent(yData, (d) => Number(d.value)) as [number, number];

    // Calculate min and max y axis
    const min = calculatedMin !== calculatedMax ? calculatedMin : Math.max(calculatedMin - 10, 0);
    const max = calculatedMax !== calculatedMin ? calculatedMax : calculatedMax + 10;

    const yScale = d3
      .scaleLinear()
      .domain(yBrushEnd.length === 0 ? [min, max] : [yBrushEnd[0], yBrushEnd[1]])
      .range([boundsHeight, 0]);

    const maxTickWidth = 50;
    const numberOfTicksX = Math.floor(boundsWidth / maxTickWidth);

    // X axis generator
    const xAxisGenerator = d3.axisBottom(xScale).ticks(numberOfTicksX);
    svgElement
      .append("g")
      .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top + boundsHeight})`)
      .transition()
      .duration(1000)
      .call(xAxisGenerator)
      .attr("opacity", 0.6)
      .call((g) => g.select(".domain").attr("stroke-opacity", 0))
      .call((g) => g.selectAll(".tick line").attr("stroke-opacity", 0));

    // Y axis generator
    const yAxisGenerator = d3.axisLeft(yScale).ticks(10);
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

    // Grouped graphs and translated
    const graphGroup = svgElement.append("g").attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`);

    // Apply the clip path to the group
    graphGroup.attr("clip-path", "url(#clipCharts)");

    // Building area
    const areaBuilder = d3
      .area<DiagramDataForParameterAndDeployment>()
      .x((d) => xScale(d.measuring_time))
      .y0(yScale(0))
      .y1((d) => yScale(Number(d.value)))
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
      // Transition effect
      .attr("d", (d) => areaBuilder(data.map((item: any) => ({ ...item, value: yScale.domain()[0] }))));

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

    // XBRUSH
    const xBrush = d3
      .brushX()
      .extent([
        [0, 0],
        [boundsWidth, boundsHeight],
      ])
      .on("brush", () => {
        xBrushGroup.select(".overlay").attr("cursor", "none");
      })
      .on("end", (event) => {
        if (!event.selection) return;
        const [x0, x1] = event.selection.map(xScale.invert);
        const filteredData = data.filter((d) => d.measuring_time >= x0 && d.measuring_time <= x1);
        if (filteredData.length === 0) return;
        onXBrushEnd(x0, x1, brushSync);
        selectionRef.current.push([x0, x1]);
      });

    // YBRUSH
    const yBrush = d3
      .brushY()
      .extent([
        [0, 0],
        [boundsWidth, boundsHeight],
      ])
      .on("brush", () => {
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

    // Calling brushes
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

    // Reset
    svgElement.on("dblclick", () => {
      onXBrushEnd(0, 0, brushSync);
      setYBrushEnd([]);
      selectionRef.current = [];
    });

    svgElement.on("contextmenu", (event) => {
      event.preventDefault();
    });

    // Single zoom reset on right click
    svgElement.on("mousedown", (event) => {
      if (selectionRef.current.length === 0) return;
      if (event.button === 2) {
        const removedZoom = selectionRef.current.pop();
        if (Array.isArray(removedZoom) && typeof removedZoom[0] === "number") {
          const lastYZoom = selectionRef.current.findLast((item) => Array.isArray(item) && typeof item[0] === "number");
          if (lastYZoom) {
            setYBrushEnd([lastYZoom[0], lastYZoom[1]]);
          } else {
            setYBrushEnd([]);
          }
        } else {
          const lastXZoom = selectionRef.current.findLast((item) => !Array.isArray(item));
          if (lastXZoom) {
            onXBrushEnd(lastXZoom[0], lastXZoom[1], brushSync);
          } else {
            onXBrushEnd(0, 0, brushSync);
          }
        }
      }
    });

    // Linear gradient
    const linearGradient = svgElement
      .append("defs")
      .append("linearGradient")
      .attr("id", "area-gradient")
      .attr("x1", "0")
      .attr("y1", "0")
      .attr("x2", "0")
      .attr("y2", "1");

    linearGradient.append("stop").attr("offset", "0%").style("stop-color", "steelblue");
    linearGradient.append("stop").attr("offset", "100%").style("stop-color", "white");

    // Axis text anchors
    svgElement
      .append("text")
      .attr("id", "yAnchor" + yAxisTitle)
      .attr("text-anchor", "end")
      .attr("y", -15 + MARGIN.top)
      .attr("x", -10 + MARGIN.left)
      .text(ChartUnits[yAxisTitle] ? ChartUnits[yAxisTitle] : yAxisTitle) // Name of the y-axis
      .attr("font-size", 9)
      .attr("font-weight", 600)
      .attr("fill", "#4883c8");

    svgElement
      .append("text")
      .attr("id", "xAnchor" + xAxisTitle)
      .attr("text-anchor", "start")
      .attr("y", boundsHeight + MARGIN.top + 7)
      .attr("x", boundsWidth + MARGIN.left)
      .text(xAxisTitle) // Name of the x-axis
      .attr("font-size", 9)
      .attr("font-weight", 600)
      .attr("fill", "#4883c8");
  }, [xBrushEnd, yBrushEnd, brushSync]);

  return (
    <div id="chartContainer" className="flex-auto inline-block">
      <div className="pl-1 text-sm text-danube-600 font-semibold">{ChartTitle[title]}</div>
      <svg
        id={title !== "pressure" ? title + "-" + sensor_id + "-chart" : "pressure-chart"}
        ref={axesRef}
        width={width}
        height={300}
        style={{ display: "block", margin: "auto" }}
      ></svg>
    </div>
  );
};

export default Chart;
