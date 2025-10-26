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

  // 🧠 fake data generator
  const generateData = (): Transaction[] => {
    const jobs = ["Engineer", "Doctor", "Teacher", "Lawyer", "Designer"];
    const states = ["NY", "CA", "TX", "FL", "IL"];

    return Array.from({ length: 8 }, (_, i) => {
      const isFraud = Math.random() < 0.25;
      return {
        id: `TXN-${10000 + i}`,
        name: `John Doe ${i + 1}`,
        gender: i % 2 === 0 ? "M" : "F",
        state: states[i % states.length],
        job: jobs[i % jobs.length],
        time: `2025-10-${String(15 + i).padStart(2, "0")} ${10 + i}:45`,
        amount: Math.floor(Math.random() * 1000),
        fraud: isFraud,
      };
    });
  };

  const refreshData = async () => {
    setFade(true);
    await new Promise((r) => setTimeout(r, 250)); // small delay for fade transition
    setTransactions(generateData());
    setFade(false);
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 60_000); // refresh every 60s
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="transition-opacity duration-500" style={{ opacity: fade ? 0.3 : 1 }}>
      <div
        className={`p-6 rounded-xl border overflow-auto ${
          darkMode
            ? "bg-gray-800 border-gray-700 text-gray-300"
            : "bg-white border-gray-200 text-gray-700"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">POS Transaction Records</h3>
          <span
            className={`text-xs ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            updates every 60 s
          </span>
        </div>

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
            {transactions.map((txn) => (
              <tr
                key={txn.id}
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
                <td className="py-2 px-3">{txn.time}</td>
                <td className="py-2 px-3 font-semibold">
                  ${txn.amount.toFixed(2)}
                </td>
                <td className="py-2 px-3 uppercase text-xs font-bold">
                  {txn.fraud ? "Fraud" : "Clean"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TransactionsTable;