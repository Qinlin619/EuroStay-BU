import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTop = () => {
  const { pathname } = useLocation()

  // 禁止刷新后恢复滚动，始终从顶端显示
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
    const id = requestAnimationFrame(() => {
      window.scrollTo(0, 0)
    })
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default ScrollToTop
