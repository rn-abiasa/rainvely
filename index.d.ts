import type { CanvasHTMLAttributes, JSX } from "react";

export type RainvelyVariant = "drizzle" | "gentle" | "storm";

export interface RainvelyProps
  extends Omit<CanvasHTMLAttributes<HTMLCanvasElement>, "width" | "height" | "color"> {
  /** Preset for density, speed, length and opacity. Default: "gentle" */
  variant?: RainvelyVariant;
  /** Exact number of drops. Defaults to a density based on the parent's area. */
  count?: number;
  /** Fall speed multiplier. */
  speed?: number;
  /** Wind lean in degrees from vertical. Positive leans right. Clamped to ±60. Default: 8 */
  angle?: number;
  /** Any CSS color. Default: "#bcd0e6" */
  color?: string;
  /** 0–1, for the nearest layer. */
  opacity?: number;
  /** Drop length in px, for the nearest layer. */
  length?: number;
  /** Drop thickness in px, for the nearest layer. */
  thickness?: number;
  /** Number of depth layers. */
  layers?: number;
  /** Freeze the rain on the current frame. Default: false */
  paused?: boolean;
  /** Show a still frame when the user prefers reduced motion. Default: true */
  respectReducedMotion?: boolean;
}

/** A soft rain overlay that fills its parent. The parent needs `position: relative`. */
export declare function Rainvely(props: RainvelyProps): JSX.Element;

export declare const VARIANTS: Record<
  RainvelyVariant,
  {
    density: number;
    speed: number;
    length: number;
    thickness: number;
    opacity: number;
    layers: number;
  }
>;
