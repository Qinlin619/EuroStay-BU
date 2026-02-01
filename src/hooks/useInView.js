import { useState, useEffect, useRef } from 'react'

/**
 * 当元素进入视口时返回 true，用于懒加载与淡入效果
 * 当 once 为 false 时，离开视口的 setState 会节流到下一帧，减少滚动时的重绘
 * @param {Object} options - IntersectionObserver 选项
 * @param {number} options.threshold - 可见比例阈值，默认 0.05
 * @param {string} options.rootMargin - 根边距，提前触发，默认 "80px 0px"
 * @param {boolean} options.once - 为 true 时进入视口后不再变回 false，默认 true（适合懒加载+淡入）
 * @returns {[React.RefObject, boolean]} [ref, isInView]
 */
export function useInView(options = {}) {
  const {
    threshold = 0.05,
    rootMargin = '80px 0px',
    once = true
  } = options

  const [isInView, setIsInView] = useState(false)
  const ref = useRef(null)
  const rafRef = useRef(null)
  const pendingLeaveRef = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (rafRef.current) {
              cancelAnimationFrame(rafRef.current)
              rafRef.current = null
            }
            pendingLeaveRef.current = false
            setIsInView(true)
          } else if (!once) {
            pendingLeaveRef.current = true
            if (rafRef.current) return
            rafRef.current = requestAnimationFrame(() => {
              rafRef.current = null
              if (pendingLeaveRef.current) setIsInView(false)
            })
          }
        })
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [threshold, rootMargin, once])

  return [ref, isInView]
}
