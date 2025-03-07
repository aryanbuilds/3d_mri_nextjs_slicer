/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Configure Content Security Policy for external scripts
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://get.goxtk.com; connect-src 'self' http://localhost:5000; img-src 'self' blob: data:;"
          }
        ]
      }
    ]
  },
  
  webpack: (config) => {
    // Handling node.js modules in browser environment
    config.resolve.fallback = { 
      ...config.resolve.fallback,
      fs: false, 
      path: false,
      crypto: false
    };
    
    return config;
  },
};

module.exports = nextConfig;
