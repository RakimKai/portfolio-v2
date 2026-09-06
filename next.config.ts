import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Next 16 writes AGENTS.md / CLAUDE.md on build; we do not want them in the repo.
  agentRules: false,
};

export default nextConfig;
