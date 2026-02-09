import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";
import { motion } from "framer-motion";

function CustomDot({ cx, cy }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={16} fill="#00d4ff" opacity={0.15} />
      <circle cx={cx} cy={cy} r={10} fill="#00d4ff" opacity={0.3} />
      <circle cx={cx} cy={cy} r={5} fill="#00d4ff" />
    </g>
  );
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { x, y } = payload[0].payload;
  return (
    <div className="glass p-3 text-sm">
      <p>
        <span className="text-geek-blue">X:</span>{" "}
        <span className="font-mono">{x.toFixed(2)}</span>
      </p>
      <p>
        <span className="text-neon-green">Y:</span>{" "}
        <span className="font-mono">{y.toFixed(2)}</span>
      </p>
    </div>
  );
}

export default function CurveChart({ curveData, currentPos }) {
  const xValues = curveData.map((d) => d.x);
  const yValues = curveData.map((d) => d.y);
  const xMax = Math.max(...xValues);
  const yMax = Math.max(...yValues);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="glass p-6"
    >
      <h2 className="text-xl font-bold text-neon-green mb-4">
        x · y = k Curve
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={curveData}
          margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.06)"
          />
          <XAxis
            dataKey="x"
            type="number"
            domain={[0, xMax]}
            stroke="#4a5568"
            tick={{ fill: "#718096", fontSize: 12 }}
            label={{
              value: "Token X Reserve",
              position: "insideBottom",
              offset: -5,
              fill: "#718096",
            }}
          />
          <YAxis
            type="number"
            domain={[0, yMax]}
            stroke="#4a5568"
            tick={{ fill: "#718096", fontSize: 12 }}
            label={{
              value: "Token Y Reserve",
              angle: -90,
              position: "insideLeft",
              offset: 10,
              fill: "#718096",
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="y"
            stroke="#39ff14"
            strokeWidth={2}
            dot={false}
            animationDuration={0}
          />
          <ReferenceDot
            x={parseFloat(currentPos.x.toFixed(2))}
            y={parseFloat(currentPos.y.toFixed(2))}
            r={0}
            shape={<CustomDot />}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="text-center text-sm text-gray-400 mt-2">
        Current Position: (
        <span className="text-geek-blue font-mono">
          {currentPos.x.toFixed(2)}
        </span>
        ,{" "}
        <span className="text-neon-green font-mono">
          {currentPos.y.toFixed(2)}
        </span>
        )
      </div>
    </motion.div>
  );
}
