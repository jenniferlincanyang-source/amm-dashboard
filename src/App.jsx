import { useState, useMemo } from "react";
import InputPanel from "./components/InputPanel";
import CurveChart from "./components/CurveChart";
import StatsBar from "./components/StatsBar";
import {
  computeK,
  computePrice,
  computeIL,
  generateCurveData,
  getPosition,
} from "./utils/amm";

export default function App() {
  const [x0, setX0] = useState(1000);
  const [y0, setY0] = useState(1000);
  const [priceMultiplier, setPriceMultiplier] = useState(1);

  const k = useMemo(() => computeK(x0, y0), [x0, y0]);

  const currentPos = useMemo(
    () => getPosition(x0, y0, priceMultiplier),
    [x0, y0, priceMultiplier],
  );

  const currentPrice = computePrice(currentPos.x, currentPos.y);
  const il = computeIL(priceMultiplier);

  const curveData = useMemo(() => {
    const xMin = x0 * 0.1;
    const xMax = x0 * 3.5;
    return generateCurveData(k, xMin, xMax, 300);
  }, [k, x0]);

  return (
    <div className="dark min-h-screen p-4 md:p-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">
          <span className="text-geek-blue">AMM</span>{" "}
          <span className="text-gray-300">Constant Product</span>{" "}
          <span className="text-neon-green">Dashboard</span>
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          Interactive x · y = k visualization
        </p>
      </header>

      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-[360px_1fr] gap-6">
          <InputPanel
            x0={x0}
            y0={y0}
            priceMultiplier={priceMultiplier}
            onX0Change={setX0}
            onY0Change={setY0}
            onPriceMultiplierChange={setPriceMultiplier}
          />
          <CurveChart curveData={curveData} currentPos={currentPos} />
        </div>

        <StatsBar
          price={currentPrice}
          x={currentPos.x}
          y={currentPos.y}
          il={il}
        />
      </div>
    </div>
  );
}
