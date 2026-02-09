import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  ComposedChart,
  Area,
} from "recharts";
import { motion } from "framer-motion";
import { useMemo } from "react";

function BeforeDotWithLabel({ cx, cy, payload, tradeInfo, k }) {
  if (cx == null || cy == null) return null;
  const bx = tradeInfo?.before?.x ?? payload?.x ?? 0;
  const by = tradeInfo?.before?.y ?? payload?.y ?? 0;
  const spotP = bx > 0 ? (by / bx).toFixed(2) : "0";
  return (
    <g>
      <circle cx={cx} cy={cy} r={8} fill="none" stroke="#00d4ff" strokeWidth={2} opacity={0}>
        <animate attributeName="r" from="8" to="28" dur="1.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.6" to="0" dur="1.8s" repeatCount="indefinite" />
      </circle>
      <circle cx={cx} cy={cy} r={6} fill="none" stroke="#00d4ff" strokeWidth={1.5} opacity={0}>
        <animate attributeName="r" from="6" to="22" dur="1.8s" begin="0.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.4" to="0" dur="1.8s" begin="0.4s" repeatCount="indefinite" />
      </circle>
      <circle cx={cx} cy={cy} r={14} fill="#00d4ff" opacity={0.08} />
      <circle cx={cx} cy={cy} r={9} fill="#00d4ff" opacity={0.2} />
      <circle cx={cx} cy={cy} r={5} fill="#00d4ff">
        <animate attributeName="opacity" values="1;0.5;1" dur="1.8s" repeatCount="indefinite" />
      </circle>
      {/* Label box */}
      <rect x={cx + 12} y={cy - 52} width={160} height={46} rx={8} fill="rgba(0,0,0,0.7)" stroke="#00d4ff" strokeWidth={0.5} />
      <text x={cx + 20} y={cy - 34} fill="#00d4ff" fontSize={11} fontFamily="monospace" fontWeight="bold">
        P₀ = y/x = {spotP}
      </text>
      <text x={cx + 20} y={cy - 18} fill="#718096" fontSize={10} fontFamily="monospace">
        ({bx.toFixed(1)}, {by.toFixed(1)})
      </text>
    </g>
  );
}

function AfterDotWithLabel({ cx, cy, tradeInfo, k }) {
  if (cx == null || cy == null || !tradeInfo) return null;
  const { after, execPrice, spotAfter } = tradeInfo;
  return (
    <g>
      <circle cx={cx} cy={cy} r={12} fill="#ff6b6b" opacity={0.1} />
      <circle cx={cx} cy={cy} r={7} fill="#ff6b6b" opacity={0.25} />
      <circle cx={cx} cy={cy} r={4} fill="#ff6b6b" />
      {/* Label box */}
      <rect x={cx - 172} y={cy + 8} width={160} height={60} rx={8} fill="rgba(0,0,0,0.7)" stroke="#ff6b6b" strokeWidth={0.5} />
      <text x={cx - 164} y={cy + 26} fill="#ff6b6b" fontSize={11} fontFamily="monospace" fontWeight="bold">
        P₁ = y'/x' = {spotAfter.toFixed(2)}
      </text>
      <text x={cx - 164} y={cy + 42} fill="#fbbf24" fontSize={10} fontFamily="monospace">
        P_avg = Δy/Δx = {execPrice.toFixed(2)}
      </text>
      <text x={cx - 164} y={cy + 56} fill="#718096" fontSize={10} fontFamily="monospace">
        ({after.x.toFixed(1)}, {after.y.toFixed(1)})
      </text>
    </g>
  );
}

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div className="glass p-3 text-sm">
      <p><span className="text-geek-blue">ETH:</span>{" "}
        <span className="font-mono">{Number(d.x).toFixed(2)}</span></p>
      <p><span className="text-neon-green">USDT:</span>{" "}
        <span className="font-mono">{Number(d.y).toFixed(2)}</span></p>
    </div>
  );
}

