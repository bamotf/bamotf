require('./scripts/load-env-vars')
const {PrismaPlugin} = require('@prisma/nextjs-monorepo-workaround-plugin')

module.exports = {
  reactStrictMode: true,
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: ['ui', 'db'],
  webpack: (config, {isServer}) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }

    return config
  },
}
