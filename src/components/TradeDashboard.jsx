import { motion } from "framer-motion";

function Cell({ label, value, sub, color = "text-gray-200" }) {
  return (
    <div className="flex flex-col items-center p-4">
      <span className="text-xs text-gray-500 mb-1 text-center">{label}</span>
      <motion.span
        key={value}
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`text-xl md:text-2xl font-mono font-bold ${color}`}
      >
        {value}
      </motion.span>
      {sub && <span className="text-[10px] text-gray-600 mt-0.5">{sub}</span>}
    </div>
  );
}

export default function TradeDashboard({
  ethReserve,
  usdtReserve,
  usdtIn,
  onUsdtInChange,
  k,
  onExecuteTrade,
  animating,
}) {
  const safeUsdtIn = Math.max(0, usdtIn);

  // After trade: buyer sends usdtIn into pool
  // new USDT reserve = usdtReserve + usdtIn
  // new ETH reserve  = k / newUsdtReserve
  // buyer gets       = ethReserve - newEthReserve
  const newUsdtReserve = usdtReserve + safeUsdtIn;
  const newEthReserve = safeUsdtIn > 0 ? k / newUsdtReserve : ethReserve;
  const ethReceived = safeUsdtIn > 0 ? ethReserve - newEthReserve : 0;

  // Spot price (before trade) = usdtReserve / ethReserve
  const spotPrice = usdtReserve / ethReserve;

  // Execution price (average) = usdtIn / ethReceived
  const execPrice = ethReceived > 0 ? safeUsdtIn / ethReceived : spotPrice;

  // Price impact
  const priceImpact =
    spotPrice > 0 ? ((execPrice - spotPrice) / spotPrice) * 100 : 0;

  // Verify k
  const newK = newEthReserve * newUsdtReserve;
  const kMatch = Math.abs(newK - k) < 0.01;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="glass p-6"
    >
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-xl font-bold">
          <span className="text-geek-blue">Trade</span>
          <span className="text-gray-500"> Simulator </span>
          <span className="text-gray-600 text-sm font-normal">
            USDT → ETH
          </span>
        </h2>
        <div className="flex items-center gap-2 flex-wrap">
          <label className="text-sm text-gray-400">Spend USDT:</label>
          <input
            type="number"
            min="0"
            step="10"
            value={usdtIn}
            onChange={(e) => onUsdtInChange(Math.max(0, Number(e.target.value)))}
            className="w-32 text-base text-center"
          />
          <button
            onClick={onExecuteTrade}
            disabled={animating || safeUsdtIn <= 0}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
              animating || safeUsdtIn <= 0
                ? "bg-white/5 text-gray-600 cursor-not-allowed"
                : "bg-geek-blue/20 text-geek-blue border border-geek-blue/40 hover:bg-geek-blue/30 hover:shadow-[0_0_16px_rgba(0,212,255,0.3)]"
            }`}
          >
            {animating ? "Executing..." : "Execute Trade"}
          </button>
        </div>
      </div>

      {/* Slippage highlight bar */}
      {safeUsdtIn > 0 && (
        <div className={`flex items-center justify-between rounded-xl px-5 py-3 mb-4 border ${
          priceImpact > 5 ? "bg-red-500/10 border-red-500/30" :
          priceImpact > 1 ? "bg-yellow-500/10 border-yellow-500/30" :
          "bg-neon-green/5 border-neon-green/20"
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-lg">{priceImpact > 5 ? "⚠️" : priceImpact > 1 ? "⚡" : "✅"}</span>
            <div>
              <span className="text-sm text-gray-400">Slippage</span>
              <p className="text-[10px] text-gray-600">
                (Exec Price − Spot) / Spot
              </p>
            </div>
          </div>
          <motion.span
            key={priceImpact.toFixed(2)}
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            className={`text-2xl md:text-3xl font-mono font-bold ${
              priceImpact > 5 ? "text-red-400" :
              priceImpact > 1 ? "text-yellow-400" :
              "text-neon-green"
            }`}
          >
            +{priceImpact.toFixed(3)}%
          </motion.span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-white/5 rounded-xl overflow-hidden">
        <Cell
          label="ETH Reserve (after)"
          value={newEthReserve.toFixed(4)}
          sub="ETH"
          color="text-geek-blue"
        />
        <Cell
          label="USDT Reserve (after)"
          value={newUsdtReserve.toFixed(2)}
          sub="USDT"
          color="text-geek-blue"
        />
        <Cell
          label="ETH Received"
          value={ethReceived.toFixed(6)}
          sub="ETH"
          color="text-neon-green"
        />
        <Cell
          label="Spot Price (before)"
          value={spotPrice.toFixed(4)}
          sub="USDT / ETH"
          color="text-gray-200"
        />
        <Cell
          label="Execution Price (avg)"
          value={execPrice.toFixed(4)}
          sub="USDT / ETH"
          color="text-gray-200"
        />
        <Cell
          label="Verify: new x × y"
          value={newK.toFixed(2)}
          sub={kMatch ? `✓ k = ${k.toFixed(2)}` : `✗ expected ${k.toFixed(2)}`}
          color={kMatch ? "text-neon-green" : "text-red-400"}
        />
      </div>
    </motion.div>
  );
}
