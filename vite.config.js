import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => {
  // 只在生产构建时使用 base 路径（用于 GitHub Pages）
  // 开发环境使用根路径
  const base = command === 'build' ? '/EuroStay_Website/' : '/'
  
  return {
    plugins: [react()],
    base,
  }
})
