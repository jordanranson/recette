/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    output: process.env.NODE_ENV === 'development' 
        ? 'standalone' 
        : 'export',
}

export default nextConfig
