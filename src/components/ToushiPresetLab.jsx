import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { HalftonePass } from 'three/examples/jsm/postprocessing/HalftonePass.js'
import { RenderPixelatedPass } from 'three/examples/jsm/postprocessing/RenderPixelatedPass.js'
import { assetPath } from '../lib/assetPath.js'

import './toushi-presets.css'

const PRESETS = [
  {
    key: 'prototype',
    label: '模型原型',
    kind: 'base',
    summary: '只查看当前 GLB 模型本体，不叠加任何数字艺术效果。',
    accent: 'neutral',
  },
  {
    key: 'halftone',
    label: '半调',
    kind: 'print',
    summary: '按你的参数面板走，保留 Dot、radius、rotateR/G/B、scatter、greyscale、blending 和 blendingMode。',
    accent: 'cyan',
  },
  {
    key: 'charcode',
    label: '字符编码',
    kind: 'archive',
    summary: '结构仍在，表面转成字符网格和扫描文本层，偏档案和研究界面。',
    accent: 'cyan',
  },
  {
    key: 'point-cloud',
    label: '粒子云',
    kind: 'pao',
    summary: '不是静态点云，而是更像 Pao Olea 那种轻、空、柔的粒子场。',
    accent: 'warm',
  },
  {
    key: 'wireframe-scan',
    label: '线框扫描',
    kind: 'scan',
    summary: '线框、轮廓、扫描线和淡蓝发光，像 TouchDesigner 的实时结构视图。',
    accent: 'cyan',
  },
  {
    key: 'pixel',
    label: '像素化',
    kind: 'pixel',
    summary: '降分辨率但保留边缘识别，像控制面板里的 block 重组。',
    accent: 'amber',
  },
]

const VISIBLE_PRESETS = PRESETS.filter((preset) => preset.key !== 'wireframe-scan')

const CONTROL_SCHEMAS = {
  prototype: [],
  halftone: [
    { id: 'shape', label: 'shape', type: 'select', value: 'Dot', options: ['Dot', 'Disc', 'Square'] },
    { id: 'radius', label: 'radius', type: 'range', min: 2, max: 14, step: 0.01, value: 8.688 },
    { id: 'rotateR', label: 'rotateR', type: 'range', min: 0, max: 90, step: 0.01, value: 25.47 },
    { id: 'rotateG', label: 'rotateG', type: 'range', min: 0, max: 90, step: 0.01, value: 45 },
    { id: 'rotateB', label: 'rotateB', type: 'range', min: 0, max: 90, step: 0.01, value: 29.999 },
    { id: 'scatter', label: 'scatter', type: 'range', min: 0, max: 1, step: 0.01, value: 0.39 },
    { id: 'greyscale', label: 'greyscale', type: 'toggle', value: true },
    { id: 'blending', label: 'blending', type: 'range', min: 0, max: 1, step: 0.01, value: 0.8 },
    { id: 'blendingMode', label: 'blendingMode', type: 'select', value: 'Linear', options: ['Linear', 'Multiply', 'Add', 'Lighter', 'Darker'] },
    { id: 'disable', label: 'disable', type: 'toggle', value: false },
  ],
  charcode: [
    { id: 'glyphSet', label: 'glyphSet', type: 'select', value: 'BQ-SHE', options: ['BQ-SHE', 'Archive', 'Mono'] },
    { id: 'density', label: 'density', type: 'range', min: 0.15, max: 1, step: 0.01, value: 0.74 },
    { id: 'size', label: 'size', type: 'range', min: 8, max: 64, step: 1, value: 28 },
    { id: 'scan', label: 'scan', type: 'range', min: 0, max: 1, step: 0.01, value: 0.44 },
    { id: 'invert', label: 'invert', type: 'toggle', value: true },
  ],
  'point-cloud': [
    { id: 'radius', label: 'radius', type: 'range', min: 0.4, max: 2.8, step: 0.01, value: 1.28 },
    { id: 'scatter', label: 'scatter', type: 'range', min: 0, max: 1, step: 0.01, value: 0.52 },
    { id: 'trail', label: 'trail', type: 'range', min: 0, max: 1, step: 0.01, value: 0.68 },
    { id: 'bloom', label: 'bloom', type: 'range', min: 0, max: 1, step: 0.01, value: 0.44 },
    { id: 'disable', label: 'disable', type: 'toggle', value: false },
  ],
  'wireframe-scan': [
    { id: 'palette', label: 'palette', type: 'select', value: 'Prism', options: ['Prism', 'Acid', 'Sunset'] },
    { id: 'lineWeight', label: 'lineWeight', type: 'range', min: 0.5, max: 4, step: 0.01, value: 1.68 },
    { id: 'scanSpeed', label: 'scanSpeed', type: 'range', min: 0, max: 2, step: 0.01, value: 0.82 },
    { id: 'glow', label: 'glow', type: 'range', min: 0, max: 1, step: 0.01, value: 0.62 },
    { id: 'jitter', label: 'jitter', type: 'range', min: 0, max: 1, step: 0.01, value: 0.27 },
    { id: 'disable', label: 'disable', type: 'toggle', value: false },
  ],
  pixel: [
    { id: 'palette', label: 'palette', type: 'select', value: 'Raster', options: ['Raster', 'Candy', 'Heat'] },
    { id: 'blockSize', label: 'blockSize', type: 'range', min: 2, max: 20, step: 1, value: 8 },
    { id: 'chroma', label: 'chroma', type: 'range', min: 0, max: 1, step: 0.01, value: 0.36 },
    { id: 'smear', label: 'smear', type: 'range', min: 0, max: 1, step: 0.01, value: 0.4 },
    { id: 'quantize', label: 'quantize', type: 'range', min: 0, max: 1, step: 0.01, value: 0.78 },
    { id: 'disable', label: 'disable', type: 'toggle', value: false },
  ],
}

