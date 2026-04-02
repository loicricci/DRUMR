import type { NextConfig } from "next";
import { resolve } from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["@drumr/db", "@drumr/types"],
  serverExternalPackages: ["@prisma/client", ".prisma/client"],
  outputFileTracingRoot: resolve("../.."),
  outputFileTracingIncludes: {
    "/**/*": [
      "node_modules/.prisma/client/*",
      "node_modules/.pnpm/@prisma+client*/node_modules/.prisma/client/*",
    ],
  },
};

export default nextConfig;
