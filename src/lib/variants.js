/**
 * Presets for the `variant` prop.
 * - density: drops per 10,000 px² of the parent's area
 * - speed: multiplier on the base fall speed
 * - length / thickness: in CSS pixels, for the nearest layer
 * - opacity: 0–1, for the nearest layer
 * - layers: depth layers (farther layers are shorter, slower and fainter)
 */
export const VARIANTS = {
  drizzle: { density: 1.2, speed: 0.7, length: 10, thickness: 1, opacity: 0.35, layers: 2 },
  gentle: { density: 2.5, speed: 1, length: 16, thickness: 1.2, opacity: 0.45, layers: 3 },
  storm: { density: 6, speed: 1.7, length: 24, thickness: 1.4, opacity: 0.6, layers: 3 },
};
