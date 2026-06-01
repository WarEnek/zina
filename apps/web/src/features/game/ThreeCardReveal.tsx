import { useEffect, useRef } from 'react'
import * as THREE from 'three'

type ThreeCardRevealProps = {
  revealId: string
  rarity: string
  cookieName: string
  tokenId: string
  isMinting: boolean
  reducedMotion: boolean
}

type SceneRefs = {
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  cardGroup: THREE.Group
  glow: THREE.Mesh
  particles: THREE.Points
  frontMaterial: THREE.MeshStandardMaterial
  backMaterial: THREE.MeshStandardMaterial
  ringMaterial: THREE.MeshBasicMaterial
  clock: THREE.Clock
  frameId: number
  resizeObserver: ResizeObserver
  dispose: () => void
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2
}

function easeOutBack(t: number) {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value))
}

function rarityColor(rarity: string) {
  switch (rarity) {
    case 'Common':
      return '#c05621'
    case 'Rare':
      return '#be185d'
    case 'Epic':
      return '#7e22ce'
    case 'Legendary':
      return '#ca8a04'
    case 'Mythic':
      return '#2563eb'
    default:
      return '#475569'
  }
}

function makeFrontTexture(rarity: string, cookieName: string, tokenId: string) {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1536
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    const fallback = new THREE.CanvasTexture(canvas)
    fallback.colorSpace = THREE.SRGBColorSpace
    return fallback
  }

  const accent = rarityColor(rarity)

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
  gradient.addColorStop(0, '#fbfdff')
  gradient.addColorStop(0.52, '#eff6ff')
  gradient.addColorStop(1, '#dbeafe')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const glow = ctx.createRadialGradient(canvas.width * 0.28, canvas.height * 0.12, 20, canvas.width * 0.28, canvas.height * 0.12, canvas.width * 0.8)
  glow.addColorStop(0, 'rgba(255,255,255,0.95)')
  glow.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.strokeStyle = 'rgba(147, 161, 191, 0.85)'
  ctx.lineWidth = 22
  ctx.strokeRect(22, 22, canvas.width - 44, canvas.height - 44)

  ctx.strokeStyle = accent
  ctx.lineWidth = 8
  ctx.strokeRect(74, 74, canvas.width - 148, canvas.height - 148)

  ctx.textAlign = 'center'
  ctx.fillStyle = accent
  ctx.font = '700 58px "Segoe UI", sans-serif'
  ctx.fillText(rarity.toUpperCase(), canvas.width / 2, 188)

  ctx.fillStyle = '#0f172a'
  ctx.font = '900 132px "Segoe UI", sans-serif'
  ctx.fillText('COOKIE', canvas.width / 2, 520)

  ctx.font = '900 110px "Segoe UI", sans-serif'
  ctx.fillText('FORGE', canvas.width / 2, 640)

  ctx.fillStyle = '#111827'
  ctx.font = '900 88px "Segoe UI", sans-serif'
  ctx.fillText(cookieName.toUpperCase(), canvas.width / 2, 900)

  ctx.font = '700 56px "Segoe UI", sans-serif'
  ctx.fillText(`TOKEN #${tokenId}`, canvas.width / 2, 1010)

  ctx.fillStyle = 'rgba(17, 24, 39, 0.85)'
  ctx.font = '700 44px "Segoe UI", sans-serif'
  ctx.fillText('On-chain reveal', canvas.width / 2, 1280)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  texture.needsUpdate = true
  return texture
}

function makeBackTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1536
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    const fallback = new THREE.CanvasTexture(canvas)
    fallback.colorSpace = THREE.SRGBColorSpace
    return fallback
  }

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
  gradient.addColorStop(0, '#3b82f6')
  gradient.addColorStop(0.48, '#1d4ed8')
  gradient.addColorStop(1, '#1e3a8a')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const stripe = ctx.createLinearGradient(0, 0, canvas.width, 0)
  stripe.addColorStop(0, 'rgba(255,255,255,0.02)')
  stripe.addColorStop(0.5, 'rgba(255,255,255,0.28)')
  stripe.addColorStop(1, 'rgba(255,255,255,0.02)')
  for (let y = -canvas.height; y < canvas.height * 2; y += 90) {
    ctx.fillStyle = stripe
    ctx.save()
    ctx.translate(0, y)
    ctx.rotate(-0.35)
    ctx.fillRect(-canvas.width * 0.4, 0, canvas.width * 1.8, 38)
    ctx.restore()
  }

  ctx.strokeStyle = 'rgba(219, 234, 254, 0.8)'
  ctx.lineWidth = 20
  ctx.strokeRect(26, 26, canvas.width - 52, canvas.height - 52)

  ctx.textAlign = 'center'
  ctx.fillStyle = '#dbeafe'
  ctx.font = '900 120px "Segoe UI", sans-serif'
  ctx.fillText('COOKIE', canvas.width / 2, 690)
  ctx.fillText('FORGE', canvas.width / 2, 820)

  ctx.fillStyle = 'rgba(219, 234, 254, 0.92)'
  ctx.font = '700 56px "Segoe UI", sans-serif'
  ctx.fillText('Mystery Drop', canvas.width / 2, 980)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  texture.needsUpdate = true
  return texture
}

function buildScene(container: HTMLDivElement, rarity: string, cookieName: string, tokenId: string): SceneRefs {
  const scene = new THREE.Scene()
  const width = container.clientWidth || 300
  const height = container.clientHeight || 280

  const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100)
  camera.position.set(0, 0.1, 5.2)

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(width, height, false)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  container.appendChild(renderer.domElement)

  scene.add(new THREE.AmbientLight('#dbeafe', 1.1))

  const keyLight = new THREE.DirectionalLight('#ffffff', 1.35)
  keyLight.position.set(3.1, 4, 4.8)
  scene.add(keyLight)

  const rimLight = new THREE.PointLight('#60a5fa', 1.45, 12)
  rimLight.position.set(-2.8, -1.2, 1.5)
  scene.add(rimLight)

  const cardGroup = new THREE.Group()
  scene.add(cardGroup)

  const cardBody = new THREE.Mesh(
    new THREE.BoxGeometry(2.36, 3.28, 0.06),
    new THREE.MeshStandardMaterial({ color: '#dbeafe', roughness: 0.48, metalness: 0.24 })
  )
  cardGroup.add(cardBody)

  const frontMaterial = new THREE.MeshStandardMaterial({ roughness: 0.36, metalness: 0.2 })
  frontMaterial.map = makeFrontTexture(rarity, cookieName, tokenId)

  const backMaterial = new THREE.MeshStandardMaterial({ roughness: 0.42, metalness: 0.18 })
  backMaterial.map = makeBackTexture()

  const frontFace = new THREE.Mesh(new THREE.PlaneGeometry(2.24, 3.18), frontMaterial)
  frontFace.position.z = 0.032
  cardGroup.add(frontFace)

  const backFace = new THREE.Mesh(new THREE.PlaneGeometry(2.24, 3.18), backMaterial)
  backFace.rotation.y = Math.PI
  backFace.position.z = -0.032
  cardGroup.add(backFace)

  const ringMaterial = new THREE.MeshBasicMaterial({
    color: rarityColor(rarity),
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide,
  })
  const glow = new THREE.Mesh(new THREE.RingGeometry(1.55, 1.86, 64), ringMaterial)
  glow.position.z = -0.58
  scene.add(glow)

  const particleCount = 82
  const particlePositions = new Float32Array(particleCount * 3)
  for (let i = 0; i < particleCount; i += 1) {
    const radius = 1.55 + Math.random() * 1.15
    const theta = Math.random() * Math.PI * 2
    const y = (Math.random() - 0.5) * 2.8
    particlePositions[i * 3] = Math.cos(theta) * radius
    particlePositions[i * 3 + 1] = y
    particlePositions[i * 3 + 2] = Math.sin(theta) * radius - 0.15
  }

  const particleGeometry = new THREE.BufferGeometry()
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))

  const particleMaterial = new THREE.PointsMaterial({
    color: '#ffffff',
    size: 0.048,
    transparent: true,
    opacity: 0.78,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })

  const particles = new THREE.Points(particleGeometry, particleMaterial)
  scene.add(particles)

  const resizeObserver = new ResizeObserver(() => {
    const nextWidth = container.clientWidth || 300
    const nextHeight = container.clientHeight || 280
    renderer.setSize(nextWidth, nextHeight, false)
    camera.aspect = nextWidth / nextHeight
    camera.updateProjectionMatrix()
  })
  resizeObserver.observe(container)

  const dispose = () => {
    resizeObserver.disconnect()
    cardBody.geometry.dispose()
    ;(cardBody.material as THREE.Material).dispose()
    frontFace.geometry.dispose()
    backFace.geometry.dispose()
    frontMaterial.map?.dispose()
    backMaterial.map?.dispose()
    frontMaterial.dispose()
    backMaterial.dispose()
    glow.geometry.dispose()
    ringMaterial.dispose()
    particleGeometry.dispose()
    particleMaterial.dispose()
    renderer.dispose()
    renderer.domElement.remove()
  }

  return {
    renderer,
    scene,
    camera,
    cardGroup,
    glow,
    particles,
    frontMaterial,
    backMaterial,
    ringMaterial,
    clock: new THREE.Clock(),
    frameId: 0,
    resizeObserver,
    dispose,
  }
}

