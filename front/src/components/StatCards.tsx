import type { FC } from "react";

interface Props {
  darkMode: boolean;
}

const StatCards: FC<Props> = ({ darkMode }) => {
  const items = ["Users", "Transactions", "Revenue", "Performance"];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((title) => (
        <div
          key={title}
          className={`p-6 rounded-xl shadow-sm border transition-colors duration-300
          ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <h3 className="text-lg font-semibold mb-3">{title}</h3>
          <div
            className={`text-4xl font-bold mb-2 ${
              darkMode ? "text-indigo-300" : "text-indigo-600"
            }`}
          >
            0
          </div>
          <div
            className={`h-2 rounded-full ${
              darkMode ? "bg-gray-700" : "bg-gray-200"
            }`}
          >
            <div
              className={`h-2 rounded-full w-1/3 ${
                darkMode ? "bg-indigo-400" : "bg-indigo-500"
              }`}
            ></div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default StatCards;