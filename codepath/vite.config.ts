import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    // In development, send AI requests to the local proxy started with `node server.js`.
    // xfwd passes the original host along, which the proxy's same-origin check needs.
    proxy: {
      '/api': { target: 'http://localhost:3001', xfwd: true },
    },
  },
})