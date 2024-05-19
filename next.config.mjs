import nextMdx from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      ...(process.env.NODE_ENV === "development" ? ["localhost"] : []),
      "images.otomadb.com",
      "imgproxy.otomadb.com",
      "nicovideo.cdn.nimg.jp",
      "img.cdn.nimg.jp",
      "i.ytimg.com",
      "s.gravatar.com",
      "secure.gravatar.com",
      "i1.sndcdn.com",
    ],
    unoptimized: process.env.NODE_ENV === "production",
    disableStaticImages: true,
  },
  experimental: {
    mdxRs: true,
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },
  redirects() {
    return [
      {
        source: "/signin",
        destination: "/auth/signin",
        permanent: true,
      },
      {
        source: "/signup",
        destination: "/auth/signup",
        permanent: true,
      },
      {
        source: "/videos",
        destination: "/mads",
        permanent: true,
      },
      {
        source: "/videos/:serial*",
        destination: "/mads/:serial*",
        permanent: true,
      },
      {
        source: "/me/mylist/likes",
        destination: "/me/likes",
        permanent: true,
      },
    ];
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: [{ loader: "@svgr/webpack" }],
    });
    return config;
  },
};

const withMdx = nextMdx();

export default withMdx(nextConfig);
