import type { FC } from "react";

interface Props {
  darkMode: boolean;
}

const TransactionsTable: FC<Props> = ({ darkMode }) => {
  return (
    <section>
      <div
        className={`p-6 rounded-xl border overflow-auto ${
          darkMode
            ? "bg-gray-800 border-gray-700 text-gray-300"
            : "bg-white border-gray-200 text-gray-700"
        }`}
      >
        <h3 className="text-lg font-semibold mb-4">
          POS Transaction Records
        </h3>

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
            {[...Array(8)].map((_, i) => {
              const isFraud = i % 3 === 0;

              return (
                <tr
                  key={i}
                  className={`border-t ${
                    isFraud
                      ? darkMode
                        ? "bg-red-950/60 hover:bg-red-900/60 border-red-800/70"
                        : "bg-red-50 hover:bg-red-100 border-red-200"
                      : darkMode
                      ? "hover:bg-gray-700/50 border-gray-700"
                      : "hover:bg-gray-50 border-gray-200"
                  }`}
                >
                  <td className="py-2 px-3 font-medium">TXN-{10000 + i}</td>
                  <td className="py-2 px-3">John Doe {i + 1}</td>
                  <td className="py-2 px-3">{i % 2 === 0 ? "M" : "F"}</td>
                  <td className="py-2 px-3">
                    {["NY", "CA", "TX", "FL", "IL"][i % 5]}
                  </td>
                  <td className="py-2 px-3">
                    {["Engineer", "Doctor", "Teacher", "Lawyer", "Designer"][i % 5]}
                  </td>
                  <td className="py-2 px-3">
                    {`2025-10-${String(15 + i).padStart(2, "0")} ${10 + i}:45`}
                  </td>
                  <td className="py-2 px-3 font-semibold">
                    ${Math.floor(Math.random() * 1000).toFixed(2)}
                  </td>
                  <td className="py-2 px-3 uppercase text-xs font-bold">
                    {isFraud ? "Fraud" : "Clean"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TransactionsTable;