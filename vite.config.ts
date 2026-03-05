import { defineConfig } from 'vite'

export default defineConfig({
  base: '/web-larek-frontend/',
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [
          './src/scss'
        ],
      },
    },
  },
})