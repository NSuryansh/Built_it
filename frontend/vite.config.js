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
      manifest:{
        icons:[
          {
            src:"/assets/final-image.png",
            sizes:"144x144",
            type:"image/png",
            // purpose:"any maskable"
          }
        ],
        theme_color:"#ffffff",
        name:"Vitality",
        short_name:"Vitality"
      }
    })
  ],
})
