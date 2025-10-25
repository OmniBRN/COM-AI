import type {FC} from "react"
import { useEffect, useState } from "react";

const App: FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div
      className={`min-h-screen transition-colors duration-700 flex flex-col items-center justify-center px-6 py-12 
        ${darkMode ? "bg-gray-900" : "bg-white"}
      `}
    >
{/* Continuous Scrolling fraud_com Header */}
<header
  className={`fixed top-0 left-0 w-full h-14 flex items-center border-b z-10
    transition-colors duration-500 overflow-hidden
    ${darkMode ? "bg-gray-900/80 border-gray-700" : "bg-white/80 border-gray-200"}
  `}
>
  {/* Scrolling Banner */}
  <div className="relative w-full h-full overflow-hidden scroll-fade">
    <div
      className={`absolute top-1/2 -translate-y-1/2 flex animate-[froStream_25s_linear_infinite]
        ${darkMode ? "text-white" : "text-indigo-600"}
        text-3xl font-extrabold uppercase tracking-widest select-none
      `}
    >
      {[...Array(30)].map((_, i) => (
        <span key={i} className="mx-8">
          fraud_com
        </span>
      ))}
    </div>
  </div>

  {/* Theme Switcher */}
  <button
    onClick={() => setDarkMode((prev) => !prev)}
    className={`absolute right-6 top-1/2 -translate-y-1/2 p-2 rounded-md transition duration-200 
      ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-indigo-100 hover:bg-indigo-200"}
    `}
    aria-label="Toggle dark mode"
  >
    {darkMode ? (
      // Sun icon
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 text-yellow-400"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
      </svg>
    ) : (
      // Moon icon
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 text-indigo-600"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M10 16a1 1 0 011 1v1a1 1 0 11-2 
          0v-1a1 1 0 011-1zm4.22-2.22a1 1 0 
          011.42 1.42l-.71.7a1 1 0 
          11-1.42-1.42l.71-.7zm1.78-3.78a1 1 0 
          110 2h-1a1 1 0 110-2h1zM10 4a1 1 0 
          01-1-1V2a1 1 0 112 0v1a1 1 0 
          01-1 1zM5.78 5.78a1 1 0 011.42 0l.71.7a1 1 0 
          01-1.42 1.42l-.71-.7a1 1 0 
          010-1.42zM4 10a1 1 0 110 2H3a1 1 0 
          110-2h1zm2.22 4.22a1 1 0 
          011.42 1.42l-.7.71a1 1 0 
          01-1.42-1.42l.7-.71zm3.78-1.22a3 
          3 0 110-6 3 3 0 010 6z"
          clipRule="evenodd"
        />
      </svg>
    )}
  </button>
</header>

      {/* Hero Section */}
<main
  className={`pt-24 pb-16 px-6 min-h-screen w-full transition-colors duration-500 
    ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"}
  `}
>
  {/* Wider container but same content inside */}
  <div className="mx-auto w-full max-w-[1400px] space-y-12 px-4 sm:px-8">
    {/* Overview Header */}
    <section>
      <h2 className="text-3xl font-bold mb-2">Statistici Tranzactii POS</h2>
      <p
        className={`text-sm ${
          darkMode ? "text-gray-400" : "text-gray-600"
        }`}
      >
        Grafice si Statistici Referitoare la Tranzactii Frauduloase Detectate
      </p>
    </section>

    {/* Stat Cards */}
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {["Users", "Transactions", "Revenue", "Performance"].map((title) => (
        <div
          key={title}
          className={`p-6 rounded-xl shadow-sm border 
            transition-colors duration-300
            ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }
          `}
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

    {/* Placeholder Graphs */}
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Line Graph Placeholder */}
      <div
        className={`p-6 rounded-xl h-72 flex flex-col border justify-center items-center 
          ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-gray-400"
              : "bg-white border-gray-200 text-gray-500"
          }
        `}
      >
        <span className="text-center text-sm mb-2 font-semibold">
          Traffic Overview (Line Chart Placeholder)
        </span>
        <div
          className={`w-full h-48 rounded-md ${
            darkMode ? "bg-gray-700" : "bg-gray-100"
          } flex items-center justify-center`}
        >
          <span className="italic opacity-60">[Graph Area]</span>
        </div>
      </div>

      {/* Bar Graph Placeholder */}
      <div
        className={`p-6 rounded-xl h-72 flex flex-col border justify-center items-center 
          ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-gray-400"
              : "bg-white border-gray-200 text-gray-500"
          }
        `}
      >
        <span className="text-center text-sm mb-2 font-semibold">
          Conversion Rates (Bar Chart Placeholder)
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

{/* Transactions Table */}
<section>
  <div
    className={`p-6 rounded-xl border overflow-auto 
      ${
        darkMode
          ? "bg-gray-800 border-gray-700 text-gray-300"
          : "bg-white border-gray-200 text-gray-700"
      }
    `}
  >
    <h3 className="text-lg font-semibold mb-4">POS Transaction Records</h3>

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
          const isFraud = i % 3 === 0; // Placeholder: every 3rd transaction is fraud

          return (
            <tr
              key={i}
              className={`border-t transition-colors duration-300 ${
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
              <td className="py-2 px-3">
                {isFraud ? (
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-semibold uppercase 
                      ${
                        darkMode
                          ? "bg-red-900 text-red-300 border border-red-700"
                          : "bg-red-100 text-red-700"
                      }
                    `}
                  >
                    Fraud
                  </span>
                ) : (
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium uppercase 
                      ${
                        darkMode
                          ? "bg-green-800/60 text-green-300 border border-green-700"
                          : "bg-green-100 text-green-700"
                      }
                    `}
                  >
                    Clean
                  </span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
</section>  
</div>
</main>

 <footer
      className={`w-full text-center py-4 text-sm border-t
        ${darkMode ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-500"}
      `}
    >
      © {new Date().getFullYear()} <span className="font-semibold">Fraud.COM</span>. All
      rights reserved.
    </footer>
  </div>
  );
};

export default App;