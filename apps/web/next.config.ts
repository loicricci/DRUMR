import type { NextConfig } from "next";
import { resolve } from "path";

const prismaEngine = "../../node_modules/.pnpm/@prisma+client*/node_modules/.prisma/client/*";

const nextConfig: NextConfig = {
  transpilePackages: ["@drumr/db", "@drumr/types"],
  outputFileTracingRoot: resolve("../.."),
  outputFileTracingIncludes: {
    "/api/**/*": [prismaEngine],
    "/dashboard": [prismaEngine],
    "/products/**/*": [prismaEngine],
    "/reports": [prismaEngine],
    "/settings": [prismaEngine],
  },
};

export default nextConfig;
