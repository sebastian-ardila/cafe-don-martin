/* ============================================================
   CAFÉ DON MARTÍN — Carta completa (página aparte)
   Datos transcritos de la carta oficial, separados por categoría.
   ============================================================ */
import './menu.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ---------------- Datos de la carta ---------------- */
const SECTIONS = [
  {
    id: 'clasicos-negros', theme: 'cream', kicker: 'Los Negros', title: 'Cafés Clásicos',
    blocks: [
      {
        subtitle: 'Filtrado Tradicional',
        desc: 'Disfruta de nuestra exclusiva jarra de café de especialidad, elaborada con microlotes cuidadosamente seleccionados. Cada mes, el café presenta un sabor único y especial, dependiendo de la variedad en cosecha. Seleccionamos lo mejor del café para asegurarnos de que cada taza sea una experiencia única.',
        items: [
          { name: '1 Taza', price: '6.500' },
          { name: '2 Tazas', price: '12.000' },
        ],
      },
      {
        divider: true,
        items: [
          { name: 'Espresso', price: '6.700', extra: 'Doble $7.500*', desc: 'Una explosión de sabor en una pequeña taza. Intenso y aromático.' },
          { name: 'Americano', temp: 'Frío o Caliente', price: '6.700', desc: 'Suave y balanceado, el perfecto acompañante para cualquier momento.' },
          { name: 'Campesino', temp: 'Frío o Caliente', price: '7.000', desc: 'Bebida de café filtrado, endulzada con panela.' },
          { name: 'Café Ginger Frío', tag: 'Recomendado', price: '16.300', desc: 'Una combinación innovadora de café espresso y ginger con un toque cítrico.' },
        ],
      },
    ],
  },
  {
    id: 'clasicos-blancos', theme: 'green', kicker: 'Los Blancos', title: 'Cafés Clásicos',
    note: 'Puedes reemplazar la leche por opciones vegetales de almendra o avena por un costo adicional de <strong>$2.400</strong>',
    blocks: [
      {
        items: [
          { name: 'Cappuccino', price: '$10.500', desc: 'Perfecta combinación de espresso con espuma de leche cremosa.' },
          { name: 'Capuccino Vainilla', price: '$13.500', desc: 'Punto ideal de cremosidad, delicioso aroma y sabor a vainilla.' },
          { name: 'Latte', temp: 'Frío o Caliente', price: '$9.400', desc: 'La suavidad de la leche al vapor y la potencia del espresso en cada sorbo.' },
          { name: 'Latte Caramelo', temp: 'Frío o Caliente', price: '$14.000', desc: 'La suavidad de la leche al vapor y la potencia del espresso en cada sorbo.' },
          { name: 'Mocaccino', temp: 'Frío o Caliente', price: '$14.000', desc: 'Espresso, leche vaporizada y un toque de chocolate colombiano.' },
        ],
      },
    ],
  },
  {
    id: 'especiales', theme: 'cream', kicker: 'Don Martín', title: 'Cafés Especiales',
    blocks: [
      {
        items: [
          { name: 'V60', sub: '(x2 Tazas)', price: '$18.500', extra: 'Taza Adicional *$4.500', desc: 'Método de filtrado manual que resalta los sabores frutales y florales de nuestro café de origen.' },
          { name: 'Prensa Francesa', sub: '(x3 Tazas)', price: '$18.000', extra: 'Taza Adicional *$4.500', desc: 'Método clásico de infusión que resalta el cuerpo y los sabores más profundos del café. Preparado en mesa, permitiendo disfrutar de la intensidad y suavidad del grano en una sola taza. Ideal para compartir y disfrutar lentamente.' },
        ],
      },
      {
        groupBadge: 'Los fríos',
        items: [
          { name: 'Cold Brew', price: '$8.900', desc: 'Café frío infusionado lentamente para obtener un sabor suave y refrescante.', options: ['Clásico', 'Con soda +$2.000', 'Con mandarina +$3.000'] },
          { name: 'Café filtrado frío', price: '$8.900', desc: 'Una opción refrescante de café filtrado en frío para resaltar su sabor suave y delicado.' },
          { name: 'Frappé en leche', price: '$10.500', desc: 'Café batido con leche, servido frío y cremoso.' },
          { name: 'Frappé con Chantilly', price: '$12.000', desc: 'Delicioso frappé de café, cubierto con una suave capa de crema chantilly.' },
          { name: 'Frappé de Vainilla', price: '$15.200', desc: 'Café batido con leche, servido con cremosa vainilla y chantilly.' },
          { name: 'Oreo Ice Cafe', price: '$17.300', desc: 'Latte frío con trozos de oreo y crema chantilly.' },
        ],
      },
    ],
  },
  {
    id: 'no-coffee', theme: 'green', kicker: 'Los Sin Café', title: 'No Coffee',
    blocks: [
      {
        items: [
          { name: 'Té Chai', temp: 'Frío o Caliente', price: '12.600', desc: 'Mezcla exótica de té negro con especias como canela, cardamomo y jengibre. Una bebida reconfortante con toques cálidos y especiados.' },
          { name: 'Matcha', temp: 'Frío o Caliente', price: '$12.100', desc: 'Delicado té verde en polvo de origen japonés, mezclado con leche al vapor para una bebida cremosa, llena de antioxidantes y energía natural.' },
          { name: 'Té Negro', temp: 'Caliente', price: '$10.000', desc: 'Infusión clásica de hojas de té negro, con un sabor fuerte y robusto. Perfecto para disfrutar solo o con un toque de leche.' },
          { name: 'Té Verde', temp: 'Caliente', price: '$10.000', desc: 'Infusión suave y refrescante de hojas de té verde, llena de antioxidantes y perfecta para cualquier momento del día.' },
          { name: 'Chocolate Caliente con Vainilla', price: '$11.500', desc: 'Chocolate negro derretido con leche y un toque de extracto de vainilla. Cremoso y perfecto para los amantes del chocolate.' },
          { name: 'Milo Frío', price: '$10.500', desc: 'Una versión refrescante del clásico Milo, mezclado con leche fría y cubierto con un toque de chocolate rallado.' },
          { name: 'Soda de Tamarindo', price: '$10.500', desc: 'Bebida refrescante de soda Bretaña mezclada con pulpa de tamarindo natural. Un equilibrio perfecto entre dulce y ácido.' },
          { name: 'Soda de Jengibre y Miel', price: '$10.500', desc: 'Una combinación vigorizante de soda Bretaña con jengibre fresco y un toque de miel. Ideal para revitalizar tus sentidos.' },
          { name: 'Soda de Frutos Amarillos', price: '$10.500', desc: 'Refrescante soda Bretaña mezclada con una combinación de frutos amarillos.' },
          { name: 'Infusión', price: '$8.900', desc: 'Maracuyá y jengibre con panela.' },
        ],
      },
    ],
  },
  {
    id: 'licores', theme: 'cream', kicker: 'Bebidas Exclusivas Don Martín', title: 'Bebidas Con Licor',
    blocks: [
      {
        items: [
          { name: 'Moscow Mule de la Casa', price: '$20.500', desc: 'Nuestra versión del clásico cóctel con un toque especial de la casa: vodka, ginger beer, limón y un toque secreto. Refrescante y equilibrado.' },
          { name: 'Espresso Martini', price: '$21.500', desc: 'La combinación perfecta de café espresso, vodka y licor de café, para quienes aman el café con un toque más fuerte.' },
          { name: 'Irish Coffee', price: '$26.800', desc: 'Café caliente con whisky irlandés y crema batida. Una deliciosa mezcla para los días fríos.' },
          { name: 'Negroni Cold Brew', price: '$26.800', desc: 'Nuestro twist al clásico Negroni, con una infusión de Cold Brew. Refrescante, amargo y profundo.' },
          { name: 'Carajillo', temp: 'Frío o Caliente', price: '$26.800', desc: 'Café espresso combinado con licor 43, una bebida sencilla pero muy elegante.' },
        ],
      },
    ],
  },
  {
    id: 'cervezas', theme: 'green', kicker: '¡Salud!', title: 'Cervezas',
    intro: 'Explora nuestra selección de cervezas para acompañar un buen café. Recuerda que la vida es demasiado corta para beber cerveza de manera aburrida.',
    blocks: [
      {
        items: [
          { name: 'Heineken', price: '$12.000', desc: 'Refrescante cerveza lager, perfecta para cualquier momento.' },
          { name: '3 Cordilleras', price: '$13.000', desc: 'Sabor artesanal y exquisito. Es una experiencia única.' },
          { name: 'Club Colombia Dorada', price: '$12.000', desc: 'Sabor suave y equilibrado, perfecta para acompañar nuestros platos y cafés.' },
          { name: 'Club Colombia Negra', price: '$12.000', desc: 'Cerveza oscura, con notas tostadas y un sabor profundo.' },
          { name: 'Club Colombia Roja', price: '$12.000', desc: 'Cerveza con un toque más maltoso y cuerpo robusto.' },
          { name: 'Cerveza Artesanal Local', price: '$13.000', desc: 'Consulta nuestra selección rotativa de cervezas artesanales de la región.' },
        ],
      },
    ],
  },
  {
    id: 'sanduches', theme: 'cream', kicker: 'Comidas y Acompañamientos', title: 'Los sánduches y las tostadas',
    intro: 'Disfruta de nuestra selección de platos preparados con ingredientes frescos y de la mejor calidad. Desde sándwiches artesanales hasta opciones para compartir.',
    blocks: [
      {
        items: [
          { name: 'Sánduche Philadelfia Pulled Pork', price: '$21.000', desc: 'Jugosa carne de cerdo desmechada, bañada en queso cheddar y cebolla caramelizada.' },
          { name: 'Sánduche Pollito', price: '$21.000', desc: 'Pollo desmenuzado con alioli de aguacate, guacamole, mayonesa de la casa y cebolla caramelizada.' },
          { name: 'Tostada Guacamole', price: '$17.000', desc: 'Guacamole fresco acompañado de queso cuajada y picadillo de tomate.' },
          { name: 'Sánduche Chicharrón', price: '$24.500', desc: 'Chicharrón caramelizado, servido con queso doble crema, cebollas encurtidas, tomate, limón y cilantro.' },
          { name: 'Sánduche Costillitas', price: '$24.500', desc: 'Costilla desmenuzada con salsa barbacoa, crema agria y cebolla crujiente.' },
        ],
      },
    ],
  },
  {
    id: 'sal-dulce', theme: 'green', kicker: 'Sal y dulce', title: 'Sal y dulce',
    intro: 'Perfectos para disfrutar y deleitarse en momentos casuales con amigos y familia.',
    blocks: [
      {
        groupBadge: 'Tortas',
        items: [
          { name: 'Torta Explosión de Chocolate', price: '$11.000', extra: 'Adiciona helado *$4.900', desc: 'Una irresistible torta de chocolate, rica y cremosa, perfecta para los amantes del cacao.' },
          { name: 'Genovesa de Beaylis', price: '$11.000' },
          { name: 'Torta de Almojábana', price: '$10.000' },
          { name: 'Torta de Chocolate y Maracuyá', price: '$10.500' },
        ],
      },
      {
        groupBadge: 'Hojaldres',
        items: [
          { name: 'New York Roll', sub: 'Relleno de Nutella', price: '$11.500' },
          { name: 'Croissant', sub: 'de Chocolate y Almendras', price: '$10.500' },
          { name: 'Croissant', sub: 'de Mantequilla', price: '$8.500' },
        ],
      },
      {
        groupBadge: 'Otros',
        items: [
          { name: 'Cheese Cake', sub: 'de Frutos Rojos', price: '$7.500' },
        ],
      },
    ],
  },
  {
    id: 'otras-bebidas', theme: 'green', kicker: 'Más opciones', title: 'Otras Bebidas',
    blocks: [
      {
        items: [
          { name: 'Agua', sub: 'Hatsu', price: '$7.500' },
          { name: 'Té', sub: 'Hatsu', price: '$8.000' },
          { name: 'Soda', sub: 'Bretaña', price: '$8.000' },
          { name: 'Canadá', sub: 'Dry', price: '$6.800' },
          { name: 'Gaseosa Postobón', sub: 'de dispensador', price: '$8.000' },
        ],
      },
    ],
  },
]

