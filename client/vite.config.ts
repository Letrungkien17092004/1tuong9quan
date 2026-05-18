import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig(({ mode }) => {
  // load biến môi trường theo mode
  const env = loadEnv(mode, process.cwd(), '')


  return {
    plugins: [
      react(),
      tailwindcss()
    ],
    server: {
      host: "0.0.0.0",
      port: Number(env.VITE_PORT) || 3000
    }
  }
})

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     react(),
//     tailwindcss()
//   ],
//   server: {
//     host: "0.0.0.0",
//     port: 8000
//   }
// })
