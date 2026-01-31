import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => {
  // 生产构建用相对路径，避免 GitHub Pages 绝对路径解析问题
  // 开发环境用根路径
  const base = command === 'build' ? './' : '/'
  return {
    plugins: [react()],
    base,
  }
})
