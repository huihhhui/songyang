import { Link, Navigate, Route, Routes, useParams, useSearchParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { getStations, getVillage, rightsLabels, sourceLabels, stations, ui, villages } from '../data/archive.js'
import { claims, reports } from '../data/reports.js'
import ToushiPresetLab from '../components/ToushiPresetLab.jsx'
import FlowerRopeReveal from '../components/FlowerRopeReveal.jsx'
import PaperStage from '../components/PaperStage.jsx'
import RockCeramicScene from '../components/RockCeramicScene.jsx'
import { useAudio } from '../audio/AudioProvider.jsx'
import { assetPath } from '../lib/assetPath.js'

function Status({ status }) { return <span className={`status status--${status}`}>{sourceLabels[status] || status}</span> }

function Header({ backTo, backLabel }) {
  const { muted, toggleMuted } = useAudio()
  return <header className="site-header"><Link className="wordmark" to="/"><strong>{ui.brand}</strong><small>{ui.subtitle}</small></Link>{backTo ? <Link className="back-link" to={backTo}>← {backLabel}</Link> : <button className="sound-button" type="button" aria-label={muted ? ui.unmute : ui.mute} onClick={toggleMuted}>{muted ? '静音' : '声场'}</button>}</header>
}

function Overview() {
  const covers = { yang: assetPath('ke/yj-01-couple-tree-detail-v13.png'), song: assetPath('ke/sz-01-peach-v8.png'), banqiao: assetPath('ke/bq-02-teacher-v10.png') }
  return <main className="app-shell"><Header /><section className="overview-intro"><p className="eyebrow">{ui.archiveLabel}</p><h1>{ui.overviewTitle}</h1><p>{ui.overviewIntro}</p></section><section className="village-grid" aria-label="三村档案入口">{villages.map((village) => <article className={`village-card village-card--${village.palette}`} key={village.id}><img src={covers[village.palette]} alt={`${village.name}观察素材`} /><div className="village-card__veil" /><div className="village-card__content"><div className="village-card__meta"><span>{village.index}</span><span>{village.englishName}</span></div><h2>{village.name}</h2><p>{village.intro}</p><footer><small>{village.stations.length} 个观察站</small><Link to={`/village/${village.id}`}>{ui.enterVillage} <span aria-hidden="true">↗</span></Link></footer></div></article>)}</section></main>
}

function VillageChapter() {
  // Keep the component compatible with both the dynamic archive links and the
  // dedicated Banqiao entry route. The latter intentionally has no path param.
  const { villageId: routeVillageId } = useParams(); const villageId = routeVillageId || 'banqiao'; const [searchParams] = useSearchParams(); const village = getVillage(villageId); if (!village) return <Navigate to="/" replace />
  const chapterStations = getStations(villageId)
  if (villageId === 'banqiao') {
    const initialStage = searchParams.get('stage') || 'weave'
    return <BanqiaoJourneyV2 key={initialStage} village={village} initialStage={initialStage} />
  }
  return <main className="app-shell chapter-shell"><Header backTo="/" backLabel={ui.returnOverview} /><section className={`chapter-hero chapter-hero--${village.palette}`}><p className="eyebrow">{village.index} / {ui.stationIndex}</p><h1>{village.name}</h1><p>{village.intro}</p></section><section className="station-index">{chapterStations.map((station, index) => <article className="station-row" key={station.id}><span className="station-number">{String(index + 1).padStart(2, '0')}</span><div><p className="eyebrow">{station.kicker}</p><h2>{station.title}</h2><p className="station-summary">{station.evidence?.description}</p></div><Link className="action-link" to={`/station/${station.id}`}>{ui.startStation} ↗</Link></article>)}</section></main>
}

function BanqiaoYarnPhysics({ needleY, dragging, bladeRef, phase, pushProgress }) {
  const baseCanvas = useRef(null)
  const weftCanvas = useRef(null)
  const liftedCanvas = useRef(null)
  const needleRef = useRef(needleY)
  const draggingRef = useRef(dragging)
  const phaseRef = useRef(phase)
  const pushRef = useRef(pushProgress)

  useEffect(() => { needleRef.current = needleY }, [needleY])
  useEffect(() => { draggingRef.current = dragging }, [dragging])
  useEffect(() => { phaseRef.current = phase }, [phase])
  useEffect(() => { pushRef.current = pushProgress }, [pushProgress])

  useEffect(() => {
    const base = baseCanvas.current
    const weftLayer = weftCanvas.current
    const lifted = liftedCanvas.current
    const baseCtx = base.getContext('2d')
    const weftCtx = weftLayer.getContext('2d')
    const liftedCtx = lifted.getContext('2d')
    const colors = ['ivory', 'indigo', 'indigo', 'red', 'ivory', 'indigo']
    const palette = {
      ivory: ['#ded2b9', '#fbf2d8'],
      indigo: ['#123f91', '#7fb0e9'],
      charcoal: ['#262a28', '#747a71'],
      red: ['#863629', '#c5775d'],
    }
    const yarns = Array.from({ length: 46 }, (_, index) => ({
      index,
      color: colors[index % colors.length],
      picked: false,
      stack: 0,
      points: Array.from({ length: 72 }, (_, point) => ({ point, y: 0, vy: 0, x: 0, vx: 0 })),
    }))
    let width = 0
    let height = 0
    let frame = 0
    let raf = 0
    let stackCount = 0
    let weftDrop = 0

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value))
    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      width = window.innerWidth
      height = window.innerHeight
      for (const canvas of [base, weftLayer, lifted]) {
        canvas.width = Math.round(width * dpr)
        canvas.height = Math.round(height * dpr)
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`
      }
      baseCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
      weftCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
      liftedCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
      yarns.forEach((yarn) => {
        const rest = height * (0.1 + yarn.index * 0.0176)
        yarn.points.forEach((point) => {
          point.y = rest
          point.vy = 0
          point.x = 0
          point.vx = 0
        })
      })
    }
    const drawYarn = (ctx, yarn, pickedLayer, contactLeft) => {
      const [main, light] = palette[yarn.color]
      ctx.save()
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.globalAlpha = pickedLayer ? 1 : 0.76
      ctx.beginPath()
      yarn.points.forEach((point, index) => {
        const x = (point.point / (yarn.points.length - 1)) * (width + 120) - 60 + point.x
        if (index === 0) ctx.moveTo(x, point.y)
        else {
          const previous = yarn.points[index - 1]
          const px = (previous.point / (yarn.points.length - 1)) * (width + 120) - 60 + previous.x
          ctx.quadraticCurveTo(px, previous.y, (px + x) / 2, (previous.y + point.y) / 2)
        }
      })
      ctx.strokeStyle = pickedLayer ? 'rgba(24, 24, 20, .26)' : 'rgba(24, 24, 20, .18)'
      ctx.lineWidth = 4.8
      ctx.stroke()
      ctx.globalAlpha = pickedLayer ? 0.98 : 0.82
      ctx.strokeStyle = main
      ctx.lineWidth = 3.2
      ctx.stroke()
      ctx.globalAlpha = pickedLayer ? 0.68 : 0.38
      ctx.strokeStyle = light
      ctx.lineWidth = 1
      ctx.translate(0, -1)
      ctx.stroke()
      ctx.restore()
    }
    const tick = () => {
      frame += 1
      baseCtx.clearRect(0, 0, width, height)
      liftedCtx.clearRect(0, 0, width, height)
      const needlePercent = clamp(needleRef.current, 14, 76)
      const currentPhase = phaseRef.current
      const push = pushRef.current
      const bladeBox = bladeRef.current?.getBoundingClientRect()
      const tipY = bladeBox ? bladeBox.top + bladeBox.height * 0.12 : height * ((needlePercent + 2.2) / 100)
      const bladeLeft = bladeBox ? bladeBox.left : clamp(width * 0.22, 120, 390)
      const bladeWidth = bladeBox ? bladeBox.width : clamp(width * 0.094, 112, 158)
      const contactLeft = bladeLeft + bladeWidth * 0.18
      const contactRight = bladeLeft + bladeWidth * 0.82
      const shoulder = Math.max(120, width * 0.12)

      yarns.forEach((yarn) => {
        const rest = height * (0.1 + yarn.index * 0.0176)
        if (draggingRef.current && yarn.color === 'indigo' && Math.abs(rest - tipY) < 32 && !yarn.picked) {
          yarn.picked = true
          yarn.stack = stackCount
          stackCount += 1
        }
        const pickedOffset = yarn.picked ? (yarn.stack % 5) * 2.1 : 0
        const lift = yarn.picked ? 9 + Math.floor(yarn.stack / 5) * 2.5 : 0
        yarn.points.forEach((point) => {
          const baseX = (point.point / (yarn.points.length - 1)) * (width + 120) - 60
          const x = baseX + point.x
          let profile = 0
          if (yarn.picked) {
            if (x >= contactLeft && x <= contactRight) profile = 1
            else {
              const distance = x < contactLeft ? contactLeft - x : x - contactRight
              profile = clamp(1 - distance / shoulder, 0, 1)
              profile = profile * profile * (3 - 2 * profile)
            }
          }
          const jitter = Math.sin(frame * 0.035 + yarn.index * 1.7 + point.point * 0.4) * 0.22
          const target = rest - lift * profile + pickedOffset * profile + jitter
          const pushStart = contactRight - 28
          const pushEnd = width * 0.78
          const pushWindow = baseX > pushStart && baseX < pushEnd ? clamp((baseX - pushStart) / Math.max(1, pushEnd - pushStart), 0, 1) : 0
          const targetX = currentPhase === 'push' ? push * 240 * (1 - pushWindow * 0.62) * (baseX > pushStart ? 1 : 0) : 0
          point.vy += (target - point.y) * 0.12
          point.vy *= 0.78
          point.y += point.vy
          point.vx += (targetX - point.x) * 0.09
          point.vx *= 0.72
          point.x += point.vx
        })
        drawYarn(yarn.picked ? liftedCtx : baseCtx, yarn, yarn.picked, contactLeft)
      })
      raf = window.requestAnimationFrame(tick)
    }

    resize()
    window.addEventListener('resize', resize)
    raf = window.requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('resize', resize)
      window.cancelAnimationFrame(raf)
    }
  }, [])

  return <>
    <canvas className="bq-yarn-canvas bq-yarn-canvas--base" ref={baseCanvas} aria-hidden="true" />
    <canvas className="bq-yarn-canvas bq-yarn-canvas--lifted" ref={liftedCanvas} aria-hidden="true" />
  </>
}

function BanqiaoJourney() {
  const [needleY, setNeedleY] = useState(82)
  const [isDragging, setIsDragging] = useState(false)
  const [phase, setPhase] = useState('pick')
  const [pushProgress, setPushProgress] = useState(0)
  const [bandShiftProgress, setBandShiftProgress] = useState(0)
  const dragging = useRef(false)
  const bladeRef = useRef(null)
  useEffect(() => {
    if (phase !== 'weft') return undefined
    const timer = window.setTimeout(() => setPhase('push'), 850)
    return () => window.clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (pushProgress <= 0.96) {
      setBandShiftProgress(0)
      return undefined
    }
    const pause = window.setTimeout(() => setBandShiftProgress(1), 520)
    return () => window.clearTimeout(pause)
  }, [pushProgress])
  const startPull = (event) => {
    dragging.current = true
    setIsDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
    movePull(event)
  }
  const movePull = (event) => {
    if (!dragging.current) return
    if (phase === 'push') {
      const nextPush = (event.clientX - window.innerWidth * 0.28) / (window.innerWidth * 0.46)
      setPushProgress(Math.max(0, Math.min(1, nextPush)))
      return
    }
    const nextY = (event.clientY / window.innerHeight) * 100
    const clampedY = Math.max(8, Math.min(84, nextY))
    setNeedleY(clampedY)
    if (clampedY < 14) setPhase('weft')
  }
  const stopPull = () => {
    dragging.current = false
    setIsDragging(false)
  }
  return <main className="banqiao-play banqiao-play--mechanic" onPointerMove={movePull} onPointerUp={stopPull} onPointerCancel={stopPull}>
    <img className="bq-mechanic-base" src={assetPath('imagegen/banqiao-assets/banqiao-weave-background-v1.png')} alt="纸张与织物肌理背景" />
    <img className="bq-woven-target" src={assetPath('imagegen/banqiao-assets/banqiao-woven-target-photo-v3.png')} alt="已编织完成的畲族布带图案" />
    <BanqiaoYarnPhysics needleY={needleY} dragging={isDragging} bladeRef={bladeRef} phase={phase} pushProgress={pushProgress} />
    {phase !== 'pick' && <span className="bq-weft-line" style={{ '--push-x': `${pushProgress * 45}vw` }} aria-hidden="true" />}
    <button ref={bladeRef} className={`bq-shuttle bq-shuttle--mechanic bq-shuttle--${phase}`} type="button" aria-label="拖动竹片挑起纱线" onPointerDown={startPull} style={{ '--needle-y': `${needleY}%`, '--push-x': `${pushProgress * 45}vw` }} />
    <p className="bq-mechanic-hint">拖动竹片，挑起同色纱线</p>
  </main>
}

function LegacyBanqiaoJourney() {
  const [scene, setScene] = useState('hands')
  const [pull, setPull] = useState(0)
  const dragging = useRef(false)

  const startPull = (event) => {
    dragging.current = true
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const movePull = (event) => {
    if (!dragging.current || scene !== 'hands') return
    const progress = Math.max(0, Math.min(1, (event.clientX - window.innerWidth * 0.13) / (window.innerWidth * 0.54)))
    setPull(progress)
    if (progress > 0.84) {
      dragging.current = false
      setScene('tool')
    }
  }

  return <main className={`banqiao-play banqiao-play--${scene}`} onPointerMove={movePull}>
    <div className="bq-scene bq-scene--hands" aria-hidden={scene !== 'hands'} style={{ '--quote-two': Math.max(0, Math.min(1, (pull - 0.36) * 2.4)) }}>
      <img className="bq-photo bq-photo--lesson" src={assetPath('source/banqiao/teacher-weaving.jpg')} alt="兰老师指导队员编织畲族布带" />
      <div className="bq-photo-slice bq-photo-slice--warp" style={{ '--pull': pull }} />
      <div className="bq-photo-slice bq-photo-slice--wood" />
      <div className="bq-quote bq-quote--first"><p>“以前每家的女孩，妈妈都要教女孩子织带子。”</p><small>兰炳花老师现场讲述整理</small></div>
      <div className="bq-quote bq-quote--second"><p>“有些拿来当围裙，有些拿来绑裤腰带。”</p><small>兰炳花老师现场讲述整理</small></div>
      <button className="bq-shuttle" type="button" aria-label="拖动木梭拉开经线" onPointerDown={startPull} onPointerUp={() => { dragging.current = false }} style={{ '--pull': pull }}><span /></button>
      <p className="bq-whisper" style={{ opacity: 1 - pull }}>按住梭子，向右拉开</p>
    </div>
    <div className="bq-scene bq-scene--tool" aria-hidden={scene !== 'tool'} onClick={() => setScene('ribbon')}>
      <img className="bq-photo bq-photo--tool" src={assetPath('source/banqiao/weaving-tools.jpg')} alt="制作畲族布带的工具" />
      <div className="bq-tool-copy"><p>线被拉起，工具才显出它的尺度。</p><p>兰老师讲，长一些、短一些，都可以依着用途调整。</p><small>点击布带，继续</small></div>
      <span className="bq-line bq-line--one" /><span className="bq-line bq-line--two" /><span className="bq-line bq-line--three" />
    </div>
    <div className="bq-scene bq-scene--ribbon" aria-hidden={scene !== 'ribbon'} onClick={() => setScene('voice')}>
      <img className="bq-photo bq-photo--ribbon" src={assetPath('source/banqiao/ribbons.jpg')} alt="桌上的畲族布带" />
      <div className="bq-ribbon-quote"><p>“这种最漂亮的花纹，以前拿来当定情物。”</p><small>兰炳花老师现场讲述整理</small></div>
      <p className="bq-whisper bq-whisper--ribbon">触碰布带，听她继续讲</p>
    </div>
    <div className="bq-scene bq-scene--voice" aria-hidden={scene !== 'voice'} onClick={() => setScene('hands')}>
      <img className="bq-photo bq-photo--teacher" src={assetPath('ke/bq-02-teacher-v10.png')} alt="兰老师讲述畲歌与编织" />
      <div className="bq-voice-copy"><p>她后来主要传承畲歌、畲语，也从学校教学讲到孩子们外出演出的期待。</p><p>“真的要失传了。”</p><small>兰炳花老师现场讲述整理。点击回到织带。</small></div>
    </div>
  </main>
}

function BanqiaoYarnPhysicsV2({ needleY, dragging, bladeRef, phase, pushProgress, active = true, stageRef }) {
  const baseCanvas = useRef(null)
  const weftCanvas = useRef(null)
  const liftedCanvas = useRef(null)
  const needleRef = useRef(needleY)
  const draggingRef = useRef(dragging)
  const phaseRef = useRef(phase)
  const pushRef = useRef(pushProgress)
  const activeRef = useRef(active)

  useEffect(() => { needleRef.current = needleY }, [needleY])
  useEffect(() => { draggingRef.current = dragging }, [dragging])
  useEffect(() => { phaseRef.current = phase }, [phase])
  useEffect(() => { pushRef.current = pushProgress }, [pushProgress])
  useEffect(() => { activeRef.current = active }, [active])

  useEffect(() => {
    const base = baseCanvas.current
    const weftLayer = weftCanvas.current
    const lifted = liftedCanvas.current
    const baseCtx = base.getContext('2d')
    const weftCtx = weftLayer.getContext('2d')
    const liftedCtx = lifted.getContext('2d')
    const palette = {
      ivory: ['#d1c2a4', '#f2e3c7'],
      blue: ['#245c96', '#7fa5c8'],
      red: ['#914136', '#bf8071'],
    }
    const lineRefs = [
      { y: 0.326, color: 'ivory', thickness: 3.0, sag: 10.8, endBias: -18 },
      { y: 0.347, color: 'ivory', thickness: 3.0, sag: 10.2, endBias: -14 },
      { y: 0.369, color: 'ivory', thickness: 3.1, sag: 9.4, endBias: -9 },
      { y: 0.389, color: 'ivory', thickness: 3.1, sag: 8.7, endBias: -5 },
      { y: 0.413, color: 'red', thickness: 2.9, sag: 6.6, endBias: -2 },
      { y: 0.444, color: 'blue', thickness: 3.8, sag: 6.4, endBias: 0 },
      { y: 0.472, color: 'blue', thickness: 3.9, sag: 5.8, endBias: 1 },
      { y: 0.506, color: 'ivory', thickness: 3.0, sag: 5.4, endBias: 2 },
      { y: 0.535, color: 'ivory', thickness: 3.0, sag: 5.2, endBias: 2 },
      { y: 0.575, color: 'blue', thickness: 3.7, sag: 6.3, endBias: 1 },
      { y: 0.624, color: 'blue', thickness: 3.8, sag: 7.2, endBias: -3 },
      { y: 0.655, color: 'blue', thickness: 3.4, sag: 8.4, endBias: -7 },
      { y: 0.691, color: 'red', thickness: 2.9, sag: 9.8, endBias: -12 },
      { y: 0.728, color: 'ivory', thickness: 3.0, sag: 11.2, endBias: -18 },
    ]
    const yarns = lineRefs.map((line, index) => ({
      index,
      color: line.color,
      yNorm: line.y,
      thickness: line.thickness,
      sag: line.sag,
      endBias: line.endBias,
      picked: false,
      stack: 0,
      points: Array.from({ length: 82 }, (_, point) => ({ point, y: 0, vy: 0, x: 0, vx: 0 })),
    }))
    const weft = Array.from({ length: 46 }, (_, index) => ({ index, x: 0, y: 0, vx: 0, vy: 0, slack: Math.sin(index * 0.58) * 12 }))
    let width = 0
    let height = 0
    let frame = 0
    let raf = 0
    let stackCount = 0
    let weftDrop = 0

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value))
    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const frame = stageRef?.current?.getBoundingClientRect()
      width = frame?.width || window.innerWidth
      height = frame?.height || window.innerHeight
      for (const canvas of [base, weftLayer, lifted]) {
        canvas.width = Math.round(width * dpr)
        canvas.height = Math.round(height * dpr)
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`
      }
      baseCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
      weftCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
      liftedCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
      yarns.forEach((yarn) => {
        const rest = height * yarn.yNorm
        yarn.points.forEach((point) => {
          point.y = rest
          point.vy = 0
          point.x = 0
          point.vx = 0
        })
      })
      weft.forEach((point) => {
        point.x = width * 0.52
        point.y = (point.index / (weft.length - 1)) * (height + 100) - 50
      })
    }
    const makePath = (ctx, points, getX, getY) => {
      ctx.beginPath()
      points.forEach((point, index) => {
        const x = getX(point)
        const y = getY(point)
        if (index === 0) ctx.moveTo(x, y)
        else {
          const previous = points[index - 1]
          const px = getX(previous)
          const py = getY(previous)
          ctx.quadraticCurveTo(px, py, (px + x) / 2, (py + y) / 2)
        }
      })
    }
    const strokeSoftLine = (ctx, path, color, light, widthMain, alpha = 1) => {
      ctx.save()
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.globalAlpha = alpha
      ctx.strokeStyle = 'rgba(31, 29, 23, .18)'
      ctx.lineWidth = widthMain + 3.5
      path()
      ctx.stroke()
      ctx.strokeStyle = color
      ctx.lineWidth = widthMain
      path()
      ctx.stroke()
      ctx.globalAlpha = alpha * 0.48
      ctx.strokeStyle = light
      ctx.lineWidth = Math.max(0.8, widthMain * 0.28)
      ctx.translate(0, -1)
      path()
      ctx.stroke()
      ctx.restore()
    }
    const getThreadX = (yarn, point, contactX) => {
      const t = point.point / (yarn.points.length - 1)
      const eased = t * t * (3 - 2 * t)
      const threadStartX = -82 - yarn.index * 1.2
      const threadEndX = contactX + yarn.endBias
      return threadStartX + (threadEndX - threadStartX) * eased + point.x
    }
    const drawYarn = (ctx, yarn, pickedLayer, contactX, clipRange = null, cutoffX = null, rightCutoffX = null, fade = 0) => {
      const [main, light] = palette[yarn.color]
      const visibility = Math.max(0, 1 - fade)
      if (visibility <= 0.01) return
      const path = () => makePath(
        ctx,
        yarn.points,
        (point) => {
          const x = getThreadX(yarn, point, contactX)
          const t = point.point / (yarn.points.length - 1)
          const gather = clamp((t - 0.82) / 0.18, 0, 1)
          return x + (1 - gather) * (yarn.index % 2 === 0 ? -2.2 : 1.6)
        },
        (point) => point.y + Math.sin((point.point / (yarn.points.length - 1)) * Math.PI) * yarn.sag,
      )
      ctx.save()
      if (clipRange) {
        ctx.beginPath()
        ctx.rect(clipRange.left ?? 0, 0, (clipRange.right ?? width) - (clipRange.left ?? 0), height)
        ctx.clip()
      }
      if (cutoffX != null) {
        ctx.beginPath()
        ctx.rect(0, 0, cutoffX, height)
        ctx.clip()
      }
      if (rightCutoffX != null) {
        ctx.beginPath()
        ctx.rect(0, 0, rightCutoffX, height)
        ctx.clip()
      }
      strokeSoftLine(ctx, path, main, light, pickedLayer ? yarn.thickness + 0.95 : yarn.thickness, (pickedLayer ? 0.98 : 0.82) * visibility)
      ctx.save()
      ctx.globalAlpha = (pickedLayer ? 0.22 : 0.12) * visibility
      ctx.strokeStyle = light
      ctx.lineWidth = pickedLayer ? 0.95 : 0.75
      for (let hair = 0; hair < (pickedLayer ? 16 : 10); hair += 1) {
        ctx.beginPath()
        yarn.points.forEach((point, index) => {
          if (index % 6 !== hair % 6) return
          const baseX = getThreadX(yarn, point, contactX)
          const t = point.point / (yarn.points.length - 1)
          const gather = clamp((t - 0.82) / 0.18, 0, 1)
          const x = baseX + (1 - gather) * (yarn.index % 2 === 0 ? -2.2 : 1.6)
          const fuzz = Math.sin(frame * 0.02 + yarn.index + point.point + hair) * (pickedLayer ? 3.8 : 2.8)
          const drift = Math.cos(frame * 0.015 + hair * 0.7 + point.point * 0.2) * (pickedLayer ? 1.2 : 0.8)
          ctx.moveTo(x - 3 + drift, point.y + fuzz)
          ctx.lineTo(x + 3 + drift, point.y - fuzz)
        })
        ctx.stroke()
      }
      ctx.restore()
      ctx.restore()
    }
    const drawWovenTarget = (ctx, push) => {
      const left = width * 0.5
      const top = height * 0.31
      const bandWidth = width * 0.47
      const bandHeight = height * 0.28
      ctx.save()
      ctx.translate(left - push * width * 0.03, top)
      ctx.globalAlpha = 0.08 + push * 0.9
      ctx.fillStyle = 'rgba(255, 252, 240, .72)'
      ctx.fillRect(0, 0, bandWidth, bandHeight)
      ctx.strokeStyle = '#18216f'
      ctx.lineWidth = 6
      ctx.beginPath()
      ctx.moveTo(0, bandHeight * 0.13)
      ctx.lineTo(bandWidth, bandHeight * 0.13)
      ctx.moveTo(0, bandHeight * 0.87)
      ctx.lineTo(bandWidth, bandHeight * 0.87)
      ctx.stroke()
      ctx.strokeStyle = '#a72d32'
      ctx.lineWidth = 3
      for (let i = 0; i < 58; i += 1) {
        const x = (i / 57) * bandWidth
        for (const y of [bandHeight * 0.04, bandHeight * 0.96]) {
          ctx.beginPath()
          ctx.moveTo(x - 5, y - 5)
          ctx.lineTo(x + 5, y + 5)
          ctx.moveTo(x + 5, y - 5)
          ctx.lineTo(x - 5, y + 5)
          ctx.stroke()
        }
      }
      const units = [
        { x: 0.06, w: 0.14, type: 'hook' },
        { x: 0.24, w: 0.12, type: 'mesh' },
        { x: 0.41, w: 0.14, type: 'hook' },
        { x: 0.6, w: 0.12, type: 'stripe' },
        { x: 0.77, w: 0.14, type: 'mesh' },
      ]
      ctx.fillStyle = '#155a9a'
      ctx.strokeStyle = '#155a9a'
      units.forEach((unit) => {
        const x = bandWidth * unit.x
        const w = bandWidth * unit.w
        const y = bandHeight * 0.2
        const h = bandHeight * 0.6
        if (unit.type === 'mesh') {
          ctx.save()
          ctx.beginPath()
          ctx.rect(x, y, w, h)
          ctx.clip()
          ctx.lineWidth = 4
          for (let i = -8; i < w + h; i += 15) {
            ctx.beginPath()
            ctx.moveTo(x + i, y)
            ctx.lineTo(x + i - h, y + h)
            ctx.moveTo(x + i, y + h)
            ctx.lineTo(x + i - h, y)
            ctx.stroke()
          }
          ctx.restore()
        } else if (unit.type === 'stripe') {
          ctx.lineWidth = 7
          for (let i = 0; i < 5; i += 1) {
            ctx.beginPath()
            ctx.moveTo(x + i * w * 0.18, y)
            ctx.lineTo(x + w * 0.42 + i * w * 0.18, y + h)
            ctx.stroke()
          }
        } else {
          ctx.lineWidth = 9
          ctx.beginPath()
          ctx.moveTo(x, y + h)
          ctx.lineTo(x + w * 0.48, y)
          ctx.lineTo(x + w, y + h)
          ctx.moveTo(x + w * 0.22, y + h * 0.5)
          ctx.lineTo(x + w * 0.56, y + h * 0.82)
          ctx.lineTo(x + w * 0.78, y + h * 0.38)
          ctx.stroke()
        }
      })
      ctx.restore()
    }
    const drawWeft = (ctx, bladeRight, push) => {
      if (phaseRef.current === 'pick') return
      if (phaseRef.current === 'push' && push >= 0.94) return
      const tension = phaseRef.current === 'push' ? push : 0
      const targetX = bladeRight - 2
      weft.forEach((point) => {
        const t = point.index / (weft.length - 1)
        const y = t * (height + 100) - 50 - (1 - weftDrop) * height * 1.15
        const slack = Math.sin(t * Math.PI * 3 + frame * 0.012) * (30 * (1 - tension)) + point.slack * (1 - tension)
        const bend = Math.exp(-Math.pow((y - height * 0.5) / (height * 0.32), 2)) * (46 * (1 - tension))
        const desiredX = targetX + slack + bend
        point.vx += (desiredX - point.x) * (0.055 + tension * 0.045)
        point.vx *= 0.64 - tension * 0.06
        point.x += point.vx
        point.vy += (y - point.y) * 0.075
        point.vy *= 0.58
        point.y += point.vy
      })
      const path = () => makePath(ctx, weft, (point) => point.x, (point) => point.y)
      strokeSoftLine(ctx, path, '#d9cdae', '#fff2d4', 4.8, 0.92)
      ctx.save()
      ctx.globalAlpha = 0.28
      ctx.strokeStyle = '#113f91'
      ctx.lineWidth = 0.7
      path()
      ctx.stroke()
      ctx.restore()
    }
    const tick = () => {
      if (!activeRef.current) {
        raf = 0
        return
      }
      frame += 1
      baseCtx.clearRect(0, 0, width, height)
      weftCtx.clearRect(0, 0, width, height)
      liftedCtx.clearRect(0, 0, width, height)
      const currentPhase = phaseRef.current
      const push = pushRef.current
      weftDrop += ((currentPhase === 'pick' ? 0 : 1) - weftDrop) * 0.032
      const bladeBox = bladeRef.current?.getBoundingClientRect()
      const seamX = width * 0.52
      const tipY = bladeBox ? bladeBox.top + bladeBox.height * 0.105 : height * ((needleRef.current + 2.2) / 100)
      const bladeLeft = bladeBox ? bladeBox.left : width * 0.1
      const bladeWidth = bladeBox ? bladeBox.width : clamp(width * 0.12, 152, 220)
      const contactRight = Math.min(bladeLeft + bladeWidth * 0.93, seamX)
      const contactLeft = Math.max(bladeLeft + bladeWidth * 0.28, contactRight - bladeWidth * 0.12)
      const bambooLeft = bladeLeft
      const bambooRight = bladeLeft + bladeWidth
      const shoulder = Math.max(128, width * 0.13)

      yarns.forEach((yarn) => {
        const rest = height * yarn.yNorm
        if (
          yarn.color === 'blue'
          && !yarn.picked
          && (
            (draggingRef.current && rest > tipY && rest < height * 0.84)
            || currentPhase !== 'pick'
          )
        ) {
          yarn.picked = true
          yarn.stack = stackCount
          stackCount += 1
        }
        const pickedOffset = yarn.picked ? (yarn.stack % 6) * 2.4 : 0
        const lift = yarn.picked ? 12 + Math.floor(yarn.stack / 5) * 2.8 : 0
        yarn.points.forEach((point) => {
          const baseX = getThreadX(yarn, { ...point, x: 0 }, seamX)
          const x = getThreadX(yarn, point, seamX)
          let profile = 0
          if (yarn.picked) {
            if (x >= contactLeft && x <= contactRight) profile = 1
            else {
              const distance = x < contactLeft ? contactLeft - x : x - contactRight
              profile = clamp(1 - distance / shoulder, 0, 1)
              profile = profile * profile * (3 - 2 * profile)
            }
          }
          const jitter = Math.sin(frame * 0.035 + yarn.index * 1.7 + point.point * 0.4) * 0.28
          const target = rest - lift * profile + pickedOffset * profile + jitter
          const pushStart = contactLeft - 24
          const pushEnd = seamX + 6
          const pushWindow = baseX > pushStart && baseX < pushEnd ? clamp((baseX - pushStart) / Math.max(1, pushEnd - pushStart), 0, 1) : 0
          const compression = Math.sin(pushWindow * Math.PI)
          const targetX = currentPhase === 'push' ? push * (26 + compression * 18) * pushWindow : 0
          point.vy += (target - point.y) * 0.12
          point.vy *= 0.78
          point.y += point.vy
          point.vx += (targetX - point.x) * 0.09
          point.vx *= 0.72
          point.x += point.vx
        })
        if (yarn.picked) {
          drawYarn(liftedCtx, yarn, true, seamX)
        } else {
          drawYarn(baseCtx, yarn, false, seamX)
        }
      })
      drawWeft(weftCtx, contactRight, push)
      raf = window.requestAnimationFrame(tick)
    }

    resize()
    window.addEventListener('resize', resize)
    raf = window.requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('resize', resize)
      window.cancelAnimationFrame(raf)
    }
  }, [stageRef])

  return <>
    <canvas className="bq-yarn-canvas bq-yarn-canvas--base" ref={baseCanvas} aria-hidden="true" />
    <canvas className="bq-yarn-canvas bq-yarn-canvas--weft" ref={weftCanvas} aria-hidden="true" />
    <canvas className="bq-yarn-canvas bq-yarn-canvas--lifted" ref={liftedCanvas} aria-hidden="true" />
  </>
}