const DEFAULT_MODEL = assetPath('imagegen/banqiao-assets/toushi/base_basic_pbr.glb')
const FALLBACK_MODEL = assetPath('imagegen/banqiao-assets/toushi/base_basic_shaded.glb')
const EXTRA_MODEL = assetPath('imagegen/banqiao-assets/1c94875422c97c3929a27501f34ba18d-web.glb')

const COLOR_PALETTES = {
  wireframe: {
    Prism: ['#5de6ff', '#ff6bd6', '#ffd166', '#7c7cff'],
    Acid: ['#d8ff3e', '#56f0c0', '#ff4f8b', '#f7f7f2'],
    Sunset: ['#ff5f6d', '#ffc371', '#9b5de5', '#00bbf9'],
  },
  pixel: {
    Raster: ['#ffcf56', '#ff6b6b', '#5ce1e6', '#6c63ff'],
    Candy: ['#ff7eb6', '#ffcf56', '#7afcff', '#b8f36b'],
    Heat: ['#ff3d54', '#ff7a3d', '#ffd166', '#f4f1de'],
  },
}

const DEFAULT_ROTATION = { x: 0.08, y: -0.64, z: 0 }
const DEFAULT_ZOOM = 4.65

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function cloneScene(scene) {
  return scene.clone(true)
}

function fitBounds(object) {
  const box = new THREE.Box3().setFromObject(object)
  const size = new THREE.Vector3()
  const center = new THREE.Vector3()
  box.getSize(size)
  box.getCenter(center)
  const max = Math.max(size.x, size.y, size.z) || 1
  const scale = 2.55 / max
  return {
    scale,
    position: [-center.x * scale, -center.y * scale - size.y * scale * 0.04, -center.z * scale],
  }
}

function materialForPreset(presetKey, controls, index = 0) {
  const palette = COLOR_PALETTES[presetKey === 'wireframe-scan' ? 'wireframe' : 'pixel']
  switch (presetKey) {
    case 'prototype':
      return new THREE.MeshStandardMaterial({
        color: '#d8d4c8',
        roughness: 0.62,
        metalness: 0.04,
      })
    case 'halftone':
      return new THREE.MeshStandardMaterial({
        color: '#d6d7d4',
        roughness: 0.5,
        metalness: 0.08,
        flatShading: false,
      })
    case 'charcode':
      return new THREE.MeshStandardMaterial({
        color: '#dbefff',
        emissive: '#65d9ff',
        emissiveIntensity: 0.22,
        roughness: 0.78,
        metalness: 0,
      })
    case 'wireframe-scan':
      return new THREE.MeshStandardMaterial({
        color: palette[ index % palette.length ],
        emissive: palette[ index % palette.length ],
        emissiveIntensity: 0.16,
        metalness: 0.08,
        roughness: 0.88,
        flatShading: true,
        wireframe: true,
      })
    case 'pixel':
      return new THREE.MeshStandardMaterial({
        color: palette[ index % palette.length ],
        roughness: 1,
        metalness: 0,
        flatShading: true,
        emissive: palette[ index % palette.length ],
        emissiveIntensity: 0.08 + controls.chroma * 0.24,
      })
    case 'point-cloud':
    default:
      return new THREE.MeshStandardMaterial({
        color: '#b8b8b8',
        roughness: 0.74,
        metalness: 0.04,
        flatShading: false,
      })
  }
}

function samplePointArray(scene, density = 1) {
  const positions = []
  scene.updateMatrixWorld(true)
  const temp = new THREE.Vector3()

  scene.traverse((node) => {
    if (!node.isMesh || !node.geometry?.attributes?.position) return
    const attribute = node.geometry.attributes.position
    const step = Math.max(1, Math.round(4 - density * 2.2))
    for (let index = 0; index < attribute.count; index += step) {
      temp.fromBufferAttribute(attribute, index).applyMatrix4(node.matrixWorld)
      positions.push(temp.x, temp.y, temp.z)
    }
  })

  return new Float32Array(positions)
}

function sampleSurfacePointArray(scene, count = 16000) {
  const samplers = []
  scene.updateMatrixWorld(true)

  scene.traverse((node) => {
    if (!node.isMesh || !node.geometry?.attributes?.position) return
    const sampler = new MeshSurfaceSampler(node).build()
    const total = sampler.distribution?.[sampler.distribution.length - 1] || 0
    if (total <= 0) return
    samplers.push({
      sampler,
      total,
      matrixWorld: node.matrixWorld.clone(),
    })
  })

  if (!samplers.length) return samplePointArray(scene, 1)

  const totalArea = samplers.reduce((sum, item) => sum + item.total, 0) || 1
  const positions = new Float32Array(count * 3)
  const temp = new THREE.Vector3()

  for (let index = 0; index < count; index += 1) {
    let pick = seeded(index, 17) * totalArea
    let selected = samplers[0]
    for (const item of samplers) {
      pick -= item.total
      if (pick <= 0) {
        selected = item
        break
      }
    }

    selected.sampler.sample(temp)
    temp.applyMatrix4(selected.matrixWorld)
    const offset = index * 3
    positions[offset] = temp.x
    positions[offset + 1] = temp.y
    positions[offset + 2] = temp.z
  }

  return positions
}

function seeded(index, salt = 0) {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453
  return value - Math.floor(value)
}

function halftoneShapeValue(shape) {
  if (shape === 'Square') return 4
  if (shape === 'Disc') return 2
  return 1
}

