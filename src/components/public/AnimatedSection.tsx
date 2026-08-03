'use client'

import { useState, useEffect, useRef, ReactNode } from 'react'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  delay?: number
  animation?: 'fade-up' | 'fade-in' | 'scale-up' | 'slide-left' | 'slide-right'
}

export default function AnimatedSection({ children, className = '', delay = 0, animation = 'fade-up' }: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
          observer.unobserve(el)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  let transformStyle = ''
  if (animation === 'fade-up') transformStyle = 'translateY(40px)'
  if (animation === 'scale-up') transformStyle = 'scale(0.95)'
  if (animation === 'slide-left') transformStyle = 'translateX(40px)'
  if (animation === 'slide-right') transformStyle = 'translateX(-40px)'

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate(0) scale(1)' : transformStyle,
      }}
    >
      {children}
    </div>
  )
}
