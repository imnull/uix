import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [vue(), vueJsx()],
  build: {
    outDir: path.resolve(__dirname, '../../docs/swiper-vue3'),
  }
})