function halftoneBlendValue(mode) {
  if (mode === 'Multiply') return 2
  if (mode === 'Add') return 3
  if (mode === 'Lighter') return 4
  if (mode === 'Darker') return 5
  return 1
}

function createParticleField(scene, density = 1) {
  const count = Math.round(9000 + density * 4200)
  const surface = sampleSurfacePointArray(scene, count)
  const sourceCount = surface.length / 3
  const particleCount = Math.min(26000, sourceCount * 2)
  const positions = new Float32Array(particleCount * 3)
  const basePositions = new Float32Array(particleCount * 3)
  const phases = new Float32Array(particleCount)
  const sizes = new Float32Array(particleCount)
  const layers = new Float32Array(particleCount)

  for (let index = 0; index < particleCount; index += 1) {
    const sourceIndex = index % sourceCount
    const x = surface[sourceIndex * 3]
    const y = surface[sourceIndex * 3 + 1]
    const z = surface[sourceIndex * 3 + 2]
    const halo = index >= sourceCount
    const spread = halo ? 0.05 + seeded(index, 2) * 0.13 : 0.012 + seeded(index, 1) * 0.025
    const theta = seeded(index, 3) * Math.PI * 2
    const phi = seeded(index, 4) * Math.PI * 2
    const px = x + Math.cos(theta) * spread * (0.6 + seeded(index, 5))
    const py = y + Math.sin(phi) * spread * 1.2
    const pz = z + Math.sin(theta + phi) * spread
    const offset = index * 3

    positions[offset] = px
    positions[offset + 1] = py
    positions[offset + 2] = pz
    basePositions[offset] = px
    basePositions[offset + 1] = py
    basePositions[offset + 2] = pz
    phases[index] = seeded(index, 6) * Math.PI * 2
    sizes[index] = halo ? 0.55 + seeded(index, 7) * 1.15 : 0.9 + seeded(index, 7) * 1.7
    layers[index] = halo ? 1 : 0
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('basePosition', new THREE.BufferAttribute(basePositions, 3))
  geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1))
  geometry.setAttribute('particleSize', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('layer', new THREE.BufferAttribute(layers, 1))
  return geometry
}

function createSoftParticleMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
    uniforms: {
      uColor: { value: new THREE.Color('#24334a') },
      uTime: { value: 0 },
      uBloom: { value: 0.44 },
    },
    vertexShader: `
      attribute float particleSize;
      attribute float layer;
      uniform float uBloom;
      varying float vLayer;
      void main() {
        vLayer = layer;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = particleSize * (13.0 + uBloom * 8.0) / max(1.0, -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uBloom;
      varying float vLayer;
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float distanceToCenter = length(uv);
        float soft = smoothstep(0.5, 0.26, distanceToCenter);
        float core = smoothstep(0.34, 0.06, distanceToCenter);
        float alpha = (soft * (vLayer > 0.5 ? 0.3 : 0.76) + core * 0.34) * (0.86 + uBloom * 0.2);
        if (alpha < 0.01) discard;
        gl_FragColor = vec4(uColor + core * 0.1, alpha);
      }
    `,
  })
}

function createHalftoneMaterial(color, opacity = 1) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
      uSize: { value: 1 },
    },
    vertexShader: `
      attribute float dotSize;
      uniform float uSize;
      varying float vDotSize;
      void main() {
        vDotSize = dotSize;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = dotSize * uSize * 26.0 / max(1.0, -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uOpacity;
      varying float vDotSize;
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float radius = length(uv);
        float dot = smoothstep(0.5, 0.46 - vDotSize * 0.08, radius);
        if (dot < 0.01) discard;
        gl_FragColor = vec4(uColor, dot * uOpacity);
      }
    `,
  })
}

function HalftoneLayer({ geometry, color, rotation, opacity, size }) {
  const material = useMemo(() => createHalftoneMaterial(color, opacity), [color, opacity])
  material.uniforms.uSize.value = size
  return <points geometry={geometry} rotation={rotation} material={material} />
}

