# Auditoría inicial — Client-Opinion

Estado del proyecto **antes** de la reorganización. Documento de trabajo interno.

Fecha: 2026-07-30
Alcance: 12 archivos en la raíz, sin subcarpetas, sin build, sin dependencias npm.

---

## 1. Archivos HTML

| Archivo | `<title>` | Encabezado real | Propósito | Estado |
|---|---|---|---|---|
| `index.html` | `JoyfulBloomers` | `<h2>Our Clients say</h2>` | Única página: carrusel de testimonios de una floristería ficticia | Funciona, pero sin `<h1>`, sin `<main>`, sin metadatos |

No existía `404.html`.

## 2. Hojas de estilo

| Archivo | ¿Se carga? | Peso | Observaciones |
|---|---|---|---|
| `normalize.css` | Sí (1.º) | 2.4 KB | Normalize minificado en una línea + 3 bloques propios pegados al final (`::selection`, scrollbar, `* { transition: .3s }`) |
| `styles.css` | Sí (2.º) | 3.3 KB | Salida compilada de Sass, con prefijos `-webkit-box` / `-ms-flexbox` innecesarios en 2026 |
| `styles.scss` | No | 1.9 KB | Fuente Sass **desincronizada**: apunta a `../IMG/flower.png`, carpeta que no existe en el repo |

## 3. JavaScript

| Archivo | ¿Se carga? | Peso | Observaciones |
|---|---|---|---|
| `script.js` | Sí | 1.8 KB | Vanilla JS, 59 líneas. Indentación rota: `updateIndicator` y `scrollToSlide` quedaron pegadas en la misma línea |
| jQuery slim 3.0.0-beta1 (cdnjs) | Sí | ~24 KB transferidos | **Nunca se usa.** Ni una sola llamada `$` en el proyecto. Además es una *beta* de 2016 |

## 4. Imágenes

| Archivo | Dimensiones | Peso | Formato | ¿Referenciada? | Dónde |
|---|---|---|---|---|---|
| `Client-Opinion.png` | 1024×1024 | 540.3 KB | PNG | Sí | `<link rel="icon">` en `index.html` |
| `icon.png` | 492×492 | 42.7 KB | PNG | **No** | Huérfana (añadida en el commit "Feat favicon", nunca enlazada) |
| `flower.png` | 100×100 | 2.7 KB | PNG | Sí | `background` de `.indicator-dot` en `styles.css` |
| `flowerChecked.png` | 100×100 | 3.9 KB | PNG | **No** | Huérfana. Variante rosa del indicador activo, descartada a favor de la morada |
| `flowerChecked2.png` | 100×100 | 4.1 KB | PNG | Sí | `background` de `.indicator-dot.active` |
| `google.svg` | 78×28 | 2.4 KB | SVG | Sí | `<img>` en la cabecera del bloque |

Peso total de imágenes: **596 KB**, de los cuales 540 KB son un PNG de 1024×1024 servido como favicon de 16 píxeles.

## 5. Dependencias externas

| Recurso | Origen | ¿Se usa? |
|---|---|---|
| jQuery slim 3.0.0-beta1 | `cdnjs.cloudflare.com` | No |
| Google Fonts: Roboto (100,300,400,500,700) + Inconsolata | `fonts.googleapis.com`, vía `@import` en CSS | Parcial: solo se usa Roboto, y solo un par de pesos. Inconsolata no aparece en ninguna regla |

Sin `preconnect`, sin `font-display`, y el `@import` bloquea el render porque se descubre después de descargar el CSS.

## 6. Archivos basura

| Buscado | Resultado |
|---|---|
| `.bak`, `copia de`, `final_v2`, `-old` | Ninguno |
| `.DS_Store`, `Thumbs.db` | Ninguno |
| `node_modules/` | No existe |
| `.gitignore` | **No existía** |

El proyecto estaba limpio de basura clásica; el problema era otro: todo suelto en la raíz.

---

## 7. Enlaces, rutas y referencias rotas

| Tipo | Detalle | Gravedad |
|---|---|---|
| Ruta de imagen rota | `styles.scss` → `url('../IMG/flower.png')` y `url('../IMG/flowerChecked2.png')`. La carpeta `IMG/` no existe | Alta — recompilar el Sass habría roto los indicadores |
| Enlaces rotos (`href`) | Ninguno: la página no tenía ni un solo `<a>` | — |
| CSS/JS referenciado inexistente | Ninguno | — |
| Favicon | Apuntaba a `Client-Opinion.png` (540 KB) en lugar de a `icon.png`, que se subió justo para eso | Media |

## 8. CSS duplicado o muerto

