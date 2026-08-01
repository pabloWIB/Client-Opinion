# Registro de cambios — reorganización de julio de 2026

Todo el trabajo es local. No se ejecutó ningún comando de git: los cambios están
en el árbol de trabajo, sin añadir ni confirmar.

El estado de partida está documentado en [auditoria.md](auditoria.md).

---

## Fase 1 — Auditoría

- Inventariados los 12 archivos de la raíz: propósito, peso, dimensiones y
  referencias entrantes de cada uno.
- Medidas las imágenes con ImageMagick y confirmadas las que nadie usaba
  (`icon.png`, `flowerChecked.png`) con búsqueda de texto en todo el proyecto.
- Búsqueda de credenciales (`api_key`, `token`, `secret`, `password`, `Bearer`,
  `sk_`, `pk_`, `AKIA`): sin resultados.
- Escrito `docs/auditoria.md`.

## Fase 2 — Estructura

Los 12 archivos sueltos pasan a una jerarquía:

| Antes | Después |
|---|---|
| `normalize.css` + `styles.css` | `assets/css/base.css`, `assets/css/layout.css`, `assets/css/components.css` |
| `script.js` | `assets/js/main.js` |
| `google.svg` | `assets/img/logo/google.svg` |
| `icon.png` | `assets/img/logo/wib-icon.png` |
| `flower.png` | `assets/img/icons/flower.png` |
| `flowerChecked2.png` | `assets/img/icons/flower-active.png` |
| `Client-Opinion.png` | `assets/img/content/og-cover.png` |

- Nombres en minúsculas y con guiones. Fuera el `2` de `flowerChecked2`, que era
  un número de versión disfrazado de nombre.
- Creado `404.html` con la misma cabecera y pie que la página principal y un
  botón real de vuelta a las reseñas.
- **No** se creó `assets/js/modules/`: con un solo componente quedaría vacía. Y
  hay un motivo de fondo para no partir el JS en módulos ES: `index.html` tiene
  que poder abrirse a doble clic desde el disco, y `file://` bloquea los
  `import` por CORS. `main.js` es un script clásico con `defer`, envuelto en una
  IIFE para no dejar nada en el ámbito global.
- Actualizadas las 17 rutas internas de HTML, CSS y JS, y comprobada una por una
  contra el disco.

## Fase 3 — Higiene

- Eliminado `styles.scss`. Era una copia desincronizada de `styles.css` que
  apuntaba a `../IMG/flower.png`, una carpeta inexistente: recompilarlo habría
  roto los indicadores. Mantener el mismo diseño escrito dos veces y a mano ya
  había fallado una vez.
- Eliminado `flowerChecked.png` (variante rosa del indicador, sin usar).
- Eliminado el `<style></style>` vacío del `<head>`.
- Eliminado jQuery slim 3.0.0-beta1 desde cdnjs: no había ni una llamada `$` en
  el proyecto. Se ahorra una petición a un tercero y ~24 KB.
- Eliminada la regla `* { transition: .3s }`, que ponía una transición sobre
  todas las propiedades de todos los elementos del documento.
- Eliminada la declaración inválida `cursor: #474747`.
- Eliminados unos 40 prefijos `-webkit-box` / `-ms-flexbox` de la salida de Sass.
- Creado `.gitignore` para el stack real: sistema operativo, editores, `node_modules/`,
  `.env`, logs, `.vercel/` y `dist/`.
- Formato normalizado en todos los archivos: indentación de 2 espacios, comillas
  dobles en los atributos HTML, punto y coma en JS y un salto de línea al final.
  Comprobado con un script: sin tabuladores y sin espacios sobrantes.

## Fase 4 — Imágenes

Sin descargar ni inventar ninguna. Solo se ha trabajado con las que ya estaban:

| Imagen | Antes | Después | Cómo |
|---|---|---|---|
| `og-cover.png` | 1024×1024, 540.3 KB | 1200×630, 21.4 KB | Redimensionada a proporción Open Graph sobre fondo blanco y cuantizada a 64 colores |
| `wib-icon.png` | 492×492, 42.7 KB | 180×180, 4.5 KB | Redimensionada al tamaño real de un favicon / icono táctil |
| `flower.png` | 100×100, 2.7 KB | 100×100, 0.8 KB | Cuantizada a 32 colores (es una línea negra sobre transparente) |
| `flower-active.png` | 100×100, 4.1 KB | 100×100, 1.2 KB | Igual |

- Las cuatro imágenes juntas bajan de **589.8 KB a 27.9 KB**, un 95 % menos.
- Ninguna supera ya los 200 KB, así que no hace falta convertir nada a WebP. Se
  quedan en PNG, que es lo que aceptan sin excepciones los rastreadores que leen
  la etiqueta `og:image`.
- El favicon apuntaba al PNG de 540 KB; ahora apunta al icono de 4.5 KB, que era
  justo para lo que se había subido.
- El logo de Google lleva `width`, `height` y un `alt` real ("Google Reviews").
  No lleva `loading="lazy"`: está por encima del pliegue.