function BanqiaoJourneyV2({ initialStage }) {
  const { play, stop } = useAudio()
  const [needleY, setNeedleY] = useState(44)
  const [isDragging, setIsDragging] = useState(false)
  const [phase, setPhase] = useState('pick')
  const [pushProgress, setPushProgress] = useState(0)
  const [bandShiftProgress, setBandShiftProgress] = useState(0)
  const [journeyStage, setJourneyStage] = useState(initialStage === 'bee' ? 'bee' : 'weave')
  const dragging = useRef(false)
  const bladeRef = useRef(null)
  const stageRef = useRef(null)

  useEffect(() => {
    const critical = [
      'imagegen/banqiao-assets/banqiao-bamboo-strip-v1-alpha-trim.png',
      'imagegen/banqiao-assets/mid-lines-web.png',
      'imagegen/banqiao-assets/right-band-web.png',
    ]
    const images = critical.map((path) => {
      const image = new Image()
      image.decoding = 'async'
      image.src = assetPath(path)
      return image
    })
    return () => images.forEach((image) => { image.src = '' })
  }, [])

  useEffect(() => {
    if (phase !== 'weft') return undefined
    play('lineLift', { restart: true })
    const timer = window.setTimeout(() => setPhase('push'), 850)
    return () => window.clearTimeout(timer)
  }, [phase, play])

  useEffect(() => {
    if (pushProgress <= 0.96) {
      setBandShiftProgress(0)
      return undefined
    }
    const pause = window.setTimeout(() => setBandShiftProgress(1), 520)
    return () => window.clearTimeout(pause)
  }, [pushProgress])

  useEffect(() => {
    if (bandShiftProgress > 0.98) setJourneyStage('handoff')
  }, [bandShiftProgress])

  const startPull = (event) => {
    dragging.current = true
    setIsDragging(true)
    play('lineSlide', { loop: true, restart: true })
    event.currentTarget.setPointerCapture(event.pointerId)
    movePull(event)
  }

  const movePull = (event) => {
    if (!dragging.current) return
    const stage = stageRef.current?.getBoundingClientRect()
    const stageX = stage ? event.clientX - stage.left : event.clientX
    const stageY = stage ? event.clientY - stage.top : event.clientY
    const stageWidth = stage?.width || window.innerWidth
    const stageHeight = stage?.height || window.innerHeight
    if (phase === 'push') {
      const nextPush = (stageX - stageWidth * 0.1) / (stageWidth * 0.42)
      setPushProgress(Math.max(0, Math.min(1, nextPush)))
      return
    }
    const nextY = (stageY / stageHeight) * 100
    const clampedY = Math.max(5, Math.min(92, nextY))
    setNeedleY(clampedY)
    if (clampedY < 13) setPhase('weft')
  }

  const stopPull = () => {
    dragging.current = false
    setIsDragging(false)
    stop('lineSlide')
  }

  const hint = phase === 'pick'
    ? '\u5411\u4e0a\u62d6\u52a8\u7af9\u7247\uff0c\u7528\u5c16\u7aef\u6311\u8d77\u84dd\u8272\u7eb1\u7ebf'
    : phase === 'weft'
      ? '\u7ad6\u7ebf\u4ece\u4e0a\u65b9\u7a7f\u5165\uff0c\u8d34\u8fd1\u7af9\u7247\u843d\u5230\u7ecf\u7ebf\u4e4b\u95f4'
      : '\u5411\u53f3\u63a8\u52a8\u7af9\u7247\uff0c\u628a\u677e\u6563\u7eb1\u7ebf\u538b\u7d27\u6210\u5e03\u5e26'

  const completed = bandShiftProgress > 0.98
  const materialSwap = pushProgress > 0.84

  if (journeyStage === 'materials') {
    return <BanqiaoMaterialsScene onContinue={() => setJourneyStage('bee')} />
  }
  if (journeyStage === 'bee') {
    return <BanqiaoBeeScene />
  }

  return <main ref={stageRef}
    className={`banqiao-play banqiao-play--mechanic banqiao-play--mechanic-v2 ${materialSwap ? 'banqiao-play--material-swap' : ''} ${completed ? 'banqiao-play--complete' : ''} ${journeyStage === 'handoff' ? 'banqiao-play--handoff' : ''}`}
    onPointerMove={movePull}
    onPointerUp={stopPull}
    onPointerCancel={stopPull}
    style={{ '--camera-x': '0vw', '--scene-x': '0vw', '--stage-shift': '0vw', '--push-x-max': '36vw' }}
  >
    <div className="bq-mechanic-base" aria-hidden="true" />
    <video className="bq-ribbon-preload" src={assetPath('imagegen/banqiao-assets/2-web.mp4')} preload="auto" muted playsInline aria-hidden="true" />
    <img className="bq-link-mid" src={assetPath('imagegen/banqiao-assets/mid-lines-web.png')} alt="" aria-hidden="true" decoding="async" />
    <img className="bq-right-band-custom" src={assetPath('imagegen/banqiao-assets/right-band-web.png')} alt="" aria-hidden="true" decoding="async" />
    <BanqiaoYarnPhysicsV2 needleY={needleY} dragging={isDragging} bladeRef={bladeRef} phase={phase} pushProgress={pushProgress} active={journeyStage !== 'handoff'} stageRef={stageRef} />
    <button
      ref={bladeRef}
      className={`bq-shuttle bq-shuttle--mechanic bq-shuttle--${phase}`}
      type="button"
      aria-label="\u62d6\u52a8\u7af9\u7247\u6311\u8d77\u7eb1\u7ebf"
      onPointerDown={startPull}
      style={{ '--needle-y': `${needleY}%`, '--push-x': `${pushProgress * 36}%` }}
    />
    <p className="bq-mechanic-hint">{hint}</p>
    {journeyStage === 'handoff' && <BanqiaoRibbonHandoff onContinue={() => setJourneyStage('bee')} />}
  </main>
}