function SceneRoot({ scene, presetKey, rotationRef, controls }) {
  const groupRef = useRef(null)
  const pointsRef = useRef(null)
  const trailRef = useRef(null)

  const displayObject = useMemo(() => {
    if (!scene) return null
    if (presetKey === 'point-cloud') return null

    const object = cloneScene(scene)
    let meshIndex = 0
    object.traverse((node) => {
      if (!node.isMesh) return
      meshIndex += 1
      node.castShadow = true
      node.receiveShadow = true
      if (presetKey === 'prototype') return
      const material = materialForPreset(presetKey, controls, meshIndex)
      node.material = material.clone()
      if (presetKey === 'charcode') {
        node.material.opacity = 0.72
        node.material.transparent = true
      }
      if (presetKey === 'wireframe-scan') {
        node.material.emissiveIntensity = 0.08 + controls.glow * 0.55
        node.material.opacity = 0.52 + controls.lineWeight * 0.08
        node.material.transparent = true
      }
      if (presetKey === 'pixel') {
        node.material.emissive = new THREE.Color(controls.chroma > 0.5 ? '#3a2208' : '#18120a')
        node.material.emissiveIntensity = 0.04 + controls.chroma * 0.16
      }
    })
    return object
  }, [scene, presetKey, controls])

  const pointGeometry = useMemo(() => {
    if (!scene || presetKey !== 'point-cloud') return null
    return createParticleField(scene, controls.radius)
  }, [scene, presetKey, controls.radius])

  const halftoneGeometry = useMemo(() => {
    if (!scene || presetKey !== 'halftone') return null
    const base = samplePointArray(scene, 0.84)
    const geometry = new THREE.BufferGeometry()
    const dots = new Float32Array(base.length / 3)
    for (let index = 0; index < dots.length; index += 1) {
      const offset = index * 3
      const scatter = controls.scatter * 0.018
      base[offset] += (seeded(index, 10) - 0.5) * scatter
      base[offset + 1] += (seeded(index, 11) - 0.5) * scatter
      base[offset + 2] += (seeded(index, 12) - 0.5) * scatter
      dots[index] = 0.48 + seeded(index, 9) * 0.52
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(base, 3))
    geometry.setAttribute('dotSize', new THREE.BufferAttribute(dots, 1))
    return geometry
  }, [scene, presetKey, controls.scatter])

  const trailGeometry = useMemo(() => {
    if (!pointGeometry) return null
    const count = pointGeometry.attributes.position.count
    const vertices = new Float32Array(count * 6)
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    return geometry
  }, [pointGeometry])

  const particleMaterial = useMemo(() => (pointGeometry ? createSoftParticleMaterial() : null), [pointGeometry])

  const fit = useMemo(() => {
    if (!scene) return { scale: 1, position: [0, 0, 0] }
    return fitBounds(scene)
  }, [scene])

  useFrame(({ clock }, delta) => {
    const group = groupRef.current
    if (!group) return

    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, rotationRef.current.x, 0.12)
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, rotationRef.current.y, 0.12)
    const jitterZ = presetKey === 'wireframe-scan' ? Math.sin(clock.elapsedTime * 18) * controls.jitter * 0.006 : 0
    group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, rotationRef.current.z + jitterZ, 0.08)

    if (presetKey === 'point-cloud' && pointGeometry) {
      const position = pointGeometry.attributes.position
      const base = pointGeometry.attributes.basePosition
      const phases = pointGeometry.attributes.phase
      const layers = pointGeometry.attributes.layer
      for (let index = 0; index < position.count; index += 1) {
        const x = base.getX(index)
        const y = base.getY(index)
        const z = base.getZ(index)
        const phase = phases.getX(index)
        const airy = layers.getX(index) > 0.5 ? 1.8 : 1
        const wave = Math.sin(clock.elapsedTime * 0.42 + x * 1.35 + phase) * 0.035 * airy
        const lift = Math.cos(clock.elapsedTime * 0.31 + y * 1.1 + phase * 1.7) * 0.028 * airy
        const drift = Math.sin(clock.elapsedTime * 0.22 + z * 1.8 + phase) * 0.018 * airy
        position.setXYZ(
          index, x + wave * controls.scatter, y + lift * controls.scatter * 1.2, z + drift * controls.trail,
        )
        if (trailGeometry) {
          const trailPosition = trailGeometry.attributes.position
          const offset = index * 6
          trailPosition.setXYZ(offset / 3, x + wave * controls.scatter, y + lift * controls.scatter * 1.2, z + drift * controls.trail)
          trailPosition.setXYZ(offset / 3 + 1, x - wave * controls.scatter * (0.35 + controls.trail * 0.4), y - lift * controls.scatter * 0.8, z - drift * controls.trail * 0.8)
        }
      }
      position.needsUpdate = true
      if (trailGeometry) {
        trailGeometry.attributes.position.needsUpdate = true
        trailGeometry.computeBoundingSphere()
      }
      pointGeometry.computeBoundingSphere()
      if (particleMaterial) {
        particleMaterial.uniforms.uTime.value = clock.elapsedTime
        particleMaterial.uniforms.uBloom.value = controls.bloom
      }
    }
  })

  if (presetKey === 'point-cloud' && pointGeometry) {
    return (
      <group ref={groupRef} scale={fit.scale} position={fit.position}>
        <points ref={pointsRef} geometry={pointGeometry} material={particleMaterial} />
        {trailGeometry && (
          <lineSegments ref={trailRef} geometry={trailGeometry}>
            <lineBasicMaterial color="#24334a" transparent opacity={0.16 + controls.trail * 0.18} blending={THREE.NormalBlending} depthWrite={false} />
          </lineSegments>
        )}
      </group>
    )
  }

  if (false && presetKey === 'halftone' && halftoneGeometry) {
    return (
      <group ref={groupRef} scale={fit.scale} position={fit.position}>
        <HalftoneLayer geometry={halftoneGeometry} color="#f4efe5" rotation={[0, 0, 0]} opacity={controls.blending} size={0.56 + controls.radius / 17} />
        {!controls.greyscale && (
          <>
            <HalftoneLayer geometry={halftoneGeometry} color="#ef6c76" rotation={[0, controls.rotateR * Math.PI / 180, 0]} opacity={controls.blending * 0.38} size={0.86} />
            <HalftoneLayer geometry={halftoneGeometry} color="#65d9dc" rotation={[controls.rotateG * Math.PI / 180, 0, 0]} opacity={controls.blending * 0.32} size={0.82} />
            <HalftoneLayer geometry={halftoneGeometry} color="#f4c46f" rotation={[0, 0, controls.rotateB * Math.PI / 180]} opacity={controls.blending * 0.28} size={0.78} />
          </>
        )}
      </group>
    )
  }

  if (!scene) return null

  return (
    <>
      <group ref={groupRef} scale={fit.scale} position={fit.position}>
        {displayObject && <primitive object={displayObject} />}
      </group>
      {presetKey === 'halftone' && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.32, 0]} receiveShadow>
          <circleGeometry args={[4.2, 96]} />
          <meshStandardMaterial color="#171717" roughness={0.92} metalness={0} />
        </mesh>
      )}
    </>
  )
}

