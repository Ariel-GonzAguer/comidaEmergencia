/**
 * @file Configuración de Vite para el cliente React.
 *
 * Incluye:
 * - Plugin de Tailwind CSS v4 (integración nativa con Vite).
 * - Plugin de React (Fast Refresh).
 * - Proxy de `/api` al servidor Express (puerto 3001) para evitar CORS en desarrollo.
 *
 * @see https://vite.dev/config/
 * @module vite.config
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
