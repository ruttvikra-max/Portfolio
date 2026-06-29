import { useEffect } from 'react'

export default function CardTilt() {
  useEffect(() => {
    const cards = Array.from(document.querySelectorAll('.case-card'))
    if (!cards.length) return

    const TILT_MAX = 8
    const cleanups = []

    cards.forEach(card => {
      card.style.transformStyle = 'preserve-3d'
      card.style.transition = 'transform 0ms linear, box-shadow 400ms ease'
      card.style.willChange = 'transform'

      function onMove(e) {
        const rect = card.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = (e.clientX - cx) / (rect.width / 2)
        const dy = (e.clientY - cy) / (rect.height / 2)
        const rotX = -dy * TILT_MAX
        const rotY = dx * TILT_MAX

        card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02,1.02,1.02)`
        card.style.transition = 'transform 0ms linear'

        const px = ((e.clientX - rect.left) / rect.width) * 100
        const py = ((e.clientY - rect.top) / rect.height) * 100
        card.style.setProperty('--spotlight-x', `${px}%`)
        card.style.setProperty('--spotlight-y', `${py}%`)
        card.classList.add('is-tilted')
      }

      function onLeave() {
        card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)'
        card.style.transition = 'transform 400ms cubic-bezier(0.22,1,0.36,1), box-shadow 400ms ease'
        card.classList.remove('is-tilted')
      }

      card.addEventListener('mousemove', onMove)
      card.addEventListener('mouseleave', onLeave)
      cleanups.push(() => {
        card.removeEventListener('mousemove', onMove)
        card.removeEventListener('mouseleave', onLeave)
      })
    })

    return () => cleanups.forEach(fn => fn())
  }, [])

  return null
}