function SourceFold({ stationId }) {
  const stationClaims = claims.filter((claim) => claim.stationId === stationId); if (!stationClaims.length) return null
  return <section className="source-fold"><p className="eyebrow">研究档案 / 来源</p>{stationClaims.map((claim) => { const report = reports.find((item) => item.id === claim.reportId); return <article className="claim-card" key={claim.id}><div className="claim-card__meta"><Status status={claim.sourceStatus} /><span>{claim.attribution}</span></div><p>{claim.body}</p><small>{report?.title} / {claim.sectionRef}</small>{report?.limitation && <small className="claim-card__limitation">{report.limitation}</small>}</article> })}</section>
}

function BanqiaoRibbonHandoff({ onContinue }) {
  const videoRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [tailReady, setTailReady] = useState(false)
  const [ended, setEnded] = useState(false)
  const handleReady = () => {
    setReady(true)
    videoRef.current?.play().catch(() => setEnded(true))
  }
  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (video?.duration) setTailReady(video.currentTime >= video.duration - 2.4)
  }
  const handoffLead = '\u624b\u6307\u628a\u7ebf\u4e00\u6839\u6839\u62e8\u5f00\uff0c\u627e\u51fa\u5b83\u4eec\u5e94\u8be5\u7ecf\u8fc7\u7684\u4f4d\u7f6e\u3002\u7af9\u7247\u6311\u8d77\u5176\u4e2d\u51e0\u6839\uff0c\u65b0\u7684\u7ebf\u4ece\u7f1d\u9699\u91cc\u7a7f\u8fc7\u53bb\uff0c\u518d\u88ab\u63a8\u7d27\u3002'
  const handoffNotes = [
    '\u6211\u4eec\u540e\u6765\u624d\u660e\u767d\uff0c\u5f69\u5e26\u4e0d\u53ea\u662f\u989c\u8272\u548c\u56fe\u6848\u7684\u7ec4\u5408\u3002\u5b83\u628a\u505a\u4e1c\u897f\u7684\u624b\u3001\u4f7f\u7528\u5b83\u7684\u4eba\uff0c\u4ee5\u53ca\u4e00\u6bb5\u88ab\u8bb0\u4f4f\u7684\u5173\u7cfb\uff0c\u653e\u5728\u4e86\u540c\u4e00\u6761\u7ebf\u4e0a\u3002',
    '\u5170\u8001\u5e08\u8bb2\u5230\uff0c\u5f69\u5e26\u53ef\u4ee5\u8fdb\u5165\u604b\u7231\u548c\u5a5a\u5ac1\u7684\u8bb0\u5fc6\uff0c\u4e5f\u53ef\u4ee5\u6210\u4e3a\u5f7c\u6b64\u8d60\u9001\u7684\u4fe1\u7269\u3002\u5b83\u5728\u88ab\u4f7f\u7528\u3001\u88ab\u8d60\u9001\u3001\u88ab\u91cd\u65b0\u8bb2\u8d77\u65f6\u7ee7\u7eed\u5b58\u5728\u3002',
    '\u5979\u4e5f\u8bb2\u5230\u7572\u6b4c\uff1a\u6b4c\u5728\u5bf9\u5531\u4e2d\u8ba9\u4eba\u5f7c\u6b64\u4e86\u89e3\uff0c\u4e5f\u5728\u5b66\u6821\u548c\u6d3b\u52a8\u91cc\u88ab\u91cd\u65b0\u6559\u7ed9\u4e0b\u4e00\u4ee3\u3002'
  ]
  return <section className={`banqiao-ribbon-handoff ${ready ? 'is-ready' : ''} ${tailReady ? 'is-tail-ready' : ''} ${ended ? 'is-ended' : ''}`} aria-label="布带转场">
    <video
      ref={videoRef}
      className="banqiao-ribbon-handoff__video"
      src={assetPath('imagegen/banqiao-assets/2-web.mp4')}
      muted
      playsInline
      preload="auto"
      onCanPlay={handleReady}
      onTimeUpdate={handleTimeUpdate}
      onEnded={() => setEnded(true)}
      onError={() => setEnded(true)}
    />
    <div className="banqiao-ribbon-handoff__copy" aria-hidden="true">
      <p className="banqiao-ribbon-handoff__eyebrow">板桥畲族乡 / 编织现场</p>
      <p className="banqiao-ribbon-handoff__title">彩带不只是颜色和图案的组合</p>
      <p className="banqiao-ribbon-handoff__body">手指把线一根根拨开，找出它们应该经过的位置。竹片挑起其中几根，新的线从缝隙里穿过去，再被推紧。它把做东西的手、使用它的人，以及一段被记住的关系，放在了同一条线上。</p>
      <p className="banqiao-ribbon-handoff__lead">{handoffLead}</p>
      <div className="banqiao-ribbon-handoff__notes">
        {handoffNotes.map((note, index) => <p key={index}>{note}</p>)}
      </div>
    </div>
    {ended && <div className="banqiao-ribbon-handoff__tail-action">
      <p>线还在继续</p>
      <button type="button" onClick={onContinue}>继续听她讲</button>
    </div>}
  </section>
}

