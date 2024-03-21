import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { DataPoint } from "@/frontend/services/UpAndDownCastCalculationService";
import "../../../styles/chart.css";

interface ChartProps {
  data: DataPoint[];
  i_down: number;
  i_down_end: number;
  i_up: number;
  i_up_end: number;
  width: number;
  title: string;
  xBrushValue: number[];
  yBrushValue: number[];
  syncCastCharts: (y0: number, y1: number) => void;
  brushSync: boolean;
  reset: boolean;
  setResetCastChart: (resetCastChart: boolean) => void;
}

const MARGIN = { top: 30, right: 30, bottom: 50, left: 50 };
const height = 300 - MARGIN.top - MARGIN.bottom;
const CastChart = ({
  data,
  i_down,
  i_down_end,
  i_up,
  i_up_end,
  width,
  title,
  xBrushValue,
  yBrushValue,
  brushSync,
  reset,
  setResetCastChart,
}: ChartProps) => {
  const d3Container = useRef<SVGSVGElement | null>(null);
  const [xBrushEnd, setXBrushEnd] = useState<number[]>(reset ? [0, 0] : xBrushValue);
  const [yBrushEnd, setYBrushEnd] = useState<number[]>(reset ? [0, 0] : yBrushValue);

  const boundsWidth = width - MARGIN.right - MARGIN.left;

  const setupScales = (data: DataPoint[], boundsWidth: number) => {
    if (reset) setXBrushEnd([0, 0]);
    const [xMin, xMax]: (number | undefined)[] = d3.extent(data, (d) => Number(d.value.replace(",", ".")));

    const xScale = d3
      .scaleLinear()
      .domain(xBrushEnd[0] > 0 || xBrushEnd[1] > 0 ? xBrushEnd : [xMin || 0, xMax || 0])
      .range([0, boundsWidth]);

    const filteredData = data.filter(
      (d) => Number(d.value) >= xScale.domain()[0] && Number(d.value) <= xScale.domain()[1]
    );
    const yData = filteredData?.length > 0 || xBrushEnd[0] > 0 ? filteredData : data;
    const [yMin, yMax]: (number | undefined)[] = d3.extent(yData, (d) => Number(d.depth));

    const yScale = d3
      .scaleLinear()
      .domain(yBrushEnd[0] > 0 || yBrushEnd[1] > 0 ? yBrushEnd : [yMax || 0, yMin || 0])
      .range([height, 0]);

    return { xScale, yScale };
  };

  const drawAxes = (
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    xScale: d3.ScaleLinear<number, number, never>,
    yScale: d3.ScaleLinear<number, number, never>
  ) => {
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(5))
      .attr("stroke-opacity", 0)
      .attr("font-size", 10)
      .attr("color", "#8c9192");
    svg
      .append("g")
      .call(d3.axisLeft(yScale).ticks(10))
      .attr("stroke-opacity", 0)
      .attr("font-size", 10)
      .attr("color", "#8c9192")
      .call((g) =>
        g
          .selectAll(".tick line")
          .attr("stroke-opacity", 0)
          .clone()
          .attr("x2", boundsWidth)
          .attr("stroke-opacity", 0.2)
          .attr("stroke-dasharray", 2)
      );
  };

  const createBrushes = (
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    xScale: d3.ScaleLinear<number, number, never>,
    yScale: d3.ScaleLinear<number, number, never>
  ) => {
    const xBrush = d3
      .brushX()
      .extent([
        [0, 0],
        [boundsWidth, height],
      ])
      .on("brush", (event) => {
        xBrushGroup.select(".overlay").attr("cursor", "none");
      })
      .on("end", (event) => {
        if (!event.selection) return;
        const [x0, x1] = event.selection.map(xScale.invert);
        setXBrushEnd([x0, x1]);
        setResetCastChart(false);
      });
    const xBrushGroup = svg.append("g").attr("clip-path", "url(#clipCharts)").append("g");
    const yBrushGroup = svg
      .append("g")
      .attr("clip-path", "url(#yclip)")
      .attr("fill", "red")
      .attr("stroke", "red")
      .append("g");

    const yBrush = d3
      .brushY()
      .extent([
        [0, 0],
        [boundsWidth, height],
      ])
      .on("brush", (event) => {
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
      });
    yBrushGroup.call(yBrush).select(".overlay").attr("cursor", "ns-resize");
    xBrushGroup.call(xBrush).select(".overlay").attr("cursor", "ew-resize");
    yBrush.handleSize(1.5);
  };

  const drawSegment = (
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    start: number,
    end: number,
    color: string,
    xScale: d3.ScaleLinear<number, number, never>,
    yScale: d3.ScaleLinear<number, number, never>
  ) => {
    svg
      .append("path")
      .datum(data.slice(start, end))
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2)
      .attr(
        "d",
        d3
          .line()
          .x((d) => xScale(Number(d.value)))
          .y((d) => yScale(Number(d.depth)))
      );
  };

  const addAxisLabels = (
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    title: string,
    boundsWidth: number
  ) => {
    svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", boundsWidth / 2)
      .attr("y", height + MARGIN.bottom - 5)
      .text(title);
  };

  const draw = (
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    i_down: number,
    i_down_end: number,
    i_up: number,
    i_up_end: number,
    xScale: d3.ScaleLinear<number, number, never>,
    yScale: d3.ScaleLinear<number, number, never>
  ) => {
    drawSegment(svg, 0, i_down, "#7B00F6", xScale, yScale); // Downcast
    drawSegment(svg, i_down, i_down_end, "#BF39D5", xScale, yScale); // Bottomcast
    drawSegment(svg, i_up, i_up_end, "#cae2f3", xScale, yScale); // Upcast
  };

  useEffect(() => {
    if (data && d3Container.current) {
      const svg = d3
        .select(d3Container.current)
        .attr("width", width)
        .attr("height", 300)
        .html("")
        .append("g")
        .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`); // grouped graphs and translated

      const { xScale, yScale } = setupScales(data, boundsWidth);
      drawAxes(svg, xScale, yScale);
      const chartBody = svg.append("g").attr("clip-path", "url(#clipCharts)").append("g");

      createBrushes(chartBody, xScale, yScale);
      draw(chartBody, i_down, i_down_end, i_up, i_up_end, xScale, yScale);
      addAxisLabels(svg, title, boundsWidth);
      const graphGroup = svg.append("g").attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`);

      // Apply the clip path to the group
      graphGroup.attr("clip-path", "url(#clipCharts)");

      const areaPath = graphGroup
        .append("g")
        .attr("clip-path", "url(#clipCharts)")
        .selectAll(".area")
        .data([data])
        .join("path")
        .attr("fill", "url(#area-gradient)")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("opacity", 0.8);
      areaPath.transition().duration(1000);

      // CLIPS
      const yBrushArea = svg
        .append("defs")
        .append("clipPath")
        .attr("id", "yclip")
        .append("rect")
        .attr("fill", "lightgrey")
        .attr("width", boundsWidth / 6)
        .attr("height", height)
        .attr("x", width)
        .attr("y", 0);

      const xBrushArea = svg
        .append("defs")
        .append("clipPath")
        .attr("id", "clipCharts")
        .append("rect")
        .attr("width", boundsWidth)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0);
    }
  }, [data, i_down, i_down_end, i_up, i_up_end, width, title, xBrushEnd, yBrushEnd]);

  return (
    <div id="chartContainer" className="flex-auto inline-block">
      <div className="pl-7 text-sm text-danube-600 font-semibold">{title}</div>
      <svg ref={d3Container} style={{ display: "block", margin: "auto" }}></svg>
    </div>
  );
};

export default CastChart;