/* ---------------- SVG decorativo: rama de café ---------------- */
const BRANCH = `
<svg class="branch" viewBox="0 0 180 760" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
  <path d="M150 0 C150 120 95 180 110 320 C122 440 70 520 95 660 C108 720 100 760 100 760"
        stroke="currentColor" stroke-width="5" fill="none" opacity="0.9"/>
  ${[70, 200, 340, 480, 620].map((y, i) => {
    const dir = i % 2 === 0 ? 1 : -1
    const x = i % 2 === 0 ? 120 : 100
    return `
      <g transform="translate(${x} ${y})">
        <path d="M0 0 C${40 * dir} -28 ${78 * dir} -18 ${96 * dir} 8 C${66 * dir} 12 ${30 * dir} 16 0 0 Z"
              fill="currentColor" opacity="0.85"/>
        <path d="M0 0 L${92 * dir} 4" stroke="currentColor" stroke-width="2" opacity="0.5"/>
      </g>`
  }).join('')}
  ${[[120, 130], [98, 270], [124, 410], [96, 560], [118, 690]].map(([x, y]) => `
    <g transform="translate(${x} ${y})">
      <circle cx="0" cy="0" r="13" fill="currentColor" opacity="0.92"/>
      <circle cx="22" cy="10" r="11" fill="currentColor" opacity="0.92"/>
      <circle cx="8" cy="26" r="12" fill="currentColor" opacity="0.92"/>
      <circle cx="0" cy="0" r="3" fill="var(--seed)"/>
      <circle cx="22" cy="10" r="2.5" fill="var(--seed)"/>
      <circle cx="8" cy="26" r="2.6" fill="var(--seed)"/>
    </g>`).join('')}
</svg>`

