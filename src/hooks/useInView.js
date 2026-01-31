import { useState, useEffect, useRef } from 'react'

/**
 * 当元素进入视口时返回 true，用于懒加载与淡入效果
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

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
          } else if (!once) {
            setIsInView(false)
          }
        })
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return [ref, isInView]
}