function BanqiaoMaterialsScene({ onContinue }) {
  const copy = banqiaoKeCopy['banqiao-materials']
  return <main className="banqiao-flow-screen banqiao-flow-screen--materials">
    <img className="banqiao-flow-screen__image" src={copy.image} alt={copy.alt} />
    <div className="banqiao-flow-screen__wash" aria-hidden="true" />
    <section className="banqiao-flow-screen__content banqiao-flow-screen__content--copy">
      <p className="banqiao-copy-page__index">板桥畲族乡 / 观察站 02</p>
      <h1>{copy.title}</h1>
      <div className="banqiao-copy-page__body">
        {copy.paragraphs.map((paragraph, index) => <p key={paragraph} style={{ '--copy-delay': `${index * 120}ms` }}>{paragraph}</p>)}
      </div>
      <button className="banqiao-flow-screen__continue" type="button" onClick={onContinue}>继续</button>
    </section>
  </main>
}

function BanqiaoBeeScene() {
  const [videoEnded, setVideoEnded] = useState(false)
  return <main className={`banqiao-flow-screen banqiao-flow-screen--bee ${videoEnded ? 'is-video-ended' : ''}`}>
    <video className="banqiao-flow-screen__video" src={assetPath('imagegen/banqiao-assets/蜜蜂.mp4')} autoPlay muted playsInline onEnded={() => setVideoEnded(true)} onError={() => setVideoEnded(true)} aria-hidden="true" />
    <a className="banqiao-flow-screen__bee-link banqiao-flow-screen__bee-link--lab" href="#/lab/toushi-presets/banqiao">3D数字实验室</a>
    <a className="banqiao-flow-screen__bee-link banqiao-flow-screen__bee-link--songzhuang" href="#/flower-rope">松庄·显影实验</a>
    <div className="banqiao-flow-screen__bee-copy"><p>蜂房在前面。</p><small>点击飞出的蜜蜂，进入板桥 3D 导览</small></div>
    <a className="banqiao-flow-screen__bee-hotspot" href="#/lab/toushi-presets/banqiao" aria-label="进入板桥 3D 导览">蜂</a>
  </main>
}

