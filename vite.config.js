import { defineConfig } from 'vite'

// base: '/' funciona en S3+CloudFront y en dominio propio.
// Para GitHub Pages en https://usuario.github.io/cafe-don-martin/ usa:
//   BASE=/cafe-don-martin/ npm run build
export default defineConfig({
  base: process.env.BASE || '/',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 1200,
  },
})
