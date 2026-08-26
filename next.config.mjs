/** @type {import('next').NextConfig} */
const config = {
  // Static export so the same build wraps into Tauri (frontendDist = ./out) and runs in a browser.
  output: 'export',
  images: { unoptimized: true },
  // Tauri serves from file://-like origin; relative asset paths keep it portable.
  trailingSlash: true,
};

export default config;
