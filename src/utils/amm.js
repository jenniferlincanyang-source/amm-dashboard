/**
 * AMM (Constant Product) math utilities
 * Core formula: x * y = k
 */

export function computeK(x, y) {
  return x * y;
}

export function computePrice(x, y) {
  return y / x;
}

/**
 * Impermanent Loss formula:
 * IL = 2 * sqrt(r) / (1 + r) - 1
 * where r = current_price / initial_price (price ratio)
 */
export function computeIL(priceRatio) {
  return (2 * Math.sqrt(priceRatio)) / (1 + priceRatio) - 1;
}

/**
 * Generate curve data points for x * y = k
 */
export function generateCurveData(k, xMin, xMax, steps = 200) {
  const data = [];
  const stepSize = (xMax - xMin) / steps;
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * stepSize;
    if (x <= 0) continue;
    const y = k / x;
    data.push({ x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(2)) });
  }
  return data;
}

/**
 * Given initial reserves and a price multiplier,
 * compute the new position on the curve.
 *
 * If initial price = y0/x0, and price changes by factor r:
 *   new_x = x0 / sqrt(r)
 *   new_y = y0 * sqrt(r)
 */
export function getPosition(x0, y0, priceMultiplier) {
  const sqrtR = Math.sqrt(priceMultiplier);
  const newX = x0 / sqrtR;
  const newY = y0 * sqrtR;
  return { x: newX, y: newY };
}