export default function CurveChart({ curveData, currentPos, tradeInfo, k }) {
  const xMax = useMemo(() => Math.max(...curveData.map((d) => d.x)), [curveData]);
  const yMax = useMemo(() => Math.max(...curveData.map((d) => d.y)), [curveData]);

  // Build chart data: curve + secant column for shaded area
  const chartData = useMemo(() => {
    if (!tradeInfo) return curveData;

    const { before, after } = tradeInfo;
    const lo = Math.min(after.x, before.x);
    const hi = Math.max(after.x, before.x);

    return curveData.map((pt) => {
      if (pt.x >= lo && pt.x <= hi) {
        const t = (pt.x - after.x) / (before.x - after.x);
        const secantY = after.y + t * (before.y - after.y);
        return { ...pt, secant: parseFloat(secantY.toFixed(2)) };
      }
      return { ...pt };
    });
  }, [curveData, tradeInfo]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="glass p-6"
    >
      <h2 className="text-xl font-bold text-neon-green mb-4">
        x · y = k Curve
        {tradeInfo && (
          <span className="text-sm font-normal text-gray-500 ml-2">
            — shaded area = slippage cost
          </span>
        )}
      </h2>
      <ResponsiveContainer width="100%" height={420}>
        <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
          <defs>
            <linearGradient id="slippageFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff6b6b" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#ff6b6b" stopOpacity={0.08} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis
            dataKey="x" type="number" domain={[0, xMax]}
            stroke="#4a5568" tick={{ fill: "#718096", fontSize: 12 }}
            label={{ value: "ETH Reserve", position: "insideBottom", offset: -5, fill: "#718096" }}
          />
          <YAxis
            type="number" domain={[0, yMax]}
            stroke="#4a5568" tick={{ fill: "#718096", fontSize: 12 }}
            label={{ value: "USDT Reserve", angle: -90, position: "insideLeft", offset: 10, fill: "#718096" }}
          />
          <Tooltip content={<ChartTooltip />} />

          {/* Secant area fill (between secant and baseline=0, clipped visually) */}
          {tradeInfo && (
            <Area
              type="linear"
              dataKey="secant"
              stroke="#ff6b6b"
              strokeWidth={2}
              strokeDasharray="6 4"
              fill="url(#slippageFill)"
              fillOpacity={1}
              dot={false}
              animationDuration={0}
              connectNulls={false}
            />
          )}

          {/* Main curve */}
          <Line type="monotone" dataKey="y" stroke="#39ff14" strokeWidth={2} dot={false} animationDuration={0} />

          {/* Current position (before trade) */}
          <ReferenceDot
            x={parseFloat(currentPos.x.toFixed(2))}
            y={parseFloat(currentPos.y.toFixed(2))}
            r={0}
            shape={(props) => <BeforeDotWithLabel {...props} tradeInfo={tradeInfo} k={k} />}
          />

          {/* After-trade position */}
          {tradeInfo && (
            <ReferenceDot
              x={parseFloat(tradeInfo.after.x.toFixed(2))}
              y={parseFloat(tradeInfo.after.y.toFixed(2))}
              r={0}
              shape={(props) => <AfterDotWithLabel {...props} tradeInfo={tradeInfo} k={k} />}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>

      {/* Formula bar */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs mt-3 mb-2 font-mono">
        <span className="glass px-3 py-1.5 text-neon-green">
          y = k / x = {k.toLocaleString()} / x
        </span>
        {tradeInfo && (
          <>
            <span className="glass px-3 py-1.5 text-geek-blue">
              P₀ = y₀/x₀ = {tradeInfo.spotBefore.toFixed(4)}
            </span>
            <span className="glass px-3 py-1.5 text-[#ff6b6b]">
              P₁ = y₁/x₁ = {tradeInfo.spotAfter.toFixed(4)}
            </span>
            <span className="glass px-3 py-1.5 text-[#fbbf24]">
              P_avg = Δy/Δx = {tradeInfo.execPrice.toFixed(4)}
            </span>
          </>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400 mt-3">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-[#00d4ff]" />
          Before ({currentPos.x.toFixed(1)}, {currentPos.y.toFixed(1)})
        </span>
        {tradeInfo && (
          <>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-full bg-[#ff6b6b]" />
              After ({tradeInfo.after.x.toFixed(1)}, {tradeInfo.after.y.toFixed(1)})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-6 border-t-2 border-dashed border-[#ff6b6b]" />
              Secant (avg price)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm bg-[#ff6b6b]/30" />
              Slippage
            </span>
          </>
        )}
      </div>
    </motion.div>
  );
}
