import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const VIEWBOX = { width: 1536, height: 1024 }
const ROPE_PATH = 'M -18 258 C 130 300 266 500 430 638 C 590 760 752 758 900 710 C 1068 662 1208 566 1340 512 C 1420 480 1482 462 1552 450'

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function getPointAtProgress(path, progress) {
  const length = path.getTotalLength()
  return path.getPointAtLength(length * progress)
}

function findProgressFromPointer(path, svg, clientX, clientY) {
  const point = svg.createSVGPoint()
  point.x = clientX
  point.y = clientY
  const local = point.matrixTransform(svg.getScreenCTM()?.inverse())
  const length = path.getTotalLength()
  let bestProgress = 0
  let bestDistance = Number.POSITIVE_INFINITY
  for (let index = 0; index <= 120; index += 1) {
    const progress = index / 120
    const candidate = path.getPointAtLength(length * progress)
    const distance = Math.hypot(candidate.x - local.x, candidate.y - local.y)
    if (distance < bestDistance) {
      bestProgress = progress
      bestDistance = distance
    }
  }
  return bestProgress
}

export default function FlowerRopeReveal() {
  const pathRef = useRef(null)
  const svgRef = useRef(null)
  const draggingRef = useRef(false)
  const [progress, setProgress] = useState(0.075)
  const [dragging, setDragging] = useState(false)
  const [complete, setComplete] = useState(false)
  const [handlePosition, setHandlePosition] = useState({ x: 0, y: 0 })
  const handleRef = useRef(null)

  useEffect(() => {
    const path = pathRef.current
    if (path) {
      const nextPosition = getPointAtProgress(path, progress)
      handleRef.current = nextPosition
      setHandlePosition(nextPosition)
    }
  }, [progress])

  const updateFromPointer = (event) => {
    if (!draggingRef.current || !pathRef.current || !svgRef.current) return
    const next = findProgressFromPointer(pathRef.current, svgRef.current, event.clientX, event.clientY)
    setProgress((current) => {
      const resolved = clamp(Math.max(current, next), 0.075, 1)
      if (resolved > 0.995) setComplete(true)
      return resolved
    })
  }

  const startDrag = (event) => {
    draggingRef.current = true
    setDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
    updateFromPointer(event)
  }

  const stopDrag = () => {
    draggingRef.current = false
    setDragging(false)
  }

  const nudge = (delta) => {
    setProgress((current) => {
      const next = clamp(current + delta, 0.075, 1)
      if (next > 0.995) setComplete(true)
      return next
    })
  }

  return (
    <main className="flower-rope" onPointerMove={updateFromPointer} onPointerUp={stopDrag} onPointerCancel={stopDrag}>
      <svg ref={svgRef} className="flower-rope__art" viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`} preserveAspectRatio="none" role="img" aria-label="沿花链揭示松阳村落的互动图像">
        <defs>
          <mask id="flower-rope-reveal-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={VIEWBOX.width} height={VIEWBOX.height}>
            <rect width={VIEWBOX.width} height={VIEWBOX.height} fill="black" />
            <path ref={pathRef} className="flower-rope__house-reveal" d={ROPE_PATH} pathLength="1" strokeDasharray="1" strokeDashoffset={1 - progress} />
            <path className="flower-rope__house-reveal house-reveal--wide" d={ROPE_PATH} pathLength="1" strokeDasharray="1" strokeDashoffset={1 - progress} style={{ strokeWidth: `${Math.max(20, progress * 190)}` }} />
            <path className="flower-rope__chain-reveal" d={ROPE_PATH} pathLength="1" strokeDasharray="1" strokeDashoffset={1 - progress} />
          </mask>
        </defs>
        <rect width={VIEWBOX.width} height={VIEWBOX.height} fill="#f4ead5" />
        <image href="/assets/ke/sz-03-flower-rope-v10.png" width={VIEWBOX.width} height={VIEWBOX.height} preserveAspectRatio="none" mask="url(#flower-rope-reveal-mask)" />
        <image className="flower-rope__complete-reveal" href="/assets/ke/sz-03-flower-rope-v10.png" width={VIEWBOX.width} height={VIEWBOX.height} preserveAspectRatio="none" style={{ opacity: complete ? 1 : 0 }} />
        <path className="flower-rope__ghost-path" d={ROPE_PATH} pathLength="1" strokeDasharray="0.006 0.018" />
      </svg>

      <div className="flower-rope__header">
        <p className="flower-rope__mark">松阳寻踪 / 03</p>
        <p className="flower-rope__caption">一条花链，沿着屋檐慢慢揭开</p>
      </div>

      <div className={`flower-rope__copy ${complete ? 'is-visible' : ''}`} aria-live="polite">
        <p className="flower-rope__copy-index">松庄 · 花链</p>
        <h1><span>让被藏起来的村庄</span><span>重新显影</span></h1>
        <p>拖动花链，沿着它原本悬垂的轨迹，寻找屋檐、墙面和一段仍在延续的生活。</p>
      </div>

      <div className="flower-rope__control" aria-label="花链揭示控制">
        <button className="flower-rope__handle" type="button" aria-label="沿花链向右拖动揭示" onPointerDown={startDrag} onKeyDown={(event) => {
          if (event.key === 'ArrowRight') { event.preventDefault(); nudge(0.035) }
          if (event.key === 'ArrowLeft') { event.preventDefault(); nudge(-0.035) }
          if (event.key === 'Home') { event.preventDefault(); setProgress(0.075); setComplete(false) }
          if (event.key === 'End') { event.preventDefault(); setProgress(1); setComplete(true) }
        }} style={{ left: `${(handlePosition.x / VIEWBOX.width) * 100}%`, top: `${(handlePosition.y / VIEWBOX.height) * 100}%` }}>
          <span className="flower-rope__handle-core" />
        </button>
        <span className={`flower-rope__hint ${dragging ? 'is-dragging' : ''}`}>{dragging ? '沿花链向右' : '按住花链，向右揭示'}</span>
      </div>
      <Link
        className="flower-rope__next"
        to="/"
        aria-label="Next"
        style={{
          position: 'absolute',
          right: 'clamp(48px, 8vw, 120px)',
          bottom: 'clamp(28px, 6vh, 68px)',
          zIndex: 12,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '9px',
          color: 'rgba(54, 43, 29, .92)',
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: 'clamp(20px, 1.7vw, 27px)',
          lineHeight: 1.2,
          letterSpacing: '.08em',
          textDecoration: 'underline',
          textDecorationThickness: '1px',
          textUnderlineOffset: '7px',
          pointerEvents: 'auto',
        }}
      >
        <span>Next</span><span aria-hidden="true" style={{ textDecoration: 'none' }}>→</span>
      </Link>
    </main>
  )
}
