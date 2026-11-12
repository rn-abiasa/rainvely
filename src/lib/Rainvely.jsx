import { useEffect, useRef } from "react";
import { VARIANTS } from "./variants.js";

const BASE_SPEED = 420; // px per second when speed = 1
const MAX_DROPS = 1500;
const MAX_ANGLE = 60;

/**
 * A soft rain overlay that fills its parent.
 * The parent needs `position: relative` (or any other positioned value).
 *
 * @param {object} props
 * @param {"drizzle"|"gentle"|"storm"} [props.variant="gentle"] Preset for density, speed, length and opacity.
 * @param {number} [props.count] Exact number of drops. Defaults to a density based on the parent's area.
 * @param {number} [props.speed] Fall speed multiplier.
 * @param {number} [props.angle=8] Wind lean in degrees from vertical. Positive leans right. Clamped to ±60.
 * @param {string} [props.color="#bcd0e6"] Any CSS color.
 * @param {number} [props.opacity] 0–1, for the nearest layer.
 * @param {number} [props.length] Drop length in px, for the nearest layer.
 * @param {number} [props.thickness] Drop thickness in px, for the nearest layer.
 * @param {number} [props.layers] Number of depth layers.
 * @param {boolean} [props.paused=false] Freeze the rain on the current frame.
 * @param {boolean} [props.respectReducedMotion=true] Show a still frame when the user prefers reduced motion.
 * @param {string} [props.className]
 * @param {import("react").CSSProperties} [props.style]
 */
export function Rainvely({
  variant = "gentle",
  count,
  speed,
  angle = 8,
  color = "#bcd0e6",
  opacity,
  length,
  thickness,
  layers,
  paused = false,
  respectReducedMotion = true,
  className,
  style,
  ...rest
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const preset = VARIANTS[variant] ?? VARIANTS.gentle;
    const cfg = {
      speed: speed ?? preset.speed,
      opacity: opacity ?? preset.opacity,
      length: length ?? preset.length,
      thickness: thickness ?? preset.thickness,
      layers: Math.max(1, Math.round(layers ?? preset.layers)),
    };

    const rad = (Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, angle)) * Math.PI) / 180;
    const sin = Math.sin(rad);
    const cos = Math.cos(rad);
    const depths = Array.from({ length: cfg.layers }, (_, i) =>
      cfg.layers === 1 ? 1 : 0.45 + (0.55 * i) / (cfg.layers - 1),
    );

    const motion = respectReducedMotion
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;

    let w = 0;
    let h = 0;
    let groups = depths.map(() => []);
    let raf = 0;
    let last = 0;

    // Spawn across the top, widened so slanted rain still covers the corners.
    const spawnX = () => {
      const spread = Math.tan(rad) * h;
      const min = Math.min(0, -spread);
      const max = w + Math.max(0, -spread);
      return min + Math.random() * (max - min);
    };

    const build = () => {
      const total = Math.min(
        MAX_DROPS,
        Math.round(count ?? ((w * h) / 10000) * preset.density),
      );
      groups = depths.map(() => []);
      for (let i = 0; i < total; i++) {
        const layer = i % cfg.layers;
        const d = depths[layer];
        groups[layer].push({
          x: spawnX(),
          y: Math.random() * h,
          len: cfg.length * d * (0.8 + Math.random() * 0.4),
          v: BASE_SPEED * cfg.speed * d * (0.9 + Math.random() * 0.2),
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = color;
      ctx.lineCap = "round";
      groups.forEach((group, layer) => {
        const d = depths[layer];
        ctx.globalAlpha = cfg.opacity * d;
        ctx.lineWidth = cfg.thickness * d;
        ctx.beginPath();
        for (const p of group) {
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - sin * p.len, p.y - cos * p.len);
        }
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
    };

    const step = (dt) => {
      for (const group of groups) {
        for (const p of group) {
          p.x += sin * p.v * dt;
          p.y += cos * p.v * dt;
          if (p.y - p.len > h) {
            p.x = spawnX();
            p.y = -Math.random() * 30;
          }
        }
      }
    };

    const frame = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      step(dt);
      draw();
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const sync = () => {
      if (!paused && !document.hidden && !motion?.matches) {
        start();
      } else {
        stop();
        draw();
      }
    };

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (!width || !height) return;
      const dpr = window.devicePixelRatio || 1;
      w = width;
      h = height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      sync();
    });

    observer.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    motion?.addEventListener("change", sync);

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      motion?.removeEventListener("change", sync);
    };
  }, [
    variant,
    count,
    speed,
    angle,
    color,
    opacity,
    length,
    thickness,
    layers,
    paused,
    respectReducedMotion,
  ]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        ...style,
      }}
      {...rest}
    />
  );
}
