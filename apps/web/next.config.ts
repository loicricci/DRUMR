import type { NextConfig } from "next";
import { resolve } from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["@drumr/db", "@drumr/types"],
  outputFileTracingRoot: resolve("../.."),
  outputFileTracingIncludes: {
    "/**/*": ["../../packages/db/src/generated/client/*"],
  },
};

export default nextConfig;