/* ---------------- Render ---------------- */
function itemHTML(it) {
  const temp = it.temp ? `<span class="mi__temp">${it.temp}</span>` : ''
  const tag = it.tag ? `<span class="mi__tag">${it.tag}</span>` : ''
  const sub = it.sub ? `<span class="mi__sub">${it.sub}</span>` : ''
  const extra = it.extra ? `<span class="mi__extra">${it.extra}</span>` : ''
  const desc = it.desc ? `<p class="mi__desc">${it.desc}</p>` : ''
  const options = it.options
    ? `<div class="mi__options">${it.options.map((o) => `<span>${o}</span>`).join('')}</div>`
    : ''
  return `
    <div class="mi">
      <div class="mi__row">
        <span class="mi__name">${it.name} ${sub} ${temp} ${tag}</span>
        <span class="mi__dots"></span>
        <span class="mi__price">${it.price}</span>
      </div>
      ${extra ? `<div class="mi__extra-row">${extra}</div>` : ''}
      ${desc}
      ${options}
    </div>`
}

function blockHTML(b) {
  const head = b.subtitle ? `<h3 class="mblock__sub">${b.subtitle}</h3>` : ''
  const desc = b.desc ? `<p class="mblock__desc">${b.desc}</p>` : ''
  const badge = b.groupBadge ? `<span class="mblock__badge">${b.groupBadge}</span>` : ''
  const divider = b.divider ? '<div class="mblock__divider"></div>' : ''
  return `${divider}<div class="mblock">${badge}${head}${desc}<div class="mblock__items">${b.items.map(itemHTML).join('')}</div></div>`
}

