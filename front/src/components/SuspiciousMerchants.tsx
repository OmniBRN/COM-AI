import type { FC } from "react";
import { useEffect, useState } from "react";

interface Props {
  darkMode: boolean;
}

interface Merchant {
  merchant: string;
  total_transactions: number;
  fraud_count: number;
  fraud_rate: number; // percentage (0–1)
}

const SuspiciousMerchants: FC<Props> = ({ darkMode }) => {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [fade, setFade] = useState(false);

  // 🔁 Fetch real data
  const fetchData = async () => {
    try {
      setFade(true);

      // call backend route
      const res = await fetch("/api/getSortedFraudulentMerchants/20", {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const result: Merchant[] = await res.json();

      // Ensure numeric + sort descending by fraud_rate
      const formatted = (Array.isArray(result) ? result : [])
        .map((r) => ({
          merchant: r.merchant,
          total_transactions: +r.total_transactions || 0,
          fraud_count: +r.fraud_count || 0,
          fraud_rate: +r.fraud_rate || 0,
        }))
        .sort((a, b) => b.fraud_rate - a.fraud_rate);

      setMerchants(formatted);
    } catch (err) {
      console.error("Error fetching merchants:", err);
      setMerchants([]);
    } finally {
      setTimeout(() => setFade(false), 300);
    }
  };

  // Initial fetch + refresh every 60s
  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={`p-6 rounded-xl h-72 flex flex-col border overflow-hidden ${
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
          updates every 60 s
        </span>
      </div>

      {/* Scrollable list */}
      <div
        className={`flex flex-col space-y-2 overflow-y-auto pr-2 transition-opacity duration-500 ${
          fade ? "opacity-30" : "opacity-100"
        }`}
        style={{ maxHeight: "210px" }} // fits ~5 items nicely
      >
        {merchants.length > 0 ? (
          merchants.slice(0, 20).map((m, i) => (
            <div
              key={m.merchant + i}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                darkMode
                  ? "bg-gray-700/50 hover:bg-gray-700"
                  : "bg-gray-100 hover:bg-gray-200"
              } transition-colors duration-200`}
            >
              {/* Rank */}
              <span
                className={`w-6 text-center font-bold ${
                  i === 0
                    ? darkMode
                      ? "text-red-400"
                      : "text-red-600"
                    : i < 5
                    ? darkMode
                      ? "text-orange-400"
                      : "text-orange-600"
                    : darkMode
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                {i + 1}
              </span>

              {/* Merchant name */}
              <span className="flex-1 text-left truncate font-medium ml-2">
                {m.merchant}
              </span>

              {/* Fraud rate bar */}
              <div className="w-24 h-2 bg-gray-400/20 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    darkMode ? "bg-red-500" : "bg-red-600"
                  }`}
                  style={{ width: `${m.fraud_rate * 100}%` }}
                />
              </div>

              {/* Fraud percentage text */}
              <span
                className={`ml-3 min-w-[45px] text-right font-semibold ${
                  darkMode ? "text-red-400" : "text-red-600"
                }`}
              >
                {(m.fraud_rate * 100).toFixed(1)}%
              </span>
            </div>
          ))
        ) : (
          <p
            className={`italic text-center ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Nu există date disponibile
          </p>
        )}
      </div>
    </div>
  );
};

export default SuspiciousMerchants;