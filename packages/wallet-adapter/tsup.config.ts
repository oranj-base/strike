import { defineConfig, type Options } from "tsup";

const commonCfg: Partial<Options> = {
  splitting: true,
  sourcemap: false,
  clean: true,
  format: ["cjs", "esm"],
  target: ["esnext"],
};

export default defineConfig([
  {
    ...commonCfg,
    entry: [
      "src/index.ts",
      "src/providers/index.ts",
      "src/providers/btc/index.ts",
      "src/providers/icp/index.ts",
    ],
    dts: {
      entry: [
        "src/index.ts",
        "src/providers/index.ts",
        "src/providers/btc/index.ts",
        "src/providers/icp/index.ts",
      ],
    },
    loader: {
      ".png": "dataurl",
      ".svg": "dataurl",
    },
  },
]);
