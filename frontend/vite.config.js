import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      manifest: {
        icons: [
          {
            src: "https://res.cloudinary.com/dt7a9meug/image/upload/v1744311175/final-image_1_xayrgc.jpg",
            sizes: "144x144",
            type: "image/png",
            // purpose:"any maskable"
          }
        ],
        theme_color: "#ffffff",
        name: "Vitality",
        short_name: "Vitality"
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
      },
    })
  ],
})
