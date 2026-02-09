import { motion } from "framer-motion";

export default function InputPanel({
  x0,
  y0,
  priceMultiplier,
  onX0Change,
  onY0Change,
  onPriceMultiplierChange,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="glass p-6 flex flex-col gap-6"
    >
      <h2 className="text-xl font-bold text-geek-blue">Pool Configuration</h2>

      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Token X Initial Reserve
          </label>
          <input
            type="number"
            min="1"
            value={x0}
            onChange={(e) => onX0Change(Math.max(1, Number(e.target.value)))}
            className="w-full text-lg"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Token Y Initial Reserve
          </label>
          <input
            type="number"
            min="1"
            value={y0}
            onChange={(e) => onY0Change(Math.max(1, Number(e.target.value)))}
            className="w-full text-lg"
          />
        </div>
      </div>

      <div className="border-t border-white/10 pt-4">
        <label className="block text-sm text-gray-400 mb-2">
          Price Multiplier
        </label>
        <input
          type="range"
          min={-1}
          max={1}
          step={0.005}
          value={Math.log10(priceMultiplier)}
          onChange={(e) =>
            onPriceMultiplierChange(Math.pow(10, Number(e.target.value)))
          }
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0.1x</span>
          <span>1x</span>
          <span>10x</span>
        </div>
        <div className="text-center mt-2">
          <span className="text-2xl font-mono font-bold text-neon-green">
            {priceMultiplier.toFixed(3)}x
          </span>
        </div>
      </div>

      <div className="text-xs text-gray-500 border-t border-white/10 pt-3">
        <p>
          <span className="text-geek-blue">k</span> = x × y ={" "}
          <span className="text-neon-green font-mono">
            {(x0 * y0).toLocaleString()}
          </span>
        </p>
      </div>
    </motion.div>
  );
}
