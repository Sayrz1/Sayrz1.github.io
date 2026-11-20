(() => {
  "use strict";
  // Red pen and highlighter go on as each sheet comes into view.
  const sheets = document.querySelectorAll(".ink");
  if (!("IntersectionObserver" in window)) { sheets.forEach((s) => s.classList.add("inked")); return; }
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("inked"); io.unobserve(e.target); } });
  }, { threshold: 0.35, rootMargin: "0px 0px -8% 0px" });
  sheets.forEach((s) => io.observe(s));
})();