function RenderManager({ presetKey, controls, asciiHostRef }) {
  const { gl, scene, camera, size } = useThree()
  const composerRef = useRef(null)
  const halftonePassRef = useRef(null)
  const pixelPassRef = useRef(null)
  const asciiEffectRef = useRef(null)

  const charSet = useMemo(() => {
    switch (controls.glyphSet) {
      case 'Archive':
        return '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*+=-:. '
      case 'Mono':
        return ' .,:;i1tfLCG08@'
      case 'BQ-SHE':
      default:
        return ' .,:;i1tfLCG08@#%*+=-: '
    }
  }, [controls.glyphSet])

  useEffect(() => {
    if (composerRef.current) {
      composerRef.current.dispose()
      composerRef.current = null
      halftonePassRef.current = null
      pixelPassRef.current = null
    }
    if (asciiEffectRef.current && asciiHostRef.current) {
      asciiHostRef.current.replaceChildren()
      asciiEffectRef.current = null
    }

    if (presetKey === 'halftone') {
      const composer = new EffectComposer(gl)
      composer.addPass(new RenderPass(scene, camera))
      const pass = new HalftonePass({
        shape: halftoneShapeValue(controls.shape),
        radius: controls.radius,
        rotateR: (controls.rotateR * Math.PI) / 180,
        rotateG: (controls.rotateG * Math.PI) / 180,
        rotateB: (controls.rotateB * Math.PI) / 180,
        scatter: controls.scatter,
        blending: controls.blending,
        blendingMode: halftoneBlendValue(controls.blendingMode),
        greyscale: controls.greyscale,
        disable: controls.disable,
      })
      composer.addPass(pass)
      composerRef.current = composer
      halftonePassRef.current = pass
      return () => {
        composer.dispose()
        composerRef.current = null
        halftonePassRef.current = null
      }
    }

    if (presetKey === 'pixel') {
      const composer = new EffectComposer(gl)
      composer.addPass(new RenderPass(scene, camera))
      const pass = new RenderPixelatedPass(Math.max(2, Math.round(controls.blockSize)), scene, camera, {
        normalEdgeStrength: 0.15 + controls.quantize * 0.45,
        depthEdgeStrength: 0.2 + controls.quantize * 0.55,
      })
      composer.addPass(pass)
      composerRef.current = composer
      pixelPassRef.current = pass
      return () => {
        composer.dispose()
        composerRef.current = null
        pixelPassRef.current = null
      }
    }

    if (presetKey === 'charcode' && asciiHostRef.current) {
      const effect = new AsciiEffect(gl, charSet, {
        resolution: 0.06 + controls.density * 0.075,
        scale: Math.max(1, Math.round(controls.size / 32)),
        color: false,
        alpha: false,
        invert: controls.invert,
        strResolution: 'high',
      })
      effect.domElement.style.position = 'absolute'
      effect.domElement.style.inset = '0'
      effect.domElement.style.pointerEvents = 'none'
      effect.domElement.style.opacity = '1'
      effect.domElement.style.mixBlendMode = 'screen'
      effect.domElement.style.filter = 'contrast(1.35) saturate(1.05)'
      asciiHostRef.current.replaceChildren(effect.domElement)
      effect.setSize(size.width, size.height)
      asciiEffectRef.current = effect
      return () => {
        asciiHostRef.current?.replaceChildren()
        asciiEffectRef.current = null
      }
    }

    return undefined
  }, [presetKey, gl, scene, camera, charSet, controls, size.width, size.height, asciiHostRef])

  useEffect(() => {
    if (composerRef.current) composerRef.current.setSize(size.width, size.height)
    if (asciiEffectRef.current) asciiEffectRef.current.setSize(size.width, size.height)
  }, [size.width, size.height])

  useFrame(() => {
    if (presetKey === 'halftone' && composerRef.current && halftonePassRef.current) {
      halftonePassRef.current.uniforms.radius.value = controls.radius
      halftonePassRef.current.uniforms.rotateR.value = (controls.rotateR * Math.PI) / 180
      halftonePassRef.current.uniforms.rotateG.value = (controls.rotateG * Math.PI) / 180
      halftonePassRef.current.uniforms.rotateB.value = (controls.rotateB * Math.PI) / 180
      halftonePassRef.current.uniforms.scatter.value = controls.scatter
      halftonePassRef.current.uniforms.blending.value = controls.blending
      halftonePassRef.current.uniforms.shape.value = halftoneShapeValue(controls.shape)
      halftonePassRef.current.uniforms.blendingMode.value = halftoneBlendValue(controls.blendingMode)
      halftonePassRef.current.uniforms.greyscale.value = controls.greyscale
      halftonePassRef.current.uniforms.disable.value = controls.disable
      composerRef.current.render()
      return
    }

    if (presetKey === 'pixel' && composerRef.current && pixelPassRef.current) {
      pixelPassRef.current.setPixelSize(Math.max(2, Math.round(controls.blockSize)))
      pixelPassRef.current.normalEdgeStrength = 0.15 + controls.quantize * 0.45
      pixelPassRef.current.depthEdgeStrength = 0.2 + controls.quantize * 0.55
      composerRef.current.render()
      return
    }

    if (presetKey === 'charcode' && asciiEffectRef.current) {
      asciiEffectRef.current.render(scene, camera)
      return
    }

    gl.render(scene, camera)
  }, 1)

  return null
}

function CameraRig({ zoomRef }) {
  const { camera } = useThree()
  useFrame(() => {
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, zoomRef.current, 0.12)
    camera.lookAt(0, 0, 0)
  })
  return null
}