export function ThreeCardReveal({ revealId, rarity, cookieName, tokenId, isMinting, reducedMotion }: ThreeCardRevealProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const sceneRef = useRef<SceneRefs | null>(null)
  const startRef = useRef(0)
  const mintingRef = useRef(isMinting)

  mintingRef.current = isMinting

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    if (sceneRef.current) {
      sceneRef.current.dispose()
      sceneRef.current = null
    }

    const scene = buildScene(container, rarity, cookieName, tokenId)
    sceneRef.current = scene
    startRef.current = performance.now()

    const animate = () => {
      if (!sceneRef.current) return
      const current = sceneRef.current
      const now = performance.now()
      const elapsedMs = now - startRef.current
      const t = clamp01(elapsedMs / 1850)

      const dropProgress = clamp01(t / 0.46)
      const flipProgress = clamp01((t - 0.36) / 0.4)
      const settleProgress = clamp01((t - 0.72) / 0.28)

      const hoverAmp = mintingRef.current ? 0.18 : 0.07
      const hoverWave = Math.sin(current.clock.getElapsedTime() * (mintingRef.current ? 4.8 : 2.2)) * hoverAmp

      if (reducedMotion) {
        current.cardGroup.position.set(0, 0, 0)
        current.cardGroup.rotation.set(-0.02, Math.PI, 0)
        current.cardGroup.scale.setScalar(1)
      } else {
        current.cardGroup.position.y = 2.9 * (1 - easeOutBack(dropProgress)) + hoverWave
        current.cardGroup.rotation.x = -0.08 + Math.sin(current.clock.getElapsedTime() * 1.8) * 0.015
        current.cardGroup.rotation.y = Math.PI * easeInOutCubic(flipProgress)

        const settle = 1 + Math.sin(settleProgress * Math.PI) * 0.06
        current.cardGroup.scale.setScalar(0.72 + 0.28 * easeOutCubic(dropProgress) * settle)
      }

      const pulse = 0.78 + Math.sin(current.clock.getElapsedTime() * (mintingRef.current ? 7 : 3)) * 0.22
      current.glow.scale.setScalar(1 + pulse * 0.16)
      current.ringMaterial.opacity = 0.2 + pulse * (mintingRef.current ? 0.22 : 0.16)
      current.glow.rotation.z += 0.0025

      current.particles.rotation.y += mintingRef.current ? 0.007 : 0.0035
      current.particles.rotation.x = Math.sin(current.clock.getElapsedTime() * 0.8) * 0.12

      current.renderer.render(current.scene, current.camera)
      current.frameId = requestAnimationFrame(animate)
    }

    scene.frameId = requestAnimationFrame(animate)

    return () => {
      if (!sceneRef.current) return
      cancelAnimationFrame(sceneRef.current.frameId)
      sceneRef.current.dispose()
      sceneRef.current = null
    }
  }, [revealId, rarity, cookieName, tokenId, reducedMotion])

  return <div className={`three-loot-scene ${isMinting ? 'three-loot-scene-pending' : ''}`} ref={containerRef} />
}
