import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import PeerDepsExternal from "rollup-plugin-peer-deps-external";
import copy from "rollup-plugin-copy";
import typescript from "@rollup/plugin-typescript";
import babel from "@rollup/plugin-babel";

const config = {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.js",
      format: "esm",
    },
    {
      file: "dist/index.cjs.js",
      format: "cjs",
      sourcemap: true,
    },
    {
      file: "dist/index.esm.js",
      format: "es",
      sourcemap: true,
    },
  ],
  plugins: [typescript()],
};

export default config;