const songzhuangWords = [
  ['线', 53, 25, 0.9, 'deep'], ['编织', 75, 28, 0.7, 'deep'], ['记忆', 91, 41, 0.75, 'deep'],
  ['竹片', 45, 35, 0.35, 'mid'], ['彩带', 53, 42, 0.5, 'mid'], ['手', 48, 53, 0.85, 'deep'],
  ['使用', 42, 47, 0.25, 'soft'], ['赠送', 43, 60, 0.42, 'mid'], ['信物', 56, 67, 0.72, 'deep'],
  ['婚嫁', 79, 57, 0.52, 'mid'], ['关系', 85, 70, 0.8, 'deep'], ['相遇', 66, 77, 0.62, 'mid'],
  ['畲歌', 42, 76, 0.3, 'soft'], ['对唱', 50, 84, 0.32, 'soft'], ['讲述', 78, 82, 0.32, 'soft'],
  ['下一代', 65, 87, 0.26, 'soft'], ['变化', 95, 52, 0.22, 'soft'], ['继续', 75, 93, 0.26, 'soft'],
]

function SongzhuangRevealScene() {
  const sceneRef = useRef(null)
  const [closing, setClosing] = useState(false)
  const [finished, setFinished] = useState(false)
  const { fadeOut } = useAudio()

  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return undefined
    const move = (event) => {
      const rect = scene.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2
      scene.style.setProperty('--scene-px', `${x.toFixed(3)}`)
      scene.style.setProperty('--scene-py', `${y.toFixed(3)}`)
    }
    scene.addEventListener('pointermove', move)
    return () => scene.removeEventListener('pointermove', move)
  }, [])

  useEffect(() => {
    if (!closing) return undefined
    const timer = window.setTimeout(() => {
      setFinished(true)
      fadeOut('ambience', 1500)
    }, 1550)
    return () => window.clearTimeout(timer)
  }, [closing, fadeOut])

  return <main ref={sceneRef} className={`songzhuang-reveal ${closing ? 'is-closing' : ''} ${finished ? 'is-finished' : ''}`}>
    <div className="songzhuang-reveal__paper" aria-hidden="true" />
    <svg className="songzhuang-reveal__roots" viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true">
      <path className="songzhuang-reveal__ribbon" d="M-20 72 C160 35 300 78 432 54 C520 38 572 64 624 105" />
      <path className="songzhuang-reveal__thread songzhuang-reveal__thread--light" d="M600 92 C640 132 654 164 644 202 C635 238 616 265 607 302" />
      <path className="songzhuang-reveal__thread" d="M620 92 C665 138 673 172 660 216 C650 250 634 275 624 310" />
      <path className="songzhuang-reveal__root songzhuang-reveal__root--main" d="M624 300 C616 350 603 395 620 450 C637 510 631 562 595 665" />
      <path className="songzhuang-reveal__root songzhuang-reveal__root--main" d="M621 405 C565 436 508 462 444 505 C400 535 353 585 298 655" />
      <path className="songzhuang-reveal__root" d="M618 426 C682 452 744 488 821 525 C872 548 916 585 967 649" />
      <path className="songzhuang-reveal__root" d="M606 478 C550 505 503 536 469 585 C446 614 421 637 390 664" />
      <path className="songzhuang-reveal__root" d="M631 477 C690 507 728 553 761 603 C779 631 801 648 829 665" />
      <path className="songzhuang-reveal__root songzhuang-reveal__root--fine" d="M572 504 C520 526 472 542 426 550 C385 558 344 573 306 602" />
      <path className="songzhuang-reveal__root songzhuang-reveal__root--fine" d="M674 501 C726 519 788 530 840 532 C891 534 934 545 975 571" />
      <path className="songzhuang-reveal__root songzhuang-reveal__root--fine" d="M594 548 C551 574 528 612 515 661" />
      <path className="songzhuang-reveal__root songzhuang-reveal__root--fine" d="M651 540 C687 574 704 617 711 666" />
    </svg>
    <p className="songzhuang-reveal__kicker">SONGZHUANG / FIELD NOTES</p>
    <div className="songzhuang-reveal__word-field" aria-label="松庄显影词语">
      {songzhuangWords.map(([word, left, top, depth, tone]) => <span key={word} className={`songzhuang-reveal__word songzhuang-reveal__word--${tone}`} style={{ '--word-left': `${left}%`, '--word-top': `${top}%`, '--word-depth': depth }}>{word}</span>)}
    </div>
    <button className="songzhuang-reveal__continue" type="button" aria-label="线还在...，关闭场景" onClick={() => setClosing(true)}>线还在...</button>
    <div className="songzhuang-reveal__doors" aria-hidden="true">
      <div className="songzhuang-reveal__door songzhuang-reveal__door--left" />
      <div className="songzhuang-reveal__door songzhuang-reveal__door--right" />
    </div>
    <div className="songzhuang-reveal__blackout" aria-hidden="true" />
  </main>
}

