(() => {
  "use strict";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const brands = $$(".brand");
  const barLinks = $$(".bar-chips a");
  const themeMeta = $('meta[name="theme-color"]');
  const studio = themeMeta.content;
  const refreshScroll = () => window.ScrollTrigger && ScrollTrigger.refresh();

  /* ---------- Takeover: the brand in the middle of the screen recolours the page ---------- */
  const setBrand = (el) => {
    if (el) document.body.dataset.brand = el.dataset.brand;
    else delete document.body.dataset.brand;
    themeMeta.content = el ? el.dataset.meta : studio;
    barLinks.forEach((a) => {
      const on = !!el && a.hash === "#" + el.id;
      a.setAttribute("aria-current", on ? "true" : "false");
      if (on && a.offsetParent) {
        const bar = a.closest(".bar-chips");
        bar.scrollTo({ left: a.offsetLeft - bar.clientWidth / 2 + a.offsetWidth / 2, behavior: reduce ? "auto" : "smooth" });
      }
    });
  };
  const seen = new Set();
  const takeover = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)));
    setBrand(brands.find((b) => seen.has(b)));
  }, { rootMargin: "-50% 0px -50% 0px" });
  brands.forEach((b) => takeover.observe(b));

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
      refreshScroll();
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

  /* ---------- Filters: sector and language ---------- */
  const cards = $$(".card");
  const barItems = $$(".bar-chips li");
  const count = $(".filter-count");
  const empty = $(".empty");
  const state = { sector: "all", lang: "all" };
  const fits = (el) => ["sector", "lang"].every((k) => state[k] === "all" || el.dataset[k] === state[k]);
  const apply = () => {
    $$(".filter").forEach((b) => b.setAttribute("aria-pressed", state[b.dataset.filter] === b.dataset.value));
    [...cards, ...brands, ...barItems].forEach((el) => { el.hidden = !fits(el); });
    const n = cards.filter((c) => !c.hidden).length;
    count.textContent = n === cards.length ? `Showing all ${n} brands`
      : `Showing ${n} of ${cards.length} brand${cards.length === 1 ? "" : "s"}`;
    empty.hidden = n > 0;
    refreshScroll();
  };
  $$(".filter").forEach((b) => b.addEventListener("click", () => {
    state[b.dataset.filter] = b.dataset.value;
    apply();
  }));
  $("[data-clear]").addEventListener("click", () => {
    state.sector = state.lang = "all";
    apply();
    $('.filter[data-value="all"]').focus();
  });

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

  /* ---------- Covers open up as they arrive ---------- */
  if (reduce || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  $$(".b-cover").forEach((cover) => {
    gsap.fromTo(cover, { clipPath: "inset(7% 6% 7% 6% round 28px)" }, {
      clipPath: "inset(0% 0% 0% 0% round 18px)", ease: "none",
      scrollTrigger: { trigger: cover, start: "top 95%", end: "top 35%", scrub: 0.5 },
    });
    gsap.fromTo($("img", cover), { scale: 1.14 }, {
      scale: 1, ease: "none",
      scrollTrigger: { trigger: cover, start: "top 95%", end: "bottom 30%", scrub: 0.5 },
    });
  });
  document.fonts?.ready.then(refreshScroll);
})();
