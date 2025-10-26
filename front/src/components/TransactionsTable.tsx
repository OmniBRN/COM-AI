import type { FC } from "react";
import { useEffect, useState } from "react";

interface Props {
  darkMode: boolean;
}

interface Transaction {
  id: string;
  name: string;
  gender: "M" | "F";
  state: string;
  job: string;
  time: string;
  amount: number;
  fraud: boolean;
}

const TransactionsTable: FC<Props> = ({ darkMode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [fade, setFade] = useState(false);

  // Fetch from your FastAPI backend
  const fetchData = async () => {
    try {
      setFade(true);
      const res = await fetch("/api/transactions/8", {
        headers: { Accept: "application/json" },
      });

      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      const data = await res.json();

      // Convert the title‑case keys from backend to consistent shape
      const formatted: Transaction[] = data.map((item: any) => ({
        id: item["Transaction ID"] ?? "N/A",
        name: item["Name"] ?? "N/A",
        gender: (item["Gender"] ?? "M") as "M" | "F",
        state: item["State"] ?? "N/A",
        job: item["Job"] ?? "N/A",
        time: item["Transaction Time"] ?? "N/A",
        amount: +item["Amount"],
        fraud: Boolean(item["Is Fraud"]),
      }));

      setTransactions(formatted);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      setTransactions([]);
    } finally {
      setTimeout(() => setFade(false), 250);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="transition-opacity duration-500"
      style={{ opacity: fade ? 0.3 : 1 }}
    >
      <div
        className={`p-6 rounded-xl border overflow-auto ${
          darkMode
            ? "bg-gray-800 border-gray-700 text-gray-300"
            : "bg-white border-gray-200 text-gray-700"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            POS Transaction Records
          </h3>
          <span
            className={`text-xs ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            updates every 60 s
          </span>
        </div>

        {transactions.length === 0 ? (
          <p
            className={`text-center italic ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            No transaction data available
          </p>
        ) : (
          <table className="min-w-full text-sm border-collapse">
            <thead>
              <tr
                className={`font-semibold text-left ${
                  darkMode ? "text-indigo-300" : "text-indigo-600"
                }`}
              >
                <th className="py-2 px-3">Transaction ID</th>
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3">Gender</th>
                <th className="py-2 px-3">State</th>
                <th className="py-2 px-3">Job</th>
                <th className="py-2 px-3">Transaction Time</th>
                <th className="py-2 px-3">Amount</th>
                <th className="py-2 px-3">Is Fraud</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((txn, i) => (
                <tr
                  key={`${txn.id}-${i}`}
                  className={`border-t transition-colors ${
                    txn.fraud
                      ? darkMode
                        ? "bg-red-950/60 hover:bg-red-900/60 border-red-800/70"
                        : "bg-red-50 hover:bg-red-100 border-red-200"
                      : darkMode
                      ? "hover:bg-gray-700/50 border-gray-700"
                      : "hover:bg-gray-50 border-gray-200"
                  }`}
                >
                  <td className="py-2 px-3 font-medium">{txn.id}</td>
                  <td className="py-2 px-3">{txn.name}</td>
                  <td className="py-2 px-3">{txn.gender}</td>
                  <td className="py-2 px-3">{txn.state}</td>
                  <td className="py-2 px-3">{txn.job}</td>
                  <td className="py-2 px-3 whitespace-nowrap">{txn.time}</td>
                  <td className="py-2 px-3 font-semibold">
                    ${txn.amount.toFixed(2)}
                  </td>
                  <td className="py-2 px-3 uppercase text-xs font-bold">
                    {txn.fraud ? "FRAUD" : "CLEAN"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default TransactionsTable;