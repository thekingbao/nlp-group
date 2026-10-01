import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],

  // Build portal vào thư mục noi-bo/ ở root repo
  // Cloudflare Pages serve static: truy cập /noi-bo/ → portal
  build: {
    outDir: new URL('../../noi-bo', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'),
    emptyOutDir: true,
  },

  // Base path — HashRouter
  base: '/noi-bo/',
})
