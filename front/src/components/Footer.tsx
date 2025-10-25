import type { FC } from "react";

interface Props {
  darkMode: boolean;
}

const Footer: FC<Props> = ({ darkMode }) => {
  return (
    <footer
      className={`w-full text-center py-4 text-sm border-t
        ${
          darkMode
            ? "border-gray-700 text-gray-400"
            : "border-gray-200 text-gray-500"
        }
      `}
    >
      © {new Date().getFullYear()}{" "}
      <span className="font-semibold">Fraud.COM</span>. All rights reserved.
    </footer>
  );
};

export default Footer;