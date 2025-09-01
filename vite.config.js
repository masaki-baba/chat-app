import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import RubyPlugin from 'vite-plugin-ruby'
import { fileURLToPath, URL } from 'node:url'
import yaml from 'js-yaml'
import fs from 'fs'

export default defineConfig({
  plugins: [
    RubyPlugin(),
    vue({
      template: {
        preprocessOptions: {
          pug: {
            doctype: 'html',
            pretty: true
          }
        }
      }
    }),
    {
      name: 'yaml-loader',
      transform(code, id) {
        if (id.endsWith('.yml') || id.endsWith('.yaml')) {
          const yamlData = yaml.load(code)
          return `export default ${JSON.stringify(yamlData)}`
        }
      }
    }
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./app/javascript', import.meta.url)),
      '~': fileURLToPath(new URL('./app/assets', import.meta.url))
    }
  },
  server: {
    hmr: {
      host: 'localhost'
    }
  }
})
