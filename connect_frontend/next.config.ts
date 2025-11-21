const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // パスエイリアスの設定
  webpack: (config, { isServer }) => {
    // パスエイリアスの解決
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src'),
    };
    return config;
  },
  // 画像の最適化設定
  images: {
    domains: ['localhost'],
  },
  // 環境変数の設定
  env: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:8000',
  },
  // 実験的機能の設定
  experimental: {
    // 必要に応じて実験的機能を有効化
  },
};

module.exports = nextConfig;
