import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@drumr/db", "@drumr/types"],
};

export default nextConfig;
