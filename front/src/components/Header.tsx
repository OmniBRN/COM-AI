import type { FC, Dispatch, SetStateAction } from "react";

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: Dispatch<SetStateAction<boolean>>;
}

const Header: FC<HeaderProps> = ({ darkMode, setDarkMode }) => {
  return (
    <header
      className={`fixed top-0 left-0 w-full h-14 flex items-center border-b z-10
        transition-colors duration-500 overflow-hidden
        ${darkMode ? "bg-gray-900/80 border-gray-700" : "bg-white/80 border-gray-200"}
      `}
    >
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

      <button
        onClick={() => setDarkMode((prev) => !prev)}
        className={`absolute right-6 top-1/2 -translate-y-1/2 p-2 rounded-md transition duration-200 
          ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-indigo-100 hover:bg-indigo-200"}
        `}
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-indigo-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 16a1 1 0 011 1v1a1 1 0 11-2 
                0v-1a1 1 0 011-1zM4 10a1 1 0 110 2H3a1 1 0 
                110-2h1z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>
    </header>
  );
};

export default Header;