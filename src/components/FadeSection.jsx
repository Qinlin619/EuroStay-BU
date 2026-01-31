import React, { useState, useEffect, useRef } from 'react'
import { useInView } from '../hooks/useInView'

/** 离开视口后延迟多久再淡出（避免快速滚动时误判） */
const FADE_OUT_DELAY_MS = 180

/**
 * 包裹任意区块：进入视口后下一帧淡入；离开视口后延迟一小段时间再淡出，期间若重新进入则取消淡出
 */
const FadeSection = ({ children, className = '', as: Tag = 'div', ...rest }) => {
  // 进入视口 1/3 处淡入，离开视口 1/8 处淡出（常见滚动交互）
  const REVEAL_ROOT_MARGIN = '-33.333% 0px -12.5% 0px'
  const [ref, inView] = useInView({ threshold: 0, rootMargin: REVEAL_ROOT_MARGIN, once: false })
  const [revealed, setRevealed] = useState(false)
  const fadeOutTimerRef = useRef(null)

  useEffect(() => {
    if (inView) {
      if (fadeOutTimerRef.current) {
        clearTimeout(fadeOutTimerRef.current)
        fadeOutTimerRef.current = null
      }
      const id = requestAnimationFrame(() => setRevealed(true))
      return () => cancelAnimationFrame(id)
    } else {
      fadeOutTimerRef.current = setTimeout(() => {
        fadeOutTimerRef.current = null
        setRevealed(false)
      }, FADE_OUT_DELAY_MS)
      return () => {
        if (fadeOutTimerRef.current) {
          clearTimeout(fadeOutTimerRef.current)
          fadeOutTimerRef.current = null
        }
      }
    }
  }, [inView])

  return (
    <Tag
      ref={ref}
      className={`section-reveal ${revealed ? 'in-view' : ''} ${className}`.trim()}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export default FadeSection
