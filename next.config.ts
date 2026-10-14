import type { NextConfig } from "next";

/**
 * Site 100 % statique (export) pour GitHub Pages.
 * NEXT_PUBLIC_BASE_PATH est fourni par la CI (ex. "/parcoursup-scanned").
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
