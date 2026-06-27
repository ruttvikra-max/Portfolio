/* Slow Pour — motion foundation (Tier 1)
   Progressive enhancement: content is fully visible by default.
   Reveal animations activate ONLY when JS runs AND motion is allowed.
   No-JS users and prefers-reduced-motion users see everything immediately. */
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Honor reduced motion: leave all content visible, do nothing.
  if (reduce.matches) return;

  // Signal CSS that motion is on (this is what arms the hidden initial state).
  root.classList.add("js-motion");

  var els = document.querySelectorAll("[data-reveal]");
  if (!els.length) return;

  // Fallback: no IntersectionObserver -> just show everything.
  if (!("IntersectionObserver" in window)) {
    els.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
  );

  els.forEach(function (el) { io.observe(el); });
})();
