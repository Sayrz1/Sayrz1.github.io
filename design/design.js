(() => {
  "use strict";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const brands = $$(".brand");
  const themeMeta = $('meta[name="theme-color"]');
  const root = document.documentElement;
  const studioBg = () => getComputedStyle(root).getPropertyValue("--bg").trim();

  /* ---------- Theme: same saved choice as the homepage ---------- */
  const themeBtn = $("#theme-toggle");
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

  /* ---------- One brand at a time: #<brand> opens it, anything else shows the overview ---------- */
  const hero = $(".hero"), overview = $(".overview");
  const setBrand = (el) => {
    if (el) document.body.dataset.brand = el.dataset.brand;
    else delete document.body.dataset.brand;
    themeMeta.content = el ? el.dataset.meta : studioBg();
  };
  let lastBrand = null;
  const route = () => {
    const el = brands.find((b) => "#" + b.id === location.hash);
    hero.hidden = overview.hidden = !!el;
    brands.forEach((b) => { b.hidden = b !== el; });
    document.body.classList.toggle("is-brand", !!el);
    setBrand(el);
    if (el) {
      scrollTo({ top: 0, behavior: "instant" });
      el.classList.remove("is-entering"); void el.offsetWidth; el.classList.add("is-entering");
      el.tabIndex = -1;
      el.focus({ preventScroll: true });
      syncers.get(el)?.();
      lastBrand = el.id;
    } else if (lastBrand) {
      const card = $(`.card a[href="#${lastBrand}"]`);
      card?.scrollIntoView({ block: "center", behavior: "instant" });
      card?.focus({ preventScroll: true });
      lastBrand = null;
    }
  };
  document.documentElement.classList.add("routed");

  /* ---------- Post strips ---------- */
  const syncers = new Map();
  brands.forEach((brand) => {
    const strip = $(".strip", brand);
    const [prev, next] = $$(".posts-nav button", brand);
    const sync = () => {
      prev.disabled = strip.scrollLeft < 4;
      next.disabled = strip.scrollLeft + strip.clientWidth > strip.scrollWidth - 4;
    };
    [prev, next].forEach((btn) => btn.addEventListener("click", () => {
      const card = $("li", strip);
      strip.scrollBy({ left: Number(btn.dataset.dir) * (card.offsetWidth + 18), behavior: reduce ? "auto" : "smooth" });
    }));
    strip.addEventListener("scroll", sync, { passive: true });
    addEventListener("resize", sync);
    syncers.set(brand, sync);
    sync();
  });

  /* ---------- Tabs: Posts / Identity / How it was built ---------- */
  brands.forEach((brand) => {
    const tabs = $$('[role="tab"]', brand);
    const nav = $(".posts-nav", brand);
    const select = (tab, focus) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute("aria-selected", on);
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      });
      nav.hidden = !tab.id.endsWith("-posts");
      if (focus) tab.focus();
      syncers.get(brand)();
    };
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => select(t));
      t.addEventListener("keydown", (e) => {
        const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (e.key === "Home") { e.preventDefault(); select(tabs[0], true); }
        else if (e.key === "End") { e.preventDefault(); select(tabs[tabs.length - 1], true); }
        else if (step) { e.preventDefault(); select(tabs[(i + step + tabs.length) % tabs.length], true); }
      });
    });
    select(tabs.find((t) => t.getAttribute("aria-selected") === "true") || tabs[0]);
  });

  addEventListener("hashchange", route);
  route();

  /* ---------- Filters: one row, sector or language ---------- */
  const cards = $$(".card");
  const count = $(".filter-count");
  const empty = $(".empty");
  let pick = "all";
  const fits = (el) => pick === "all" || el.dataset.sector === pick || el.dataset.lang === pick;
  const select = $(".filter-select");
  const apply = () => {
    pick = select.value;
    cards.forEach((el) => { el.hidden = !fits(el); });
    const n = cards.filter((c) => !c.hidden).length;
    count.textContent = n === cards.length ? `${n} brands` : `${n} of ${cards.length} brands`;
    empty.hidden = n > 0;
  };
  select.addEventListener("change", apply);
  $("[data-clear]").addEventListener("click", () => { select.value = "all"; apply(); select.focus(); });
  apply();

  /* ---------- Viewer ---------- */
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
    group = $$(".post", post.closest(".strip"));
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
