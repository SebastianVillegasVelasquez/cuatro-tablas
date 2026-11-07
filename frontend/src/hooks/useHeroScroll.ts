import { useEffect, useRef, type RefObject } from 'react'

/**
 * How far the visitor has scrolled through `element`, as 0 (top of the page) to 1
 * (element fully scrolled out). Stored in a ref, not state: the 3D loop reads it
 * every frame and a re-render per scroll event would be wasted work.
 */
export function useHeroScroll(element: RefObject<HTMLElement | null>) {
  const progress = useRef(0)

  useEffect(() => {
    const update = () => {
      const height = element.current?.offsetHeight || window.innerHeight
      progress.current = Math.min(1, Math.max(0, window.scrollY / height))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [element])

  return progress
}
