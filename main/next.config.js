/** @type {import('next').NextConfig} */
const { MEMBERS_URL } = process.env

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: `/:path*`,
      },
      {
        source: '/members',
        destination: `${MEMBERS_URL}/members`,
      },
      {
        source: '/members/:path*',
        destination: `${MEMBERS_URL}/members/:path*`,
      },

    ]
  }
}


module.exports = nextConfig
