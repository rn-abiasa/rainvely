import { useId, useState } from "react";
import { Rainvely, VARIANTS } from "../lib";

const COLORS = [
  { name: "Mist", value: "#bcd0e6" },
  { name: "Moon", value: "#eef3f9" },
  { name: "Lilac", value: "#cfc6ee" },
  { name: "Lamp", value: "#f3cf9a" },
];

const DEFAULT_ANGLE = 8;
const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lamp";

function Slider({ label, value, min, max, step, onChange }) {
  const id = useId();
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <label htmlFor={id} className="text-paper/80">
          {label}
        </label>
        <output htmlFor={id} className="tabular-nums text-paper/60">
          {value}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`mt-2 w-full accent-lamp ${focusRing}`}
      />
    </div>
  );
}

export default function Cover() {
  const [variant, setVariant] = useState("gentle");
  const [speed, setSpeed] = useState(null);
  const [opacity, setOpacity] = useState(null);
  const [angle, setAngle] = useState(DEFAULT_ANGLE);
  const [color, setColor] = useState(COLORS[0].value);
  const [paused, setPaused] = useState(false);

  const preset = VARIANTS[variant];

  const pickVariant = (next) => {
    setVariant(next);
    setSpeed(null);
    setOpacity(null);
  };

  const attrs = [`variant="${variant}"`];
  if (speed !== null) attrs.push(`speed={${speed}}`);
  if (opacity !== null) attrs.push(`opacity={${opacity}}`);
  if (angle !== DEFAULT_ANGLE) attrs.push(`angle={${angle}}`);
  if (color !== COLORS[0].value) attrs.push(`color="${color}"`);
  if (paused) attrs.push("paused");

  return (
    <main className="bg-dusk font-sans text-paper">
      <section className="relative isolate min-h-svh overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-48 -left-48 -z-10 size-[44rem] rounded-full bg-[radial-gradient(closest-side,rgba(240,185,111,0.32),transparent)]"
        />
        <Rainvely
          variant={variant}
          speed={speed}
          opacity={opacity}
          angle={angle}
          color={color}
          paused={paused}
          style={{ zIndex: -1 }}
        />

        <div className="mx-auto grid min-h-svh max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h1 className="font-display text-7xl leading-none sm:text-8xl">Rainvely</h1>
            <p className="mt-6 max-w-md text-xl leading-relaxed text-paper/85">
              A soft rain for any container. Put it on a hero, a card or a whole page.
            </p>
            <p className="mt-4 max-w-md leading-relaxed text-paper/65">
              It fills its parent, follows its size, pauses in background tabs and stays
              still for people who prefer reduced motion.
            </p>

            <p className="mt-10 font-mono text-sm text-lamp">npm i rainvely</p>
            <pre className="mt-3 max-w-xl overflow-x-auto rounded-xl bg-dusk/70 p-5 font-mono text-sm leading-relaxed text-paper/90 ring-1 ring-paper/10">
              <code>{`import { Rainvely } from "rainvely";

<div className="relative">
  <Rainvely ${attrs.join(" ")} />
</div>`}</code>
            </pre>
          </div>

          <div className="rounded-2xl bg-dusk-raised/70 p-6 ring-1 ring-paper/10 backdrop-blur-sm">
            <h2 className="font-display text-2xl">Try it</h2>

            <div role="group" aria-label="Variant" className="mt-5 grid grid-cols-3 gap-2">
              {Object.keys(VARIANTS).map((name) => (
                <button
                  key={name}
                  type="button"
                  aria-pressed={variant === name}
                  onClick={() => pickVariant(name)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium capitalize transition-colors ${focusRing} ${
                    variant === name
                      ? "bg-lamp text-dusk"
                      : "bg-paper/10 text-paper hover:bg-paper/20"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-5">
              <Slider
                label="Speed"
                min={0.3}
                max={2.5}
                step={0.1}
                value={speed ?? preset.speed}
                onChange={setSpeed}
              />
              <Slider
                label="Opacity"
                min={0.1}
                max={1}
                step={0.05}
                value={opacity ?? preset.opacity}
                onChange={setOpacity}
              />
              <Slider
                label="Wind angle"
                min={-30}
                max={30}
                step={1}
                value={angle}
                onChange={setAngle}
              />
            </div>

            <div className="mt-6">
              <p className="text-sm text-paper/80">Color</p>
              <div role="group" aria-label="Rain color" className="mt-2 flex gap-3">
                {COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    aria-label={c.name}
                    aria-pressed={color === c.value}
                    onClick={() => setColor(c.value)}
                    style={{ backgroundColor: c.value }}
                    className={`size-8 rounded-full ring-offset-2 ring-offset-dusk-raised transition-shadow ${focusRing} ${
                      color === c.value ? "ring-2 ring-paper" : "ring-0"
                    }`}
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              aria-pressed={paused}
              onClick={() => setPaused((p) => !p)}
              className={`mt-6 w-full rounded-lg bg-paper/10 px-3 py-2 text-sm font-medium hover:bg-paper/20 ${focusRing}`}
            >
              {paused ? "Resume rain" : "Pause rain"}
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="font-display text-3xl">It follows its parent</h2>
        <p className="mt-3 max-w-md text-paper/70">
          Drag the bottom-right corner of the box. The rain resizes with it.
        </p>
        <div className="relative mt-8 h-64 min-h-40 w-full max-w-2xl min-w-60 resize overflow-hidden rounded-2xl bg-dusk-raised ring-1 ring-paper/10">
          <Rainvely variant="drizzle" angle={-6} />
          <p className="relative p-6 font-display text-2xl text-paper/90">
            Same rain, any size.
          </p>
        </div>
      </section>
    </main>
  );
}