function WallDrawingScene() {
  const [ready, setReady] = useState(false)
  return <main className={`wall-drawing-scene ${ready ? 'is-ready' : ''}`}>
    <img className="wall-drawing-scene__image" src={assetPath('ke/sz-02-wall-drawing-v12.png')} alt="老屋墙面与陶土小物" onLoad={() => setReady(true)} />
    <div className="wall-drawing-scene__veil" aria-hidden="true" />
    <section className="wall-drawing-scene__copy" aria-label="艺术手艺人的理解">
      <p className="wall-drawing-scene__kicker">松庄 · 艺术手艺人的理解</p>
      <h1>让破损成为<br />重新被看见的地方</h1>
      <p className="wall-drawing-scene__lead">一个人由五部分组成。</p>
      <div className="wall-drawing-scene__parts">
        <p><strong>思想</strong><span>作为头脑，决定要看见什么。</span></p>
        <p><strong>技术与手艺</strong><span>作为双手，把想法变成可以触摸的形状。</span></p>
        <p><strong>产业</strong><span>作为双脚，支撑创作走进日常，脚踏实地地继续。</span></p>
      </div>
    </section>
    <Link className="wall-drawing-scene__next" to="/songzhuang-reveal">继续显影</Link>
  </main>
}

function BanqiaoBeeGuideRoute() {
  return <div className="banqiao-guide-route">
    <Link className="banqiao-guide-route__back" to="/village/banqiao?stage=bee">返回蜂房</Link>
    <ToushiPresetLab />
  </div>
}

