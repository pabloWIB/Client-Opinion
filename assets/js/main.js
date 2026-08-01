/**
 * main.js — entry point.
 *
 * Loaded as a classic deferred script rather than an ES module so the page also
 * works when index.html is opened straight from disk over file://, where module
 * imports are blocked by CORS.
 */
(function () {
  "use strict";

  const WHEEL_LOCK_MS = 420;
  const SWIPE_THRESHOLD_PX = 50;

  /**
   * Wires one carousel root. Every lookup is guarded: if the markup is missing
   * a part, the carousel stays as plain, readable, scrollable content.
   */
  function createCarousel(root) {
    const track = root.querySelector("[data-carousel-track]");
    const viewport = root.querySelector("[data-carousel-viewport]");
    const slides = Array.from(root.querySelectorAll("[data-carousel-slide]"));
    const dots = Array.from(root.querySelectorAll("[data-carousel-dot]"));
    const prevButton = root.querySelector("[data-carousel-prev]");
    const nextButton = root.querySelector("[data-carousel-next]");

    if (!track || !viewport || slides.length === 0) {
      return;
    }

    let index = 0;
    let wheelLocked = false;
    let wheelTimer = 0;
    let pointerStartX = null;

    function render() {
      track.style.transform = "translateX(" + index * -100 + "%)";

      slides.forEach((slide, position) => {
        const isCurrent = position === index;
        slide.inert = !isCurrent;
        slide.setAttribute("aria-hidden", String(!isCurrent));
      });

      dots.forEach((dot, position) => {
        dot.setAttribute("aria-current", String(position === index));
      });

      if (prevButton) {
        prevButton.disabled = index === 0;
      }

      if (nextButton) {
        nextButton.disabled = index === slides.length - 1;
      }
    }

    function goTo(target) {
      const clamped = Math.min(Math.max(target, 0), slides.length - 1);

      if (clamped === index) {
        return false;
      }

      index = clamped;
      render();
      return true;
    }

    if (prevButton) {
      prevButton.addEventListener("click", () => goTo(index - 1));
    }

    if (nextButton) {
      nextButton.addEventListener("click", () => goTo(index + 1));
    }

    /* One delegated listener covers every indicator, however many there are. */
    root.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) {
        return;
      }

      const dot = event.target.closest("[data-carousel-dot]");

      if (dot && root.contains(dot)) {
        goTo(dots.indexOf(dot));
      }
    });

    root.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(index - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(index + 1);
      }
    });

    /* Wheel over the carousel moves between reviews. The page keeps its own
       scroll: the event is only swallowed when the carousel actually moves. */
    viewport.addEventListener(
      "wheel",
      (event) => {
        if (wheelLocked) {
          event.preventDefault();
          return;
        }

        const delta =
          Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;

        if (delta === 0) {
          return;
        }

        if (!goTo(delta > 0 ? index + 1 : index - 1)) {
          return;
        }

        event.preventDefault();
        wheelLocked = true;
        window.clearTimeout(wheelTimer);
        wheelTimer = window.setTimeout(() => {
          wheelLocked = false;
        }, WHEEL_LOCK_MS);
      },
      { passive: false }
    );

    /* Touch and pen swipe. Mouse is left alone so the quote stays selectable. */
    viewport.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse") {
        return;
      }

      pointerStartX = event.clientX;
    });

    viewport.addEventListener("pointerup", (event) => {
      if (pointerStartX === null) {
        return;
      }

      const travelled = event.clientX - pointerStartX;
      pointerStartX = null;

      if (Math.abs(travelled) < SWIPE_THRESHOLD_PX) {
        return;
      }

      goTo(travelled < 0 ? index + 1 : index - 1);
    });

    viewport.addEventListener("pointercancel", () => {
      pointerStartX = null;
    });

    render();
  }

  document.querySelectorAll("[data-carousel]").forEach(createCarousel);
})();
