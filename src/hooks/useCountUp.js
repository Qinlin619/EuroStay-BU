import { useState, useEffect, useRef } from 'react'

/**
 * 数字递增动画 Hook
 * @param {number|string} endValue - 目标值（可以是数字或字符串如 "100万+"）
 * @param {number} duration - 动画持续时间（毫秒）
 * @param {boolean} startOnMount - 是否在组件挂载时自动开始
 * @param {React.RefObject} elementRef - 元素引用，用于 Intersection Observer
 * @returns {string} - 当前显示的值
 */
export const useCountUp = (endValue, duration = 2000, startOnMount = true, elementRef = null) => {
  const [count, setCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const hasStartedRef = useRef(false)
  const frameRef = useRef(null)
  const startTimeRef = useRef(null)

  // 解析目标值，提取数字部分和后缀
  const parseValue = (value) => {
    if (typeof value === 'number') {
      return { number: value, suffix: '', isWan: false }
    }
    
    const str = String(value)
    // 处理中文数字（如 "100万+"）
    if (str.includes('万')) {
      const match = str.match(/([\d.]+)万/)
      if (match) {
        const wanValue = parseFloat(match[1])
        const suffix = str.replace(match[0], '')
        return { number: wanValue, suffix: suffix || '', isWan: true }
      }
    }
    
    // 处理普通数字（如 "30000+" 或 "30+"）
    const match = str.match(/([\d,]+)/)
    if (match) {
      const num = parseInt(match[1].replace(/,/g, ''), 10)
      const suffix = str.replace(match[0], '')
      return { number: num, suffix: suffix || '', isWan: false }
    }
    
    return { number: 0, suffix: str, isWan: false }
  }

  const { number: targetNumber, suffix, isWan } = parseValue(endValue)

  const animate = (timestamp) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp
    }

    const elapsed = timestamp - startTimeRef.current
    const progress = Math.min(elapsed / duration, 1)
    
    // 使用缓动函数（ease-out）
    const easeOut = 1 - Math.pow(1 - progress, 3)
    const current = Math.floor(targetNumber * easeOut)
    
    setCount(current)

    if (progress < 1) {
      frameRef.current = requestAnimationFrame(animate)
    } else {
      setCount(targetNumber)
      setIsAnimating(false)
      startTimeRef.current = null
    }
  }

  const start = () => {
    if (isAnimating || hasStartedRef.current) return
    
    hasStartedRef.current = true
    setIsAnimating(true)
    setCount(0)
    startTimeRef.current = null
    frameRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    if (!startOnMount) return

    // 如果提供了元素引用，使用 Intersection Observer
    if (elementRef?.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasStartedRef.current) {
              // 延迟一点开始动画，让元素完全可见
              setTimeout(() => {
                start()
              }, 200)
              observer.disconnect()
            }
          })
        },
        { threshold: 0.5 }
      )
      
      observer.observe(elementRef.current)
      
      return () => {
        observer.disconnect()
        if (frameRef.current) {
          cancelAnimationFrame(frameRef.current)
        }
      }
    } else {
      // 没有元素引用，直接延迟开始
      const timer = setTimeout(() => {
        start()
      }, 300)
      
      return () => {
        clearTimeout(timer)
        if (frameRef.current) {
          cancelAnimationFrame(frameRef.current)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startOnMount])

  // 格式化显示的数字
  const formatNumber = (num) => {
    if (isWan) {
      // 如果是"万"单位，显示为小数
      const wan = num
      // 如果数字是整数，不显示小数
      if (wan % 1 === 0) {
        return wan + '万'
      }
      return Math.floor(wan * 10) / 10 + '万'
    }
    
    // 添加千位分隔符
    return num.toLocaleString()
  }

  return {
    value: formatNumber(count) + suffix,
    isAnimating,
    start,
    reset: () => {
      setCount(0)
      setIsAnimating(false)
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }
}
