import type { FC } from "react";
import { useEffect, useState } from "react";

interface Props {
  darkMode: boolean;
}

const StatCards: FC<Props> = ({ darkMode }) => {
  const [totalTransactions, setTotalTransactions] = useState(12543);
  const [fraudTransactions, setFraudTransactions] = useState(312);
  const [fraudAmount, setFraudAmount] = useState(58400);
  const [topStates, setTopStates] = useState([
    { state: "New York", value: 320 },
    { state: "California", value: 290 },
    { state: "Texas", value: 240 },
    { state: "Florida", value: 210 },
    { state: "Illinois", value: 190 },
  ]);
  const [fade, setFade] = useState(false);

  // 🔁 Simulate API refresh every 60 s
  useEffect(() => {
    const refresh = () => {
      setFade(true);

      setTimeout(() => {
        // dummy updated values
        const randomFraud = Math.floor(250 + Math.random() * 100);
        const randomTotal = Math.floor(12000 + Math.random() * 800);
        const randomAmount = Math.floor(50000 + Math.random() * 12000);

        setFraudTransactions(randomFraud);
        setTotalTransactions(randomTotal);
        setFraudAmount(randomAmount);

        // shuffle top states slightly
        setTopStates((prev) =>
          prev
            .map((s) => ({
              ...s,
              value: Math.max(150, s.value + Math.round(Math.random() * 40 - 20)),
            }))
            .sort((a, b) => b.value - a.value)
        );

        setFade(false);
      }, 300); // short fade‑out/in delay
    };

    refresh(); // first run
    const id = setInterval(refresh, 60_000);
    return () => clearInterval(id);
  }, []);

  const cleanTransactions = totalTransactions - fraudTransactions;
  const fraudRatio = (fraudTransactions / totalTransactions) * 100;
  const cardBase = `
    p-4 rounded-xl shadow-sm border flex flex-col items-center text-center
    transition-colors duration-300
  `;

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-5 transition-opacity duration-500"
      style={{ opacity: fade ? 0.3 : 1 }}
    >
      {/* --- CARD 1 --- */}
      <div
        className={`${cardBase} ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <h3
          className={`text-lg font-semibold mb-2 ${
            darkMode ? "text-indigo-400" : "text-indigo-600"
          }`}
        >
          Tranzacții monitorizate
        </h3>

        <div
          className="flex flex-col items-center justify-center flex-grow space-y-2 mt-1"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          <p className="text-5xl font-bold leading-tight">
            {totalTransactions.toLocaleString("ro-RO")}
          </p>

          <div className="flex justify-between w-full max-w-[200px] text-sm font-medium">
            <span
              className={`${
                darkMode ? "text-red-400" : "text-red-600"
              } font-semibold`}
            >
              {fraudTransactions} fraude
            </span>
            <span
              className={`${
                darkMode ? "text-green-400" : "text-green-700"
              } font-semibold`}
            >
              {cleanTransactions} curate
            </span>
          </div>

          {/* Progress bar */}
          <div
            className={`h-1.5 w-[260px] sm:w-[280px] rounded-full overflow-hidden ${
              darkMode ? "bg-green-700" : "bg-green-400"
            }`}
          >
            <div
              className={`h-full transition-all duration-700 ease-out ${
                darkMode ? "bg-red-500" : "bg-red-600"
              }`}
              style={{ width: `${fraudRatio}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* --- CARD 2 --- */}
      <div
        className={`${cardBase} ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <h3
          className={`text-lg font-semibold mb-2 ${
            darkMode ? "text-indigo-400" : "text-indigo-600"
          }`}
        >
          Banii în tranzacții frauduloase
        </h3>

        <div className="flex flex-col items-center justify-center flex-grow space-y-2 mt-1">
          <p
            className="text-5xl font-extrabold leading-tight"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            ${fraudAmount.toLocaleString("en-US")}
          </p>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Total estimat pierdut prin fraude
          </p>
        </div>
      </div>

      {/* --- CARD 3 --- */}
      <div
        className={`${cardBase} ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <h3
          className={`text-lg font-semibold mb-2 ${
            darkMode ? "text-indigo-400" : "text-indigo-600"
          }`}
        >
          Top zone cu cele mai multe fraude
        </h3>

        <div className="flex flex-col justify-center flex-grow w-full mt-1 space-y-1.5">
          {topStates.map((item, i) => (
            <div
              key={item.state}
              className="flex items-center justify-between px-2"
              style={{ opacity: 1 - i * 0.18 }}
            >
              <span
                className={`font-bold ${
                  darkMode ? "text-white" : "text-gray-800"
                } text-base`}
              >
                {item.state}
              </span>
              <span
                className={`font-semibold ${
                  darkMode ? "text-red-400" : "text-red-600"
                } text-sm`}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatCards;