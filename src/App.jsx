import { useState, useMemo, useRef, useCallback } from "react";
import InputPanel from "./components/InputPanel";
import CurveChart from "./components/CurveChart";
import StatsBar from "./components/StatsBar";
import PriceHistory from "./components/PriceHistory";
import ILCompareChart from "./components/ILCompareChart";
import TradeDashboard from "./components/TradeDashboard";
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
  const [usdtIn, setUsdtIn] = useState(100);
  const [history, setHistory] = useState([]);
  const idRef = useRef(0);
  const lastRecordedRef = useRef(null);

  const handlePriceChange = useCallback((val) => {
    setPriceMultiplier(val);
    const rounded = parseFloat(val.toFixed(3));
    if (lastRecordedRef.current === rounded) return;
    lastRecordedRef.current = rounded;

    const sqrtR = Math.sqrt(val);
    const newX = x0 / sqrtR;
    const newY = y0 * sqrtR;
    const price = newY / newX;
    const il = (2 * sqrtR) / (1 + val) - 1;
    const ilPercent = (il * 100).toFixed(3);

    idRef.current += 1;
    setHistory((prev) => [{
      id: idRef.current,
      multiplier: rounded.toFixed(3),
      price: price.toFixed(4),
      x: newX.toFixed(2),
      y: newY.toFixed(2),
      il: ilPercent,
      ilColor: il < -0.01 ? "text-red-400" : il < 0 ? "text-yellow-400" : "text-neon-green",
    }, ...prev.slice(0, 49)]);
  }, [x0, y0]);

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

  // Trade computation for chart overlay
  const tradeInfo = useMemo(() => {
    const safeUsdtIn = Math.max(0, usdtIn);
    if (safeUsdtIn === 0) return null;
    const beforeX = currentPos.x;
    const beforeY = currentPos.y;
    const afterY = beforeY + safeUsdtIn;
    const afterX = k / afterY;
    const ethReceived = beforeX - afterX;
    if (ethReceived <= 0) return null;
    const spotBefore = beforeY / beforeX;
    const spotAfter = afterY / afterX;
    const execPrice = safeUsdtIn / ethReceived;
    return {
      before: { x: beforeX, y: beforeY },
      after: { x: afterX, y: afterY },
      ethReceived,
      spotBefore,
      spotAfter,
      execPrice,
    };
  }, [currentPos, usdtIn, k]);

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
            onPriceMultiplierChange={handlePriceChange}
          />
          <CurveChart curveData={curveData} currentPos={currentPos} tradeInfo={tradeInfo} k={k} />
        </div>

        <TradeDashboard
          ethReserve={currentPos.x}
          usdtReserve={currentPos.y}
          usdtIn={usdtIn}
          onUsdtInChange={setUsdtIn}
          k={k}
        />

        <StatsBar
          price={currentPrice}
          x={currentPos.x}
          y={currentPos.y}
          il={il}
        />

        <ILCompareChart x0={x0} y0={y0} priceMultiplier={priceMultiplier} />

        <PriceHistory records={history} onClear={() => setHistory([])} />
      </div>
    </div>
  );
}
