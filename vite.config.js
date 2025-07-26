import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from "vite-plugin-pwa";

// configurar después vitePWA
export default defineConfig({
  plugins: [react(), tailwindcss(), VitePWA({})],
})
