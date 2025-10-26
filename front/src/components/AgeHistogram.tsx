import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface Props {
  darkMode: boolean;
}

interface AgeDatum {
  age: number;
  count: number;
}

const AgeHistogram: FC<Props> = ({ darkMode }) => {
  const ref = useRef<SVGSVGElement | null>(null);
  const [data, setData] = useState<AgeDatum[]>([]);
  const [fade, setFade] = useState(false);

  // 🧠 Fetch live data from backend
  const fetchData = async () => {
    try {
      setFade(true);
      await new Promise((r) => setTimeout(r, 200)); // small fade delay

      const res = await fetch("/api/getFirstNAges/");
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const result = await res.json();

      /**
       * Assuming backend returns something like:
       * [
       *   { "age": 18, "count": 12 },
       *   { "age": 23, "count": 30 },
       *   ...
       * ]
       */
      const formatted: AgeDatum[] = result.map((d: any) => ({
        age: +d.age,
        count: +d.count,
      }));

      setData(formatted);
    } catch (err) {
      console.error("Failed to load age data:", err);
    } finally {
      setFade(false);
    }
  };

  // Initial + recurring refresh
  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 60_000); // every minute
    return () => clearInterval(id);
  }, []);

  // D3 render logic
  useEffect(() => {
    if (!ref.current || data.length === 0) return;

    const svgNode = d3.select(ref.current);
    svgNode.selectAll("*").remove();

    const container = ref.current.parentElement;
    const width = container ? container.clientWidth - 40 : 500;
    const height = 250;
    const m = { top: 10, right: 20, bottom: 45, left: 45 };

    const svg = svgNode
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%")
      .attr("height", height)
      .attr("preserveAspectRatio", "xMidYMid meet");

    // Scales
    const x = d3
      .scaleBand<number>()
      .domain(data.map((d) => d.age))
      .range([m.left, width - m.right])
      .padding(0.25);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count)!])
      .nice()
      .range([height - m.bottom, m.top]);

    const barColor = darkMode ? "#818CF8" : "#4F46E5";
    const barHover = darkMode ? "#A5B4FC" : "#6366F1";

    // Create bars
    const bars = svg
      .append("g")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (d) => x(d.age)!)
      .attr("width", x.bandwidth())
      .attr("rx", 4)
      .attr("fill", barColor)
      .attr("y", y(0))
      .attr("height", 0);

    bars
      .transition()
      .duration(700)
      .ease(d3.easeCubicOut)
      .attr("y", (d) => y(d.count))
      .attr("height", (d) => y(0) - y(d.count));

    // Tooltip — single instance
    d3.select(".age-tooltip").remove();
    const tooltip = d3
      .select("body")
      .append("div")
      .attr(
        "class",
        "age-tooltip absolute text-xs bg-gray-900 text-white px-2 py-1 rounded opacity-0 pointer-events-none"
      )
      .style("position", "absolute")
      .style("z-index", "10");

    bars
      .on("mouseover", function (e, d) {
        d3.select(this).attr("fill", barHover);
        tooltip
          .style("opacity", 1)
          .text(`${d.count} tranzacții la ${d.age} ani`)
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

    // Axes
    svg
      .append("g")
      .attr("transform", `translate(0,${height - m.bottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .attr("color", darkMode ? "#9CA3AF" : "#4B5563")
      .selectAll("text")
      .style("font-size", "11px");

    svg
      .append("g")
      .attr("transform", `translate(${m.left},0)`)
      .call(d3.axisLeft(y).ticks(5))
      .call((g) => g.select(".domain").remove())
      .attr("color", darkMode ? "#9CA3AF" : "#4B5563")
      .selectAll("text")
      .style("font-size", "11px");

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
  }, [data, darkMode]);

  return (
    <div
      className={`p-6 rounded-xl h-72 flex flex-col border justify-center items-center transition-opacity duration-500 ${
        fade ? "opacity-30" : "opacity-100"
      } ${
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