- Los indicadores se pintan por CSS, no por `<img>`, así que no aplican `width`
  ni `alt`; su significado lo lleva el `aria-label` del botón.

## Fase 5 — HTML, SEO y accesibilidad

- Estructura semántica: `<header>`, `<main>`, `<section>`, `<figure>`,
  `<blockquote>`, `<footer>`. Antes todo colgaba de `<header>`.
- Un `<h1>` por página. La página principal empezaba en `<h2>`.
- `<head>` completo en las dos páginas: `title` único (57 y 51 caracteres),
  `description` única (150 en las dos), `canonical`, Open Graph (`type`, `url`,
  `title`, `description`, `image`) y favicon. El `og:image` apunta a un archivo
  que existe de verdad.
- `404.html` lleva además `noindex`.
- Accesibilidad:
  - Los indicadores pasan de `<div>` a `<button>` con `aria-label` que nombra al
    cliente ("Show review 2: Michael Ramirez") y `aria-current` que marca cuál está
    activo.
  - Los botones anterior/siguiente, que estaban vacíos, llevan un SVG en línea y
    su `aria-label`.
  - Las reseñas ocultas se marcan con `inert` y `aria-hidden`, de modo que el
    lector de pantalla solo ve la que está en pantalla.
  - El visor es una región `aria-live="polite"`: al cambiar de reseña, se anuncia.
  - Foco visible en todo elemento interactivo mediante `:focus-visible`.
  - Contraste medido sobre la página ya renderizada en las 8 combinaciones de
    texto. El mínimo es 5.44:1, por encima del 4.5:1 exigido.
- Creados `robots.txt` (con `Disallow` del 404 y enlace al sitemap) y
  `sitemap.xml` con la URL real del sitio.
- Corregida la comilla de apertura que le faltaba al primer testimonio.
- Comillas y apóstrofos tipográficos en las cuatro reseñas.

## Fase 6 — CSS y sistema de diseño

- 37 variables en `:root`: color, espaciado, tipografía, radios, sombras,
  transiciones y anchos de layout. Comprobado que no queda ninguna sin usar.
- La paleta se deriva de lo que ya usaba el sitio: el texto `#474747` que estaba
  en el CSS y el lavanda `#b879ea` muestreado del propio archivo del indicador
  activo. Como ese lavanda no llega a 4.5:1 sobre blanco, se derivan dos tonos
  más oscuros (`#7c3fbe`, `#62309a`) para lo que lleva texto; el original se
  queda para lo decorativo.
- Escala de espaciado 4 / 8 / 16 / 24 / 32 / 48 / 64 / 96. Ya no hay valores
  sueltos como `bottom: -5px` o `height: 182.5px`.
- Una sola familia tipográfica, Roboto, en tres pesos. Antes se pedían cinco
  pesos de Roboto **más** Inconsolata entera, que no aparecía en ninguna regla.
- Fuera los tamaños en `vh`: el texto ya no encoge al girar el móvil. En su
  lugar, `clamp()` sobre `rem`.
- Orden dentro de cada archivo: variables → reset → base → layout → componentes →
  utilidades → media queries.
- El único `!important` que queda son los tres del bloque
  `prefers-reduced-motion`, donde es el uso correcto.
- Ningún selector pasa de tres niveles, no queda ni un estilo en línea y las
  reglas duplicadas del original (`background-size` declarado dos veces en cada
  indicador) desaparecen.

## Fase 7 — Responsive

- Mobile-first con `min-width` en 480 / 768 / 1024. Antes: cero media queries.
- **Corregido el fallo central del proyecto.** El ancho `1100px` estaba escrito a
  mano en dos sitios: en el CSS (`.carousel-container`, `.slide`) y en el JS
  (`index * -1100`). Ahora cada reseña ocupa `flex: 0 0 100%` y el track se
  desplaza en porcentajes, así que el carrusel se ajusta solo a cualquier ancho y
  no queda ninguna cifra mágica que mantener sincronizada entre dos lenguajes.
- Eliminado `overflow: hidden` del `body`, que tapaba el desbordamiento en vez de
  arreglarlo.
- Comprobado con medición real, no a ojo, en 360, 480, 768, 1024 y 1440 px:
  `scrollWidth` nunca supera `innerWidth`, la fila de controles cabe siempre y el
  objetivo táctil más pequeño de la página mide 44×44 px.
- Las cuatro tarjetas miden lo mismo (305 px en escritorio), así que el layout no
  salta al cambiar de reseña.
- No hay tablas ni bloques de código en la página.

## Fase 8 — UX / UI

- Jerarquía: marca, sello de Google, antetítulo, `<h1>` y la reseña. Se entiende
  de un vistazo qué es esto.
- Estados completos en todo lo interactivo: `default`, `hover`, `focus-visible`,
  `active` y `disabled`, con transiciones de 150 ms y 250 ms.
- Las flechas se deshabilitan de verdad en los extremos, en lugar de quedarse
  aparentemente pulsables sin hacer nada.
- Longitud de línea medida carácter a carácter sobre la página renderizada: el
  ancho máximo (`--measure: 52ch`) da 70 caracteres por línea en la más larga,
  dentro del rango de 60-75.
