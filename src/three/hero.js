/* ============================================================
   Escena 3D del Hero — Three.js
   Granos de café flotando + sistema de partículas de "aroma/vapor"
   reactivo al movimiento del mouse.
   Tema CLARO (habano): material físico con clearcoat (brillo aceitoso
   del tostado), environment map para reflejos reales, tone mapping
   cinematográfico y luz de contorno para perfilar los granos.
   ============================================================ */
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

export function initHero(canvas) {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const scene = new THREE.Scene()
  // Niebla en tono crema/durazno de marca para fundir los granos lejanos
  scene.fog = new THREE.FogExp2(0xf6e6d2, 0.042)

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
  // Render cinematográfico: tone mapping filmico + espacio de color correcto
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.95
  renderer.outputColorSpace = THREE.SRGBColorSpace

  // ---------- Environment map (reflejos realistas) ----------
  const pmrem = new THREE.PMREMGenerator(renderer)
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environment = envTex

  // ---------- Luces ----------
  // Key cálida (sol de la mañana sobre el café)
  const key = new THREE.DirectionalLight(0xfff0d4, 2.4)
  key.position.set(6, 7, 8)
  scene.add(key)

  // Rim / contraluz suave: perfila los granos sin lavarlos
  const rim = new THREE.DirectionalLight(0xffe9c2, 1.4)
  rim.position.set(-7, 3, -6)
  scene.add(rim)

  // Acento verde sutil (marca) que aparece en los bordes
  const accent = new THREE.DirectionalLight(0x3a6b50, 0.7)
  accent.position.set(-4, -5, 3)
  scene.add(accent)

  scene.add(new THREE.AmbientLight(0xc7b08c, 0.35))

  const fill = new THREE.PointLight(0xffd9a0, 6, 28)
  fill.position.set(0, 0, 7)
  scene.add(fill)

  // ---------- Geometría de un grano de café ----------
  // Grano realista y ASIMÉTRICO: cuerpo ovalado que se estrecha en las puntas,
  // una cara plana con surco central en "S" y la cara opuesta convexa (la panza).
  function makeBeanGeometry() {
    const geo = new THREE.SphereGeometry(1, 96, 64)
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const nx = pos.getX(i), ny = pos.getY(i), nz = pos.getZ(i)
      // Estrechamiento hacia las puntas (extremos del eje largo Y) → forma de óvalo/almendra
      const taper = 1 - Math.pow(Math.abs(ny), 3) * 0.18
      const x = nx * 0.64 * taper
      const y = ny * 1.0
      let z
      if (nz > 0) {
        // Cara frontal: casi plana, con un surco central sinuoso (en S) a lo largo de Y
        const sCurve = Math.sin(ny * 1.5) * 0.1           // serpenteo del surco
        const dx = nx - sCurve
        const groove = Math.exp(-(dx * dx) / 0.03) * nz * 0.22  // profundo al centro, se desvanece al borde
        z = nz * 0.28 - groove
      } else {
        // Cara trasera: panza convexa (más abombada que la frontal)
        z = nz * 0.5
      }
      pos.setXYZ(i, x, y, z)
    }
    geo.computeVertexNormals()
    return geo
  }

  const beanGeo = makeBeanGeometry()

  // Material físico: café tostado con brillo aceitoso (clearcoat) y
  // reflejos del environment. Dos tonos para variedad natural.
  function beanMaterial(color) {
    return new THREE.MeshPhysicalMaterial({
      color, roughness: 0.5, metalness: 0.0,
      clearcoat: 0.4, clearcoatRoughness: 0.45,
      sheen: 0.25, sheenColor: new THREE.Color(0x6b3f1d),
      envMapIntensity: 0.45, // reflejo del entorno reducido para que no se laven sobre fondo claro
    })
  }
  const beanMats = [
    beanMaterial(0x3a2012), // tueste oscuro
    beanMaterial(0x4a2814), // tueste medio
    beanMaterial(0x25140c), // tueste muy oscuro
  ]

  // ---------- Campo de granos ----------
  const beans = []
  const beanCount = prefersReduced ? 14 : 32
  const beanGroup = new THREE.Group()
  for (let i = 0; i < beanCount; i++) {
    const m = new THREE.Mesh(beanGeo, beanMats[i % beanMats.length])
    const r = 4.8 + Math.random() * 7
    const a = Math.random() * Math.PI * 2
    const y = (Math.random() - 0.5) * 12
    m.position.set(Math.cos(a) * r, y, Math.sin(a) * r - 3)
    const s = 0.42 + Math.random() * 0.55
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
      depth: (r - 3.5) / 7.5,
    }
    beanGroup.add(m)
    beans.push(m)
  }
  scene.add(beanGroup)

  // ---------- Partículas de aroma / motas de café ----------
  const pCount = prefersReduced ? 380 : 900
  const pGeo = new THREE.BufferGeometry()
  const positions = new Float32Array(pCount * 3)
  const speeds = new Float32Array(pCount)
  for (let i = 0; i < pCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 26
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20
    positions[i * 3 + 2] = (Math.random() - 0.5) * 14 - 2
    speeds[i] = 0.2 + Math.random() * 0.8
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  // Textura de partícula circular suave (canvas → sprite)
  const pTex = (() => {
    const c = document.createElement('canvas')
    c.width = c.height = 64
    const ctx = c.getContext('2d')
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    g.addColorStop(0, 'rgba(122,74,36,0.95)')
    g.addColorStop(0.4, 'rgba(90,55,28,0.4)')
    g.addColorStop(1, 'rgba(90,55,28,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 64, 64)
    return new THREE.CanvasTexture(c)
  })()

  // Blending normal (no aditivo) para que las motas se vean sobre fondo claro
  const pMat = new THREE.PointsMaterial({
    size: 0.15, map: pTex, transparent: true, depthWrite: false,
    blending: THREE.NormalBlending, opacity: 0.5, sizeAttenuation: true,
    color: 0x8a5a32,
  })
  const points = new THREE.Points(pGeo, pMat)
  scene.add(points)

  // ---------- Interacción con el mouse ----------
  const mouse = new THREE.Vector2(0, 0)
  const targetM = new THREE.Vector2(0, 0)
  window.addEventListener('pointermove', (e) => {
    targetM.x = (e.clientX / window.innerWidth - 0.5) * 2
    targetM.y = (e.clientY / window.innerHeight - 0.5) * 2
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
    mouse.x += (targetM.x - mouse.x) * 0.05
    mouse.y += (targetM.y - mouse.y) * 0.05

    // Granos: rotación + flotación
    for (const b of beans) {
      const u = b.userData
      b.rotation.x += u.rotSpeed.x * dt
      b.rotation.y += u.rotSpeed.y * dt
      b.rotation.z += u.rotSpeed.z * dt
      b.position.y = u.baseY + Math.sin(t * u.floatSpeed + u.phase) * u.floatAmp
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
      pos.setX(i, pos.getX(i) + Math.sin(t * 0.3 + i) * 0.002 + mouse.x * 0.004)
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
