import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAudio } from '../audio/AudioProvider.jsx'
import { assetPath } from '../lib/assetPath.js'

const BACKGROUND = assetPath('rock-ceramic/rock-background-v1.png')
const FINAL_REFERENCE = assetPath('rock-ceramic/clay-cat-reference-v8.png')
const CERAMIC_ASSETS = {
  main: assetPath('rock-ceramic/ceramic-main-cat-v1-alpha.png'),
  face: assetPath('rock-ceramic/ceramic-face-v1-alpha.png'),
}
const GARBAGE_ASSETS = {
  cigarette: assetPath('rock-ceramic/garbage-cigarettes-v1-alpha.png'),
  tissue: assetPath('rock-ceramic/garbage-tissue-v1-alpha.png'),
  paper: assetPath('rock-ceramic/garbage-wrapper-v1-alpha.png'),
  wrapper: assetPath('rock-ceramic/garbage-wrapper-v1-alpha.png'),
  debris: assetPath('rock-ceramic/garbage-debris-v1-alpha.png'),
}
const PHASE = {
  CLEANING: 'cleaning',
  CERAMIC_REVEAL: 'ceramic-reveal',
  PLACE_MAIN_CERAMIC: 'place-main-ceramic',
  FINAL_REVEAL: 'final-reveal',
  COMPLETE: 'complete',
}

const GARBAGE_SEEDS = [
  ['cigarette', 16, 47, -18], ['cigarette', 24, 51, 12], ['cigarette', 32, 54, 22],
  ['tissue', 22, 55, -12], ['tissue', 31, 58, 18], ['paper', 15, 59, -8],
  ['paper', 28, 62, 15], ['wrapper', 38, 55, -26], ['wrapper', 42, 62, 7],
  ['debris', 13, 53, 35], ['debris', 26, 49, -14], ['debris', 35, 59, 8],
]

const STORY = {
  cleaning: [
    '老屋的墙角，总有一些被忽略的缝隙。',
    '久而久之，烟头、纸巾和生活的碎屑，也落进了这些坑洞。',
  ],
  reveal: [
    '有人开始清理这些被遗忘的角落。',
    '陶艺店主把清理后的坑洞，当成了新的容器。',
  ],
  complete: [
    '老房子的墙面留下许多大大小小的坑洞。它们原本只是岁月留下的破损，却也成了烟头、纸巾和生活碎屑随手落下的地方。后来，陶艺店主清理了这些被忽略的角落，把一件件亲手制作的小陶物嵌进墙体的缝隙里。破损没有被遮住，反而成为了新的容器。旧墙、泥土与陶片，在日常生活里重新长出了属于自己的样子。',
    '有些地方不必被修复成新的，只需要重新被看见。',
  ],
}

function makeGarbage() {
  return GARBAGE_SEEDS.map(([type, x, y, rotation], index) => ({
    id: `${type}-${index}`,
    type,
    x,
    y,
    rotation,
    scale: [0.72, 1.08, 0.86, 1.16, 0.78, 0.94, 1.2, 0.82, 1.04, 0.68, 1.1, 0.9][index],
    status: 'idle',
  }))
}

function phaseAtLeast(phase, target) {
  const order = [PHASE.CLEANING, PHASE.CERAMIC_REVEAL, PHASE.PLACE_MAIN_CERAMIC, PHASE.FINAL_REVEAL, PHASE.COMPLETE]
  return order.indexOf(phase) >= order.indexOf(target)
}