const banqiaoKeCopy = {
  'banqiao-lan-teacher': {
    image: assetPath('imagegen/banqiao-transition/bq-ribbon-to-lan-tail-v1.png'),
    transitionVideo: assetPath('imagegen/banqiao-assets/2-web.mp4'),
    alt: '布带散线过渡到兰老师编织手部的尾帧',
    title: '彩带从一根线开始',
    paragraphs: [
      '眼前的彩带还没有成为一件完整的东西。',
      '手指把线一根根拨开，找出它们应该经过的位置。竹片挑起其中几根，新的线从缝隙里穿过去，再被推紧。',
      '我们后来才明白，彩带不只是颜色和图案的组合。它把做东西的手、使用它的人，以及一段被记住的关系，放在了同一条线上。',
      '兰老师讲到，彩带可以进入恋爱和婚嫁的记忆，也可以成为彼此赠送的信物。它不是被收藏起来才有意义，而是在被使用、被赠送、被重新讲起时继续存在。',
      '她也讲到畲歌。歌可以在对唱中让人彼此了解，也可以在学校和活动里被重新教给下一代。声音、手艺和人的相遇，并不总是在同一个地方发生。',
      '有些婚嫁记忆仍留在讲述里，有些做法已经随着今天的生活发生变化。我们听见的不是一条固定不变的传统，而是一件物在不同的人手里不断改变它的用法。',
    ],
    outro: '线还在继续，接下来听她讲板桥。',
  },
  'banqiao-materials': {
    image: assetPath('ke/bq-02-teacher-v10.png'),
    alt: '兰老师的风格化肖像与编织纹理',
    title: '她带我们粗略游览板桥',
    paragraphs: [
      '这一天，我们没有从一张完整的地图开始。兰老师带着我们走，走到愿意停下来的地方，就从手边的一件物开始讲。',
      '她先从身边的彩带讲起：一根线怎样和另一根线交错，颜色怎样按照顺序留下来，最后变成可以被看见、被使用、也被赠送的东西。',
      '她讲彩带，也讲畲歌。讲一条线怎样被做出来，也讲它为什么会进入恋爱、婚嫁、赠送和记忆。物件没有离开生活，它只是被不同的人一次次重新使用。',
      '她讲到学校里的教学，讲到活动中重新响起的歌，也讲到一些旧的婚嫁做法在今天发生了变化。讲述没有把过去封存起来，而是把过去带到现在，让我们看见它正在被怎样继续。',
      '畲族也有“山哈”“山达”等自称。新中国成立后，“畲族”被正式确定为统一的民族称谓。这个名称可以帮助我们理解背景，却不能替代板桥这一次具体的相遇。',
      '我们看到的还有夯土墙、木头、瓦片、蜂箱和公共空间。它们没有自动说明文化是什么，却让讲述有了发生的地方。文化不是摆在一旁等待观看的答案，而是人在这里生活、交流和做事时留下的关系。',
    ],
    outro: '这次经过不会替板桥下一个结论。我们只记录兰老师带我们走过的这一小段路，以及她愿意让我们听见的这些故事。',
  },
}

