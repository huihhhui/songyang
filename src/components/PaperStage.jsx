import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { paperStageCopy } from '../data/paperStageCopy.js'
import { assetPath } from '../lib/assetPath.js'

const VIEWBOX = { width: 1536, height: 1024 }
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function toLocalPoint(svg, clientX, clientY) {
  const point = svg.createSVGPoint()
  point.x = clientX
  point.y = clientY
  const matrix = svg.getScreenCTM()
  return matrix ? point.matrixTransform(matrix.inverse()) : null
}

export default function PaperStage() {
  const navigate = useNavigate()
  const svgRef = useRef(null)
  const ropeRef = useRef(null)
  const draggingRef = useRef(false)
  const frameRef = useRef(0)
  const pullRef = useRef(0)
  const swayRef = useRef(0)
  const dragOriginRef = useRef(null)
  const [lit, setLit] = useState(false)
  const [pull, setPull] = useState(0)
  const [sway, setSway] = useState(0)
  const [dragging, setDragging] = useState(false)

  const ignite = () => setLit(true)

  const resolvePull = (next) => {
    pullRef.current = next
    setPull(next)
  }

  const resolveSway = (next) => {
    swayRef.current = next
    setSway(next)
  }

  const moveRope = (event) => {
    if (!draggingRef.current || !svgRef.current || !dragOriginRef.current) return
    const local = toLocalPoint(svgRef.current, event.clientX, event.clientY)
    if (!local) return
    const { x, y, pull: originPull, sway: originSway } = dragOriginRef.current
    const resolved = clamp(originPull + (local.y - y) / 260, -0.18, 1.15)
    const resolvedSway = clamp(originSway + (local.x - x) * 0.48 + resolved * 42, -60, 60)
    resolvePull(resolved)
    resolveSway(resolvedSway)
    if (resolved > 0.42) ignite()
  }

  const startRope = (event) => {
    if (!ropeRef.current || !svgRef.current) return
    const local = toLocalPoint(svgRef.current, event.clientX, event.clientY)
    const tail = ropeRef.current.getPointAtLength(ropeRef.current.getTotalLength())
    if (!local || Math.hypot(local.x - tail.x, local.y - tail.y) > 86) return
    window.cancelAnimationFrame(frameRef.current)
    draggingRef.current = true
    dragOriginRef.current = { x: local.x, y: local.y, pull: pullRef.current, sway: swayRef.current }
    setDragging(true)
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const releaseRope = () => {
    if (!draggingRef.current) return
    draggingRef.current = false
    setDragging(false)

    let position = pullRef.current
    let velocity = 0
    let side = swayRef.current
    let sideVelocity = 0

    const settle = () => {
      const force = -position * 0.035
      velocity = (velocity + force) * 0.94
      position += velocity
      const sideForce = -side * 0.09
      sideVelocity = (sideVelocity + sideForce) * 0.86
      side += sideVelocity

      if (Math.abs(position) < 0.003 && Math.abs(velocity) < 0.003 && Math.abs(side) < 0.08 && Math.abs(sideVelocity) < 0.08) {
        resolveSway(0)
        resolvePull(0)
        return
      }

      resolveSway(side)
      resolvePull(clamp(position, -0.18, 1.15))
      frameRef.current = window.requestAnimationFrame(settle)
    }

    frameRef.current = window.requestAnimationFrame(settle)
  }

  const ropeShape = useMemo(() => {
    const naturalSag = 22
    const endX = 390 + sway
    const endY = 650 + pull * 250

    return {
      d: [
        'M 390 0',
        `C ${390 + sway * 0.03} 180 ${390 + naturalSag + sway * 0.18} 350 ${390 + naturalSag * 0.7 + sway * 0.12} 470`,
        `S ${390 + naturalSag * 0.7 + sway * 0.45} 580 ${endX} ${endY}`,
      ].join(' '),
      knotX: endX,
      knotY: endY,
    }
  }, [pull, sway])

  useEffect(() => {
    return () => window.cancelAnimationFrame(frameRef.current)
  }, [])

  useEffect(() => {
    pullRef.current = pull
  }, [pull])

  useEffect(() => {
    swayRef.current = sway
  }, [sway])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Enter' || event.key === ' ') ignite()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <main
      className={`paper-stage ${lit ? 'is-lit' : ''} ${dragging ? 'is-pulling' : ''}`}
      onPointerMove={moveRope}
      onPointerUp={releaseRope}
      onPointerCancel={releaseRope}
    >
      <div className="paper-stage__wall" aria-hidden="true" />
      <div className="paper-stage__warmth" aria-hidden="true" />

      <div className="paper-stage__lamp" onPointerDown={ignite} aria-hidden="true">
        <img src={assetPath('ke/sz-02-lamp-v10.png')} alt="" />
      </div>
      <div className="paper-stage__projection paper-stage__projection--bird" aria-hidden="true">
        <img src={assetPath('ke/sz-03-wood-bird-3.png')} alt="" />
      </div>
      <div className="paper-stage__projection paper-stage__projection--turtle" aria-hidden="true">
        <img src={assetPath('ke/sz-03-tile-turtle-3.png')} alt="" />
      </div>
      <div className="paper-stage__shadow paper-stage__shadow--bird" aria-hidden="true">
        <img src={assetPath('ke/sz-03-wood-bird-2.png')} alt="" />
      </div>
      <div className="paper-stage__shadow paper-stage__shadow--turtle" aria-hidden="true">
        <img src={assetPath('ke/sz-03-tile-turtle-2.png')} alt="" />
      </div>
      <div className="paper-stage__object paper-stage__object--bird" aria-hidden="true">
        <img src={assetPath('ke/sz-03-wood-bird-1.png')} alt="" />
      </div>
      <div className="paper-stage__object paper-stage__object--turtle" aria-hidden="true">
        <img src={assetPath('ke/sz-03-tile-turtle-1.png')} alt="" />
      </div>

      <section className="paper-stage__copy paper-stage__copy--upper" aria-label="村民艺术创作">
        <p className="paper-stage__copy-kicker">{paperStageCopy.upper.kicker}</p>
        <h1>{paperStageCopy.upper.title}</h1>
        <p>{paperStageCopy.upper.body}</p>
      </section>
      <section className="paper-stage__copy paper-stage__copy--lower" aria-label="展览与日常">
        <h2>{paperStageCopy.lower.title}</h2>
        <p>{paperStageCopy.lower.body}</p>
      </section>
      <button
        className="paper-stage__next"
        type="button"
        onClick={() => navigate('/placeholder/rock-ceramic')}
      >
        <span>Next</span>
        <span className="paper-stage__next-arrow" aria-hidden="true">→</span>
      </button>

      <svg ref={svgRef} className="paper-stage__rope" viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`} preserveAspectRatio="none" aria-hidden="true">
        <path className="paper-stage__rope-ink" d={ropeShape.d} />
        <path ref={ropeRef} className="paper-stage__rope-hit" d={ropeShape.d} onPointerDown={startRope} style={{ strokeWidth: `${36 + Math.max(0, pull) * 22}` }} />
        <circle className="paper-stage__rope-knot" cx={ropeShape.knotX} cy={ropeShape.knotY} r="7" />
      </svg>
    </main>
  )
}
