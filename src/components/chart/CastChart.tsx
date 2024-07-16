import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { DataPoint } from "@/frontend/services/UpAndDownCastCalculationService";
import "../../../styles/chart.css";
import { ChartTitle, ChartUnits } from "@/frontend/constants";

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
  reset: boolean;
  setResetCastChart: (resetCastChart: boolean) => void;
  onCheck: any;
  onSwitch: boolean;
  resetCastData: () => void;
  handleYBrushEnd: (y1: number, y0: number) => void;
  unit: string;
  sensor_id: number;
}

const MARGIN = { top: 30, right: 30, bottom: 50, left: 50 };
const height = 300 - MARGIN.top - MARGIN.bottom;

/**
 * A reusable chart component for displaying cast data.
 * @param {Object} props - The props for the chart component.
 * @param {DataPoint[]} props.data - The data to be displayed in the chart.
 * @param {number} props.i_down - The start index for the downcast.
 * @param {number} props.i_down_end - The end index for the downcast.
 * @param {number} props.i_up - The start index for the upcast.
 * @param {number} props.i_up_end - The end index for the upcast.
 * @param {number} props.width - The width of the chart.
 * @param {string} props.title - The title of the chart.
 * @param {number[]} props.xBrushValue - The initial x brush values.
 * @param {number[]} props.yBrushValue - The initial y brush values.
 * @param {Function} props.syncCastCharts - Function to synchronize charts.
 * @param {boolean} props.reset - Flag to reset the chart.
 * @param {Function} props.setResetCastChart - Function to set the reset flag for the chart.
 * @param {Object} props.onCheck - Object containing flags for checkboxes.
 * @param {boolean} props.onCheck.checkbox1 - Flag for the first checkbox.
 * @param {boolean} props.onCheck.checkbox2 - Flag for the second checkbox.
 * @param {boolean} props.onCheck.checkbox3 - Flag for the third checkbox.
 * @param {boolean} props.onSwitch - Flag to indicate switching state.
 * @param {Function} props.resetCastData - Function to reset cast data.
 * @param {Function} props.handleYBrushEnd - Function to handle the end of a y brush event.
 * @param {string} props.unit - The unit of the data being displayed.
 * @param {number} props.sensor_id - The ID of the sensor.
 * @returns {JSX.Element} - The rendered chart component.
 */
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
  setResetCastChart,
  onCheck,
  onSwitch,
  resetCastData,
  handleYBrushEnd,
  unit,
  reset,
  sensor_id,
}: ChartProps): JSX.Element => {
  const d3Container = useRef<SVGSVGElement | null>(null);
  const [xBrushEnd, setXBrushEnd] = useState<number[]>(reset ? [0, 0] : xBrushValue);
  const [yBrushEnd, setYBrushEnd] = useState<number[]>(reset ? [0, 0] : yBrushValue);

  const boundsWidth = width - MARGIN.right - MARGIN.left;

  useEffect(() => {
    if (reset) setXBrushEnd([0, 0]);
  }, [reset]);

  useEffect(() => {
    setYBrushEnd([yBrushValue[0], yBrushValue[1]]);
  }, [yBrushValue]);

  /**
   * Sets up the scales for the x and y axes.
   * @param {DataPoint[]} data - The data to be used in the chart.
   * @param {number} boundsWidth - The width of the chart bounds.
   * @returns {{ xScale: d3.ScaleLinear<number, number>, yScale: d3.ScaleLinear<number, number> }} - The x and y scales.
   */
  const setupScales = (data: DataPoint[], boundsWidth: number) => {
    const [xMin, xMax] = d3.extent(data, (d) => Number(d?.value));
    const xEnd = reset ? [0, 0] : xBrushEnd;
    const yEnd = reset ? [0, 0] : yBrushEnd;
    const xScale = d3
      .scaleLinear()
      .domain(xEnd[0] > 0 || xEnd[1] > 0 ? xEnd : [xMin || 0, xMax || 0])
      .range([0, boundsWidth]);

    const filteredData = data.filter(
      (d) => Number(d.value) >= xScale.domain()[0] && Number(d.value) <= xScale.domain()[1]
    );
    const yData = filteredData?.length > 0 || yEnd[0] > 0 ? filteredData : data;
    const [yMin, yMax] = d3.extent(yData, (d) => Number(d.depth));

    const yScale = d3
      .scaleLinear()
      .domain(yEnd[0] > 0 || yEnd[1] > 0 ? yEnd : [(yMax || 0) + 0.5, (yMin || 0) - 0.5])
      .range([height, 0]);

    return { xScale, yScale };
  };

  /**
   * Draws the axes for the chart.
   * @param {d3.Selection<SVGGElement, unknown, null, undefined>} svg - The SVG selection.
   * @param {d3.ScaleLinear<number, number>} xScale - The x scale.
   * @param {d3.ScaleLinear<number, number>} yScale - The y scale.
   */
  const drawAxes = (
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    xScale: d3.ScaleLinear<number, number>,
    yScale: d3.ScaleLinear<number, number>
  ) => {
    const maxTickWidth = 50;
    const numberOfTicksX = Math.floor(boundsWidth / maxTickWidth);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(numberOfTicksX))
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

  /**
   * Creates the brushes for the x and y axes.
   * @param {d3.Selection<SVGGElement, unknown, null, undefined>} svg - The SVG selection.
   * @param {d3.ScaleLinear<number, number>} xScale - The x scale.
   * @param {d3.ScaleLinear<number, number>} yScale - The y scale.
   */
  const createBrushes = (
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    xScale: d3.ScaleLinear<number, number>,
    yScale: d3.ScaleLinear<number, number>
  ) => {
    const yBrushGroup = svg
      .append("g")
      .attr("transform", `translate(${-boundsWidth / 5}, 0)`)
      .append("g");
    const xBrushGroup = svg.append("g").attr("clip-path", "url(#clipCharts)").append("g");

    const xBrush = d3
      .brushX()
      .extent([
        [0, 0],
        [boundsWidth, height],
      ])
      .on("brush", () => {
        xBrushGroup.select(".overlay").attr("cursor", "none");
      })
      .on("end", (event) => {
        if (!event.selection) return;
        const [x0, x1] = event.selection.map(xScale.invert);
        setXBrushEnd([x0, x1]);
        setResetCastChart(false);
      });

    const yBrush = d3
      .brushY()
      .extent([
        [0, 0],
        [boundsWidth / 6, height],
      ])
      .on("brush", (event) => {
        if (!event.selection) return;
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
        handleYBrushEnd(y1, y0);
        setResetCastChart(false);
      });

    yBrush.handleSize(1.5);

    xBrushGroup.call(xBrush).select(".overlay").attr("cursor", "ew-resize");
    yBrushGroup.call(yBrush).select(".overlay").attr("cursor", "ns-resize");
  };

  /**
   * Draws a segment of the chart.
   * @param {d3.Selection<SVGGElement, unknown, null, undefined>} svg - The SVG selection.
   * @param {number} start - The start index of the segment.
   * @param {number} end - The end index of the segment.
   * @param {string} color - The color of the segment.
   * @param {d3.ScaleLinear<number, number>} xScale - The x scale.
   * @param {d3.ScaleLinear<number, number>} yScale - The y scale.
   */
  const drawSegment = (
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    start: number,
    end: number,
    color: string,
    xScale: d3.ScaleLinear<number, number>,
    yScale: d3.ScaleLinear<number, number>
  ) => {
    const lineGenerator = d3
      .line<DataPoint>()
      .x((d) => xScale(Number(d.value)))
      .y((d) => yScale(Number(d.depth)));

    svg
      .append("path")
      .datum(data.slice(start, end))
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2)
      .attr("d", lineGenerator);
  };

  /**
   * Adds labels to the axes of the chart.
   * @param {d3.Selection<SVGGElement, unknown, null, undefined>} svg - The SVG selection.
   * @param {string} title - The title of the chart.
   * @param {number} boundsWidth - The width of the chart bounds.
   */
  const addAxisLabels = (
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    title: string,
    boundsWidth: number
  ) => {
    svg
      .append("text")
      .attr("id", "xAnchor-" + title)
      .attr("text-anchor", "start")
      .attr("y", 222)
      .attr("x", boundsWidth)
      .text(ChartUnits[unit] ? ChartUnits[unit] : unit)
      .attr("font-size", 9)
      .attr("font-weight", 600)
      .attr("fill", "#4883c8");

    svg
      .append("text")
      .attr("id", "yAnchor-depth")
      .attr("text-anchor", "end")
      .attr("y", -10)
      .attr("x", 0)
      .text("depth")
      .attr("font-size", 9)
      .attr("font-weight", 600)
      .attr("fill", "#4883c8");
  };

  /**
   * Draws the chart.
   * @param {d3.Selection<SVGGElement, unknown, null, undefined>} svg - The SVG selection.
   * @param {number} i_down - The start index for the downcast.
   * @param {number} i_down_end - The end index for the downcast.
   * @param {number} i_up - The start index for the upcast.
   * @param {number} i_up_end - The end index for the upcast.
   * @param {d3.ScaleLinear<number, number>} xScale - The x scale.
   * @param {d3.ScaleLinear<number, number>} yScale - The y scale.
   */
  const draw = (
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    i_down: number,
    i_down_end: number,
    i_up: number,
    i_up_end: number,
    xScale: d3.ScaleLinear<number, number>,
    yScale: d3.ScaleLinear<number, number>
  ) => {
    const downcastColor = onCheck.checkbox1 ? (!onSwitch ? "#7B00F6" : "#4883c8") : "";
    const bottomcastColor = onCheck.checkbox2 ? (!onSwitch ? "#cae2f3" : "#4883c8") : "";
    const upcastColor = onCheck.checkbox3 ? (!onSwitch ? "#BF39D5" : "#4883c8") : "";

    drawSegment(svg, 0, i_down + 1, bottomcastColor, xScale, yScale); // Rest
    drawSegment(svg, i_down, i_down_end, downcastColor, xScale, yScale); // Bottomcast
    drawSegment(svg, i_down_end - 1, i_up + 1, bottomcastColor, xScale, yScale); // Rest
    drawSegment(svg, i_up, i_up_end, upcastColor, xScale, yScale); // Upcast
    drawSegment(svg, i_up_end - 1, data.length, bottomcastColor, xScale, yScale); // Rest
  };

  /**
   * Initializes the reset functionality for the chart.
   * @param {d3.Selection<SVGGElement, unknown, null, undefined>} svg - The SVG selection.
   */
  const initReset = (svg: d3.Selection<SVGGElement, unknown, null, undefined>) => {
    svg.on("dblclick", () => {
      setXBrushEnd([0, 0]);
      setYBrushEnd([0, 0]);
      handleYBrushEnd(0, 0);
      setResetCastChart(true);
      resetCastData();
    });

    svg.on("contextmenu", (event) => {
      event.preventDefault();
    });
  };

  useEffect(() => {
    if (data && d3Container.current) {
      const svg = d3
        .select(d3Container.current)
        .attr("width", width)
        .attr("height", 300)
        .html("")
        .append("g")
        .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

      const { xScale, yScale } = setupScales(data, boundsWidth);
      const chartBody = svg.append("g").attr("clip-path", "url(#clipCharts)");
      draw(chartBody, i_down, i_down_end, i_up, i_up_end, xScale, yScale);
      drawAxes(svg, xScale, yScale);
      const chartBrushBody = svg.append("g");
      svg.attr("id", "castGraphGroup").append("g").attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`);

      svg
        .append("defs")
        .attr("width", boundsWidth / 6)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0);

      svg
        .append("defs")
        .append("clipPath")
        .attr("id", "clipCharts")
        .append("rect")
        .attr("width", boundsWidth)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0);

      initReset(svg);
      createBrushes(chartBrushBody, xScale, yScale);
      addAxisLabels(svg, title, boundsWidth);
    }
  }, [data, i_down, i_down_end, i_up, i_up_end, width, title, xBrushEnd, yBrushEnd, onCheck, onSwitch]);

  return (
    <div id="chartContainer" className="flex-auto inline-block">
      <div className="pl-1 text-sm text-danube-600 font-semibold">{ChartTitle[title]}</div>
      <svg
        id={title + "-" + sensor_id + "-cast_chart"}
        ref={d3Container}
        style={{ display: "block", margin: "auto" }}
      ></svg>
    </div>
  );
};

export default CastChart;
