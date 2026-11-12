# Rainvely

A soft, cozy rain overlay for React. It fills its parent, follows its size, and stays out of the way.

- Canvas based, no dependencies
- Three presets: `drizzle`, `gentle`, `storm`
- Pauses in background tabs
- Shows a still frame when the user prefers reduced motion
- SSR safe (Next.js, Remix)

## Install

```bash
npm i rainvely
```

## Usage

The parent needs a positioned `position` (for example `relative`).

```jsx
import { Rainvely } from "rainvely";

export function Hero() {
  return (
    <section className="relative">
      <Rainvely variant="gentle" />
      <h1>Stay in. It's raining.</h1>
    </section>
  );
}
```

The overlay has `pointer-events: none`, so it never blocks clicks.
Use `style={{ zIndex: -1 }}` to put the rain behind the content.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"drizzle" \| "gentle" \| "storm"` | `"gentle"` | Preset for density, speed, length and opacity |
| `count` | `number` | by area | Exact number of drops |
| `speed` | `number` | by variant | Fall speed multiplier |
| `angle` | `number` | `8` | Wind lean in degrees. Positive leans right. Clamped to ±60 |
| `color` | `string` | `"#bcd0e6"` | Any CSS color |
| `opacity` | `number` | by variant | 0 to 1, for the nearest layer |
| `length` | `number` | by variant | Drop length in px |
| `thickness` | `number` | by variant | Drop thickness in px |
| `layers` | `number` | by variant | Depth layers. Farther layers are shorter, slower and fainter |
| `paused` | `boolean` | `false` | Freeze on the current frame |
| `respectReducedMotion` | `boolean` | `true` | Show a still frame when the user prefers reduced motion |
| `className`, `style` | | | Passed to the `<canvas>` |

## Development

```bash
npm install
npm run dev          # demo site
npm run build        # builds the package into dist/
npm run build:demo   # builds the demo site into dist-demo/
```

## License

MIT
