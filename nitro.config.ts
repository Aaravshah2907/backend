import { config } from 'dotenv';
config();
import { version } from './server/utils/config';
import { tr } from 'zod/v4/locales';

export default defineNitroConfig({
  srcDir: 'server',
  preset: 'cloudflare-pages',
  compatibilityDate: '2025-03-05',
  
  cloudflare: {
    pages: { defaultRoutes: true },
    edgeConfig: true,
    nodeCompat: true, 
  },

  // KEY PRISMA + CLOUDFLARE FIX
  noExternals: false,
  externals: {
    noExternal: [/^@prisma\/client/, /^@prisma\/engines/, /^prom-client/, 'prom-client'],
    external: [/\.prisma\/client/, /\.prisma\/client\/default/]
  },

  experimental: {
    asyncContext: true,
    tasks: true,
    wasm: true, 
  },

  prisma: {
    client: {
      dir: '.prisma/client'
    }
  }

  // Simplify auto-imports to avoid "Duplicated imports" warnings
  imports: {
    dirs: ['./utils']
  },

  replace: {
    "import ws from 'ws'": "const ws = {}"
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