function SceneCanvas({ presetKey, scene, rotationRef, zoomRef, controls }) {
  const asciiHostRef = useRef(null)
  const blendMode = {
    Linear: 'normal',
    Multiply: 'multiply',
    Add: 'screen',
    Lighter: 'screen',
    Darker: 'darken',
  }[controls.blendingMode] || 'normal'

  const canvasStyle = useMemo(() => {
    if (presetKey === 'halftone') {
      return {
        '--dot-size': `${controls.radius}px`,
        '--scatter': controls.scatter,
        '--mix-mode': blendMode,
        '--mix-opacity': controls.blending,
        '--rotate-r': `${controls.rotateR}deg`,
        '--rotate-g': `${controls.rotateG}deg`,
        '--rotate-b': `${controls.rotateB}deg`,
      }
    }
    if (presetKey === 'point-cloud') {
      return {
        '--cloud-opacity': `${0.56 + controls.bloom * 0.35}`,
      }
    }
    if (presetKey === 'charcode') {
      return {
        '--glyph-size': `${controls.size}px`,
        '--glyph-density': controls.density,
        '--glyph-scan': controls.scan,
      }
    }
    if (presetKey === 'wireframe-scan') {
      return {
        '--wire-c1': COLOR_PALETTES.wireframe[controls.palette]?.[0] || COLOR_PALETTES.wireframe.Prism[0],
        '--wire-c2': COLOR_PALETTES.wireframe[controls.palette]?.[1] || COLOR_PALETTES.wireframe.Prism[1],
        '--wire-c3': COLOR_PALETTES.wireframe[controls.palette]?.[2] || COLOR_PALETTES.wireframe.Prism[2],
        '--scan-speed': `${controls.scanSpeed}s`,
        '--glow-level': controls.glow,
        '--line-weight': controls.lineWeight,
        '--wire-gap': `${Math.max(8, 24 - controls.lineWeight * 3)}px`,
        '--wire-thick': `${1 + controls.lineWeight * 0.35}px`,
        '--jitter-level': controls.jitter,
      }
    }
    if (presetKey === 'pixel') {
      return {
        '--pixel-c1': COLOR_PALETTES.pixel[controls.palette]?.[0] || COLOR_PALETTES.pixel.Raster[0],
        '--pixel-c2': COLOR_PALETTES.pixel[controls.palette]?.[1] || COLOR_PALETTES.pixel.Raster[1],
        '--pixel-c3': COLOR_PALETTES.pixel[controls.palette]?.[2] || COLOR_PALETTES.pixel.Raster[2],
        '--pixel-size': `${controls.blockSize}px`,
        '--pixel-smear': controls.smear,
        '--pixel-chroma': controls.chroma,
      }
    }
    return {}
  }, [presetKey, controls, blendMode])

  const theme = useMemo(() => {
    switch (presetKey) {
      case 'point-cloud':
        return { bg: '#e8dcc2', fog: '#d2c3a5', ambient: 0.52, key: '#3d372d', keyIntensity: 1.05, fillIntensity: 0.22 }
      case 'charcode':
        return { bg: '#eee4cd', fog: '#d8c9aa', ambient: 0.42, key: '#3b382f', keyIntensity: 1.1, fillIntensity: 0.25 }
      case 'wireframe-scan':
        return { bg: '#e9dfc8', fog: '#d5c5a6', ambient: 0.5, key: '#8d382b', keyIntensity: 1.12, fillIntensity: 0.3 }
      case 'pixel':
        return { bg: '#eadcc0', fog: '#d1bd99', ambient: 0.52, key: '#554332', keyIntensity: 1.18, fillIntensity: 0.28 }
      case 'prototype':
        return { bg: '#e9dfc9', fog: '#d4c5a8', ambient: 0.86, key: '#fff1d0', keyIntensity: 1.72, fillIntensity: 0.58 }
      case 'halftone':
      default:
        return { bg: '#000000', fog: '#030303', ambient: 0.18, key: '#ffffff', keyIntensity: 3.1, fillIntensity: 0.18 }
    }
  }, [presetKey])

  return (
    <div className={`toushi-stage toushi-stage--${presetKey}`} style={canvasStyle} data-shape={controls.shape}>
      <div className="toushi-stage__grain" aria-hidden="true" />
      <div className="toushi-stage__frame" aria-hidden="true" />
      <div className="toushi-stage__label">
        <span>drag</span>
        <span>wheel</span>
        <span>reset 0</span>
      </div>
      <div ref={asciiHostRef} className="toushi-ascii-host" aria-hidden="true" />
      <Canvas
        shadows
        dpr={presetKey === 'point-cloud' ? [1, 1.35] : [1, 1.2]}
        camera={{ position: [0, 0.18, DEFAULT_ZOOM], fov: 34 }}
        gl={{ antialias: presetKey !== 'pixel', alpha: true, powerPreference: 'high-performance' }}
        className="toushi-canvas"
        frameloop="always"
      >
        <color attach="background" args={[theme.bg]} />
        <fog attach="fog" args={[theme.fog, 4.1, 11.5]} />
        <ambientLight intensity={theme.ambient} />
        <directionalLight position={[3.2, 4.5, 4.5]} intensity={theme.keyIntensity || 1.4} color={theme.key} castShadow={presetKey === 'halftone'} />
        <directionalLight position={[-4, -2, 2]} intensity={theme.fillIntensity || 0.45} color="#8ca1b8" />
        <hemisphereLight intensity={presetKey === 'prototype' ? 0.48 : 0.28} groundColor={presetKey === 'prototype' ? '#82745f' : '#1b160f'} color="#fffaf0" />
        <CameraRig zoomRef={zoomRef} />
        <SceneRoot scene={scene} presetKey={presetKey} rotationRef={rotationRef} controls={controls} />
        <RenderManager presetKey={presetKey} controls={controls} asciiHostRef={asciiHostRef} />
      </Canvas>
      <div className="toushi-stage__overlay toushi-stage__overlay--scan" aria-hidden="true" />
      <div className="toushi-stage__overlay toushi-stage__overlay--content" aria-hidden="true" />
    </div>
  )
}

