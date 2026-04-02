import type { NextConfig } from "next";
import { resolve } from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["@drumr/db", "@drumr/types"],
  serverExternalPackages: ["@prisma/client", ".prisma/client"],
  outputFileTracingRoot: resolve("../.."),
};

export default nextConfig;
