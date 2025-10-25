import { FC, useEffect, useState } from "react";

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
        ${darkMode ? "text-indigo-400" : "text-indigo-600"}
        text-3xl font-extrabold uppercase tracking-widest select-none
      `}
    >
      {[...Array(30)].map((_, i) => (
        <span key={i} className="mx-8">
          fraud_COM
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
      <main className="text-center mt-24 max-w-2xl transition-colors duration-500">
        <h2
          className={`text-5xl font-bold leading-tight mb-6 transition-colors duration-500 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Build experiences that{" "}
          <span
            className={`transition-colors duration-500 ${
              darkMode ? "text-indigo-400" : "text-indigo-600"
            }`}
          >
            delight
          </span>
        </h2>
        <p
          className={`text-lg mb-8 transition-colors duration-500 ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Launch your next project with React, Vite, and TailwindCSS — fast,
          modern, and delightful by default.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <a
            className="px-6 py-3 text-white bg-indigo-600 rounded-lg shadow hover:bg-indigo-700 transition-all duration-200"
          >
            Get Started
          </a>
          <a
            href="#"
            className={`px-6 py-3 border rounded-lg transition-all duration-200 
              ${darkMode 
                ? "text-indigo-400 border-indigo-400 hover:bg-indigo-950"
                : "text-indigo-600 border-indigo-600 hover:bg-indigo-50"}
            `}
          >
            Learn More
          </a>
        </div>
      </main>

      <footer
        className={`absolute bottom-4 text-sm transition-colors duration-500 ${
          darkMode ? "text-gray-400" : "text-gray-500"
        }`}
      >
        © {new Date().getFullYear()} Fraud.COM. No rights reserved.
      </footer>
    </div>
  );
};

export default App;