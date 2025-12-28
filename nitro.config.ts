import { config } from 'dotenv';
config();
import { version } from './server/utils/config';

export default defineNitroConfig({
  srcDir: 'server',
  preset: 'cloudflare-module',
  compatibilityDate: '2025-03-05',
  
  cloudflare: {
    nodeCompat: true, 
  },

  experimental: {
    asyncContext: true,
    tasks: true,
    wasm: true, 
  },

  // FIXED ALIAS: Map a unique string to the generated folder
  alias: {
    "#prisma-client": "./server/generated/client"
  },

  // Simplify auto-imports to avoid "Duplicated imports" warnings
  imports: {
    dirs: ['./utils/**']
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