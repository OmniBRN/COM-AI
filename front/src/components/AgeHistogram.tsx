import type {FC} from "react"
import {  useEffect, useRef } from "react";
import * as d3 from "d3";

interface Props {
  darkMode: boolean;
  data: { age: number; count: number }[];
}

const AgeHistogram: FC<Props> = ({ darkMode, data }) => {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Clear previous renders when data changes
    d3.select(ref.current).selectAll("*").remove();

    // Dimensions
    const width = 400;
    const height = 200;
    const margins = { top: 10, right: 20, bottom: 30, left: 30 };

    const svg = d3
      .select(ref.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    // Scales
    const x = d3
      .scaleBand<number>()
      .domain(data.map((d) => d.age))
      .range([margins.left, width - margins.right])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count)!])
      .nice()
      .range([height - margins.bottom, margins.top]);

    // Bars
    const barColor = darkMode ? "#818CF8" : "#4F46E5";
    const barHover = darkMode ? "#A5B4FC" : "#6366F1";

    const bars = svg
      .append("g")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (d) => x(d.age)!)
      .attr("y", (d) => y(d.count))
      .attr("width", x.bandwidth())
      .attr("height", (d) => y(0) - y(d.count))
      .attr("rx", 3)
      .attr("fill", barColor)
      .on("mouseover", function (e, d) {
        d3.select(this).attr("fill", barHover);
        tooltip
          .style("opacity", 1)
          .text(`${d.count} cazuri la ${d.age} ani`)
          .style("left", e.pageX + "px")
          .style("top", e.pageY - 28 + "px");
      })
      .on("mousemove", function (e) {
        tooltip
          .style("left", e.pageX + "px")
          .style("top", e.pageY - 28 + "px");
      })
      .on("mouseout", function () {
        d3.select(this).attr("fill", barColor);
        tooltip.style("opacity", 0);
      });

    // X Axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margins.bottom})`)
      .call(
        d3
          .axisBottom(x)
          .tickSizeOuter(0)
          .tickFormat((d) => `${d}a`) as any
      )
      .attr("color", darkMode ? "#9CA3AF" : "#4B5563")
      .selectAll("text")
      .style("font-size", "10px");

    // Y Axis (light grid lines)
    svg
      .append("g")
      .attr("transform", `translate(${margins.left},0)`)
      .call(d3.axisLeft(y).ticks(4))
      .call((g) => g.select(".domain").remove())
      .attr("color", darkMode ? "#9CA3AF" : "#4B5563")
      .selectAll("text")
      .style("font-size", "10px");

    // Tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr(
        "class",
        "absolute text-xs bg-gray-900 text-white px-2 py-1 rounded opacity-0 pointer-events-none"
      )
      .style("position", "absolute")
      .style("z-index", "10");
  }, [darkMode, data]);

  return (
    <div
      className={`p-4 rounded-xl border h-[260px] flex flex-col items-center justify-center
        ${
          darkMode
            ? "bg-gray-800 border-gray-700 text-gray-300"
            : "bg-white border-gray-200 text-gray-700"
        }`}
    >
      <h3
        className={`text-base font-semibold mb-2 ${
          darkMode ? "text-indigo-400" : "text-indigo-600"
        }`}
      >
        Distribuția pe vârste
      </h3>
      <svg ref={ref} className="w-full h-full"></svg>
    </div>
  );
};

export default AgeHistogram;