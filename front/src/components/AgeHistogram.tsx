import type { FC } from "react";
import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface Props {
  darkMode: boolean;
  data: { age: number; count: number }[];
}

const AgeHistogram: FC<Props> = ({ darkMode, data }) => {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    d3.select(ref.current).selectAll("*").remove();

    // ⚙️ Compute container width dynamically
    const container = ref.current.parentElement;
    const width = container ? container.clientWidth - 40 : 500;
    const height = 250;
    const margins = { top: 10, right: 20, bottom: 45, left: 45 };

    const svg = d3
      .select(ref.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%")
      .attr("height", height)
      .attr("preserveAspectRatio", "xMidYMid meet");

    // Scales
    const x = d3
      .scaleBand<number>()
      .domain(data.map((d) => d.age))
      .range([margins.left, width - margins.right])
      .padding(0.25);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count)!])
      .nice()
      .range([height - margins.bottom, margins.top]);

    // Colors
    const barColor = darkMode ? "#818CF8" : "#4F46E5";
    const barHover = darkMode ? "#A5B4FC" : "#6366F1";

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

    // Bars
    svg
      .append("g")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (d) => x(d.age)!)
      .attr("width", x.bandwidth())
      .attr("fill", barColor)
      .attr("rx", 4)
      .attr("y", y(0))
      .attr("height", 0)
      .transition()
      .duration(800)
      .ease(d3.easeCubicOut)
      .attr("y", (d) => y(d.count))
      .attr("height", (d) => y(0) - y(d.count));

    // Tooltip Interactivity
    svg
      .selectAll("rect")
      .on("mouseover", function (e, d) {
        d3.select(this).attr("fill", barHover);
        tooltip
          .style("opacity", 1)
          .text(`${d.count} cazuri la ${d.age} ani`)
          .style("left", e.pageX + "px")
          .style("top", e.pageY - 28 + "px");
      })
      .on("mousemove", (e) => {
        tooltip.style("left", e.pageX + "px").style("top", e.pageY - 28 + "px");
      })
      .on("mouseout", function () {
        d3.select(this).attr("fill", barColor);
        tooltip.style("opacity", 0);
      });

    // Axes
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margins.bottom})`)
      .call(
        d3
          .axisBottom(x)
          .tickSizeOuter(0)
          .tickFormat((d) => `${d}`)
      )
      .attr("color", darkMode ? "#9CA3AF" : "#4B5563")
      .selectAll("text")
      .style("font-size", "11px");

    svg
      .append("g")
      .attr("transform", `translate(${margins.left},0)`)
      .call(d3.axisLeft(y).ticks(5))
      .call((g) => g.select(".domain").remove())
      .attr("color", darkMode ? "#9CA3AF" : "#4B5563")
      .selectAll("text")
      .style("font-size", "11px");

    // Axis Labels
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 10)
      .attr("text-anchor", "middle")
      .style("fill", darkMode ? "#9CA3AF" : "#4B5563")
      .style("font-size", "12px")
      .text("Ages");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .style("fill", darkMode ? "#9CA3AF" : "#4B5563")
      .style("font-size", "12px")
      .text("Count");
  }, [darkMode, data]);

  return (
    <div
      className={`p-6 rounded-xl h-72 flex flex-col border justify-center items-center 
        ${
          darkMode
            ? "bg-gray-800 border-gray-700 text-gray-300"
            : "bg-white border-gray-200 text-gray-700"
        }`}
    >
      <h3
        className={`text-base font-semibold mb-3 ${
          darkMode ? "text-indigo-400" : "text-indigo-600"
        }`}
      >
        Distribuția pe vârste
      </h3>
      <svg ref={ref} className="w-full h-full" />
    </div>
  );
};

export default AgeHistogram;