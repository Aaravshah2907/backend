import { defineNitroConfig } from 'nitropack'

export default defineNitroConfig({
  srcDir: 'server',
  preset: 'cloudflare-pages',
  compatibilityDate: '2025-03-05',
  
  cloudflare: {
    pages: { defaultRoutes: true },
    nodeCompat: true
  },

  externals: {
    external: [
      /\.prisma\/client/,
      /\.prisma\/client\/default/
    ]
  },

  experimental: {
    tasks: true
  }
})
