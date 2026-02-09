import { motion } from "framer-motion";

const STEPS = [
  {
    id: 1,
    title: "Inject Liquidity",
    desc: "LP deposits equal-value ETH + USDT into the pool",
    icon: "💧",
  },
  {
    id: 2,
    title: "Establish k",
    desc: "Constant product k = x × y is locked",
    icon: "🔒",
  },
  {
    id: 3,
    title: "User Initiates Trade",
    desc: "Trader sends USDT to swap for ETH",
    icon: "🔄",
  },
  {
    id: 4,
    title: "Reserves Rebalance",
    desc: "Pool adjusts: ETH decreases, USDT increases",
    icon: "⚖️",
  },
  {
    id: 5,
    title: "Price Updates",
    desc: "New price = y'/x', slippage reflected",
    icon: "📈",
  },
];

function getActiveStep(k, usdtIn, priceMultiplier) {
  if (!k || k <= 0) return 0;
  if (usdtIn > 0 && priceMultiplier !== 1) return 5;
  if (usdtIn > 0) return 4;
  if (priceMultiplier !== 1) return 3;
  return 2;
}

export default function AmmFlowSteps({ k, usdtIn, priceMultiplier }) {
  const active = getActiveStep(k, usdtIn, priceMultiplier);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="glass p-6"
    >
      <h2 className="text-xl font-bold mb-5">
        <span className="text-geek-blue">AMM</span>{" "}
        <span className="text-gray-400">Full Flow</span>
      </h2>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-0">
        {STEPS.map((step, i) => {
          const done = step.id < active;
          const current = step.id === active;
          return (
            <div key={step.id} className="flex md:flex-col items-center flex-1 w-full md:w-auto">
              <div className="flex flex-row md:flex-col items-center gap-3 md:gap-0">
                {/* Step node */}
                <motion.div
                  animate={current ? { scale: [1, 1.08, 1] } : {}}
                  transition={current ? { duration: 1.6, repeat: Infinity } : {}}
                  className="flex flex-col items-center text-center min-w-[48px] md:min-w-[100px]"
                >
                  <div
                    className={`
                      w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-lg md:text-xl
                      border-2 transition-all duration-500
                      ${current
                        ? "border-geek-blue bg-geek-blue/15 shadow-[0_0_18px_rgba(0,212,255,0.4)]"
                        : done
                          ? "border-neon-green bg-neon-green/10"
                          : "border-white/10 bg-white/5"
                      }
                    `}
                  >
                    {done ? "✓" : step.icon}
                  </div>
                </motion.div>
                <div className="md:text-center">
                  <span
                    className={`block mt-0 md:mt-2 text-xs font-semibold leading-tight ${
                      current ? "text-geek-blue" : done ? "text-neon-green" : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </span>
                  <span className="block mt-0.5 text-[10px] text-gray-600 leading-tight max-w-[180px] md:max-w-[120px]">
                    {step.desc}
                  </span>
                </div>
              </div>

              {/* Connector */}
              {i < STEPS.length - 1 && (
                <>
                  {/* Vertical connector (mobile) */}
                  <div className="block md:hidden w-0.5 h-4 ml-5 my-1">
                    <div className={`w-full h-full transition-all duration-500 ${
                      step.id < active ? "bg-neon-green" : step.id === active ? "bg-geek-blue" : "bg-white/10"
                    }`} />
                  </div>
                  {/* Horizontal connector (desktop) */}
                  <div className="hidden md:block flex-1 mx-1">
                    <div className={`h-0.5 w-full transition-all duration-500 ${
                      step.id < active
                        ? "bg-gradient-to-r from-neon-green to-neon-green"
                        : step.id === active
                          ? "bg-gradient-to-r from-geek-blue to-transparent"
                          : "bg-white/10"
                    }`} />
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
