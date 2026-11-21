(() => {
  "use strict";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const brands = $$(".brand");
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const studio = themeMeta.content;

  /* ---------- Takeover: the brand in the middle of the screen recolours the page ---------- */
  const setBrand = (el) => {
    if (el) document.body.dataset.brand = el.dataset.brand;
    else delete document.body.dataset.brand;
    themeMeta.content = el ? el.dataset.meta : studio;
  };
  const seen = new Set();
  const takeover = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)));
    setBrand(brands.find((b) => seen.has(b)));
  }, { rootMargin: "-50% 0px -50% 0px" });
  brands.forEach((b) => takeover.observe(b));

  /* ---------- Post strips ---------- */
  brands.forEach((brand) => {
    const strip = brand.querySelector(".strip");
    const [prev, next] = $$(".posts-nav button", brand);
    const sync = () => {
      prev.disabled = strip.scrollLeft < 4;
      next.disabled = strip.scrollLeft + strip.clientWidth > strip.scrollWidth - 4;
    };
    $$(".posts-nav button", brand).forEach((btn) => btn.addEventListener("click", () => {
      const card = strip.querySelector("li");
      strip.scrollBy({ left: Number(btn.dataset.dir) * (card.offsetWidth + 18), behavior: reduce ? "auto" : "smooth" });
    }));
    strip.addEventListener("scroll", sync, { passive: true });
    addEventListener("resize", sync);
    sync();
  });

  /* ---------- Viewer ---------- */
  const viewer = document.getElementById("viewer");
  const vImg = viewer.querySelector(".viewer-img");
  const vCap = viewer.querySelector(".viewer-cap");
  let group = [], at = 0, opener = null;
  const show = (i) => {
    at = (i + group.length) % group.length;
    const post = group[at], img = post.querySelector("img");
    vImg.src = post.dataset.full;
    vImg.alt = img.alt;
    vCap.textContent = post.dataset.caption;
  };
  $$(".post").forEach((post) => post.addEventListener("click", () => {
    group = $$(".post", post.closest(".strip"));
    opener = post;
    show(group.indexOf(post));
    viewer.showModal();
  }));
  $$(".viewer-step", viewer).forEach((b) => b.addEventListener("click", () => show(at + Number(b.dataset.step))));
  viewer.querySelector(".viewer-close").addEventListener("click", () => viewer.close());
  viewer.addEventListener("click", (e) => { if (e.target === viewer) viewer.close(); });
  viewer.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") show(at + 1);
    else if (e.key === "ArrowLeft") show(at - 1);
  });
  viewer.addEventListener("close", () => opener?.focus({ preventScroll: true }));

  /* ---------- Covers open up as they arrive ---------- */
  if (reduce || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  $$(".b-cover").forEach((cover) => {
    gsap.fromTo(cover, { clipPath: "inset(7% 6% 7% 6% round 28px)" }, {
      clipPath: "inset(0% 0% 0% 0% round 18px)", ease: "none",
      scrollTrigger: { trigger: cover, start: "top 95%", end: "top 35%", scrub: 0.5 },
    });
    gsap.fromTo(cover.querySelector("img"), { scale: 1.14 }, {
      scale: 1, ease: "none",
      scrollTrigger: { trigger: cover, start: "top 95%", end: "bottom 30%", scrub: 0.5 },
    });
  });
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
})();
