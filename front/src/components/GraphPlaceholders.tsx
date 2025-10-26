import type { FC } from "react";
import AgeHistogram from "./AgeHistogram";
import SuspiciousMerchants from "./SuspiciousMerchants";

interface Props {
  darkMode: boolean;
}

const GraphPlaceholders: FC<Props> = ({ darkMode }) => {
  return (
  <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <AgeHistogram darkMode={darkMode} />
    <SuspiciousMerchants darkMode={darkMode} />
  </section>
);
};

export default GraphPlaceholders;