import type { FC } from "react";

interface Props {
  darkMode: boolean;
}

const Footer: FC<Props> = () => {
  return (
   <footer className="mt-auto py-4 text-center text-sm border-t border-gray-700 text-gray-500">
  © {new Date().getFullYear()} Fraud.COM — No Rights Reserved
  </footer>
  );
};

export default Footer;