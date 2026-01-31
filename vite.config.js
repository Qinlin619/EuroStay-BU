import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => {
  // 生产构建用 base 路径（GitHub Pages 子路径）
  const base = command === 'build' ? '/EuroStay-BU/' : '/'
  return {
    plugins: [react()],
    base,
  }
})
