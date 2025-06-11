import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/devtunnel': {
        target: 'https://hndkpm0x-4004.asse.devtunnels.ms/graphql',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/devtunnel/, ''),
      },
    },
  },
})
