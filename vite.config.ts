import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api-countries': {
        target: 'https://www.apicountries.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-countries/, ''),
      },
    }
  }
})