export default function RockCeramicScene() {
  const navigate = useNavigate()
  const { play } = useAudio()
  const [viewport, setViewport] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }))
  const [phase, setPhase] = useState(PHASE.CLEANING)
  const [garbage, setGarbage] = useState(makeGarbage)
  const [particles, setParticles] = useState([])
  const [mainPiece, setMainPiece] = useState({ x: 16, y: -12, rotation: -6 })
  const dragRef = useRef(null)
  const garbageRef = useRef(garbage)
  const particleFrameRef = useRef(0)
  const transitionStartedRef = useRef(false)

  useEffect(() => {
    const handleResize = () => setViewport({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    garbageRef.current = garbage
  }, [garbage])

  const holeBounds = useMemo(() => ({ left: 5, right: 58, top: 35, bottom: 70 }), [])
  const removedCount = garbage.filter((item) => item.status === 'removed').length

  useEffect(() => {
    if (phase !== PHASE.CLEANING || transitionStartedRef.current || removedCount < 9) return undefined
    transitionStartedRef.current = true
    setGarbage((items) => items.map((item) => item.status === 'idle' ? { ...item, status: 'fading' } : item))
    const revealTimer = window.setTimeout(() => {
      setPhase(PHASE.CERAMIC_REVEAL)
      window.setTimeout(() => setPhase(PHASE.PLACE_MAIN_CERAMIC), 700)
    }, 620)
    return () => window.clearTimeout(revealTimer)
  }, [phase, removedCount])

  useEffect(() => {
    if (!particles.length) return undefined
    const tick = () => {
      setParticles((current) => current
        .map((particle) => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vy: particle.vy + 0.03,
          vx: particle.vx * 0.996,
          rotation: particle.rotation + particle.spin,
          life: particle.life - 1,
        }))
        .filter((particle) => particle.life > 0 && particle.y < 103))
      particleFrameRef.current = window.requestAnimationFrame(tick)
    }
    particleFrameRef.current = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(particleFrameRef.current)
  }, [particles.length])

  useEffect(() => () => window.cancelAnimationFrame(particleFrameRef.current), [])

  const spawnParticles = (item) => {
    const colors = item.type === 'cigarette' ? ['#8b755f', '#3d3328', '#d3b486'] : ['#b69b76', '#8d765b', '#d8c3a2']
    const next = Array.from({ length: 36 }, (_, index) => ({
      id: `${item.id}-particle-${index}-${Date.now()}`,
      x: item.x,
      y: item.y,
      vx: (Math.random() - 0.5) * 1.8,
      vy: -0.35 - Math.random() * 1.1,
      rotation: Math.random() * 180,
      spin: (Math.random() - 0.5) * 12,
      size: 5 + Math.random() * 6,
      color: colors[index % colors.length],
      life: 180 + Math.random() * 80,
    }))
    setParticles((current) => [...current, ...next])
  }

  const flyGarbage = (item, velocityX, velocityY) => {
    play('debris', { restart: true })
    let x = item.x
    let y = item.y
    const releaseSpeed = Math.hypot(velocityX || 0, velocityY || 0)
    const fallbackDirection = x > 30 ? 1 : -1
    let vx = Math.max(-0.72, Math.min(0.72, velocityX || fallbackDirection * 0.35))
    let vy = Math.max(-0.7, Math.min(0.7, velocityY || -0.12))
    let rotation = item.rotation
    const spin = (releaseSpeed > 0.1 ? releaseSpeed : 1) * (vx < 0 ? -1 : 1) * 4.5

    setGarbage((items) => items.map((entry) => entry.id === item.id ? { ...entry, status: 'flying' } : entry))
    const tick = () => {
      x += vx
      y += vy
      vx *= 0.992
      vy += 0.025
      rotation += spin
      if (x < -8 || x > 108 || y < -8 || y > 108) {
        spawnParticles({ ...item, x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) })
        setGarbage((items) => items.map((entry) => entry.id === item.id ? { ...entry, status: 'removed' } : entry))
        return
      }
      setGarbage((items) => items.map((entry) => entry.id === item.id ? { ...entry, x, y, rotation } : entry))
      window.requestAnimationFrame(tick)
    }
    window.requestAnimationFrame(tick)
  }

  const handleGarbageDown = (event, item) => {
    if (phase !== PHASE.CLEANING || item.status !== 'idle') return
    const rect = event.currentTarget.getBoundingClientRect()
    dragRef.current = { kind: 'garbage', id: item.id, offsetX: event.clientX - rect.left - rect.width / 2, offsetY: event.clientY - rect.top - rect.height / 2, lastX: event.clientX, lastY: event.clientY, lastTime: event.timeStamp, vx: 0, vy: 0 }
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const handleGarbageMove = (event) => {
    if (!dragRef.current || dragRef.current.kind !== 'garbage') return
    const drag = dragRef.current
    const now = event.timeStamp
    const dt = Math.max(8, now - drag.lastTime)
    drag.vx = ((event.clientX - drag.lastX) / window.innerWidth * 100) / (dt / 16)
    drag.vy = ((event.clientY - drag.lastY) / window.innerHeight * 100) / (dt / 16)
    drag.lastX = event.clientX
    drag.lastY = event.clientY
    drag.lastTime = now
    const x = Math.max(-5, Math.min(105, (event.clientX / window.innerWidth) * 100))
    const y = Math.max(-5, Math.min(105, (event.clientY / window.innerHeight) * 100))
    setGarbage((items) => items.map((item) => item.id === drag.id ? { ...item, x, y } : item))
    const outside = x < holeBounds.left || x > holeBounds.right || y < holeBounds.top || y > holeBounds.bottom
    if (outside) {
      dragRef.current = null
      flyGarbage({ ...garbageRef.current.find((item) => item.id === drag.id), x, y }, drag.vx, drag.vy)
    }
  }

  const handleGarbageLeave = () => {
    const drag = dragRef.current
    if (!drag || drag.kind !== 'garbage') return
    const item = garbageRef.current.find((entry) => entry.id === drag.id)
    if (!item) return
    const outside = item.x < holeBounds.left || item.x > holeBounds.right || item.y < holeBounds.top || item.y > holeBounds.bottom
    if (outside) handlePointerUp()
  }

  const handlePointerUp = () => {
    if (!dragRef.current) return
    const drag = dragRef.current
    dragRef.current = null
    if (drag.kind === 'garbage') {
      const item = garbageRef.current.find((entry) => entry.id === drag.id)
      if (!item) return
      const outside = item.x < holeBounds.left || item.x > holeBounds.right || item.y < holeBounds.top || item.y > holeBounds.bottom
      if (outside) flyGarbage(item, drag.vx, drag.vy)
      return
    }
    if (drag.kind === 'ceramic') {
      const distance = Math.hypot(mainPiece.x, mainPiece.y)
      if (distance < 7) {
        setMainPiece({ x: 0, y: 0, rotation: 0 })
        setPhase(PHASE.FINAL_REVEAL)
        window.setTimeout(() => setPhase(PHASE.COMPLETE), 1100)
      }
    }
  }

  const handleCeramicDown = (event) => {
    if (phase !== PHASE.PLACE_MAIN_CERAMIC) return
    dragRef.current = { kind: 'ceramic', startX: event.clientX, startY: event.clientY, originX: mainPiece.x, originY: mainPiece.y }
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const handleCeramicMove = (event) => {
    if (!dragRef.current || dragRef.current.kind !== 'ceramic') return
    const drag = dragRef.current
    setMainPiece((piece) => ({
      ...piece,
      x: drag.originX + ((event.clientX - drag.startX) / window.innerWidth) * 100,
      y: drag.originY + ((event.clientY - drag.startY) / window.innerHeight) * 100,
      rotation: Math.max(-14, Math.min(14, ((event.clientX - drag.startX) / window.innerWidth) * 18)),
    }))
  }

  const ceramicVisible = phaseAtLeast(phase, PHASE.CERAMIC_REVEAL)
  const finalVisible = phaseAtLeast(phase, PHASE.FINAL_REVEAL)
  const referenceScale = Math.max(viewport.width / 1536, viewport.height / 1024)
  const referenceOffsetX = (viewport.width - 1536 * referenceScale) / 2
  const referenceOffsetY = (viewport.height - 1024 * referenceScale) / 2
  const catTarget = {
    x: referenceOffsetX + 358 * referenceScale,
    y: referenceOffsetY + 483 * referenceScale,
  }
  const story = phase === PHASE.CLEANING ? STORY.cleaning : phase === PHASE.COMPLETE ? STORY.complete : phaseAtLeast(phase, PHASE.CERAMIC_REVEAL) ? STORY.reveal : STORY.cleaning

  return (
    <main
      className={`rock-scene rock-scene--${phase}`}
      onPointerMove={(event) => { handleGarbageMove(event); handleCeramicMove(event) }}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <img className="rock-scene__reference" src={phase === PHASE.COMPLETE ? FINAL_REFERENCE : BACKGROUND} alt="" aria-hidden="true" />

      {garbage.map((item, index) => item.status !== 'removed' && <img
        className={`rock-scene__garbage rock-scene__garbage--${item.type} ${item.status === 'fading' ? 'is-fading' : ''}`}
        key={item.id}
        src={GARBAGE_ASSETS[item.type]}
        alt=""
        draggable="false"
        style={{ left: `${item.x}%`, top: `${item.y}%`, zIndex: 5 + (index % 3), transform: `translate(-50%, -50%) rotate(${item.rotation}deg) scale(${item.scale})` }}
        onPointerDown={(event) => handleGarbageDown(event, item)}
        onPointerUp={handlePointerUp}
        onPointerLeave={handleGarbageLeave}
        onDragStart={(event) => event.preventDefault()}
      />)}

      {particles.map((particle) => <i
        className="rock-scene__particle"
        key={particle.id}
        style={{ left: `${particle.x}%`, top: `${particle.y}%`, width: particle.size, height: particle.size, opacity: Math.min(1, particle.life / 24), background: particle.color, transform: `translate(-50%, -50%) rotate(${particle.rotation}deg)` }}
      />)}

      {ceramicVisible && <>
        {!finalVisible && <div className="rock-scene__drop-guide" style={{ left: catTarget.x, top: catTarget.y }} aria-hidden="true" />}
        <div className={`rock-scene__ceramic rock-scene__ceramic--main ${phase === PHASE.PLACE_MAIN_CERAMIC ? 'is-draggable' : ''}`} style={{ left: catTarget.x, top: catTarget.y, '--piece-x': `${mainPiece.x}vw`, '--piece-y': `${mainPiece.y}vh`, '--piece-rotation': `${mainPiece.rotation}deg` }} onPointerDown={handleCeramicDown}>
          <img src={CERAMIC_ASSETS.main} alt="" />
        </div>
        <div className={`rock-scene__ceramic rock-scene__ceramic--face ${finalVisible ? 'is-visible' : ''}`}><img src={CERAMIC_ASSETS.face} alt="" /></div>
      </>}

      <section className="rock-scene__story" aria-live="polite">
        {story.map((line, index) => <p className={index === story.length - 1 && phase === PHASE.COMPLETE ? 'is-emphasis' : ''} key={line}>{line}</p>)}
      </section>
      {phase === PHASE.COMPLETE && <button className="rock-scene__next" type="button" onClick={() => { play('uiClick', { restart: true }); navigate('/placeholder/wall-drawing') }}>
        <span>Next</span><span aria-hidden="true">→</span>
      </button>}
    </main>
  )
}