function sectionHTML(s, i, total) {
  const note = s.note ? `<div class="msec__note"><span>Nota:</span> ${s.note}</div>` : ''
  const intro = s.intro ? `<p class="msec__intro">${s.intro}</p>` : ''
  const num = `${String(i + 1).padStart(2, '0')}`
  return `
    <section class="msec msec--${s.theme}" id="${s.id}">
      <div class="msec__inner">
        <header class="msec__head">
          <span class="msec__num">${num}<i>/${String(total).padStart(2, '0')}</i></span>
          <span class="msec__kicker">${s.kicker}</span>
          <h2 class="msec__title">${s.title}</h2>
        </header>
        ${note}
        ${intro}
        <div class="msec__body">${s.blocks.map(blockHTML).join('')}</div>
      </div>
      <div class="msec__branch">${BRANCH}</div>
    </section>`
}

function renderNav() {
  const links = document.getElementById('menuNavLinks')
  if (!links) return
  links.innerHTML = SECTIONS.map((s) => `<a href="#${s.id}" data-hover>${s.title}</a>`).join('')
}

function render() {
  const root = document.getElementById('menuRoot')
  root.innerHTML = SECTIONS.map((s, i) => sectionHTML(s, i, SECTIONS.length)).join('')
  renderNav()
}

