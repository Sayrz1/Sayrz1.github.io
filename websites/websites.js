(() => {
  "use strict";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- UK time drives the sky and the door signs ---------- */
  const ukParts = () => {
    const p = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric", hourCycle: "h23" }).formatToParts(new Date());
    const g = (t) => p.find((x) => x.type === t).value;
    return { h: +g("hour"), m: +g("minute"), date: `${g("day")}/${g("month")}/${g("year")}` };
  };
  const mins = (s) => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };

  function tick() {
    const { h, m, date } = ukParts();
    const now = h * 60 + m;
    const hhmm = String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
    document.getElementById("uk-time").textContent = hhmm;
    document.getElementById("r-time").textContent = hhmm;
    document.getElementById("r-date").textContent = date;
    document.body.dataset.tod = h >= 7 && h < 17 ? "day" : (h >= 17 && h < 20) || (h >= 5 && h < 7) ? "dusk" : "night";

    document.querySelectorAll(".shop[data-open]").forEach((shop) => {
      const o = mins(shop.dataset.open), c = mins(shop.dataset.close);
      const open = o < c ? now >= o && now < c : now >= o || now < c;
      shop.classList.toggle("closed", !open);
      const state = shop.querySelector(".hs-state");
      if (state) state.textContent = open ? "Open" : "Closed";
    });
  }
  tick();
  setInterval(tick, 30000);

  /* ---------- glass glare follows the pointer ---------- */
  if (matchMedia("(hover: hover)").matches && !reduce) {
    document.querySelectorAll(".window").forEach((w) => {
      const g = w.querySelector(".glare"); if (!g) return;
      w.addEventListener("pointermove", (e) => {
        const r = w.getBoundingClientRect();
        g.style.setProperty("--gx", ((e.clientX - r.left) / r.width - 0.5) * 80 + "px");
      });
      w.addEventListener("pointerleave", () => g.style.setProperty("--gx", "0px"));
    });
  }

  /* ---------- the receipt prints when it comes into view ---------- */
  const receipt = document.getElementById("receipt");
  if (reduce || !("IntersectionObserver" in window)) receipt.classList.add("printed");
  else new IntersectionObserver((es, io) => {
    if (es[0].isIntersecting) { receipt.classList.add("printed"); io.disconnect(); }
  }, { threshold: 0.2 }).observe(receipt);

  /* ---------- walk down the street: horizontal scroll on wide screens ---------- */
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();
  mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
    const track = document.getElementById("track");
    const street = document.getElementById("street");
    const dist = () => Math.max(0, track.scrollWidth - innerWidth);
    const tl = gsap.timeline({
      scrollTrigger: { trigger: street, start: "top top", end: () => "+=" + dist(), pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1 }
    });
    tl.to(track, { x: () => -dist(), ease: "none" }, 0)
      .to("#orb", { x: () => innerWidth * 0.7, y: -30, ease: "sine.inOut" }, 0);
  });
})();
