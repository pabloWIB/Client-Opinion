# Client-Opinion

A testimonial carousel you can drop into any page — navigable by arrows, indicators, keyboard, mouse wheel and swipe, with no dependencies and no build step.

[![Live demo](https://img.shields.io/badge/demo-clientopinion.wib.digital-2ea44f)](https://clientopinion.wib.digital)
[![Hire me on Fiverr](https://img.shields.io/badge/Hire%20me%20on-Fiverr-1DBF73?style=for-the-badge&logo=fiverr&logoColor=white)](https://www.fiverr.com/pablonietop)
![Dependencies](https://img.shields.io/badge/npm%20dependencies-0-brightgreen)
![Build step](https://img.shields.io/badge/build%20step-none-lightgrey)
![First load](https://img.shields.io/badge/first%20load-31%20KB-blue)

## Description

A reviews block for a small business, built as a component rather than a page. It is the section you drop into an existing site under the fold, not a site of its own. The demo brand is a florist, JoyfulBloomers; the shop and its four reviews are sample content.

Five ways to move between reviews are wired up, and each one is there for a different pointer:

- **Arrows** for the mouse. They disable themselves at either end instead of sitting there looking clickable and doing nothing.
- **Flower indicators** for direct access, so you can jump to the fourth review without stepping through the other three.
- **Left and right arrow keys** whenever focus is inside the carousel.
- **Mouse wheel** over the component, because that is what people already do over a horizontal strip. The page keeps its own scroll: the wheel is only swallowed when the carousel actually moves, so at the last review the page scrolls normally again.
- **Swipe** on touch and pen. Deliberately not on mouse, so the quote stays selectable on desktop.

The slides move in percentages, not pixels, so the component fits whatever container you put it in. Nothing in the JavaScript needs to know how wide the carousel is.

Only the review on screen is exposed to assistive technology — the rest are marked `inert` and `aria-hidden` — and the viewport is a polite live region, so changing review announces the new one.

## Tech stack

| Layer | Technology | Role in project |
|---|---|---|
| Markup | HTML5 | `index.html` and `404.html` |
| Styling | CSS3 custom properties | 37 design tokens; no preprocessor, no build |
| Scripting | JavaScript (ES2020) | One classic deferred script, wrapped in an IIFE |
| Fonts | Roboto, 3 weights | Google Fonts, `preconnect` + `display=swap` |
| Images | PNG, SVG | 30 KB total, all of it in the repository |

No npm dependencies, no bundler, no framework. The whole first load is about 31 KB of project files.

## Project structure

```
.
├── index.html                     # The reviews page
├── 404.html                       # Not found, links back to the reviews
├── robots.txt                     # Allows everything except 404.html
├── sitemap.xml                    # One URL: the home page
├── assets/
│   ├── css/
│   │   ├── base.css               # Design tokens, reset, typography
│   │   ├── layout.css             # Page shell, container, header, footer
│   │   └── components.css         # Reviews block, carousel, controls, error page
│   ├── js/
│   │   └── main.js                # Carousel: arrows, indicators, keyboard, wheel, swipe
│   └── img/
│       ├── logo/
│       │   ├── google.svg         # Google Reviews mark
│       │   └── wib-icon.png       # Favicon and touch icon
│       ├── icons/
│       │   ├── flower.png         # Indicator, inactive
│       │   └── flower-active.png  # Indicator, active
│       └── content/
│           └── og-cover.png       # Open Graph card, 1200×630
└── docs/
    ├── auditoria.md               # State of the project before the reorganisation
    └── cambios.md                 # What changed, by phase
```

`main.js` is a classic script rather than an ES module on purpose: modules are blocked by CORS over `file://`, and `index.html` is meant to work when you double-click it.

## Running it locally

Open `index.html` in a browser. That is the whole procedure — there is nothing to install and nothing to compile.

To serve it over HTTP instead, from the repository root:

```bash
npx serve .
```

or, with Python:

```bash
python -m http.server 8000
```

## Reusing the component

Copy the `.carousel` markup, the three stylesheets and `main.js`. The script binds to `[data-carousel]` and looks up its parts by data attribute, so it does not assume it is the only thing on the page, and more than one carousel can live in the same document.

Adding a review means adding one `<li class="carousel__slide" data-carousel-slide>` and one indicator button. The script reads the counts from the DOM; nothing else needs updating.

## Deployment

Deployed on Vercel at [clientopinion.wib.digital](https://clientopinion.wib.digital). Static hosting: upload the repository root as-is, with no build command and no output directory.

## Author

**Pablo Nieto Pérez** — [wib.digital](https://wib.digital)
GitHub: [@pabloWIB](https://github.com/pabloWIB)

## Hire me

I build **custom internal tools, CRMs and dashboards** for small teams, and
**conversion-focused websites** for businesses.

- [Custom internal tool, CRM or dashboard](https://www.fiverr.com/pablonietop/build-a-custom-internal-app-for-your-business) — from $45
- [Conversion-focused website](https://www.fiverr.com/pablonietop/convert-your-landing-page-design-to-code) — from $80
- [All my services on Fiverr](https://www.fiverr.com/pablonietop)
- [wib.digital](https://wib.digital)
