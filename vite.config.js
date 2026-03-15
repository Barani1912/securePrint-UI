import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/peerjs': {
        target: 'https://secureprint-be.onrender.com',
        ws: true,        // WebSocket support — critical for PeerJS
        changeOrigin: true
      }
    }
  }
})
