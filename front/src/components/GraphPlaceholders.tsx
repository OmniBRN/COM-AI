import type { FC } from "react";
import AgeHistogram from "./AgeHistogram";
const dummyAges = [
  { age: 18, count: 12 },
  { age: 23, count: 30 },
  { age: 28, count: 55 },
  { age: 35, count: 20 },
  { age: 42, count: 15 },
  { age: 50, count: 8 },
  { age: 60, count: 3 },
]

interface Props {
  darkMode: boolean;
}

const GraphPlaceholders: FC<Props> = ({ darkMode }) => {
  return (
  <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    {/* 🔹 First slot = interactive histogram */}
      <AgeHistogram darkMode={darkMode} data={dummyAges} />

    {/* 🔹 Second slot = keep one placeholder */}
    <div
      className={`p-6 rounded-xl h-72 flex flex-col border justify-center items-center
        ${
          darkMode
            ? "bg-gray-800 border-gray-700 text-gray-400"
            : "bg-white border-gray-200 text-gray-500"
        }`}
    >
      <span className="text-center text-sm mb-2 font-semibold">
        Conversion Rates (Placeholder)
      </span>
      <div
        className={`w-full h-48 rounded-md ${
          darkMode ? "bg-gray-700" : "bg-gray-100"
        } flex items-center justify-center`}
      >
        <span className="italic opacity-60">[Graph Area]</span>
      </div>
    </div>
  </section>
);
};

export default GraphPlaceholders;