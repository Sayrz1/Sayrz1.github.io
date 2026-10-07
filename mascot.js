/*
  Mini Sama: a chibi mascot that keeps you company down the page.
  She swaps props and lines per section, hops on changes, follows the
  cursor with her eyes, naps when you go idle and shares a fact when clicked.
*/
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => r.querySelector(s);

  // Ringlets around the face, seeded so they never shift between loads.
  let seed = 11;
  const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const curl = (x, y, r) =>
    `<circle class="m-hair" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}"/>` +
    `<path class="m-curl" d="M${(x - r * 0.5).toFixed(1)} ${(y + r * 0.1).toFixed(1)} a${(r * 0.55).toFixed(1)} ${(r * 0.55).toFixed(1)} 0 0 1 ${(r * 0.7).toFixed(1)} ${(-r * 0.55).toFixed(1)}"/>`;
  let cloud = "";
  for (let a = 200; a <= 340; a += 14) {
    const t = (a * Math.PI) / 180;
    cloud += curl(60 + Math.cos(t) * 38, 54 + Math.sin(t) * 36, 9 + rand() * 3);
  }
  const ringlets = (x) => { let o = ""; for (let y = 60; y <= 104; y += 9) o += curl(x + (rand() - 0.5) * 3, y, 7.5 - (y - 60) / 20); return o; };

  const SVG = `
  <svg class="m-svg" viewBox="0 0 120 140" aria-hidden="true">
    <ellipse class="m-shadow" cx="60" cy="135" rx="26" ry="4"/>
    <g class="m-body">
      <g class="m-backhair"><circle class="m-hair" cx="60" cy="56" r="38"/>${cloud}${ringlets(26)}${ringlets(94)}</g>
      <ellipse class="m-shoe" cx="51" cy="131" rx="8" ry="4.5"/>
      <ellipse class="m-shoe" cx="69" cy="131" rx="8" ry="4.5"/>
      <path class="m-hoodie" d="M38 130 C37 104 46 90 60 89 C74 90 83 104 82 130 Z"/>
      <path class="m-string" d="M56 96 v12 M64 96 v12"/>
      <path class="m-hoodie m-arm-l" d="M42 100 C34 106 31 114 34 120 L40 118 C39 113 42 108 46 104 Z"/>
      <circle class="m-skin" cx="36" cy="121" r="4.5"/>

      <g class="m-head">
        <circle class="m-skin" cx="60" cy="56" r="29"/>
        <path class="m-hair" d="M60 25 C44 23 30 34 30 52 C30 60 31 66 33 72 C35 56 44 44 59 41 L60 34 Z"/>
        <path class="m-hair" d="M60 25 C76 23 90 34 90 52 C90 60 89 66 87 72 C85 56 76 44 61 41 L60 34 Z"/>
        <path class="m-stray" d="M60 30 c-6 3 -8 11 -3 14 c4 2 7 -2 4 -5"/>
        <path class="m-clip" d="M38 36 l2 4 4.4 .6 -3.2 3 .8 4.4 -4 -2 -4 2 .8 -4.4 -3.2 -3 4.4 -.6 Z"/>
        <g class="m-eyes">
          <g class="m-open">
            <ellipse class="m-eye" cx="49" cy="60" rx="5" ry="6.5"/>
            <ellipse class="m-eye" cx="71" cy="60" rx="5" ry="6.5"/>
            <g class="m-gaze">
              <circle class="m-glint" cx="50.8" cy="57.6" r="2"/>
              <circle class="m-glint" cx="72.8" cy="57.6" r="2"/>
              <circle class="m-glint" cx="47.6" cy="62.6" r="1"/>
              <circle class="m-glint" cx="69.6" cy="62.6" r="1"/>
            </g>
          </g>
          <path class="m-closed" d="M44 61 q5 4 10 0 M66 61 q5 4 10 0"/>
          <path class="m-happy" d="M44 62 q5 -6 10 0 M66 62 q5 -6 10 0"/>
        </g>
        <ellipse class="m-blush" cx="41" cy="69" rx="5.5" ry="3.2"/>
        <ellipse class="m-blush" cx="79" cy="69" rx="5.5" ry="3.2"/>
        <path class="m-mouth" d="M55 69 q2.5 3 5 0 q2.5 3 5 0"/>
        <ellipse class="m-mouth-o" cx="60" cy="71" rx="3" ry="3.5"/>
      </g>

      <g class="m-props">
        <g class="p p-wave"><path class="m-hoodie" d="M78 100 C86 96 92 88 94 80 L88 78 C86 84 82 90 76 94 Z"/><circle class="m-skin m-wave-hand" cx="92" cy="76" r="5"/></g>

        <g class="p p-card"><path class="m-line" d="M60 92 L88 98"/><rect class="m-paper" x="84" y="96" width="18" height="24" rx="3"/><rect class="m-ink" x="84" y="96" width="18" height="7" rx="3"/><circle class="m-skin-dot" cx="93" cy="110" r="3.6"/><path class="m-line" d="M88 116 h10"/><circle class="m-skin" cx="83" cy="108" r="4.5"/></g>

        <g class="p p-flask"><path class="m-glass" d="M90 90 h8 v9 l8 16 a3 3 0 0 1 -3 4 h-18 a3 3 0 0 1 -3 -4 l8 -16 Z"/><path class="m-liquid" d="M85.5 110 h17 l2.6 5 a3 3 0 0 1 -3 4 h-16.2 a3 3 0 0 1 -3 -4 Z"/><circle class="m-fizz b1" cx="92" cy="110" r="1.6"/><circle class="m-fizz b2" cx="97" cy="112" r="1.2"/><circle class="m-fizz b3" cx="94" cy="106" r="1"/><circle class="m-skin" cx="82" cy="112" r="4.5"/></g>

        <g class="p p-laptop"><rect class="m-ink" x="40" y="104" width="40" height="24" rx="3"/><text class="m-code" x="60" y="120">&lt;/&gt;</text><rect class="m-paper" x="34" y="127" width="52" height="5" rx="2"/><circle class="m-skin m-type1" cx="44" cy="126" r="4"/><circle class="m-skin m-type2" cx="76" cy="126" r="4"/></g>

        <g class="p p-scroll"><rect class="m-paper" x="80" y="94" width="26" height="22" rx="2" transform="rotate(8 93 105)"/><path class="m-line" d="M85 101 h14 M85 106 h12 M85 111 h9" transform="rotate(8 93 105)"/><circle class="m-seal" cx="100" cy="116" r="4.5"/><path class="m-seal" d="M98 119 l-1.5 6 2.5 -1.5 1.5 2 .5 -6 Z"/><circle class="m-skin" cx="81" cy="110" r="4.5"/></g>

        <g class="p p-clapper"><rect class="m-ink" x="80" y="100" width="26" height="19" rx="2"/><path class="m-chalk" d="M84 108 h12 M84 112 h8"/><g class="m-clap"><rect class="m-ink" x="80" y="94" width="26" height="6" rx="1"/><path class="m-stripe" d="M84 94 l-3 6 M90 94 l-3 6 M96 94 l-3 6 M102 94 l-3 6"/></g><circle class="m-skin" cx="81" cy="112" r="4.5"/></g>

        <g class="p p-trophy"><path class="m-gold" d="M84 92 h20 v6 a10 10 0 0 1 -20 0 Z"/><path class="m-goldline" d="M84 95 c-6 0 -6 8 1 8 M104 95 c6 0 6 8 -1 8"/><rect class="m-gold" x="92" y="106" width="4" height="6"/><rect class="m-ink" x="87" y="112" width="14" height="5" rx="1.5"/><path class="m-spark" d="M108 86 l1.2 3 3 1.2 -3 1.2 -1.2 3 -1.2 -3 -3 -1.2 3 -1.2 Z"/><circle class="m-skin" cx="83" cy="108" r="4.5"/></g>

        <g class="p p-letter"><rect class="m-paper" x="80" y="98" width="26" height="18" rx="2"/><path class="m-line" d="M80 99 l13 9 13 -9"/><path class="m-heart" d="M93 109 c-2 -3 -6 -1 -4 2 l4 4 4 -4 c2 -3 -2 -5 -4 -2 Z"/><path class="m-heart m-float" d="M104 84 c-1.5 -2 -4.5 -.8 -3 1.5 l3 3 3 -3 c1.5 -2.3 -1.5 -3.5 -3 -1.5 Z"/><circle class="m-skin" cx="81" cy="110" r="4.5"/></g>
      </g>
    </g>
    <g class="m-zzz"><text x="88" y="30">z</text><text x="96" y="20">z</text><text x="104" y="10">Z</text></g>
  </svg>`;

  // Lines per section, and friendly invitations for clicks.
  const SECTIONS = {
    about: ["card", "That's my ID. Go on, flip it."],
    skills: ["flask", "Science! Well, a periodic table of it."],
    work: ["laptop", "Try the reading levels on LexiLift."],
    certifications: ["scroll", "Always learning, always collecting."],
    experience: ["clapper", "Lights, camera, career."],
    achievements: ["trophy", "Keep scrolling, it slides sideways."],
    contact: ["letter", "Say hi! I reply faster than my code compiles."],
  };
  const INVITES = [
    "Can I help you? We could work together!",
    "Looking for a developer? Hi, that's me.",
    "Got a project in mind? Let's build it.",
    "Need someone who codes AND edits videos?",
    "My inbox is open. Just saying.",
    "Let's make something cool together!",
  ];
  const MOVES = ["spin", "wiggle", "dance", "flip", "hop"];

  const root = document.createElement("div");
  root.className = "mascot";
  root.innerHTML = `
    <p class="m-bubble" role="status"></p>
    <button class="m-btn" type="button" aria-label="Mini Sama, the site mascot. Press for a fun fact.">${SVG}</button>
    <button class="m-hide" type="button" aria-label="Hide Mini Sama"><i class="ph ph-x"></i></button>`;
  document.body.appendChild(root);

  const svg = $(".m-svg", root);
  const bubble = $(".m-bubble", root);
  const btn = $(".m-btn", root);
  let bubbleT = 0, factIdx = 0, current = "";

  function say(text, ms = 3600) {
    bubble.textContent = text;
    root.classList.add("talk");
    clearTimeout(bubbleT);
    bubbleT = setTimeout(() => root.classList.remove("talk"), ms);
  }
  function hop(cls = "hop") {
    if (reduce) return;
    root.classList.remove("hop", "spin", "wiggle", "dance", "flip");
    void root.offsetWidth;
    root.classList.add(cls);
  }
  function setProp(name, line) {
    if (name === current) return;
    current = name;
    svg.dataset.prop = name;
    hop();
    if (line && root.classList.contains("on")) say(line);
  }

  // Appear once the hero is out of view, and follow the sections.
  const hero = $(".hero");
  new IntersectionObserver(([e]) => {
    const show = !e.isIntersecting;
    root.classList.toggle("on", show);
    if (show && !current) setProp("wave", "Hi again! I'm the mini one.");
  }, { threshold: 0.15 }).observe(hero);

  const secObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const s = SECTIONS[e.target.id];
      if (s) setProp(s[0], s[1]);
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  Object.keys(SECTIONS).forEach((id) => { const el = document.getElementById(id); if (el) secObs.observe(el); });

  btn.addEventListener("click", () => {
    wake();
    hop(MOVES[(Math.random() * MOVES.length) | 0]);
    root.classList.add("happy");
    setTimeout(() => root.classList.remove("happy"), 1200);
    say(INVITES[factIdx++ % INVITES.length], 4200);
  });

  // Hide / bring back, remembered per visitor.
  const KEY = "mini-sama-hidden";
  const restore = document.createElement("button");
  restore.type = "button";
  restore.className = "m-restore";
  restore.setAttribute("aria-label", "Bring back Mini Sama");
  restore.innerHTML = `<span>SE</span>`;
  document.body.appendChild(restore);
  function setHidden(h) {
    root.classList.toggle("gone", h);
    restore.classList.toggle("show", h);
    try { h ? localStorage.setItem(KEY, "1") : localStorage.removeItem(KEY); } catch (e) {}
  }
  $(".m-hide", root).addEventListener("click", () => setHidden(true));
  restore.addEventListener("click", () => { setHidden(false); hop("spin"); say("Missed me?"); });
  try { if (localStorage.getItem(KEY)) setHidden(true); } catch (e) {}

  // Nap after a while without activity.
  let idleT = 0;
  function wake() {
    if (root.classList.contains("sleep")) { root.classList.remove("sleep"); hop(); say("Huh? I wasn't sleeping.", 2400); }
    clearTimeout(idleT);
    idleT = setTimeout(() => { if (root.classList.contains("on")) { root.classList.add("sleep"); root.classList.remove("talk"); } }, 14000);
  }
  ["scroll", "pointerdown", "keydown"].forEach((ev) => window.addEventListener(ev, wake, { passive: true }));
  wake();

  // Eyes follow the pointer.
  if (!reduce && window.matchMedia("(hover: hover)").matches) {
    const gaze = $(".m-gaze", root);
    let raf = 0;
    window.addEventListener("pointermove", (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = btn.getBoundingClientRect();
        const dx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / 500));
        const dy = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height * 0.4)) / 500));
        gaze.style.transform = `translate(${(dx * 1.6).toFixed(2)}px, ${(dy * 1.4).toFixed(2)}px)`;
        if (root.classList.contains("sleep")) return;
        clearTimeout(idleT);
        idleT = setTimeout(() => { if (root.classList.contains("on")) { root.classList.add("sleep"); root.classList.remove("talk"); } }, 14000);
      });
    }, { passive: true });
  }
})();
