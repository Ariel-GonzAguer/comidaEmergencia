import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from "vite-plugin-pwa";

// configurar después vitePWA
export default defineConfig({
  plugins: [react(), tailwindcss(), VitePWA({})],
  build: {
    chunkSizeWarningLimit: 1000 // Límite aumentado a 1000 kB
  },
  // Configuración de pruebas con Vitest
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setupTests.js',
    include: ['src/**/*.{test,spec}.{js,jsx}'],
  },
})