| Problema | Detalle |
|---|---|
| Duplicación total | `styles.scss` y `styles.css` describen las mismas reglas; mantener las dos a mano garantiza que se desincronicen (ya pasó con las rutas de imagen) |
| `background-size` declarado dos veces | `contain` y luego `cover` en `.indicator-dot` y `.indicator-dot.active`: la primera es código muerto |
| `.indicator-dot` / `.indicator-dot.active` | Bloques casi idénticos: solo cambia la `url()` |
| Propiedad inválida | `cursor: #474747` en `.carousel-container`: un color no es un valor de `cursor`; el navegador la descarta |
| Selector universal con transición | `* { transition: .3s }` en `normalize.css`: aplica una transición a todas las propiedades de todos los elementos del documento |
| Prefijos obsoletos | ~40 líneas de `-webkit-box` / `-ms-flexbox` para navegadores sin soporte desde hace una década |
| `.prev-button` / `.next-button` | **Existen en el HTML, no tienen ni una regla CSS.** Botones vacíos, sin contenido ni tamaño: invisibles en pantalla |

## 9. HTML duplicado entre páginas

No aplica: el proyecto tenía una sola página.

## 10. Contenido de relleno y restos de plantilla

| Elemento | Detalle |
|---|---|
| `<style></style>` | Bloque vacío en el `<head>` |
| `alt=""` en el logo de Google | La imagen comunica "reseñas verificadas de Google"; vaciar el `alt` la oculta a los lectores de pantalla |
| Primer testimonio | Le falta la comilla de apertura: termina con `"` pero no empieza con ella |
| Reseñas | Cuatro testimonios de una marca ficticia (JoyfulBloomers). No son clientes reales: son datos de muestra del componente |

## 11. Responsive y accesibilidad

| Problema | Detalle | Gravedad |
|---|---|---|
| Anchos fijos | `.carousel-container` y `.slide` a `1100px` fijos. Por debajo de 1100 px de viewport el contenido se sale | Crítica |
| Desplazamiento por píxeles | `scrollToSlide` calcula `index * -1100`. El número está escrito a mano en el JS: si cambia el ancho, el carrusel se desalinea | Crítica |
| `body { overflow: hidden }` | Oculta el desbordamiento en lugar de arreglarlo. En móvil el contenido queda cortado sin forma de llegar a él | Crítica |
| Cero media queries | Ninguna | Crítica |
| Tipografías en `vh` | `font-size: 6vh`, `3vh`, `2vh`. El texto depende de la **altura** de la ventana: en un móvil apaisado el texto se vuelve ilegible | Alta |
| Sin `<h1>` | La página empieza en `<h2>` | Alta |
| Sin `<main>` | Todo el contenido vive dentro de `<header>` | Alta |
| Botones sin nombre accesible | `.prev-button` y `.next-button` están vacíos: un lector de pantalla anuncia "botón" y nada más | Alta |
| Indicadores no accesibles | Son `<div>` con `click`: no reciben foco, no responden a teclado, no anuncian estado | Alta |
| Sin navegación por teclado | Ni flechas, ni foco visible en ningún elemento | Alta |
| `wheel` con `preventDefault` | Secuestra la rueda del ratón de forma incondicional en toda la página | Media |
| `lang="en"` | Correcto: el contenido está en inglés | OK |

## 12. Metadatos y SEO

| Elemento | Estado |
|---|---|
| `<title>` | Presente pero pobre: "JoyfulBloomers", 14 caracteres |
| `<meta name="description">` | **Ausente** |
| Open Graph | **Ausente** por completo |
| `<link rel="canonical">` | **Ausente** |
| `robots.txt` | **No existía** |
| `sitemap.xml` | **No existía** |
| `charset` / `viewport` | Correctos |

## 13. Seguridad

Búsqueda de `api[_-]?key`, `token`, `secret`, `password`, `Bearer`, `sk_`, `pk_` en todo el proyecto: **sin resultados**. No hay credenciales en el código.

---

## Resumen en 5 líneas

1. Es un **componente de testimonios**, no un sitio: una sola página con un carrusel de cuatro reseñas para una floristería de demostración (JoyfulBloomers), en HTML/CSS/JS plano, sin build ni dependencias npm.
2. El código **funciona en un monitor de escritorio grande y se rompe en todo lo demás**: anchos de 1100 px escritos a mano en el CSS *y* en el JavaScript, cero media queries, y un `overflow: hidden` en el `body` que esconde el problema en vez de resolverlo.
3. Lo más grave es esa **cifra 1100 duplicada en dos lenguajes**: el carrusel se desalinea en cuanto alguien toca un ancho, y en móvil el contenido queda cortado sin forma de alcanzarlo.
4. Le siguen tres cosas: los botones anterior/siguiente **existen en el HTML pero no tienen una sola regla CSS** (son invisibles), se carga **jQuery beta de 2016 que no se usa nunca**, y el favicon es un PNG de **540 KB** mientras el icono real de 42 KB estaba sin enlazar.
5. En accesibilidad y SEO partía de cero: sin `<h1>`, sin `<main>`, sin descripción, sin Open Graph, sin `robots.txt`, sin `sitemap.xml`, indicadores no operables con teclado y botones sin nombre accesible.
