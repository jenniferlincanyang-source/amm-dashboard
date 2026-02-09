import { motion, AnimatePresence } from "framer-motion";

export default function PriceHistory({ records, onClear }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-geek-blue">Price History</h2>
        {records.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-gray-500 hover:text-red-400 transition-colors px-3 py-1 rounded-lg border border-white/10 hover:border-red-400/30"
          >
            Clear
          </button>
        )}
      </div>

      {records.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-6">
          Drag the price slider to start recording...
        </p>
      ) : (
        <div className="overflow-auto max-h-64">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-white/10">
                <th className="text-left py-2 px-3 font-medium">#</th>
                <th className="text-right py-2 px-3 font-medium">Multiplier</th>
                <th className="text-right py-2 px-3 font-medium">Price (Y/X)</th>
                <th className="text-right py-2 px-3 font-medium">Reserve X</th>
                <th className="text-right py-2 px-3 font-medium">Reserve Y</th>
                <th className="text-right py-2 px-3 font-medium">IL %</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {records.map((r, i) => (
                  <motion.tr
                    key={r.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-2 px-3 text-gray-500">{records.length - i}</td>
                    <td className="py-2 px-3 text-right font-mono text-neon-green">
                      {r.multiplier}x
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-geek-blue">
                      {r.price}
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-gray-300">
                      {r.x}
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-gray-300">
                      {r.y}
                    </td>
                    <td className={`py-2 px-3 text-right font-mono ${r.ilColor}`}>
                      {r.il}%
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
