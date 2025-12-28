#!/usr/bin/env bash

set -e

echo "=== 1. Nitro / Nuxt / Vite config (to find bad @prisma/client alias) ==="
echo
for f in nitro.config.* nuxt.config.* vite.config.*; do
  if [ -f "$f" ]; then
    echo "--- $f ---"
    sed -n '1,200p' "$f" | grep -n -E '@prisma/client|alias' || echo "(no @prisma/client or alias in first 200 lines)"
    echo
  fi
done

echo
echo "=== 2. Prisma generator config (prisma.config.ts / schema.prisma) ==="
echo
if [ -f prisma.config.ts ]; then
  echo "--- prisma.config.ts (first 200 lines) ---"
  sed -n '1,200p' prisma.config.ts
  echo
fi

if [ -f prisma/schema.prisma ]; then
  echo "--- prisma/schema.prisma (generator client block, if any) ---"
  sed -n '/generator client {/,/}/p' prisma/schema.prisma || echo "(no generator client block found)"
  echo
fi

echo
echo "=== 3. @prisma/client package.json entry points ==="
echo
if [ -f node_modules/@prisma/client/package.json ]; then
  sed -n '1,80p' node_modules/@prisma/client/package.json
else
  echo "node_modules/@prisma/client/package.json not found. Did you run `npm install`?"
fi

echo
echo "=== 4. Contents of node_modules/.prisma/client ==="
echo
if [ -d node_modules/.prisma/client ]; then
  ls -la node_modules/.prisma/client
else
  echo "node_modules/.prisma/client directory not found. Try: npx prisma generate"
fi

echo
echo "=== 5. Create TEMPORARY local shim for index.js (for dev only) ==="
echo
if [ -d node_modules/.prisma/client ]; then
  cat > node_modules/.prisma/client/index.js << 'EOF'
export * from '../@prisma/client/default.js';
export { default } from '../@prisma/client/default.js';
EOF
  echo "Created node_modules/.prisma/client/index.js shim for local development."
  echo "This will be overwritten by a fresh npm install; do NOT rely on it for deployment."
else
  echo "Skipped shim creation: node_modules/.prisma/client does not exist."
fi

echo
echo "=== 6. IMPORTANT: Source changes you should make for proper deploy ==="
echo
cat << 'EOF'

In your config (one of nitro.config.*, nuxt.config.*, vite.config.*), find any alias that looks like:

  alias: {
    '@prisma/client': './node_modules/.prisma/client/index.js',
    // ...
  }

You have two good options:

1) Preferred: REMOVE the alias entirely and just import normally everywhere:

   import { PrismaClient } from '@prisma/client';

   Prisma 7 already points @prisma/client to its own default.js entry, so no path alias is required.

2) If your setup REALLY needs an alias, change it to:

   alias: {
     '@prisma/client': './node_modules/@prisma/client/default.js',
   }

After changing the config in source:

   npm install
   npx prisma generate
   npm run dev

For deployment (Railway / Render / etc.), configure the build steps as:

   npm install
   npx prisma generate
   npm run build   # if your project has one
   npm start       # or whatever your start script is

EOF

echo
echo "=== 7. Next step for you ==="
echo
echo "Copy this entire output and paste it back so the config sections (step 1 and 2) can be inspected and exact lines to edit can be given."