/* ---------------- Cursor (reutilizado del sitio) ---------------- */
function initCursor() {
  if (window.matchMedia('(hover: none)').matches) return
  const ring = document.querySelector('.cursor')
  const dot = document.querySelector('.cursor-dot')
  if (!ring) return
  let rx = 0, ry = 0, dx = 0, dy = 0
  window.addEventListener('pointermove', (e) => {
    dx = e.clientX; dy = e.clientY
    dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`
  })
  function loop() {
    rx += (dx - rx) * 0.18; ry += (dy - ry) * 0.18
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`
    requestAnimationFrame(loop)
  }
  loop()
  document.addEventListener('pointerover', (e) => {
    if (e.target.closest('[data-hover], a, button')) ring.classList.add('is-hover')
  })
  document.addEventListener('pointerout', (e) => {
    if (e.target.closest('[data-hover], a, button')) ring.classList.remove('is-hover')
  })
}

/* ---------------- Init ---------------- */
function boot() {
  render()
  initCursor()
  document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear())

  // Smooth scroll
  let lenis
  if (!reducedMotion) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((t) => lenis.raf(t * 1000))
    gsap.ticker.lagSmoothing(0)
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href')
        if (id.length > 1) { e.preventDefault(); lenis.scrollTo(id, { offset: -104, duration: 1.3 }); closeMobile() }
      })
    })
  }

  // Menú móvil (navbar principal)
  const burger = document.getElementById('burger')
  const mobile = document.getElementById('mobileMenu')
  function closeMobile() { burger?.classList.remove('is-open'); mobile?.classList.remove('is-open') }
  burger?.addEventListener('click', () => { burger.classList.toggle('is-open'); mobile.classList.toggle('is-open') })

  // Reveals — encabezados y bloques
  gsap.utils.toArray('.msec__head, .msec__note, .msec__intro, .mblock__badge, .mblock__sub, .mblock__desc').forEach((el) => {
    gsap.from(el, { y: 30, opacity: 0, duration: .9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%' } })
  })
  // Ítems en cascada
  ScrollTrigger.batch('.mi', {
    start: 'top 94%',
    onEnter: (els) => gsap.from(els, { y: 22, opacity: 0, duration: .7, stagger: .06, ease: 'power3.out', overwrite: true }),
  })
  // Ramas decorativas
  gsap.utils.toArray('.msec__branch .branch').forEach((el) => {
    gsap.from(el, { y: 60, opacity: 0, duration: 1.4, ease: 'power3.out',
      scrollTrigger: { trigger: el.closest('.msec'), start: 'top 70%' } })
  })

  // Navbar principal: estado scrolled
  const nav = document.getElementById('topnav')
  ScrollTrigger.create({ start: 'top -60', onUpdate: (self) => nav.classList.toggle('is-scrolled', self.scroll() > 60) })

  // Barra de progreso de lectura
  const prog = document.getElementById('mprogress')
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (self) => { prog.style.transform = `scaleX(${self.progress})` } })

  // Scrollspy — categoría activa en el nav
  const navLinks = [...document.querySelectorAll('#menuNavLinks a')]
  SECTIONS.forEach((s) => {
    ScrollTrigger.create({
      trigger: `#${s.id}`, start: 'top 45%', end: 'bottom 45%',
      onToggle: (self) => {
        if (!self.isActive) return
        navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${s.id}`))
      },
    })
  })

  // Botón volver arriba
  const top = document.getElementById('mtop')
  ScrollTrigger.create({ start: 'top -500', end: 'max', onToggle: (self) => top.classList.toggle('is-visible', self.isActive) })
  top.addEventListener('click', () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.2 })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  })

  ScrollTrigger.refresh()
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot)
else boot()
