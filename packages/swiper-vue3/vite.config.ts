import path from 'path'
import { defineConfig, LibraryOptions } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from "vite-plugin-dts";
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

// https://vite.dev/config/
export default defineConfig(options => {
  const plugins = [vue(), vueJsx()]

  const { mode } = options

  const outDir = mode === 'DOC' ? path.resolve(__dirname, '../../docs/swiper-vue3') : 'dist'
  const lib: LibraryOptions | undefined = mode === 'DOC' ? undefined : {
    entry: path.resolve(__dirname, './src/components/index.ts'),  // 入口文件，通常是组件库的主入口
    name: 'Swiper', // 组件库名称
    fileName: 'index',
    formats: ['es', 'cjs', 'umd'], // 打包格式
  }

  const rollupOptions = mode === 'DOC' ? undefined : {
    external: ['vue'], // 排除 Vue 作为外部依赖
    output: {
      globals: {
        vue: 'Vue', // 如果你的库是通过 CDN 引入，Vue 的全局变量名
      },
    },
  }

  if (mode !== 'DOC') {
    plugins.push(
      dts({
        entryRoot: path.resolve(__dirname, './src/components')
      })
    )
    plugins.push(cssInjectedByJsPlugin() as any)
  }


  return {
    base: './',
    plugins,
    build: {
      cssCodeSplit: false,
      emptyOutDir: true,
      lib,
      outDir,
      rollupOptions,
    },
    server: {
      port: 5005,
    }
  }
})
