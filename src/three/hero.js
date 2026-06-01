/* ============================================================
   Escena 3D del Hero — Three.js
   Granos de café flotando + sistema de partículas de "aroma/vapor"
   reactivo al movimiento del mouse. Paleta espresso + dorado.
   ============================================================ */
import * as THREE from 'three'

export function initHero(canvas) {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const scene = new THREE.Scene()
  // Niebla en tono habano para fundir los granos lejanos con el fondo claro
  scene.fog = new THREE.FogExp2(0xece1ce, 0.05)

  const camera = new THREE.PerspectiveCamera(
    42, window.innerWidth / window.innerHeight, 0.1, 100
  )
  camera.position.set(0, 0, 14)

  const renderer = new THREE.WebGLRenderer({
    canvas, antialias: true, alpha: true, powerPreference: 'high-performance',
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0)

  // ---------- Luces (calibradas para fondo claro habano) ----------
  const key = new THREE.DirectionalLight(0xfff1d8, 3.0)
  key.position.set(5, 6, 8)
  scene.add(key)

  const rim = new THREE.DirectionalLight(0x2f5740, 1.4) // rim verde sutil (marca)
  rim.position.set(-6, -2, -4)
  scene.add(rim)

  scene.add(new THREE.AmbientLight(0xd8c6a6, 1.6))

  const fill = new THREE.PointLight(0xbd9263, 10, 30)
  fill.position.set(0, 0, 6)
  scene.add(fill)

  // ---------- Geometría de un grano de café ----------
  // Esfera deformada con una hendidura central (el "surco" del grano)
  function makeBeanGeometry() {
    const geo = new THREE.SphereGeometry(1, 48, 32)
    const pos = geo.attributes.position
    const v = new THREE.Vector3()
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i)
      // Aplanar en Z para forma ovalada de grano
      v.z *= 0.62
      v.y *= 1.18
      // Surco central: empujar hacia adentro cerca de x≈0
      const groove = Math.exp(-(v.x * v.x) / 0.05) * 0.32
      v.z -= Math.sign(v.z || 1) * groove * (v.z >= 0 ? 1 : 1)
      v.multiplyScalar(1 + Math.sin(v.y * 2.0) * 0.015)
      pos.setXYZ(i, v.x, v.y, v.z)
    }
    geo.computeVertexNormals()
    return geo
  }

  const beanGeo = makeBeanGeometry()
  const beanMat = new THREE.MeshStandardMaterial({
    color: 0x4a2c18, roughness: 0.5, metalness: 0.2,
    emissive: 0x2a1608, emissiveIntensity: 0.15,
  })

  // ---------- Campo de granos ----------
  const beans = []
  const beanCount = prefersReduced ? 14 : 30
  const beanGroup = new THREE.Group()
  for (let i = 0; i < beanCount; i++) {
    const m = new THREE.Mesh(beanGeo, beanMat)
    const r = 4 + Math.random() * 7
    const a = Math.random() * Math.PI * 2
    const y = (Math.random() - 0.5) * 12
    m.position.set(Math.cos(a) * r, y, Math.sin(a) * r - 3)
    const s = 0.35 + Math.random() * 0.7
    m.scale.setScalar(s)
    m.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
    m.userData = {
      rotSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.4
      ),
      floatSpeed: 0.3 + Math.random() * 0.5,
      floatAmp: 0.3 + Math.random() * 0.6,
      baseY: y,
      phase: Math.random() * Math.PI * 2,
      depth: (r - 4) / 7,
    }
    beanGroup.add(m)
    beans.push(m)
  }
  scene.add(beanGroup)

  // ---------- Partículas de aroma / vapor ----------
  const pCount = prefersReduced ? 400 : 1100
  const pGeo = new THREE.BufferGeometry()
  const positions = new Float32Array(pCount * 3)
  const speeds = new Float32Array(pCount)
  const sizes = new Float32Array(pCount)
  for (let i = 0; i < pCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 26
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20
    positions[i * 3 + 2] = (Math.random() - 0.5) * 14 - 2
    speeds[i] = 0.2 + Math.random() * 0.8
    sizes[i] = Math.random() * 0.08 + 0.02
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  pGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  // Textura de partícula circular suave (canvas → sprite)
  const pTex = (() => {
    const c = document.createElement('canvas')
    c.width = c.height = 64
    const ctx = c.getContext('2d')
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    g.addColorStop(0, 'rgba(154,108,63,0.95)')
    g.addColorStop(0.4, 'rgba(120,84,48,0.45)')
    g.addColorStop(1, 'rgba(120,84,48,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 64, 64)
    const t = new THREE.CanvasTexture(c)
    return t
  })()

  // Blending normal (no aditivo) para que las motas se vean sobre fondo claro
  const pMat = new THREE.PointsMaterial({
    size: 0.16, map: pTex, transparent: true, depthWrite: false,
    blending: THREE.NormalBlending, opacity: 0.55, sizeAttenuation: true,
    color: 0x9a6c3f,
  })
  const points = new THREE.Points(pGeo, pMat)
  scene.add(points)

  // ---------- Interacción con el mouse ----------
  const mouse = new THREE.Vector2(0, 0)
  const target = new THREE.Vector2(0, 0)
  window.addEventListener('pointermove', (e) => {
    target.x = (e.clientX / window.innerWidth - 0.5) * 2
    target.y = (e.clientY / window.innerHeight - 0.5) * 2
  })

  // ---------- Scroll parallax ----------
  let scrollY = 0
  window.addEventListener('scroll', () => { scrollY = window.scrollY }, { passive: true })

  // ---------- Animación ----------
  const clock = new THREE.Clock()
  let frameId

  function animate() {
    frameId = requestAnimationFrame(animate)
    const t = clock.getElapsedTime()
    const dt = clock.getDelta()

    // Suavizado del mouse
    mouse.x += (target.x - mouse.x) * 0.05
    mouse.y += (target.y - mouse.y) * 0.05

    // Granos: rotación + flotación + repulsión sutil del cursor
    for (const b of beans) {
      const u = b.userData
      b.rotation.x += u.rotSpeed.x * dt
      b.rotation.y += u.rotSpeed.y * dt
      b.rotation.z += u.rotSpeed.z * dt
      b.position.y = u.baseY + Math.sin(t * u.floatSpeed + u.phase) * u.floatAmp
      // parallax por profundidad respecto al mouse
      b.position.x += (mouse.x * (1 + u.depth * 2) - (b.position.x - Math.cos(u.phase) * 6) * 0) * 0
    }

    // El grupo entero reacciona al mouse (parallax orbital)
    beanGroup.rotation.y += (mouse.x * 0.4 - beanGroup.rotation.y) * 0.04
    beanGroup.rotation.x += (-mouse.y * 0.25 - beanGroup.rotation.x) * 0.04

    // Partículas: ascenso tipo vapor
    const pos = pGeo.attributes.position
    for (let i = 0; i < pCount; i++) {
      let y = pos.getY(i) + speeds[i] * dt * 0.6
      if (y > 11) y = -11
      pos.setY(i, y)
      // deriva horizontal con el mouse
      let x = pos.getX(i) + Math.sin(t * 0.3 + i) * 0.002 + mouse.x * 0.004
      pos.setX(i, x)
    }
    pos.needsUpdate = true
    points.rotation.y = mouse.x * 0.1

    // Cámara: parallax suave + leve dolly por scroll
    camera.position.x += (mouse.x * 1.2 - camera.position.x) * 0.04
    camera.position.y += (-mouse.y * 0.8 - camera.position.y) * 0.04
    camera.position.z = 14 + Math.min(scrollY * 0.004, 6)
    camera.lookAt(0, 0, 0)

    fill.position.x = mouse.x * 4
    fill.position.y = -mouse.y * 4

    renderer.render(scene, camera)
  }
  animate()

  // ---------- Resize ----------
  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }
  window.addEventListener('resize', onResize)

  // Pausar cuando no es visible (ahorro de batería)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(frameId)
    else animate()
  })

  return { scene, camera, renderer }
}
