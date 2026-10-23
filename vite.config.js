import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  base: '/commit_tracker/',
  server: {
    port: 3000,
  },
  build: {
    cssMinify: false,
  },
})
