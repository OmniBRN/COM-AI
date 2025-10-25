import type { FC } from "react";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import StatCards from "./components/StatCards";
import GraphPlaceholders from "./components/GraphPlaceholders";
import TransactionsTable from "./components/TransactionsTable";
import Footer from "./components/Footer";

const App: FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-700 
        ${darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}
      `} style={{fontFamily:"Space Grotesk"}}
    >
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <main
        className={`pt-24 pb-16 px-6 w-full flex-grow transition-colors duration-500 
          ${darkMode ? "bg-gray-900" : "bg-gray-50"}
        `}
      >
        <div className="mx-auto w-full max-w-[1400px] space-y-12 px-4 sm:px-8">
          <section>
            <h2 className="text-3xl font-bold mb-2">
              Statistici Tranzacții POS
            </h2>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Grafice și Statistici Referitoare la Tranzacții Frauduloase
              Detectate
            </p>
          </section>

          <StatCards darkMode={darkMode} />
          <GraphPlaceholders darkMode={darkMode} />
          <TransactionsTable darkMode={darkMode} />
        </div>
      </main>

      <Footer darkMode={darkMode} />
    </div>
  );
};

export default App;