import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default ({ mode }) => {
  process.env = {
    ...process.env,
    ...loadEnv(mode, process.cwd(), '')
  }

  return defineConfig({
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname),
      },
    },
    base: process.env.VITE_BASE_URL,
  })
}
