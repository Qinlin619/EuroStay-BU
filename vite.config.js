import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => {
  // 生产构建：base 为子路径，输出到 dist，再由 workflow 复制到仓库根供「从 main / root 部署」
  const base = command === 'build' ? '/EuroStay-BU/' : '/'
  return {
    plugins: [react()],
    base,
  }
})
