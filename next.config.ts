import type { NextConfig } from "next";

// Normal builds retain Vercel image optimization. Static mode is for portable previews.
const staticExport = process.env.STATIC_EXPORT === "1";
const config: NextConfig = {
  ...(staticExport ? { output: "export" } : {}),
  images: {
    unoptimized: staticExport,
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
  },
  poweredByHeader: false,
  allowedDevOrigins: ["terminal.local"],
  reactStrictMode: true,
  devIndicators: false,
};
export default config;
