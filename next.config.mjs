/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    output: process.env.NODE_ENV === 'production' ? 'export' : 'standalone',
}

export default nextConfig
