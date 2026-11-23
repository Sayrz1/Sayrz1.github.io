(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const themeMeta = $('meta[name="theme-color"]');
  const brands = $$(".brand");
  const chips = new Map($$(".chip").map((c) => [c.dataset.for, c]));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const index = $(".index");

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
    document.body.classList.toggle("at-top", index.getBoundingClientRect().bottom > 80);
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

  /* ---------- The line tile opens the brief ---------- */
  $$(".tile-btn").forEach((btn) => btn.addEventListener("click", () => {
    const about = document.getElementById(btn.dataset.about);
    about.open = true;
    about.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
    $("summary", about).focus({ preventScroll: true });
  }));

  /* ---------- Viewer: zooms out of the thumbnail, steps through the brand, swipes on phones ---------- */
  const viewer = $("#viewer");
  const vImg = $(".viewer-img", viewer);
  const vCap = $(".viewer-cap", viewer);
  let group = [], at = 0, opener = null;
  const load = (post) => {
    vImg.src = post.dataset.full;
    vImg.alt = $("img", post).alt;
    vCap.textContent = post.dataset.caption;
    return vImg.decode().catch(() => {});
  };
  const flyFrom = (el, back) => {
    if (reduce || !el) return Promise.resolve();
    const a = el.getBoundingClientRect(), b = vImg.getBoundingClientRect();
    if (!a.width || !b.width || a.bottom < 0 || a.top > innerHeight) return Promise.resolve();
    const from = `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${a.width / b.width}, ${a.height / b.height})`;
    const frames = back ? [{ transform: "none" }, { transform: from }] : [{ transform: from }, { transform: "none" }];
    return vImg.animate(frames, { duration: back ? 280 : 420, easing: "cubic-bezier(.16, 1, .3, 1)" }).finished;
  };
  const show = (i, dir = 0) => {
    at = (i + group.length) % group.length;
    load(group[at]).then(() => {
      if (dir && !reduce) vImg.animate([{ opacity: 0, transform: `translateX(${dir * 40}px)` }, { opacity: 1, transform: "none" }], { duration: 320, easing: "cubic-bezier(.16, 1, .3, 1)" });
    });
  };
  $$(".post").forEach((post) => post.addEventListener("click", async () => {
    group = $$(".post", post.closest(".brand"));
    opener = post;
    at = group.indexOf(post);
    await load(post);
    viewer.showModal();
    flyFrom($("img", post));
  }));
  const close = async () => {
    const thumb = group[at] && $("img", group[at]);
    await flyFrom(thumb, true);
    viewer.close();
  };
  $$(".viewer-step", viewer).forEach((b) => b.addEventListener("click", () => show(at + Number(b.dataset.step), Number(b.dataset.step))));
  $(".viewer-close", viewer).addEventListener("click", close);
  viewer.addEventListener("cancel", (e) => { e.preventDefault(); close(); });
  viewer.addEventListener("click", (e) => { if (e.target === viewer) close(); });
  viewer.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") show(at + 1, 1);
    else if (e.key === "ArrowLeft") show(at - 1, -1);
  });
  let sx = 0, sy = 0;
  viewer.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  viewer.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(at + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    else if (dy > 80) close();
  }, { passive: true });
  viewer.addEventListener("close", () => (group[at] || opener)?.focus({ preventScroll: true }));
})();
