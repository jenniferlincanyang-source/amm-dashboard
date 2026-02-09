import { motion } from "framer-motion";

function StatCard({ label, value, unit, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass p-5 flex flex-col items-center gap-2"
    >
      <span className="text-sm text-gray-400">{label}</span>
      <motion.span
        key={value}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`text-3xl font-mono font-bold ${color}`}
      >
        {value}
      </motion.span>
      {unit && <span className="text-xs text-gray-500">{unit}</span>}
    </motion.div>
  );
}

export default function StatsBar({ price, x, y, il }) {
  const ratio = `${(x / (x + y) * 100).toFixed(1)}% / ${(y / (x + y) * 100).toFixed(1)}%`;
  const ilPercent = (il * 100).toFixed(3);
  const ilColor =
    il < -0.01
      ? "text-red-400"
      : il < 0
        ? "text-yellow-400"
        : "text-neon-green";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      <StatCard
        label="Current Price (Y/X)"
        value={price.toFixed(4)}
        unit="Y per X"
        color="text-geek-blue"
        delay={0.3}
      />
      <StatCard
        label="Pool Ratio (X / Y)"
        value={ratio}
        unit="Token X% / Token Y%"
        color="text-neon-green"
        delay={0.4}
      />
      <StatCard
        label="Impermanent Loss"
        value={`${ilPercent}%`}
        color={ilColor}
        delay={0.5}
      />
    </motion.div>
  );
}
