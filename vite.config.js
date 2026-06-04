import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => {
  // 使用自定义域名时，路径必须设为根目录 '/'
  const base = '/'
  return {
    plugins: [react()],
    base,
  }
})