function BanqiaoKeTextPage({ station, village }) {
  const copy = banqiaoKeCopy[station.id]
  if (!copy) return null
  const [transitionDone, setTransitionDone] = useState(!copy.transitionVideo)
  return <main className={`banqiao-copy-page banqiao-copy-page--${station.id} ${transitionDone ? 'is-ready' : 'is-transitioning'}`}>
    <img className="banqiao-copy-page__image" src={copy.image} alt={copy.alt} />
    <div className="banqiao-copy-page__wash" aria-hidden="true" />
    {copy.transitionVideo && <video className={`banqiao-copy-page__transition ${transitionDone ? 'is-done' : ''}`} src={copy.transitionVideo} autoPlay muted playsInline onEnded={() => setTransitionDone(true)} onError={() => setTransitionDone(true)} aria-hidden="true" />}
    <Header backTo={`/village/${village.id}`} backLabel={village.name} />
    <section className="banqiao-copy-page__content">
      <p className="banqiao-copy-page__index">{station.kicker}</p>
      <h1>{copy.title}</h1>
      <div className="banqiao-copy-page__body">
        {copy.paragraphs.map((paragraph, index) => <p key={paragraph} style={{ '--copy-delay': `${index * 120}ms` }}>{paragraph}</p>)}
      </div>
      <p className="banqiao-copy-page__outro">{copy.outro}</p>
    </section>
  </main>
}

function StationPage({ station, village }) {
  const note = station.content.find((item) => item.type === 'field-note') || station.content[0]; const rest = station.content.filter((item) => item !== note); const [lead, detail] = station.visual.images
  return <main className={`reading-station reading-station--${station.visual.accent}`}><Header backTo={`/village/${village.id}`} backLabel={village.name} /><section className="reading-hero"><div className="reading-hero__intro"><p className="eyebrow">{station.kicker}</p><h1>{station.title}</h1><p className="reading-hero__index">{station.observer.displayName} / {station.observer.sourceObjectName}</p><div className="reading-hero__note"><p className="eyebrow">调研旁注</p><p>{note.body}</p></div></div><figure className="photo-panel photo-panel--lead"><img src={lead.src} alt={lead.alt} style={{ objectPosition: lead.position }} /><figcaption>冻结素材 / 主叙事画面</figcaption></figure></section><section className="reading-layout"><aside className="reading-index"><span>01</span><p>先看现场，再进入对话。物件只在需要时出现，作为关系的证据。</p><Status status={note.sourceStatus} /></aside><article className="reading-body"><p className="eyebrow">对话与感悟</p><h2>{station.observer.displayName} 的现场</h2>{rest.map((item, index) => <p key={`${item.type}-${index}`} className={item.type === 'oral-account' ? 'dialogue-note' : ''}>{item.body}</p>)}<div className="reading-body__footer"><Status status={station.evidence.sourceStatus} /><span>{station.evidence.description}</span></div></article><figure className="photo-panel photo-panel--detail"><img src={detail.src} alt={detail.alt} style={{ objectPosition: detail.position }} /><figcaption>{station.evidence.label}</figcaption></figure></section><SourceFold stationId={station.id} /></main>
}

function Station() { const { stationId } = useParams(); const station = stations.find((item) => item.id === stationId); if (!station || station.status !== 'ready') return <Navigate to="/" replace />; const village = getVillage(station.villageId); if (station.villageId === 'banqiao' && banqiaoKeCopy[station.id]) return <BanqiaoKeTextPage station={station} village={village} />; return station.visual ? <StationPage station={station} village={village} /> : <Navigate to={`/village/${village.id}`} replace /> }

export default function App() {
  return <Routes>
    <Route path="/" element={<Navigate to="/village/banqiao" replace />} />
    <Route path="/village/banqiao" element={<VillageChapter />} />
    <Route path="/lab/toushi-presets/banqiao" element={<BanqiaoBeeGuideRoute />} />
    <Route path="/flower-rope" element={<FlowerRopeReveal />} />
    <Route path="/songzhuang-reveal" element={<SongzhuangRevealScene />} />
    <Route path="/placeholder/paper-stage-next" element={<PaperStage />} />
    <Route path="/placeholder/rock-ceramic" element={<RockCeramicScene />} />
    <Route path="/placeholder/wall-drawing" element={<WallDrawingScene />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
}
