import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { useMemo } from "react";

function generateCompareData(x0, y0) {
  const data = [];
  const initialValue = x0 + y0; // normalized: initial price = 1, so value = x0 * 1 + y0 * 1 (price of X in Y terms = y0/x0)
  const p0 = y0 / x0;

  for (let i = 0; i <= 200; i++) {
    const r = 0.1 + (i / 200) * 9.9; // price multiplier 0.1 to 10
    const sqrtR = Math.sqrt(r);

    // HODL value: hold original x0 and y0, price of X changes by r
    // Value in Y terms: x0 * (p0 * r) + y0 = p0 * x0 * r + y0
    const hodlValue = x0 * p0 * r + y0;

    // LP value: new_x = x0/sqrt(r), new_y = y0*sqrt(r)
    // Value in Y terms: new_x * (p0 * r) + new_y
    const lpX = x0 / sqrtR;
    const lpY = y0 * sqrtR;
    const lpValue = lpX * p0 * r + lpY;

    // Normalize to initial value percentage
    const initialTotal = x0 * p0 + y0;
    const hodlPct = (hodlValue / initialTotal) * 100;
    const lpPct = (lpValue / initialTotal) * 100;

    data.push({
      r: parseFloat(r.toFixed(2)),
      hodl: parseFloat(hodlPct.toFixed(2)),
      lp: parseFloat(lpPct.toFixed(2)),
      diff: parseFloat((lpPct - hodlPct).toFixed(2)),
    });
  }
  return data;
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const hodl = payload.find((p) => p.dataKey === "hodl");
  const lp = payload.find((p) => p.dataKey === "lp");
  const diff = lp && hodl ? (lp.value - hodl.value).toFixed(2) : "0";
  return (
    <div className="glass p-3 text-sm">
      <p className="text-gray-400 mb-1">Price: {label}x</p>
      <p>
        <span className="text-geek-blue">HODL:</span>{" "}
        <span className="font-mono">{hodl?.value}%</span>
      </p>
      <p>
        <span className="text-neon-green">LP:</span>{" "}
        <span className="font-mono">{lp?.value}%</span>
      </p>
      <p className="border-t border-white/10 mt-1 pt-1">
        <span className="text-gray-400">IL:</span>{" "}
        <span className={`font-mono ${Number(diff) < 0 ? "text-red-400" : "text-neon-green"}`}>
          {diff}%
        </span>
      </p>
    </div>
  );
}

export default function ILCompareChart({ x0, y0, priceMultiplier }) {
  const data = useMemo(() => generateCompareData(x0, y0), [x0, y0]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass p-6"
    >
      <h2 className="text-xl font-bold mb-1">
        <span className="text-geek-blue">HODL</span>
        <span className="text-gray-500"> vs </span>
        <span className="text-neon-green">LP</span>
        <span className="text-gray-400 text-base font-normal ml-2">
          — Impermanent Loss Visualized
        </span>
      </h2>
      <p className="text-xs text-gray-500 mb-4">
        Portfolio value (%) relative to initial deposit
      </p>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
          <defs>
            <linearGradient id="hodlGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#00d4ff" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="lpGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#39ff14" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#39ff14" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis
            dataKey="r"
            type="number"
            domain={[0.1, 10]}
            stroke="#4a5568"
            tick={{ fill: "#718096", fontSize: 12 }}
            label={{ value: "Price Multiplier", position: "insideBottom", offset: -5, fill: "#718096" }}
            tickFormatter={(v) => `${v}x`}
          />
          <YAxis
            stroke="#4a5568"
            tick={{ fill: "#718096", fontSize: 12 }}
            tickFormatter={(v) => `${v}%`}
            label={{ value: "Value %", angle: -90, position: "insideLeft", offset: 10, fill: "#718096" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            height={36}
            formatter={(value) => (
              <span className={value === "hodl" ? "text-geek-blue" : "text-neon-green"}>
                {value === "hodl" ? "HODL" : "LP (AMM)"}
              </span>
            )}
          />
          <Area
            type="monotone"
            dataKey="hodl"
            stroke="#00d4ff"
            strokeWidth={2}
            fill="url(#hodlGrad)"
            animationDuration={0}
          />
          <Area
            type="monotone"
            dataKey="lp"
            stroke="#39ff14"
            strokeWidth={2}
            fill="url(#lpGrad)"
            animationDuration={0}
          />
          <ReferenceLine
            x={parseFloat(priceMultiplier.toFixed(2))}
            stroke="#ff6b6b"
            strokeWidth={2}
            strokeDasharray="6 3"
            label={{ value: "Current", fill: "#ff6b6b", fontSize: 12, position: "top" }}
          />
          <ReferenceLine x={1} stroke="rgba(255,255,255,0.2)" strokeDasharray="4 4" />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
