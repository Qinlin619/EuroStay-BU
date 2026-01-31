import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// 自定义光标：正常 1，悬浮 4，点击时光标变 2、动效用 3；1/4/2 顺时针转 5°
const base = import.meta.env.BASE_URL

// 加载图片并顺时针旋转 5 度，返回 { url, size } 用作光标（size 用于设置热点居中）
function loadAndRotateCursor(filename) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const size = Math.max(img.width, img.height) * 1.4
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')
      ctx.shadowColor = 'transparent'
      ctx.shadowBlur = 0
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
      ctx.translate(size / 2, size / 2)
      ctx.rotate((5 * Math.PI) / 180)
      ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height)
      resolve({ url: canvas.toDataURL('image/png'), size })
    }
    img.onerror = () => resolve(null)
    img.src = base + 'images/cursor/' + filename
  })
}

const cursorStyle = document.createElement('style')
cursorStyle.id = 'cursor-custom'
cursorStyle.textContent = `
  @keyframes cursor-burst {
    0% { transform: translate(-50%, -50%) scale(0.1); opacity: 1; }
    70% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.6; }
    100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
  }
  .cursor-burst {
    position: fixed;
    width: 48px;
    height: 48px;
    pointer-events: none;
    z-index: 99999;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    transform-origin: center;
    box-shadow: none;
    filter: none;
    animation: cursor-burst 0.35s ease-out forwards;
  }
`
document.head.appendChild(cursorStyle)

Promise.all([
  loadAndRotateCursor('1.png'),
  loadAndRotateCursor('4.png'),
  loadAndRotateCursor('2.png')
]).then(([r1, r4, r2]) => {
  const fallback1 = base + 'images/cursor/1.png'
  const fallback4 = base + 'images/cursor/4.png'
  const fallback2 = base + 'images/cursor/2.png'
  const hotX = (r) => (r && r.size ? Math.round(r.size / 2) - 4 : 0)
  const hotY = (r) => (r && r.size ? Math.round(r.size / 2) - 8 : 0)
  const url = (r, fallback) => (r && r.url ? r.url : fallback)
  const x1 = hotX(r1)
  const y1 = hotY(r1)
  const x4 = hotX(r4)
  const y4 = hotY(r4)
  const x2 = hotX(r2)
  const y2 = hotY(r2)
  const cursorRules = `
  * { cursor: url('${url(r1, fallback1)}') ${x1} ${y1}, auto !important; }
  a, button, [role="button"], [onclick], input[type="submit"], input[type="button"], .clickable, .pointer, .cursor-pointer { cursor: url('${url(r4, fallback4)}') ${x4} ${y4}, pointer !important; }
  body.cursor-pressed, body.cursor-pressed * { cursor: url('${url(r2, fallback2)}') ${x2} ${y2}, pointer !important; }
  `
  cursorStyle.textContent = cursorRules + cursorStyle.textContent
})

// 按下时：光标变 2，动效显示图 3 炸开
document.addEventListener('mousedown', (e) => {
  document.body.classList.add('cursor-pressed')
  const el = document.createElement('div')
  el.className = 'cursor-burst'
  el.style.left = (e.clientX - 2) + 'px'
  el.style.top = e.clientY + 'px'
  el.style.backgroundImage = `url('${base}images/cursor/3.png')`
  document.body.appendChild(el)
  el.addEventListener('animationend', () => el.remove(), { once: true })
})
document.addEventListener('mouseup', () => {
  document.body.classList.remove('cursor-pressed')
})
document.addEventListener('mouseleave', () => {
  document.body.classList.remove('cursor-pressed')
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