- El carrusel se limita a 880 px para que la tarjeta enmarque el texto en lugar
  de dejar dos franjas vacías a los lados.
- Sin gradientes, sin sombras exageradas y sin animaciones de adorno.

**Lo que no se ha añadido:** no hay CTA principal en la portada. Un botón de
"pedir flores" o "dejar tu reseña" tendría que apuntar a una tienda o a una ficha
de Google que no existen, y un botón que no lleva a ninguna parte es peor que
ningún botón. Los únicos enlaces de la página son reales: el repositorio y
wib.digital, los dos comprobados con respuesta 200.

## Fase 9 — JavaScript

- Todo dentro de una IIFE con `"use strict"`: cero variables globales sueltas,
  cero `var`.
- Arreglada la indentación rota del original, donde `updateIndicator` y
  `scrollToSlide` habían quedado pegadas en la misma línea.
- Cada consulta al DOM está protegida: si falta una pieza del marcado, el
  componente se rinde y deja las reseñas como texto legible en lugar de reventar.
- Los indicadores usan **un solo listener delegado** en la raíz del carrusel, en
  lugar de uno por punto.
- Se añaden dos formas de navegar que antes no existían: teclado (flechas
  izquierda y derecha con el foco dentro del carrusel) y gesto de deslizar en
  móvil. El deslizamiento se limita a dedo y lápiz para que en escritorio se
  pueda seguir seleccionando el texto de la reseña con el ratón.
- La rueda del ratón deja de secuestrar la página: `preventDefault` solo se
  llama cuando el carrusel se mueve de verdad. Al llegar a la última reseña, la
  rueda vuelve a desplazar la página. Además hay un bloqueo de 420 ms para que un
  golpe de rueda no salte tres reseñas de una vez.
- Cero errores y cero avisos en consola, comprobado en las dos páginas y también
  abriendo el archivo con `file://`.

## Fase 10 — Rendimiento

- `@import` de Google Fonts sacado del CSS y puesto en el `<head>` con
  `preconnect` a los dos orígenes y `display=swap`. El `@import` bloqueaba el
  render porque solo se descubría después de descargar la hoja de estilos.
- Se piden 3 pesos de una familia en lugar de 5 pesos de una y una segunda
  familia entera. Una única petición de fuente.
- El script va con `defer`.
- Los tres CSS se cargan en orden en el `<head>`: entre los tres suman menos de
  12 KB, así que separarlos en crítico y diferido añadiría un parpadeo de estilos
  sin ganar nada.
- **Primera carga: 30.6 KB** de archivos propios, más unos 16 KB de la fuente
  remota. El objetivo era menos de 1 MB.
- Ninguna librería: se eliminó la única que había, y no se usaba.

## Fase 11 — QA

Comprobado con un script sobre el disco y con el navegador abierto en las dos
páginas:

| Comprobación | Resultado |
|---|---|
| Enlaces de cabecera y pie llevan a algo que existe | 3/3, los externos con respuesta 200 |
| Cada ruta de imagen corresponde a un archivo real | 17 referencias locales, todas resueltas |
| Cada `<link>` y `<script>` apunta a un archivo que existe | Correcto |
| Errores en consola | 0 en `index.html`, 0 en `404.html`, 0 por `file://` |
| Scroll horizontal en 360 / 480 / 768 / 1024 / 1440 | Ninguno |
| Formularios | No hay, y no se ha inventado ninguno |
| Restos de plantilla, "Lorem ipsum", "TODO" | Ninguno |
| Imágenes rotas | Ninguna |
| Imágenes en disco sin usar | Ninguna |
| `title` y `description` únicos por página | Correcto, dentro de los rangos |
| `404.html` con enlace de vuelta | Correcto |
| Credenciales en el código | Ninguna |
| Rutas absolutas del equipo (`C:\Users\...`) | Ninguna |

Menú móvil: no aplica. El sitio es una sola página y no tiene navegación, así que
no hay menú que abrir ni cerrar. Añadir uno habría significado inventar enlaces.

## Fase 12 — Documentación

- `docs/auditoria.md`: el estado de partida.
- `docs/cambios.md`: este archivo.
- `README.md` reescrito. La reorganización cambió todas las rutas y el comando de
  Sass ya no existe, así que había que tocarlo. Aprovechando la revisión se
  corrigieron tres cosas que el README afirmaba y el código no cumplía:
  navegación por teclado (que ahora sí existe), "tres formas" de moverse
  seguidas de una lista de dos, y unas marcas de valoración por reseña que nunca
  se llegaron a implementar.

## Fase 13 — Deploy

- Verificado abriendo `index.html` a doble clic (`file://`): CSS aplicado, JS en
  marcha, imágenes cargadas y consola limpia.
- Verificado con servidor local: las 11 peticiones responden 200.
- Ninguna ruta absoluta del equipo. Todas las rutas internas son relativas y en
  minúsculas.
- No se creó `vercel.json` ni ningún archivo de configuración de hosting: no se
  indicó destino y el sitio es estático, sin necesidad de reglas.
- No se ha desplegado nada.