function useModel(modelUrl, reloadToken) {
  const [state, setState] = useState({ status: 'loading', scene: null, source: DEFAULT_MODEL, error: null })

  useEffect(() => {
    let alive = true
    const loader = new GLTFLoader()

    const load = (url, fallback = false) =>
      new Promise((resolve, reject) => {
        loader.load(
          url,
          (gltf) => resolve({ gltf, source: url }),
          undefined,
          (error) => {
            if (fallback) {
              reject(error)
              return
            }
            load(FALLBACK_MODEL, true).then(resolve).catch(reject)
          },
        )
      })

    setState({ status: 'loading', scene: null, source: modelUrl, error: null })
    load(modelUrl)
      .then(({ gltf, source }) => {
        if (!alive) return
        setState({ status: 'ready', scene: gltf.scene, source, error: null })
      })
      .catch((error) => {
        if (!alive) return
        setState({ status: 'error', scene: null, source: DEFAULT_MODEL, error })
      })

    return () => {
      alive = false
    }
  }, [modelUrl, reloadToken])

  return state
}

function PresetButton({ preset, active, onClick }) {
  return (
    <button className={`toushi-chip ${active ? 'is-active' : ''}`} type="button" onClick={onClick}>
      <strong>{preset.label}</strong>
      <span>{preset.kind}</span>
    </button>
  )
}

function ControlRow({ control, value, onChange }) {
  if (control.type === 'toggle') {
    return (
      <label className="toushi-control toushi-control--toggle">
        <span>{control.label}</span>
        <input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} />
      </label>
    )
  }

  if (control.type === 'select') {
    return (
      <label className="toushi-control">
        <span>{control.label}</span>
        <select value={value} onChange={(event) => onChange(event.target.value)}>
          {control.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    )
  }

  return (
    <label className="toushi-control toushi-control--knob">
      <span>{control.label}</span>
      <span className="toushi-knob" style={{ '--knob-progress': `${((Number(value) - control.min) / (control.max - control.min)) * 100}%` }}>
        <input
          type="range"
          min={control.min}
          max={control.max}
          step={control.step}
          value={value}
          aria-label={control.label}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <span className="toushi-knob__face" aria-hidden="true"><i /></span>
      </span>
      <output className="toushi-control__readout">{Number(value).toFixed(Number.isInteger(control.step) ? 0 : 2)}</output>
    </label>
  )
}

function LoadingState() {
  return (
    <div className="toushi-empty">
      <div className="toushi-skeleton toushi-skeleton--title" />
      <div className="toushi-skeleton toushi-skeleton--line" />
      <div className="toushi-skeleton toushi-skeleton--line" />
      <div className="toushi-skeleton toushi-skeleton--panel" />
    </div>
  )
}

function ErrorState({ onRetry }) {
  return (
    <div className="toushi-empty toushi-empty--error" role="alert">
      <p>模型读取失败，已经准备回退版本。</p>
      <button type="button" className="toushi-action" onClick={onRetry}>
        重新加载
      </button>
    </div>
  )
}

function getInitialSettings() {
  const result = {}
  Object.entries(CONTROL_SCHEMAS).forEach(([presetKey, controls]) => {
    result[presetKey] = controls.reduce((acc, control) => {
      acc[control.id] = control.value
      return acc
    }, {})
  })
  return result
}

