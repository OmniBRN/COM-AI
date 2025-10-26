import type { FC } from "react";
import { useMemo } from "react";

interface Props {
  darkMode: boolean;
}

const SuspiciousMerchants: FC<Props> = ({ darkMode }) => {
  // Dummy data — replace later with backend response
  const merchants = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        name: `Merchant ${i + 1}`,
        score: Math.round(100 - i * 3 + Math.random() * 5), // 100 down to ~45
      })),
    []
  );

  return (
    <div
      className={`p-6 rounded-xl h-72 flex flex-col border
        ${
          darkMode
            ? "bg-gray-800 border-gray-700 text-gray-200"
            : "bg-white border-gray-200 text-gray-700"
        }`}
    >
      <h3
        className={`text-base font-semibold mb-3 ${
          darkMode ? "text-indigo-400" : "text-indigo-600"
        }`}
      >
        Suspicious Merchant Activity
      </h3>

      {/* Scroll container */}
      <div
        className={`flex flex-col space-y-2 overflow-y-auto pr-2`}
        style={{ maxHeight: "205px" }} // shows ~5 items
      >
        {merchants.map((m, index) => (
          <div
            key={m.name}
            className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm
              ${
                darkMode
                  ? "bg-gray-700/50 hover:bg-gray-700"
                  : "bg-gray-100 hover:bg-gray-200"
              }
              transition-colors duration-200
            `}
          >
            {/* Rank */}
            <span
              className={`w-6 text-center font-bold ${
                index === 0
                  ? darkMode
                    ? "text-red-400"
                    : "text-red-600"
                  : index < 5
                  ? darkMode
                    ? "text-orange-400"
                    : "text-orange-600"
                  : darkMode
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              {index + 1}
            </span>

            {/* Merchant name */}
            <span className="flex-1 text-left truncate font-medium ml-2">
              {m.name}
            </span>

            {/* Score bar / severity */}
            <div className="w-24 h-2 bg-gray-400/20 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  darkMode ? "bg-red-500" : "bg-red-600"
                }`}
                style={{ width: `${m.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuspiciousMerchants;