# ☕ Café Don Martin — Sitio web premium

Landing de una sola página para **Café Don Martin**, café de especialidad en la Av. Circunvalar #5-83 (frente al Parque Arboleda, 2° piso de La Patatería), Pereira, Risaralda.

Estética *luxury specialty coffee*: espresso oscuro + dorado champagne, escena 3D en Three.js (granos flotando + partículas de aroma reactivas al mouse), smooth-scroll, animaciones GSAP, cursor personalizado, tarjetas con tilt 3D, galería con lightbox y grain overlay.

## 🛠️ Stack

- **Vite** (build estático)
- **Three.js** — escena 3D del hero
- **GSAP + ScrollTrigger** — animaciones de scroll
- **Lenis** — smooth scroll
- CSS custom (sin frameworks)

## 🚀 Desarrollo

```bash
npm install
npm run dev      # servidor local con hot-reload
npm run build    # genera /dist (estático)
npm run preview  # sirve /dist localmente
```

## 🖼️ Reemplazar las imágenes por las reales del Instagram

Las fotos actuales en `public/assets/images/` son **placeholders premium** (Unsplash, libres). Instagram bloquea la descarga automática, así que reemplázalas manualmente:

1. Entra a [@cafedonmartin_](https://www.instagram.com/cafedonmartin_/) y descarga las fotos del local.
2. Sustituye los archivos en `public/assets/images/` **manteniendo el mismo nombre** (p. ej. `latte-art.jpg`, `cafe-interior.jpg`, `barista.jpg`…), o cambia las rutas en `index.html`.
3. `npm run build` y vuelve a desplegar.

> Tamaño recomendado: ~1600px de ancho, JPG optimizado (<400 KB).

## 📦 Despliegue

### Opción A — S3 + CloudFront

```bash
npm run build
aws s3 sync dist/ s3://TU-BUCKET --delete
aws cloudfront create-invalidation --distribution-id TU_DIST_ID --paths "/*"
```

El `base` por defecto es `/` (raíz del dominio), ideal para CloudFront con dominio propio.

### Opción B — GitHub Pages

Si publicas en `https://usuario.github.io/cafe-don-martin/`, compila con el subpath:

```bash
BASE=/cafe-don-martin/ npm run build
```

El workflow incluido en `.github/workflows/deploy.yml` lo hace automáticamente en cada push a `main`. Solo activa **Settings → Pages → Source: GitHub Actions** en el repositorio.

Si usas un **dominio propio** en GitHub Pages (CNAME), deja `base` en `/` (no pases `BASE`).

## 📍 Datos del local

- **Dirección:** Av. Circunvalar #5-83, 2° piso de La Patatería (frente al Parque Arboleda)
- **Ciudad:** Pereira, Risaralda, Colombia
- **Instagram:** [@cafedonmartin_](https://www.instagram.com/cafedonmartin_/)

> ✏️ Edita el número de WhatsApp (`wa.me/573000000000`) y los horarios en `index.html` por los reales.
