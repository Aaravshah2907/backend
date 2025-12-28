import { config } from 'dotenv';
config();
import { version } from './server/utils/config';

// https://nitro.unjs.io/config
export default defineNitroConfig({
  srcDir: 'server',
  // Required for Cloudflare Workers/Pages
  preset: 'cloudflare-module',
  compatibilityDate: '2025-03-05',
  
  // Cloudflare-specific settings
  cloudflare: {
    // Enables Node.js built-in APIs (required for many Prisma drivers)
    nodeCompat: true, 
  },

  experimental: {
    asyncContext: true,
    tasks: true,
    // Helps with bundling WASM files used by Prisma's drivers
    wasm: true, 
  },

  // Ensures Nitro doesn't try to load Prisma as an external file
  alias: {
    // If your schema output is "../generated/client", ensure the alias matches
    "../../generated/client": "./generated/client"
  },

  scheduledTasks: {
    '0 0 * * *': ['jobs:clear-metrics:daily'],
    '0 0 * * 0': ['jobs:clear-metrics:weekly'],
    '0 0 1 * *': ['jobs:clear-metrics:monthly']
  },

  runtimeConfig: {
    public: {
      meta: {
        name: process.env.META_NAME || '',
        description: process.env.META_DESCRIPTION || '',
        version: version || '',
        captcha: (process.env.CAPTCHA === 'true').toString(),
        captchaClientKey: process.env.CAPTCHA_CLIENT_KEY || '',
      },
    },
    cryptoSecret: process.env.CRYPTO_SECRET,
    tmdbApiKey: process.env.TMDB_API_KEY,
    trakt: {
      clientId: process.env.TRAKT_CLIENT_ID,
      clientSecret: process.env.TRAKT_SECRET_ID,
    },
  },
});