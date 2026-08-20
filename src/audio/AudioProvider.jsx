import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

const AUDIO = {
  ambience: '/assets/audio/main1.mp3',
  lineSlide: '/assets/audio/%E7%BA%BF%E6%BB%91%E5%8A%A8.mp3',
  lineLift: '/assets/audio/%E7%BA%BF%E8%A2%AB%E6%8C%91%E8%B5%B7.mp3',
  debris: '/assets/audio/%E5%9E%83%E5%9C%BE%E7%A0%B4%E7%A2%8E.mp3',
  uiClick: '/assets/audio/%E6%8C%89%E9%92%AE.mp3',
  slider: '/assets/audio/%E6%BB%91%E6%9D%A1.mp3',
}

const AudioContext = createContext(null)

export function AudioProvider({ children }) {
  const tracksRef = useRef(new Map())
  const unlockedRef = useRef(false)
  const [muted, setMuted] = useState(() => window.localStorage.getItem('wutonger-audio-muted') === '1')

  const getTrack = useCallback((key) => {
    const src = AUDIO[key]
    if (!src) return null
    if (!tracksRef.current.has(key)) {
      const audio = new Audio(src)
      audio.preload = 'auto'
      audio.volume = key === 'ambience' ? 0.12 : key === 'uiClick' ? 0.22 : key === 'slider' ? 0.08 : 0.14
      tracksRef.current.set(key, audio)
    }
    return tracksRef.current.get(key)
  }, [])

  const unlock = useCallback(() => {
    unlockedRef.current = true
    if (muted) return
    const ambience = getTrack('ambience')
    if (ambience && ambience.paused) ambience.play().catch(() => {})
  }, [getTrack, muted])

  const play = useCallback((key, { loop = false, restart = false } = {}) => {
    unlock()
    if (muted) return
    const audio = getTrack(key)
    if (!audio) return
    audio.loop = loop
    if (restart) audio.currentTime = 0
    audio.play().catch(() => {})
  }, [getTrack, muted, unlock])

  const stop = useCallback((key) => {
    const audio = tracksRef.current.get(key)
    if (!audio) return
    audio.pause()
    audio.currentTime = 0
  }, [])

  const toggleMuted = useCallback(() => {
    setMuted((current) => {
      const next = !current
      window.localStorage.setItem('wutonger-audio-muted', next ? '1' : '0')
      tracksRef.current.forEach((audio) => { audio.muted = next })
      if (!next && unlockedRef.current) getTrack('ambience')?.play().catch(() => {})
      return next
    })
  }, [getTrack])

  useEffect(() => {
    const onGesture = () => unlock()
    const onUiClick = (event) => {
      if (event.target.closest('.paper-stage__next, .flower-rope__next, .rock-scene__next, .wall-drawing-scene__next, .banqiao-flow-screen__continue, .banqiao-ribbon-handoff__tail-action button, .toushi-chip, .toushi-preset-rail__item, .toushi-action, .toushi-model-button, .back-link')) play('uiClick', { restart: true })
    }
    const onSliderStart = (event) => {
      if (event.target.matches('.toushi-control input[type="range"]')) play('slider', { loop: true, restart: true })
    }
    const onSliderEnd = () => stop('slider')
    window.addEventListener('pointerdown', onGesture, { capture: true, passive: true })
    window.addEventListener('keydown', onGesture, { capture: true })
    document.addEventListener('click', onUiClick, true)
    document.addEventListener('pointerdown', onSliderStart, true)
    document.addEventListener('pointerup', onSliderEnd, true)
    document.addEventListener('pointercancel', onSliderEnd, true)
    return () => {
      window.removeEventListener('pointerdown', onGesture, { capture: true })
      window.removeEventListener('keydown', onGesture, { capture: true })
      document.removeEventListener('click', onUiClick, true)
      document.removeEventListener('pointerdown', onSliderStart, true)
      document.removeEventListener('pointerup', onSliderEnd, true)
      document.removeEventListener('pointercancel', onSliderEnd, true)
    }
  }, [play, stop, unlock])

  useEffect(() => {
    tracksRef.current.forEach((audio) => { audio.muted = muted })
  }, [muted])

  const value = useMemo(() => ({ muted, unlock, play, stop, toggleMuted }), [muted, play, stop, toggleMuted, unlock])
  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
}

export function useAudio() {
  const value = useContext(AudioContext)
  if (!value) throw new Error('useAudio must be used inside AudioProvider')
  return value
}
