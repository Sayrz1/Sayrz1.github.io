(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const themeMeta = $('meta[name="theme-color"]');
  const brands = $$(".brand");
  const chips = new Map($$(".chip").map((c) => [c.dataset.for, c]));

  /* ---------- Theme: same saved choice as the homepage ---------- */
  const themeBtn = $("#theme-toggle");
  const studioBg = () => getComputedStyle(root).getPropertyValue("--bg").trim();
  const syncTheme = () => {
    const dark = root.dataset.theme !== "light";
    themeBtn.innerHTML = `<i class="ph ${dark ? "ph-sun" : "ph-moon"}" aria-hidden="true"></i>`;
    themeBtn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    if (!document.body.dataset.brand) themeMeta.content = studioBg();
  };
  const setTheme = (t) => { root.dataset.theme = t; syncTheme(); };
  themeBtn.addEventListener("click", () => {
    const next = root.dataset.theme === "light" ? "dark" : "light";
    try { localStorage.setItem("theme", next); } catch (e) {}
    setTheme(next);
  });
  matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e) => {
    let saved = null;
    try { saved = localStorage.getItem("theme"); } catch (err) {}
    if (!saved) setTheme(e.matches ? "light" : "dark");
  });
  syncTheme();

  /* ---------- The header and jump bar take on whichever brand fills the screen ---------- */
  let current = null;
  const setCurrent = (el) => {
    if (el === current) return;
    current = el;
    if (el) document.body.dataset.brand = el.dataset.brand;
    else delete document.body.dataset.brand;
    themeMeta.content = el ? el.dataset.meta : studioBg();
    chips.forEach((c, id) => c.setAttribute("aria-current", el && id === el.id ? "true" : "false"));
    const chip = el && chips.get(el.id);
    if (chip) {
      const bar = chip.closest("ul");
      bar.scrollTo({ left: chip.offsetLeft - (bar.clientWidth - chip.offsetWidth) / 2, behavior: "smooth" });
    }
  };
  const pick = () => {
    const line = innerHeight * 0.35;
    setCurrent(brands.find((b) => { const r = b.getBoundingClientRect(); return r.top <= line && r.bottom > line; }) || null);
  };
  let ticking = false;
  addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; pick(); }); }
  }, { passive: true });
  addEventListener("resize", pick);
  pick();

  /* ---------- Language: dims the other language in the index, hides it in the reel ---------- */
  const langBtns = $$(".lang button");
  const ixItems = $$(".index li");
  const chipItems = $$(".jump li");
  langBtns.forEach((btn) => btn.addEventListener("click", () => {
    const v = btn.dataset.lang;
    const fits = (el) => v === "all" || el.dataset.lang === v;
    langBtns.forEach((x) => x.setAttribute("aria-pressed", x === btn ? "true" : "false"));
    ixItems.forEach((li) => li.classList.toggle("is-dim", !fits(li)));
    brands.forEach((b) => { b.hidden = !fits(b); });
    chipItems.forEach((li) => { li.hidden = !fits(li); });
    pick();
  }));

  /* ---------- Viewer: steps through the brand's posts and extras ---------- */
  const viewer = $("#viewer");
  const vImg = $(".viewer-img", viewer);
  const vCap = $(".viewer-cap", viewer);
  let group = [], at = 0, opener = null;
  const show = (i) => {
    at = (i + group.length) % group.length;
    const post = group[at];
    vImg.src = post.dataset.full;
    vImg.alt = $("img", post).alt;
    vCap.textContent = post.dataset.caption;
  };
  $$(".post").forEach((post) => post.addEventListener("click", () => {
    group = $$(".post", post.closest(".brand"));
    opener = post;
    show(group.indexOf(post));
    viewer.showModal();
  }));
  $$(".viewer-step", viewer).forEach((b) => b.addEventListener("click", () => show(at + Number(b.dataset.step))));
  $(".viewer-close", viewer).addEventListener("click", () => viewer.close());
  viewer.addEventListener("click", (e) => { if (e.target === viewer) viewer.close(); });
  viewer.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") show(at + 1);
    else if (e.key === "ArrowLeft") show(at - 1);
  });
  viewer.addEventListener("close", () => opener?.focus({ preventScroll: true }));
})();
