const basePath =
  process.env.NODE_ENV === "production" ? "/portfolio-devops-admin" : undefined;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true }
};

export default nextConfig;
