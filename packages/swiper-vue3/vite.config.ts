import path from 'path'
import { defineConfig, LibraryOptions } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vite.dev/config/
export default defineConfig(options => {
  const { mode } = options
  const outDir = mode === 'DOC' ? path.resolve(__dirname, '../../docs/swiper-vue3') : 'dist'
  const lib: LibraryOptions | false = mode === 'DOC' ? false : {
    entry: './src/components/index.ts',  // 入口文件，通常是组件库的主入口
    name: '@imnull/swiper-vue3', // 组件库名称
    fileName: 'swiper',
    // fileName: (format) => `my-vue-component-library.${format}.js`, // 输出文件名称
    formats: ['es', 'cjs'], // 打包格式
  }
  return {
    base: './',
    plugins: [vue(), vueJsx()],
    build: {
      emptyOutDir: true,
      lib,
      outDir,
    }
  }
})
