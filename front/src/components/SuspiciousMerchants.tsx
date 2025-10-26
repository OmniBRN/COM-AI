import type { FC } from "react";
import { useEffect, useState } from "react";

interface Props {
  darkMode: boolean;
}

interface Merchant {
  name: string;
  score: number;
}

const SuspiciousMerchants: FC<Props> = ({ darkMode }) => {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [fade, setFade] = useState(false);

  // 🧠 mock/dummy generator for now
  const generateData = () =>
    Array.from({ length: 20 }, (_, i) => ({
      name: `Merchant ${i + 1}`,
      score: Math.round(100 - i * 3 + Math.random() * 5),
    }));

  // ⚡  function to load/refresh data
  const fetchData = async () => {
    try {
      // For later, replace with real fetch:
      // const res = await fetch('/api/merchants');
      // const data = await res.json();
      const data = generateData(); // simulate

      // trigger fade animation
      setFade(true);
      setTimeout(() => {
        setMerchants(data);
        setFade(false);
      }, 300); // fade out then in
    } catch (err) {
      console.error("Error updating merchants:", err);
    }
  };

  // Initial load + refresh every minute
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60_000); // 1 minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`p-6 rounded-xl h-72 flex flex-col border overflow-hidden
        ${
          darkMode
            ? "bg-gray-800 border-gray-700 text-gray-200"
            : "bg-white border-gray-200 text-gray-700"
        }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3
          className={`text-base font-semibold ${
            darkMode ? "text-indigo-400" : "text-indigo-600"
          }`}
        >
          Suspicious Merchant Activity
        </h3>
        <span
          className={`text-xs ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          updates every 60s
        </span>
      </div>

      {/* Scroll list */}
      <div
        className={`flex flex-col space-y-2 overflow-y-auto pr-2 transition-opacity duration-500 ${
          fade ? "opacity-30" : "opacity-100"
        }`}
        style={{ maxHeight: "205px" }}
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
            transition-colors duration-200`}
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

            {/* Name */}
            <span className="flex-1 text-left truncate font-medium ml-2">
              {m.name}
            </span>

            {/* Severity bar */}
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