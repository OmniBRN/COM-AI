import type { FC } from "react";

interface Props {
  darkMode: boolean;
}

const GraphPlaceholders: FC<Props> = ({ darkMode }) => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {["Traffic Overview", "Conversion Rates"].map((title) => (
        <div
          key={title}
          className={`p-6 rounded-xl h-72 flex flex-col border justify-center items-center
            ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-gray-400"
                : "bg-white border-gray-200 text-gray-500"
            }`}
        >
          <span className="text-center text-sm mb-2 font-semibold">
            {title} (Placeholder)
          </span>
          <div
            className={`w-full h-48 rounded-md ${
              darkMode ? "bg-gray-700" : "bg-gray-100"
            } flex items-center justify-center`}
          >
            <span className="italic opacity-60">[Graph Area]</span>
          </div>
        </div>
      ))}
    </section>
  );
};

export default GraphPlaceholders;