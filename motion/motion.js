(() => {
  "use strict";
  const A = "../assets/motion/";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const TRACKS = [
    { key: "ads", name: "Ads and reels", short: "Ads", c: "var(--t-ads)", icon: "ph-storefront",
      intro: "Short films for made-up shops, the kind of ad a small business could post this week.", wide: true },
    { key: "world", name: "In My World", short: "In My World", c: "var(--t-world)", icon: "ph-globe-hemisphere-west",
      intro: "My own series of twelve vertical short stories. Each one is set somewhere ordinary, a boiler round in the north of England or a post office in Ohio, with one impossible rule. <strong>The rule is always drawn in orange</strong>, so you learn to spot the magic." },
    { key: "howso", name: "How so?", short: "How so?", c: "var(--t-howso)", icon: "ph-flask",
      intro: "A science explainer series. Each episode takes one question people actually ask, works through the answer with labelled diagrams and ends on an A-or-B poll for the comments. The facts are checked against published sources." },
    { key: "exp", name: "Experiments", short: "Experiments", c: "var(--t-exp)", icon: "ph-sparkle",
      intro: "Films I make to try a style I haven't used before.", wide: true }
  ];

  const W = (n, file, name, rule, where, dur) => ({ track: "world", file: "world/" + file, poster: "world/world" + n + "-cover.jpg", name: "World " + n + " · " + name, short: name, client: "In my world, <em>" + rule + "</em>", setting: "Set in the " + where, desc: "In my world, <em>" + rule + "</em>", format: "9:16 · set in the " + where, dur, tall: true, num: n });
  const H = (n, file, name, q, dur) => ({ track: "howso", file: "howso/" + file, poster: "howso/howso-0" + n + "-cover.jpg", name: "Episode " + n + " · " + name, short: name, client: q, desc: q + " One question, answered with labelled diagrams in about 90 seconds.", format: "9:16 · Season 2", dur, tall: true, num: "0" + n });

  const CLIPS = [
    { track: "ads", file: "sama-showreel.mp4", poster: "sama-showreel.jpg", name: "Showreel 2026", client: "Eleven looks, one minute", desc: "My showreel. Each look is made with a different technique: palette-knife oil paint, a whiteboard, paper cut-outs, halftone collage, ink drawings, watercolour, 8-bit, anime, crayon, a neon night street and a product teardown. Then a 3D name, a few client-style pieces and an original score written for the cut.", format: "4:5", dur: 63, tall: true },
    { track: "ads", file: "same-ball.mp4", poster: "same-ball.jpg", name: "Same ball, ten styles", client: "Showreel", desc: "One orange ball bounces through ten styles in 28 seconds: chalkboard, paper cut-out, 8-bit, riso, blueprint, neon, watercolour, newsprint collage, glossy 3D and a Swiss poster. Each landing switches the look.", format: "9:16", dur: 28, tall: true },
    { track: "ads", file: "motion-showreel.mp4", poster: "motion-showreel.jpg", name: "Motion showreel", client: "Six looks, one dot", desc: "One orange dot travels through six looks in 30 seconds: Swiss grid, riso print, blueprint, paper diorama, collage, then glass and light. It ends as the full stop on the final line.", format: "9:16", dur: 30, tall: true },
    { track: "ads", file: "unfold-it.mp4", poster: "unfold-it.jpg", name: "One-line drawing", client: "Mess to idea", desc: "A crumpled scribble unfolds into a paper plane, then a light bulb, a song, a book and a home, all in one ink line.", format: "9:16", dur: 20, tall: true },
    { track: "ads", file: "tilly-salon.mp4", poster: "tilly-salon.jpg", name: "Cartoon explainer ad", client: "Tilly, AI front desk for salons", desc: "A cartoon explainer for Tilly, a made-up AI front desk that picks up the phone so salon staff don't have to.", format: "16:9", dur: 75 },
    { track: "ads", file: "ashgrove-cinematic.mp4", poster: "ashgrove-cinematic.jpg", name: "Cinematic product film", client: "Ashgrove Candle Co., Brooklyn", desc: "A slow, warm product film for a made-up candle maker in Brooklyn.", format: "16:9", dur: 33 },
    { track: "ads", file: "miller-whiteboard.mp4", poster: "miller-whiteboard.jpg", name: "Whiteboard explainer", client: "Miller Family Plumbing, Columbus", desc: "A hand-drawn whiteboard explainer for a made-up family plumber in Columbus, Ohio.", format: "16:9", dur: 32 },
    { track: "ads", file: "blue-hour.mp4", poster: "blue-hour.jpg", name: "Inked 3D world", client: "Hill town", desc: "An inked 3D fly-through of a hill town at golden hour. At blue hour its windows light up in a wave while a rider watches.", format: "9:16", dur: 15, tall: true },

    W("001", "world001-cold.mp4", "Cold", "being thought about keeps you warm.", "UK", 89.5),
    W("002", "world002-unsaid.mp4", "Unsaid", "every word you don't say becomes a letter.", "US", 79.5),
    W("003", "world003-shadows.mp4", "Shadows", "your shadow stays wherever you last felt safe.", "UK", 76.9),
    W("004", "world004-names.mp4", "Names", "you can hear how many times someone has said your name.", "US", 96.7),
    W("005", "world005-onecall.mp4", "One Call", "everyone gets one phone call. To anyone, dead or alive. Just once.", "US", 92.7),
    W("006", "world006-heard.mp4", "Heard", "when someone walks past you, you hear the last thing they thought about you.", "UK", 130.1),
    W("007", "world007-stones.mp4", "Stones", "every lie you tell turns into a little gray stone in your pocket.", "US", 140.7),
    W("008", "world008-ropes.mp4", "Ropes", "when you lean on someone, a rope grows between you.", "UK", 147.6),
    W("009", "world009-porch-light.mp4", "Porch Light", "when someone thinks about you, your porch light flickers.", "US", 139.2),
    W("010", "world010-thursdays.mp4", "Thursdays", "when someone starts to forget you, you fade out of their photos.", "UK", 131.2),
    W("011", "world011-cranes.mp4", "Cranes", "every time someone worries about you, a paper crane lands wherever you sleep.", "US", 121.3),
    W("012", "world012-waiting.mp4", "Waiting", "when someone waits for you, their footprints stay where they stood.", "UK", 128.1),

    H(1, "howso-01-plane.mp4", "Plane Toilet", "You flush on a plane. Where does it go?", 91.7),
    H(2, "howso-02-tattoo.mp4", "Tattoo", "Why don't tattoos wash away?", 95.1),
    H(3, "howso-03-cat.mp4", "Falling Cat", "How do cats always land on their feet?", 89.6),
    H(4, "howso-04-onion.mp4", "Onion", "Why do onions make you cry?", 98.2),
    H(5, "howso-05-freeze.mp4", "Brain Freeze", "Why does brain freeze hurt there?", 72.3),
    H(6, "howso-06-flamingo.mp4", "Flamingo", "Why are flamingos pink?", 100.8),

    { track: "exp", file: "keeper-loop.mp4", poster: "keeper-loop.jpg", name: "Keeper", client: "Hand-painted short film", desc: "A lighthouse, a storm and one small boat, in a hand-painted style. The preview loops here; the full film with sound is on Google Drive.", format: "16:9", dur: 49, loop: true, drive: "18zvr0xuk5kl_AqHbz5KitadBv5wbU2T3" },
    { track: "exp", file: "styles-loop.mp4", poster: "styles-loop.jpg", name: "Twelve styles, one minute", client: "Motion study", desc: "Twelve thinking words, each in its own technique: glass shader, halftone, particles, blueprint, Three.js voxels.", format: "1:1", dur: 60, loop: true, drive: "1LSrcfeM3NHrS66CU3hDH8ha2ZvuN0aYa" },
    { track: "exp", file: "share-full.mp4", poster: "share-loop.jpg", name: "Before You Share", client: "Mid-century cartoon explainer", desc: "Three rules for stopping a rumour before your thumb sends it on: pause, check the source, and if in doubt, don't.", format: "16:9 · no sound", dur: 38, silent: true }
  ];

  CLIPS.forEach((c, i) => { c.i = i; });

  const $ = (id) => document.getElementById(id);
  const video = $("program"), monitor = $("monitor"), drive = $("drive");
  const tc = $("tc");
  // Nothing plays until the visitor picks a film and presses play.
  let cur = 0, started = false;

  const fmt = (s) => { s = Math.max(0, s || 0); const m = Math.floor(s / 60); return m + ":" + String(Math.floor(s % 60)).padStart(2, "0"); };
  const tcode = (s) => {
    const f = Math.floor((s % 1) * 25), t = Math.floor(s);
    return [Math.floor(t / 3600), Math.floor(t / 60) % 60, t % 60, f].map((n) => String(n).padStart(2, "0")).join(":");
  };
  const trackOf = (k) => TRACKS.find((t) => t.key === k);

  // The header timecode follows the film on the monitor.
  function movePlayhead() { tc.textContent = tcode(video.currentTime || 0); }

  /* ---------- monitor ---------- */
  function setBadge() {
    const live = !video.muted && !video.paused;
    $("mon-badge").classList.toggle("live", live);
    $("mon-mode").textContent = video.paused ? (started ? "Paused" : "Press play") : video.muted ? "Playing, muted" : "Playing with sound";
    const muteBtn = $("mute");
    muteBtn.setAttribute("aria-pressed", String(!video.muted));
    muteBtn.setAttribute("aria-label", video.muted ? "Turn sound on" : "Turn sound off");
    muteBtn.innerHTML = `<i class="ph-fill ${video.muted ? "ph-speaker-slash" : "ph-speaker-high"}" aria-hidden="true"></i>`;
    const tg = $("toggle");
    tg.setAttribute("aria-label", video.paused ? "Play" : "Pause");
    tg.innerHTML = `<i class="ph-fill ${video.paused ? "ph-play" : "ph-pause"}" aria-hidden="true"></i>`;
  }

  function inspector(c) {
    const t = trackOf(c.track);
    $("insp-swatch").style.background = t.c;
    $("insp-track").textContent = t.name;
    $("insp-name").textContent = c.name;
    $("insp-client").innerHTML = c.setting || c.client;
    $("insp-desc").innerHTML = c.desc;
    $("insp-format").textContent = c.format.split(" · ")[0];
    $("insp-length").textContent = fmt(c.dur);
    $("full-film").hidden = !c.drive;
    const ps = $("play-sound");
    ps.hidden = c.silent && !video.paused;
    ps.querySelector("span").textContent = c.silent ? "Play from the start" : "Play with sound";
    document.querySelectorAll(".item").forEach((el) => el.classList.toggle("on", +el.dataset.i === c.i));
  }

  let loadToken = 0;
  function load(i, { sound = false, seek = 0, auto = true } = {}) {
    if (auto) started = true;
    cur = (i + CLIPS.length) % CLIPS.length;
    const c = CLIPS[cur];
    drive.hidden = true; drive.removeAttribute("src");
    monitor.classList.add("swap");
    monitor.classList.toggle("tall", !!c.tall);
    const token = ++loadToken;
    setTimeout(() => {
      if (token !== loadToken) return;
      video.src = A + c.file;
      video.poster = A + c.poster;
      video.loop = !!c.loop;
      video.muted = !sound ? video.muted : false;
      const go = () => {
        if (seek) { try { video.currentTime = seek; } catch (e) {} }
        if (auto) video.play().catch(() => { video.muted = true; video.play().catch(() => {}); setBadge(); });
        monitor.classList.remove("swap");
      };
      if (video.readyState >= 1) go(); else video.addEventListener("loadedmetadata", go, { once: true });
      inspector(c); setBadge(); movePlayhead();
    }, reduce ? 0 : 180);
  }

  video.addEventListener("timeupdate", () => {
    const d = video.duration || CLIPS[cur].dur;
    $("t-now").textContent = fmt(video.currentTime);
    $("t-dur").textContent = fmt(d);
    $("scrub-fill").style.width = (video.currentTime / d) * 100 + "%";
    $("scrub").setAttribute("aria-valuenow", Math.round((video.currentTime / d) * 100));
    movePlayhead();
  });
  video.addEventListener("ended", setBadge);
  ["play", "pause", "volumechange"].forEach((e) => video.addEventListener(e, setBadge));

  $("play-sound").addEventListener("click", () => load(cur, { sound: true }));
  $("toggle").addEventListener("click", () => { started = true; if (video.paused) { video.muted = false; video.play(); } else video.pause(); setBadge(); });
  $("prev").addEventListener("click", () => load(cur - 1, { sound: true, auto: started && !video.paused }));
  $("next").addEventListener("click", () => load(cur + 1, { sound: true, auto: started && !video.paused }));
  $("mute").addEventListener("click", () => { video.muted = !video.muted; setBadge(); });
  $("full-film").addEventListener("click", () => {
    const c = CLIPS[cur]; if (!c.drive) return;
    video.pause();
    drive.src = "https://drive.google.com/file/d/" + c.drive + "/preview";
    drive.hidden = false; monitor.classList.remove("tall");
    $("mon-mode").textContent = "Full film from Google Drive";
  });

  // scrub bar
  const scrub = $("scrub");
  const seekTo = (ev) => {
    const r = scrub.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width));
    if (video.duration) video.currentTime = p * video.duration;
  };
  scrub.addEventListener("pointerdown", (ev) => { seekTo(ev); scrub.setPointerCapture(ev.pointerId); setBadge(); });
  scrub.addEventListener("pointermove", (ev) => { if (scrub.hasPointerCapture(ev.pointerId)) seekTo(ev); });
  scrub.addEventListener("keydown", (ev) => {
    if (ev.key === "ArrowRight" || ev.key === "ArrowLeft") { ev.preventDefault(); ev.stopPropagation(); video.currentTime += ev.key === "ArrowRight" ? 5 : -5; }
  });

  document.addEventListener("keydown", (ev) => {
    if (ev.target.closest("input, textarea, [contenteditable]") || ev.metaKey || ev.ctrlKey || ev.altKey) return;
    const onButton = ev.target.closest("button, a, [role=slider]");
    if (ev.code === "Space" && !onButton) { ev.preventDefault(); $("toggle").click(); }
    else if (ev.key === "ArrowRight" && !onButton) $("next").click();
    else if (ev.key === "ArrowLeft" && !onButton) $("prev").click();
    else if (ev.key.toLowerCase() === "m") $("mute").click();
  });


  /* ---------- bays: one screen per series, list beside it ---------- */
  const allVideos = () => [video, ...document.querySelectorAll(".bay-video")];
  function solo(v) { allVideos().forEach((o) => { if (o !== v && !o.paused && !o.muted) o.pause(); }); if (v !== video && !video.paused) { video.pause(); setBadge(); } }

  $("bins").innerHTML = TRACKS.map((t) => {
    const items = CLIPS.filter((c) => c.track === t.key);
    const first = items[0];
    return `<div class="bay${t.wide ? " bay-wide" : ""}" id="bay-${t.key}" data-track="${t.key}" style="--c:${t.c}">
      <div class="bin-head"><i class="ph-fill ${t.icon}" aria-hidden="true"></i><h3>${t.name}</h3><p>${t.intro}</p></div>
      <div class="bay-body">
        <div class="bay-screen">
          <div class="bay-frame">
            <video class="bay-video" controls playsinline preload="none" poster="${A}${first.poster}" src="${A}${first.file}"></video>
            <iframe class="bay-drive" title="Full film from Google Drive" allow="autoplay; fullscreen" hidden></iframe>
          </div>
          <div class="bay-now" aria-live="polite">
            <p class="bay-title"></p>
            <p class="bay-desc"></p>
            <button class="btn btn-ghost bay-full" type="button" hidden><i class="ph ph-google-drive-logo" aria-hidden="true"></i>Watch the full film with sound</button>
          </div>
        </div>
        <ol class="bay-list" aria-label="${t.name} films">${items.map((c) => `
          <li><button class="item" type="button" data-i="${c.i}" aria-label="Play ${c.name.replace(/"/g, "")}">
            <span class="item-thumb"><img src="${A}${c.poster}" alt="" loading="lazy"><span class="item-play" aria-hidden="true"><i class="ph-fill ph-play"></i></span></span>
            <span class="item-text">
              <span class="item-t">${c.num ? `<span class="item-n">${c.num}</span>` : ""}${c.short || c.name}</span>
              <span class="item-s">${c.client}</span>
              <span class="item-d">${c.format.split(" · ")[0]} · ${fmt(c.dur)}</span>
            </span>
          </button></li>`).join("")}</ol>
      </div></div>`;
  }).join("");

  function bayShow(bay, c, play) {
    const v = bay.querySelector(".bay-video"), d = bay.querySelector(".bay-drive");
    d.hidden = true; d.removeAttribute("src"); v.hidden = false;
    if (!v.src.endsWith(c.file)) { v.src = A + c.file; v.poster = A + c.poster; }
    v.loop = !!c.loop;
    bay.dataset.cur = c.i;
    bay.querySelector(".bay-frame").classList.toggle("tall", !!c.tall);
    bay.querySelector(".bay-title").textContent = c.name;
    bay.querySelector(".bay-desc").innerHTML = c.desc;
    bay.querySelector(".bay-full").hidden = !c.drive;
    bay.querySelectorAll(".item").forEach((el) => { const on = +el.dataset.i === c.i; el.classList.toggle("on", on); if (on) el.setAttribute("aria-current", "true"); else el.removeAttribute("aria-current"); });
    if (play) { v.muted = false; v.play().catch(() => {}); }
  }

  document.querySelectorAll(".bay").forEach((bay) => {
    const v = bay.querySelector(".bay-video");
    const items = CLIPS.filter((c) => c.track === bay.dataset.track);
    bayShow(bay, items[0], false);
    v.addEventListener("play", () => solo(v));
    bay.querySelector(".bay-list").addEventListener("click", (ev) => {
      const el = ev.target.closest(".item"); if (!el) return;
      bayShow(bay, CLIPS[+el.dataset.i], true);
      // keep the screen in view without jumping the page about
      const r = bay.querySelector(".bay-frame").getBoundingClientRect();
      if (r.bottom < 60 || r.top > innerHeight - 60) bay.querySelector(".bay-screen").scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
    });
    bay.querySelector(".bay-full").addEventListener("click", () => {
      const c = CLIPS[+bay.dataset.cur]; if (!c.drive) return;
      v.pause(); v.hidden = true; solo(v);
      const d = bay.querySelector(".bay-drive");
      d.src = "https://drive.google.com/file/d/" + c.drive + "/preview"; d.hidden = false;
      bay.querySelector(".bay-frame").classList.remove("tall");
    });
  });
  video.addEventListener("play", () => { if (!video.muted) solo(video); });
  video.addEventListener("volumechange", () => { if (!video.muted && !video.paused) solo(video); });

  /* ---------- deep links: /motion/#world-005, #howso-3, #keeper ---------- */
  function fromHash() {
    const h = location.hash.slice(1).toLowerCase(); if (!h) return null;
    const m = h.match(/^(world|howso)-?0*(\d+)$/);
    if (m) return CLIPS.find((c) => c.track === m[1] && parseInt(c.num, 10) === +m[2]);
    return CLIPS.find((c) => c.file.replace(/^.*\//, "").startsWith(h));
  }

  /* ---------- leader ---------- */
  const leader = $("leader");
  let seen = false;
  try { seen = sessionStorage.getItem("leader") === "1"; } catch (e) {}
  function start() {
    const c = fromHash();
    load(0, { auto: false });
    if (c) {
      const bay = document.getElementById("bay-" + c.track);
      bayShow(bay, c, false);
      setTimeout(() => bay.scrollIntoView({ behavior: "auto", block: "start" }), 50);
    }
  }
  if (!reduce && !seen) {
    leader.classList.add("on");
    let n = 3, done = false;
    const tick = setInterval(() => { n--; if (n > 0) $("leader-n").textContent = n; else finish(); }, 750);
    function finish() {
      if (done) return; done = true; clearInterval(tick);
      try { sessionStorage.setItem("leader", "1"); } catch (e) {}
      leader.classList.add("out");
      setTimeout(() => leader.remove(), 700);
    }
    leader.addEventListener("click", finish);
    addEventListener("keydown", finish, { once: true });
  } else leader.remove();
  start();
})();
