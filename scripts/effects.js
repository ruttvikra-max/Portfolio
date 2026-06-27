/* Slow Pour — effects registry (plug & play)
   One place to gate motion; behaviors wired by data-attribute.
   - Gate:        prefers-reduced-motion + <html data-fx-off> kill switch.
   - Behaviors:   [data-reveal]  -> scroll reveal (IntersectionObserver)
                  [data-fx~="splittext"] -> hero word/char reveal (anime.js)
   - Progressive enhancement: content is visible by default; effects only enhance.
   Add a new effect = add an init* function + call it in the armed block below. */

const root = document.documentElement;
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const disabled = root.hasAttribute("data-fx-off") || reduce;

if (disabled) {
  root.classList.remove("pre-fx"); // ensure hidden-until-fx targets are shown
} else {
  root.classList.add("js-motion"); // arms the CSS effect layer
  initReveal();
  initFill();
  initScrollAvatar();
  initSplitText().finally(() => root.classList.remove("pre-fx"));
}


/* ---- [data-fx~="scroll-avatar"] : crossfade standing -> drinking on scroll ----
   Sets --scroll (0 at top, 1 at bottom) so CSS crossfades the two poses. */
function initScrollAvatar() {
  const el = document.querySelector('[data-fx~="scroll-avatar"]');
  if (!el) return;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    el.style.setProperty("--scroll", p.toFixed(3));
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

/* ---- [data-fx~="fill"] : directional fill grows from the cursor entry point ----
   Sets --fx-x / --fx-y to the pointer position on enter and leave, so the CSS
   circle grows from where the cursor entered and retreats toward where it left. */
function initFill() {
  const els = document.querySelectorAll('[data-fx~="fill"]');
  els.forEach((el) => {
    const setOrigin = (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--fx-x", ((e.clientX - r.left) / r.width) * 100 + "%");
      el.style.setProperty("--fx-y", ((e.clientY - r.top) / r.height) * 100 + "%");
    };
    el.addEventListener("pointerenter", setOrigin);
    el.addEventListener("pointerleave", setOrigin);
  });
}

/* ---- [data-reveal] : fade/rise in on scroll ---- */
function initReveal() {
  const els = document.querySelectorAll("[data-reveal]");
  if (!els.length) return;
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      }),
    { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
  );
  els.forEach((el) => io.observe(el));
}

/* ---- [data-fx~="splittext"] : word/char reveal via anime.js (lazy-loaded) ----
   Config per element:
     data-fx-split="words|chars"  (default words)
     data-fx-stagger="<ms>"       (default 55)
     data-fx-duration="<ms>"      (default 800)
   anime.js is imported only if a target exists, so the CDN cost is opt-in. */
async function initSplitText() {
  const targets = document.querySelectorAll('[data-fx~="splittext"]');
  if (!targets.length) return;
  try {
    const [{ animate, stagger }, { splitText }] = await Promise.all([
      import("animejs"),
      import("animejs/text"),
    ]);
    targets.forEach((el) => {
      const chars = el.dataset.fxSplit === "chars";
      const stg = Number(el.dataset.fxStagger || 55);
      const dur = Number(el.dataset.fxDuration || 800);
      const res = splitText(
        el,
        chars ? { chars: true, words: false } : { words: true, chars: false }
      );
      const pieces = chars ? res.chars : res.words;
      animate(pieces, {
        opacity: [0, 1],
        translateY: [18, 0],
        duration: dur,
        delay: stagger(stg),
      });
    });
  } catch (e) {
    /* CDN/module failure: caller removes .pre-fx, so the text simply shows. */
  }
}

