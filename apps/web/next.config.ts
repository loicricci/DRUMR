import type { NextConfig } from "next";
import { resolve } from "path";

const prismaGenerated = "../../packages/db/src/generated/prisma/*";

const nextConfig: NextConfig = {
  transpilePackages: ["@drumr/db", "@drumr/types"],
  outputFileTracingRoot: resolve("../.."),
  outputFileTracingIncludes: {
    "/api/**/*": [prismaGenerated],
    "/dashboard": [prismaGenerated],
    "/products/**/*": [prismaGenerated],
    "/reports": [prismaGenerated],
    "/settings": [prismaGenerated],
  },
};

export default nextConfig;
