/* ============================================================
   CAFÉ DON MARTIN — Orquestador principal
   ============================================================ */
import './style.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { initHero } from './three/hero.js'

gsap.registerPlugin(ScrollTrigger)

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ---------------- Cursor personalizado ---------------- */
function initCursor() {
  if (window.matchMedia('(hover: none)').matches) return
  const ring = document.querySelector('.cursor')
  const dot = document.querySelector('.cursor-dot')
  let rx = 0, ry = 0, dx = 0, dy = 0
  window.addEventListener('pointermove', (e) => {
    dx = e.clientX; dy = e.clientY
    dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`
  })
  function loop() {
    rx += (dx - rx) * 0.18
    ry += (dy - ry) * 0.18
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`
    requestAnimationFrame(loop)
  }
  loop()
  document.addEventListener('pointerover', (e) => {
    if (e.target.closest('[data-hover], a, button, .galeria__item, .mcard')) ring.classList.add('is-hover')
  })
  document.addEventListener('pointerout', (e) => {
    if (e.target.closest('[data-hover], a, button, .galeria__item, .mcard')) ring.classList.remove('is-hover')
  })
}

/* ---------------- Smooth scroll (Lenis) ---------------- */
let lenis
function initSmoothScroll() {
  if (reducedMotion) return
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)

  // Anclas internas con Lenis
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href')
      if (id.length > 1) {
        e.preventDefault()
        lenis.scrollTo(id, { offset: -20, duration: 1.4 })
        closeMobileMenu()
      }
    })
  })
}

/* ---------------- Animaciones de revelado ---------------- */
function initReveals() {
  // Hero (al cargar)
  const heroTl = gsap.timeline({ delay: 0.2 })
  heroTl
    .from('.hero__kicker', { y: 20, opacity: 0, duration: .9, ease: 'power3.out' })
    .from('.hero__brand', { y: 40, opacity: 0, duration: 1.2, ease: 'power4.out' }, '-=0.5')
    .from('.hero__sub', { y: 30, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.8')
    .from('.hero__actions', { y: 30, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.8')
    .from('.hero__scroll', { opacity: 0, duration: 1 }, '-=0.6')

  // Secciones (scroll)
  gsap.utils.toArray('.reveal').forEach((el) => {
    if (el.closest('.hero')) return
    gsap.from(el, {
      y: 50, opacity: 0, duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    })
  })

  // Imagen parallax
  gsap.utils.toArray('.parallax-img img').forEach((img) => {
    gsap.to(img, {
      yPercent: -12, ease: 'none',
      scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true },
    })
  })

  // Galería
  ScrollTrigger.batch('.galeria__item', {
    start: 'top 92%',
    onEnter: (els) => gsap.from(els, { y: 50, opacity: 0, scale: 0.96, duration: 0.9, stagger: 0.08, ease: 'power3.out', overwrite: true }),
  })
}

/* ---------------- Contadores ---------------- */
function initCounters() {
  document.querySelectorAll('.stat__num[data-count]').forEach((el) => {
    const end = parseInt(el.dataset.count, 10)
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: () => {
        gsap.fromTo(el, { innerText: 0 }, {
          innerText: end, duration: 1.6, ease: 'power2.out', snap: { innerText: 1 },
          onUpdate() { el.innerText = Math.round(this.targets()[0].innerText) },
        })
      },
    })
  })
}

/* ---------------- Nav scrolled + burger ---------------- */
function initNav() {
  const nav = document.getElementById('nav')
  ScrollTrigger.create({
    start: 'top -80',
    onUpdate: (self) => nav.classList.toggle('is-scrolled', self.scroll() > 80),
  })
  // fallback sin scrolltrigger
  window.addEventListener('scroll', () => nav.classList.toggle('is-scrolled', window.scrollY > 80), { passive: true })

  const burger = document.getElementById('burger')
  const menu = document.getElementById('mobileMenu')
  burger?.addEventListener('click', () => {
    burger.classList.toggle('is-open')
    menu.classList.toggle('is-open')
  })
}
function closeMobileMenu() {
  document.getElementById('burger')?.classList.remove('is-open')
  document.getElementById('mobileMenu')?.classList.remove('is-open')
}

/* ---------------- Lightbox ---------------- */
function initLightbox() {
  const lb = document.getElementById('lightbox')
  const lbImg = document.getElementById('lightboxImg')
  const close = document.getElementById('lightboxClose')
  document.querySelectorAll('.galeria__item').forEach((item) => {
    item.addEventListener('click', () => {
      lbImg.src = item.dataset.img
      lb.classList.add('is-open')
      lb.setAttribute('aria-hidden', 'false')
    })
  })
  const hide = () => { lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true') }
  close.addEventListener('click', hide)
  lb.addEventListener('click', (e) => { if (e.target === lb) hide() })
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') hide() })
}

/* ---------------- Preloader ---------------- */
function initPreloader(onDone) {
  const pre = document.getElementById('preloader')
  const finish = () => {
    setTimeout(() => {
      pre.classList.add('is-done')
      onDone?.()
    }, 1900)
  }
  if (document.readyState === 'complete') finish()
  else window.addEventListener('load', finish)
}

/* ---------------- Init ---------------- */
function boot() {
  document.getElementById('year').textContent = new Date().getFullYear()
  initCursor()
  initNav()
  initLightbox()

  // Three.js hero
  const canvas = document.getElementById('three-canvas')
  try { if (canvas) initHero(canvas) }
  catch (err) { console.warn('[3D] no disponible:', err) }

  initPreloader(() => {
    initSmoothScroll()
    initReveals()
    initCounters()
    ScrollTrigger.refresh()
  })
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot)
else boot()
