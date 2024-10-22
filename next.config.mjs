/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server Actions are now available by default, so we can remove the experimental flag
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.(pdf|doc|docx)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: '/_next/static/files',
            outputPath: 'static/files',
          },
        },
      ],
    });
    return config;
  },
}

export default nextConfig;


//    /** @type {import('next').NextConfig} */
//    const nextConfig = {
//     reactStrictMode: true,
//   }

// module.exports = nextConfig;
