import { defineConfig } from 'vite'
import tailwindcss     from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],

  // Marketing site: index.html at root, all pages as entry points
  build: {
    outDir:   'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main:           'index.html',
        '404':          '404.html',
        've-chung-toi': 'pages/ve-chung-toi/index.html',
        'dich-vu':      'pages/dich-vu/index.html',
        'du-an':        'pages/du-an/index.html',
        'tin-tuc':      'pages/tin-tuc/index.html',
        'lien-he':      'pages/lien-he/index.html',
        'doi-tac':      'pages/doi-tac/index.html',
        'bieu-phi':     'pages/bieu-phi/index.html',
        'dang-ky-doi-tac': 'pages/dang-ky-doi-tac/index.html',
        'dieu-khoan':   'pages/dieu-khoan/index.html',
        'bao-mat':      'pages/bao-mat/index.html',
        'dien-mat-troi':'pages/dien-mat-troi/index.html',
        'tru-sac':      'pages/tru-sac/index.html',
        'tim-kiem':     'pages/tim-kiem-tram-sac/index.html',
      },
    },
  },

  // Dev: proxy /api to local Workers
  server: {
    proxy: {
      '/api': {
        target:      'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
})
