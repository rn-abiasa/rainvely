import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // `npm run build` -> the npm package (dist/)
  if (mode === "lib") {
    return {
      plugins: [react()],
      build: {
        lib: {
          entry: fileURLToPath(new URL("./src/lib/index.js", import.meta.url)),
          formats: ["es", "cjs"],
          fileName: (format) => (format === "es" ? "rainvely.js" : "rainvely.cjs"),
        },
        rollupOptions: {
          external: ["react", "react/jsx-runtime"],
        },
      },
    };
  }

  // `npm run dev` / `npm run build:demo` -> the demo site
  return {
    plugins: [react(), tailwindcss()],
    build: { outDir: "dist-demo" },
  };
});
