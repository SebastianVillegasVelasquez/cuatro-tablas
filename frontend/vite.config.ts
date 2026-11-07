import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // In development the browser only talks to the Vite server, and Vite forwards
    // /api/* to the backend. App and API then share one origin, so CORS never
    // applies and the dev port or hostname stops mattering.
    // 127.0.0.1 (not "localhost") so Node cannot resolve to ::1 while uvicorn listens on IPv4.
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  test: {
    environment: 'node',
  },
})