export default function ToushiPresetLab() {
  const [reloadToken, setReloadToken] = useState(0)
  const [modelUrl, setModelUrl] = useState(DEFAULT_MODEL)
  const [presetKey, setPresetKey] = useState('halftone')
  const [settingsByPreset, setSettingsByPreset] = useState(() => getInitialSettings())
  const [zoom, setZoom] = useState(DEFAULT_ZOOM)
  const model = useModel(modelUrl, reloadToken)
  const rotationRef = useRef({ ...DEFAULT_ROTATION })
  const zoomRef = useRef(DEFAULT_ZOOM)
  const dragRef = useRef(null)
  const activePreset = PRESETS.find((item) => item.key === presetKey) || PRESETS[0]
  const activeControls = settingsByPreset[presetKey]
  const schema = CONTROL_SCHEMAS[presetKey]

  useEffect(() => {
    zoomRef.current = zoom
  }, [zoom])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === '0') {
        rotationRef.current = { ...DEFAULT_ROTATION }
        zoomRef.current = DEFAULT_ZOOM
        setZoom(DEFAULT_ZOOM)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const updateControl = (id, nextValue) => {
    setSettingsByPreset((current) => ({
      ...current,
      [presetKey]: {
        ...current[presetKey],
        [id]: nextValue,
      },
    }))
  }

  const onPointerDown = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      x: event.clientX,
      y: event.clientY,
      rotation: { ...rotationRef.current },
    }
  }

  const onPointerMove = (event) => {
    if (!dragRef.current) return
    const dx = event.clientX - dragRef.current.x
    const dy = event.clientY - dragRef.current.y
    rotationRef.current = {
      x: clamp(dragRef.current.rotation.x + dy * 0.0048, -0.65, 0.82),
      y: clamp(dragRef.current.rotation.y + dx * 0.0071, -1.45, 1.18),
      z: 0,
    }
  }

  const onPointerUp = () => {
    dragRef.current = null
  }

  const onWheel = (event) => {
    event.preventDefault()
    const nextZoom = clamp(zoomRef.current + event.deltaY * 0.0036, 3.1, 7.1)
    zoomRef.current = nextZoom
    setZoom(nextZoom)
  }

  const resetView = () => {
    rotationRef.current = { ...DEFAULT_ROTATION }
    zoomRef.current = DEFAULT_ZOOM
    setZoom(DEFAULT_ZOOM)
  }

  const halftoneEffectActive = presetKey === 'halftone' && !activeControls.disable

  return (
    <main className="toushi-page">
      <section className="toushi-shell">
        <header className="toushi-header">
          <div className="toushi-header__copy">
            <p className="toushi-eyebrow">digital specimen / banqiao</p>
            <h1>畲族头饰数字艺术预设实验室</h1>
            <p className="toushi-lede">
              在一台旧式电子设备里旋转旋钮，观察模型进入半调、字符编码、粒子云和像素化的实时视觉。
            </p>
          </div>
          <div className="toushi-header__meta">
            <span>S2 / observational model</span>
            <span>standalone specimen review</span>
          </div>
        </header>

        <section className="toushi-layout" aria-label="头饰预设实验室">
          <aside className="toushi-panel toushi-panel--left">
            <div className="toushi-panel__section">
              <p className="toushi-panel__label">model source</p>
              <div className="toushi-model-list">
                <button type="button" className={`toushi-model-button ${modelUrl === DEFAULT_MODEL ? 'is-active' : ''}`} onClick={() => setModelUrl(DEFAULT_MODEL)}>
                  <strong>畲族头饰 / PBR</strong><span>base_basic_pbr.glb</span>
                </button>
                <button type="button" className={`toushi-model-button ${modelUrl === EXTRA_MODEL ? 'is-active' : ''}`} onClick={() => setModelUrl(EXTRA_MODEL)}>
                  <strong>Banqiao object / web</strong><span>1c948...web.glb</span>
                </button>
              </div>
            </div>
            <div className="toushi-panel__section">
              <p className="toushi-panel__label">controls</p>
              <div className="toushi-chip-list">
                {VISIBLE_PRESETS.map((preset) => (
                  <PresetButton key={preset.key} preset={preset} active={preset.key === presetKey} onClick={() => setPresetKey(preset.key)} />
                ))}
              </div>
            </div>

            <div className="toushi-panel__section">
              <p className="toushi-panel__label">parameter bank</p>
              <div className="toushi-control-stack">
                {schema.map((control) => (
                  <ControlRow key={control.id} control={control} value={activeControls[control.id]} onChange={(value) => updateControl(control.id, value)} />
                ))}
              </div>
            </div>
          </aside>

          <section
            className={`toushi-stage-shell toushi-stage-shell--${presetKey} ${halftoneEffectActive ? 'is-halftone' : ''}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onPointerLeave={onPointerUp}
            onWheel={onWheel}
          >
            <div className="toushi-stage-shell__topline">
              <div>
                <strong>{activePreset.label}</strong>
                <span>{activePreset.summary}</span>
              </div>
              <div className="toushi-stage-shell__topmeta">
                <span>{model.status === 'ready' ? model.source.split('/').pop() : 'loading'}</span>
                <span>zoom {zoom.toFixed(2)}x</span>
              </div>
            </div>

            <SceneCanvas
              presetKey={presetKey}
              scene={model.scene}
              rotationRef={rotationRef}
              zoomRef={zoomRef}
              controls={activeControls}
            />

            <div className="toushi-crt-status" aria-live="polite">
              <span>信号 / {model.status === 'ready' ? '稳定' : '读取中'}</span>
              <span>预设 / {presetKey}</span>
              <span>放大 / {zoom.toFixed(2)}x</span>
            </div>

            {model.status === 'loading' && <LoadingState />}
            {model.status === 'error' && <ErrorState onRetry={() => setReloadToken((value) => value + 1)} />}

            <div className="toushi-stage-shell__bottom">
              <button type="button" className="toushi-action toushi-action--ghost" onClick={resetView}>
                reset view
              </button>
              <span>drag to orbit, wheel to zoom, 0 to reset</span>
            </div>
          </section>

          <aside className="toushi-panel toushi-panel--right">
            <div className="toushi-panel__section">
              <p className="toushi-panel__label">signal chain</p>
              <div className="toushi-chain">
                <span className="is-live">GLB</span>
                <span>Material</span>
                <span>Mask</span>
                <span>Feedback</span>
                <span>Output</span>
              </div>
            </div>

            <div className="toushi-panel__section">
              <p className="toushi-panel__label">preset readout</p>
              <div className="toushi-readout">
                <strong>{activePreset.kind}</strong>
                <p>{activePreset.summary}</p>
                <dl>
                  <div>
                    <dt>mode</dt>
                    <dd>{presetKey}</dd>
                  </div>
                  <div>
                    <dt>model</dt>
                    <dd>{model.source.split('/').pop()}</dd>
                  </div>
                  <div>
                    <dt>status</dt>
                    <dd>{model.status}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="toushi-panel__section">
              <p className="toushi-panel__label">field note</p>
              <ul className="toushi-notes">
                <li>模型为观察性建模，不作为精确测绘还原。</li>
                <li>数字效果用于观察材质、轮廓与结构关系。</li>
                <li>TouchDesigner 仅作为实时视觉参考，不替代现场证据。</li>
              </ul>
            </div>
          </aside>
        </section>
        <nav className="toushi-preset-rail" aria-label="数字艺术预设">
          {VISIBLE_PRESETS.map((preset) => (
            <button key={preset.key} type="button" className={`toushi-preset-rail__item ${preset.key === presetKey ? 'is-active' : ''}`} onClick={() => setPresetKey(preset.key)}>
              <span className={`toushi-preset-rail__mark toushi-preset-rail__mark--${preset.key}`} aria-hidden="true" />
              <strong>{preset.label}</strong>
              <small>{preset.kind}</small>
            </button>
          ))}
        </nav>
      </section>
    </main>
  )
}
