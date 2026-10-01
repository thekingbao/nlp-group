import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],

  // Build portal vào thư mục noi-bo/ ở root repo
  // Cloudflare Pages serve static: truy cập /noi-bo/ → portal
  build: {
    outDir: resolve(__dirname, '../../noi-bo'),
    emptyOutDir: true,
  },

  // Base path — HashRouter nên không cần config base
  base: '/noi-bo/',
})
