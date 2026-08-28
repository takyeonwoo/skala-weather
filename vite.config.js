import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

function apiDevServer(env) {
  return {
    name: 'api-dev-server',
    configureServer(server) {
      Object.assign(process.env, env)
      server.middlewares.use('/api/weather', async (req, res) => {
        const { proxyWeather } = await server.ssrLoadModule('/api/weather.js')
        const query = Object.fromEntries(new URL(req.url, 'http://localhost').searchParams)
        const { status, body } = await proxyWeather(query)
        res.statusCode = status
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(body))
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue(), vueDevTools(), apiDevServer(env)],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
