;(function () {
  'use strict'

  // ── Timestamp zones ───────────────────────────────────────────────────────
  // scrollStart/End: fraction of total page scroll (0–1)
  // tStart/tEnd:     video seconds
  // hold:            true → video frozen at tStart for the whole scroll range
  const ZONES = [
    { scrollStart: 0.00, scrollEnd: 0.05, tStart:  0, tEnd:  8, hold: false },
    { scrollStart: 0.05, scrollEnd: 0.16, tStart:  8, tEnd:  8, hold: true  },
    { scrollStart: 0.16, scrollEnd: 0.22, tStart:  8, tEnd: 14, hold: false },
    { scrollStart: 0.22, scrollEnd: 0.36, tStart: 14, tEnd: 14, hold: true  },
    { scrollStart: 0.36, scrollEnd: 0.42, tStart: 14, tEnd: 22, hold: false },
    { scrollStart: 0.42, scrollEnd: 0.54, tStart: 22, tEnd: 22, hold: true  },
    { scrollStart: 0.54, scrollEnd: 0.60, tStart: 22, tEnd: 30, hold: false },
    { scrollStart: 0.60, scrollEnd: 0.70, tStart: 30, tEnd: 30, hold: true  },
    { scrollStart: 0.70, scrollEnd: 0.77, tStart: 30, tEnd: 37, hold: false },
    { scrollStart: 0.77, scrollEnd: 0.85, tStart: 37, tEnd: 37, hold: true  },
    { scrollStart: 0.85, scrollEnd: 0.93, tStart: 37, tEnd: 44, hold: false },
    { scrollStart: 0.93, scrollEnd: 1.00, tStart: 44, tEnd: 44, hold: true  },
  ]

  const ACT3_START = 44
  const ACT3_END   = 90

  function scrollToVideoTime(progress) {
    const p = Math.max(0, Math.min(1, progress))
    const zone = ZONES.find(z => p >= z.scrollStart && p <= z.scrollEnd)
      ?? ZONES[ZONES.length - 1]
    if (zone.hold) return zone.tStart
    const t = (p - zone.scrollStart) / (zone.scrollEnd - zone.scrollStart)
    return zone.tStart + t * (zone.tEnd - zone.tStart)
  }

  // ── Canvas init ───────────────────────────────────────────────────────────
  // Reads rendered CSS size and sets the canvas internal resolution at DPR.
  // Call AFTER layout so getBoundingClientRect() returns real dimensions.
  function initCanvas(el) {
    const rect = el.getBoundingClientRect()
    const w = rect.width  || el.offsetWidth  || 300
    const h = rect.height || el.offsetHeight || 400
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    el.width  = Math.round(w * dpr)
    el.height = Math.round(h * dpr)
    const ctx = el.getContext('2d', { alpha: true })
    ctx.scale(dpr, dpr)
    return { el, ctx, w, h }
  }

  function init() {
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Single hidden video — pixel source for all canvases
    const video = document.createElement('video')
    video.innerHTML = `
      <source src="Assets/animation.webm" type="video/webm">
      <source src="Assets/animation.mp4"  type="video/mp4">
    `
    video.muted       = true
    video.playsInline = true
    video.preload     = 'auto'
    video.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;'
    document.body.appendChild(video)

    // Collect all section canvases — each sits inside its section layout
    const canvasIds = ['hero-canvas', 'work-canvas', 'shelf-canvas']
    let canvases = []

    // Init all canvases after a frame to ensure CSS layout has settled
    requestAnimationFrame(() => {
      canvases = canvasIds
        .map(id => {
          const el = document.getElementById(id)
          return el ? initCanvas(el) : null
        })
        .filter(Boolean)
    })

    // Draw current video frame to every canvas
    function drawAll() {
      if (video.readyState < 2) return
      for (const { el, ctx, w, h } of canvases) {
        ctx.clearRect(0, 0, w, h)
        ctx.drawImage(video, 0, 0, w, h)
      }
    }

    // ── ACT III: footer intersection fires a one-shot playthrough ────────
    const footer = document.getElementById('footer')
    let act3Fired = false

    if (footer) {
      const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting && !act3Fired) {
          act3Fired = true
          video.currentTime = ACT3_START
          video.play()
          function onUpdate() {
            drawAll()
            if (video.currentTime >= ACT3_END) {
              video.pause()
              video.removeEventListener('timeupdate', onUpdate)
            }
          }
          video.addEventListener('timeupdate', onUpdate)
        }
      }, { threshold: 0.3 })
      obs.observe(footer)
    }

    // ── Scroll handler ────────────────────────────────────────────────────
    let rafId = null
    let lastSeek = -1

    function onScroll() {
      if (act3Fired) return
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      if (scrollable <= 0) return
      const t = scrollToVideoTime(window.scrollY / scrollable)
      if (Math.abs(t - lastSeek) > 0.05) {
        video.currentTime = t
        lastSeek = t
      }
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(drawAll)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    video.addEventListener('seeked', drawAll)
    video.addEventListener('loadeddata', () => { video.currentTime = 0; drawAll() })
    video.load()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()
