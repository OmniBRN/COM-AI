import type { FC } from "react";
import AgeHistogram from "./AgeHistogram";
import SuspiciousMerchants from "./SuspiciousMerchants";
const dummyAges = [
  { age: 18, count: 12 },
  { age: 23, count: 30 },
  { age: 28, count: 55 },
  { age: 35, count: 20 },
  { age: 42, count: 15 },
  { age: 50, count: 8 },
  { age: 60, count: 3 },
]

interface Props {
  darkMode: boolean;
}

const GraphPlaceholders: FC<Props> = ({ darkMode }) => {
  return (
  <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <AgeHistogram darkMode={darkMode} data={dummyAges} />
    <SuspiciousMerchants darkMode={darkMode} />
  </section>
);
};

export default GraphPlaceholders;