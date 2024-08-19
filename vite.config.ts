/// <reference types="vitest" />

import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [],
  test: {
    globals: true, // Corrigido: "globals" no lugar de "global"
  },
})
