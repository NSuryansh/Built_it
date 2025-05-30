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
            src: "https://res.cloudinary.com/dt7a9meug/image/upload/v1748338565/CompressJPEG.Online_img_512x512_ztlsln.png",
            sizes: "512x512",
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
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'https://built-it-python-895c.onrender.com',
  //       changeOrigin: true,
  //       rewrite: path => path.replace(/^\/api/, ''),
  //       secure: false
  //     }
  //   }
  // }
})
