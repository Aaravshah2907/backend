import type { Config } from '@prisma/generator-helper'

const config: Config = {
  previewFeatures: ['prisma-client-js'],
  generator: {
    client: {
      output: './generated/prisma-client'
    }
  }
}

export default config