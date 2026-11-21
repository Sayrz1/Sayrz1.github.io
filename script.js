(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- Projects tab: show how many projects there are ---------- */
  const navCount = $("#nav-count");
  if (navCount) navCount.textContent = $$("#stage > .panel").length || "";

  /* ---------- Split headings into words for the mask reveal ---------- */
  $$("[data-split]").forEach((el) => {
    let i = 0;
    const wrap = (node) => {
      const w = document.createElement("span");
      w.className = "w";
      const inner = document.createElement("span");
      inner.style.setProperty("--wi", i++);
      inner.appendChild(node);
      w.appendChild(inner);
      return w;
    };
    [...el.childNodes].forEach((node) => {
      if (node.nodeType === 3) {
        const frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          frag.appendChild(/^\s+$/.test(part) ? document.createTextNode(part) : wrap(document.createTextNode(part)));
        });
        el.replaceChild(frag, node);
      } else if (node.nodeType === 1 && node.tagName !== "BR") {
        const marker = document.createComment("");
        el.replaceChild(marker, node);
        el.replaceChild(wrap(node), marker);
      }
    });
  });
  $$(".hero-ghost span").forEach((s, i) => s.style.setProperty("--gi", i));

  /* ---------- Hero portrait ---------- */
  const avatar = $("#portrait");
  const tilt = $(".portrait-tilt", avatar);
  const sparkleLayer = $(".sparkles", avatar);

  if (finePointer && !reduce) {
    const fig = $(".hero-figure");
    let raf = 0;
    fig.addEventListener("pointermove", (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = fig.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        tilt.style.transform = `rotateY(${(x * 8).toFixed(2)}deg) rotateX(${(-y * 6).toFixed(2)}deg)`;
        sparkleLayer.style.transform = `translate(${(-x * 14).toFixed(1)}px, ${(-y * 10).toFixed(1)}px)`;
      });
    });
    fig.addEventListener("pointerleave", () => { tilt.style.transform = ""; sparkleLayer.style.transform = ""; });
  }

  const SPARK_COLOURS = ["#8eaee8", "#ec8a78", "#d6a756", "#f2c94c"];
  function sparkleBurst(x, y) {
    if (reduce) return;
    for (let i = 0; i < 12; i++) {
      const s = document.createElement("span");
      const a = (i / 12) * Math.PI * 2 + Math.random() * 0.5;
      const d = 50 + Math.random() * 70;
      s.className = "pop-spark";
      s.style.left = x + "px";
      s.style.top = y + "px";
      s.style.setProperty("--dx", (Math.cos(a) * d).toFixed(0) + "px");
      s.style.setProperty("--dy", (Math.sin(a) * d).toFixed(0) + "px");
      s.style.setProperty("--c", SPARK_COLOURS[i % SPARK_COLOURS.length]);
      avatar.appendChild(s);
      s.addEventListener("animationend", () => s.remove());
    }
  }

  /* ---------- Theme ---------- */
  const themeBtn = $("#theme-toggle");
  const isDark = () =>
    document.documentElement.dataset.theme
      ? document.documentElement.dataset.theme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  const syncThemeIcon = () => {
    themeBtn.innerHTML = `<i class="ph ${isDark() ? "ph-sun" : "ph-moon"}"></i>`;
    themeBtn.setAttribute("aria-label", isDark() ? "Switch to light mode" : "Switch to dark mode");
  };
  syncThemeIcon();
  themeBtn.addEventListener("click", () => {
    const next = isDark() ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
    syncThemeIcon();
  });

  /* ---------- Mobile menu ---------- */
  const menuBtn = $("#menu-toggle");
  const links = $("#nav-links");
  const setMenu = (open) => {
    links.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menuBtn.innerHTML = `<i class="ph ${open ? "ph-x" : "ph-list"}"></i>`;
  };
  menuBtn.addEventListener("click", () => setMenu(!links.classList.contains("open")));
  $$("a", links).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* ---------- Current section ----------
     One observer for the whole page; the nav pill and the mascot both listen for "section:change". */
  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) document.dispatchEvent(new CustomEvent("section:change", { detail: e.target.id }));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("main > section[id]").forEach((s) => sectionObs.observe(s));

  const navMap = new Map($$("a", links).map((a) => [a.getAttribute("href").slice(1), a]));
  document.addEventListener("section:change", ({ detail: id }) => {
    const a = navMap.get(id);
    if (!a) return;
    navMap.forEach((x) => x.classList.toggle("active", x === a));
  });

  /* ---------- Talking hero ---------- */
  const lines = [
    "Hi, I'm Sama.",
    "I just graduated with a First in Computer Science.",
    "My final year project makes web pages easier to read.",
    "I like building things and putting them in front of people.",
    "I also edit videos. A lot of videos.",
    "Some of my freelance work is top secret. Sorry!",
    "Click me. I sparkle.",
  ];
  const bubbleText = $("#bubble-text");
  let lineIdx = 0, typing = null, paused = false;

  function say(text) {
    clearTimeout(typing);
    if (reduce || paused) { bubbleText.textContent = text; avatar.classList.remove("talking"); if (!paused && !reduce) typing = setTimeout(next, 3200); return; }
    let i = 0;
    avatar.classList.add("talking");
    bubbleText.textContent = "";
    const step = () => {
      if (paused) { bubbleText.textContent = text; avatar.classList.remove("talking"); return; }
      bubbleText.textContent = text.slice(0, ++i);
      if (i < text.length) typing = setTimeout(step, 38);
      else { avatar.classList.remove("talking"); typing = setTimeout(next, 2800); }
    };
    step();
  }
  function next() { lineIdx = (lineIdx + 1) % lines.length; say(lines[lineIdx]); }
  function bounce() {
    if (reduce) return;
    avatar.classList.remove("bounce");
    void avatar.offsetWidth;
    avatar.classList.add("bounce");
  }
  setTimeout(() => { bounce(); say(lines[0]); }, reduce ? 0 : 900);
  $("#figure").addEventListener("click", (e) => {
    bounce();
    const r = avatar.getBoundingClientRect();
    const fromKeyboard = e.detail === 0;
    sparkleBurst(fromKeyboard ? r.width / 2 : e.clientX - r.left, fromKeyboard ? r.height * 0.3 : e.clientY - r.top);
    if (!paused) next();
  });

  const pauseBtn = $("#pause");
  pauseBtn.addEventListener("click", () => {
    paused = !paused;
    pauseBtn.setAttribute("aria-pressed", String(paused));
    pauseBtn.setAttribute("aria-label", paused ? "Play animation" : "Pause animation");
    pauseBtn.innerHTML = `<i class="ph ${paused ? "ph-play" : "ph-pause"}"></i>`;
    avatar.classList.toggle("paused", paused);
    clearTimeout(typing);
    if (paused) { avatar.classList.remove("talking"); bubbleText.textContent = lines[lineIdx]; }
    else next();
  });

  /* ---------- ID card: flip + pointer tilt ---------- */
  const card = $("#id-card");
  card.addEventListener("click", () => {
    card.setAttribute("aria-pressed", card.getAttribute("aria-pressed") === "true" ? "false" : "true");
  });
  if (finePointer && !reduce) {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `rotate(${(x * 5).toFixed(2)}deg) rotateX(${(-y * 8).toFixed(2)}deg)`;
    });
    card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  }

  /* ---------- Periodic table ---------- */
  const FAMILY = { lang: "Languages", front: "Frontend", back: "Backend & data", ai: "AI & algorithms", tool: "Tools" };
  const els = [
    ["Py", "Python", "lang", "python", "Model training for LexiLift, FastAPI backends and evolutionary algorithms."],
    ["Jv", "Java", "lang", "openjdk", "Object-oriented coursework, a JavaFX app, a GloVe news classifier and JHipster back ends."],
    ["Ts", "TypeScript", "lang", "typescript", "Typed front ends in Angular and React, for Campus Connect and RelAI."],
    ["Js", "JavaScript", "lang", "javascript", "LexiLift's Chrome extension scripts, and the interactions on this page."],
    ["Sq", "SQL", "lang", "", "Relational modelling and queries for PostgreSQL and MySQL."],
    ["C", "C", "lang", "c", "Low-level programming in C."],
    ["Ht", "HTML", "lang", "html5", "Semantic, accessible markup."],
    ["Cs", "CSS & SCSS", "lang", "css3", "Layouts, theming and motion, including this site. Accessible SCSS components for Campus Connect."],
    ["Ng", "Angular", "front", "angular", "Campus Connect's front end, with role-based access control and dynamic routing."],
    ["Re", "React", "front", "react", "The RelAI dashboard, built with Vite and shadcn/ui."],
    ["Tw", "Tailwind CSS", "front", "tailwindcss", "Utility-first styling for the RelAI dashboard."],
    ["Fx", "JavaFX", "front", "", "Desktop interface for the Inventory Management System."],
    ["Ce", "Chrome Extensions", "front", "googlechrome", "LexiLift is a Manifest V3 extension that rewrites pages in place."],
    ["Fg", "Figma", "front", "figma", "Interface design. Second place in Valyfy's Figma UI hackathon."],
    ["Fa", "FastAPI", "back", "fastapi", "LexiLift's local inference server, with a meaning gate and a fallback chain."],
    ["Jh", "JHipster", "back", "jhipster", "Full stack scaffolding for Campus Connect."],
    ["Sb", "Spring Boot", "back", "springboot", "The Java back end behind Campus Connect's REST API."],
    ["Pg", "PostgreSQL", "back", "postgresql", "Data for Campus Connect and the Inventory Management System."],
    ["My", "MySQL", "back", "mysql", "Relational databases alongside PostgreSQL."],
    ["Su", "Supabase", "back", "supabase", "Auth and Postgres behind the RelAI dashboard."],
    ["Pt", "PyTorch", "ai", "pytorch", "Fine-tuning T5-small and BART-base for text simplification."],
    ["Hf", "Hugging Face", "ai", "", "Transformers and datasets in LexiLift's training pipeline."],
    ["On", "ONNX", "ai", "onnx", "A T5 export that runs 1.5 to 2 times faster on CPU."],
    ["Nl", "NLP", "ai", "", "Text simplification, CEFR levels, and SARI and BERTScore evaluation."],
    ["Ga", "Genetic Algorithms", "ai", "", "Population-based search for MAXSAT and airline crew scheduling."],
    ["Sa", "Simulated Annealing", "ai", "", "Compared head to head with genetic algorithms on crew scheduling."],
    ["Gv", "GloVe", "ai", "", "Word embeddings behind the Advanced News Classifier."],
    ["Gt", "Git", "tool", "git", "Version control for every project here."],
    ["Dk", "Docker", "tool", "docker", "Reproducible runs for the MAXSAT solver."],
    ["Aw", "AWS", "tool", "amazonaws", "Where Campus Connect was deployed."],
    ["Lx", "Linux", "tool", "linux", "Ubuntu for development and GPU training."],
    ["Ws", "Wireshark", "tool", "wireshark", "Packet-level traffic analysis in Security & Networks coursework."],
    ["Ij", "IntelliJ IDEA", "tool", "intellijidea", "My home for Java."],
    ["Cv", "Canva", "tool", "canva", "Social posts for ReachOut2All and university campaigns."],
    ["Ve", "Video Editing", "tool", "", "Filming and editing promo videos for the university and Food Fellows, plus edits for fun."],
    ["Mk", "Marketing", "tool", "", "Freelance marketing for Agorize and the Student Safety App, and Instagram content for ReachOut2All."],
  ];
  const table = $("#ptable");
  const panel = { logo: $("#pt-logo"), name: $("#pt-name"), fam: $("#pt-fam"), desc: $("#pt-desc") };
  let current = null;
  function show(btn, d) {
    if (current === btn) return;
    current?.classList.remove("on");
    btn.classList.add("on");
    current = btn;
    panel.logo.innerHTML = d[3]
      ? `<span class="logo" style="--ico:url('https://cdn.jsdelivr.net/npm/simple-icons@11/icons/${d[3]}.svg')"></span>`
      : `<span class="pt-sym-big">${d[0]}</span>`;
    panel.name.textContent = d[1];
    panel.fam.textContent = FAMILY[d[2]];
    panel.desc.textContent = d[4];
  }
  els.forEach((d, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = `el ${d[2]} reveal-el`;
    b.dataset.fam = d[2];
    b.style.setProperty("--i", i);
    b.setAttribute("aria-label", `${d[1]}, ${FAMILY[d[2]]}: ${d[4]}`);
    b.innerHTML = `<span class="n">${String(i + 1).padStart(2, "0")}</span><span class="s">${d[0]}</span><span class="nm">${d[1]}</span>`;
    b.addEventListener("mouseenter", () => show(b, d));
    b.addEventListener("focus", () => show(b, d));
    b.addEventListener("click", () => show(b, d));
    table.appendChild(b);
    if (i === 0) show(b, d);
  });
  $$(".pt-filters button").forEach((f) => f.addEventListener("click", () => {
    $$(".pt-filters button").forEach((x) => x.setAttribute("aria-pressed", String(x === f)));
    const fam = f.dataset.fam;
    table.classList.toggle("filtered", fam !== "all");
    $$(".el", table).forEach((el) => el.classList.toggle("match", fam === "all" || el.dataset.fam === fam));
    if (fam !== "all") {
      const first = $(`.el[data-fam="${fam}"]`, table);
      show(first, els[[...table.children].indexOf(first)]);
    }
  }));

  /* ---------- LexiLift demo ---------- */
  const samples = {
    orig: "The committee postponed its decision owing to insufficient evidence regarding the proposal's long-term viability.",
    b2: "The committee delayed its decision because there was not enough evidence that the plan would work in the long term.",
    b1: "The committee decided to wait. They did not have enough proof that the plan would work for a long time.",
    a2: "The group did not decide yet. They need more proof that the plan will work.",
  };
  const demoText = $("#demo-text");
  $$(".seg button").forEach((btn) => btn.addEventListener("click", () => {
    $$(".seg button").forEach((b) => b.setAttribute("aria-selected", "false"));
    btn.setAttribute("aria-selected", "true");
    demoText.classList.add("swap");
    setTimeout(() => { demoText.textContent = samples[btn.dataset.level]; demoText.classList.remove("swap"); }, reduce ? 0 : 220);
  }));

  /* ---------- Projects: index + stage ----------
     Without JS the cards are a plain list; with JS they stack on one stage and the numbered list picks which shows. */
  (() => {
    const stage = $("#stage"), index = $("#proj-index"), wrap = $(".stage-wrap");
    if (!stage || !index || !wrap) return;
    const cards = $$(":scope > .panel", stage);
    const pad = (n) => String(n).padStart(2, "0");
    const tabs = cards.map((card, i) => {
      if (!card.id) card.id = "proj-" + (i + 1);
      const li = document.createElement("li");
      const b = document.createElement("button");
      b.type = "button"; b.className = "proj-tab"; b.id = card.id + "-tab";
      b.setAttribute("role", "tab"); b.setAttribute("aria-controls", card.id);
      b.innerHTML = '<span class="n"></span><span class="t"></span><span class="k"></span>';
      $(".n", b).textContent = pad(i + 1);
      $(".t", b).textContent = $(".panel-title", card).textContent;
      $(".k", b).textContent = card.dataset.kind || "";
      li.appendChild(b); index.appendChild(li);
      card.setAttribute("role", "tabpanel"); card.setAttribute("aria-labelledby", b.id);
      return b;
    });
    index.setAttribute("role", "tablist");

    const nav = document.createElement("div");
    nav.className = "stage-nav";
    nav.innerHTML = '<button type="button" class="icon-btn" data-step="-1" aria-label="Previous project"><i class="ph ph-arrow-left"></i></button>' +
      '<span class="stage-count" aria-hidden="true"><b></b> / ' + pad(cards.length) + '</span><span class="stage-bar" aria-hidden="true"><span></span></span>' +
      '<button type="button" class="icon-btn" data-step="1" aria-label="Next project"><i class="ph ph-arrow-right"></i></button>';
    stage.after(nav);

    let cur = -1, hoverT;
    function show(i, focus) {
      i = (i + cards.length) % cards.length;
      if (focus) tabs[i].focus();
      if (i === cur) return;
      cur = i;
      cards.forEach((c, j) => { const on = j === i; c.classList.toggle("is-open", on); c.inert = !on; });
      tabs.forEach((t, j) => { t.setAttribute("aria-selected", String(j === i)); t.tabIndex = j === i ? 0 : -1; });
      // On phones the list is a sideways row of pills: keep the chosen one in view without moving the page.
      if (index.scrollWidth > index.clientWidth) {
        const li = tabs[i].parentElement;
        index.scrollTo({ left: li.offsetLeft - index.offsetLeft - 16, behavior: reduce ? "auto" : "smooth" });
      }
      $(".stage-count b", nav).textContent = pad(i + 1);
      $(".stage-bar span", nav).style.transform = "scaleX(" + ((i + 1) / cards.length) + ")";
    }
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => show(i));
      t.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") hoverT = setTimeout(() => show(i), 140); });
      t.addEventListener("pointerleave", () => clearTimeout(hoverT));
    });
    index.addEventListener("keydown", (e) => {
      const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (step) { e.preventDefault(); show(cur + step, true); }
      else if (e.key === "Home") { e.preventDefault(); show(0, true); }
      else if (e.key === "End") { e.preventDefault(); show(cards.length - 1, true); }
    });
    nav.addEventListener("click", (e) => { const b = e.target.closest("[data-step]"); if (b) show(cur + Number(b.dataset.step)); });

    let x0 = null;
    stage.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
    });

    wrap.classList.add("is-ready");
    show(0);
  })();

  /* ---------- Project visuals ---------- */
  // RelAI: usage heatmap motif (decorative, not real data)
  const heat = $("#heat");
  const HEAT_COLS = 14, HEAT_ROWS = 6;
  heat.style.setProperty("--cols", HEAT_COLS);
  for (let i = 0; i < HEAT_COLS * HEAT_ROWS; i++) {
    const c = document.createElement("i");
    const v = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
    c.style.opacity = (0.08 + v * 0.85).toFixed(2);
    heat.appendChild(c);
  }

  // MAXSAT: bits flipping, like an EA mutating an assignment
  const bits = $("#bits");
  const cells = [];
  const BIT_COLS = 16, BIT_ROWS = 12;
  bits.style.setProperty("--cols", BIT_COLS);
  for (let i = 0; i < BIT_COLS * BIT_ROWS; i++) {
    const s = document.createElement("span");
    const one = Math.random() > 0.5;
    s.textContent = one ? "1" : "0";
    if (one) s.className = "one";
    bits.appendChild(s);
    cells.push(s);
  }
  let bitTimer = null;
  const mutate = () => {
    for (let k = 0; k < 4; k++) {
      const s = cells[(Math.random() * cells.length) | 0];
      const one = s.textContent === "0";
      s.textContent = one ? "1" : "0";
      s.className = (one ? "one " : "") + "flip";
    }
  };

  // Cyber-Maze: the real level from teaching-cs-in-school, solved with BFS
  const MAP = [
    "WWWWWWWWWWWWWWWWWWWW",
    "W.PP.......W.......W",
    "W.WWWW.WWW.W.WWWWW.W",
    "W....W.W...W.....W.W",
    "WWWW.W.W.WWWWWWW.W.W",
    "W.E..W.W.......W.W.W",
    "W.WWWW.WWWWWWW.W.W.W",
    "W.W..........W.W.W.W",
    "W.W.WWWWWWWW.W.W.W.W",
    "W.W......E...W.W.W.W",
    "W.W.WWWWWWWW.W.W.W.W",
    "W.W..........W...W.W",
    "W.WWWWWWWWWWWWWW.W.W",
    "W................G.W",
    "WWWWWWWWWWWWWWWWWWWW",
  ];
  const maze = $("#maze");
  const MAZE_W = MAP[0].length, MAZE_H = MAP.length;
  maze.style.setProperty("--cols", MAZE_W);
  maze.style.setProperty("--rows", MAZE_H);
  const mazeCells = [];
  let start, goal;
  MAP.forEach((row, y) => [...row].forEach((ch, x) => {
    const c = document.createElement("i");
    c.className = ch === "W" ? "" : "o";
    if (ch === "G") { c.className = "goal"; goal = [x, y]; }
    if (ch === "P" && !start) start = [x, y];
    maze.appendChild(c);
    mazeCells.push(c);
  }));
  const runner = document.createElement("span");
  runner.className = "runner";
  maze.appendChild(runner);
  const place = ([x, y]) => { runner.style.left = (x / MAZE_W) * 100 + "%"; runner.style.top = (y / MAZE_H) * 100 + "%"; };
  place(start);
  function bfs() {
    const key = (p) => p[0] + "," + p[1];
    const prev = new Map([[key(start), null]]);
    const q = [start];
    while (q.length) {
      const p = q.shift();
      if (p[0] === goal[0] && p[1] === goal[1]) break;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const n = [p[0] + dx, p[1] + dy];
        if (MAP[n[1]][n[0]] !== "W" && !prev.has(key(n))) { prev.set(key(n), p); q.push(n); }
      }
    }
    const path = [];
    for (let p = goal; p; p = prev.get(key(p))) path.unshift(p);
    return path;
  }
  const path = bfs();
  let mazeTimer = null, step = 0;
  const runMaze = () => {
    if (step >= path.length) {
      mazeCells.forEach((c) => c.classList.remove("trail"));
      step = 0;
      place(start);
      mazeTimer = setTimeout(runMaze, 900);
      return;
    }
    const [x, y] = path[step++];
    if (MAP[y][x] === ".") mazeCells[y * MAZE_W + x].classList.add("trail");
    place([x, y]);
    mazeTimer = setTimeout(runMaze, 150);
  };

  const coverObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.target === bits) {
        clearInterval(bitTimer);
        if (e.isIntersecting && !reduce) bitTimer = setInterval(mutate, 260);
      }
      if (e.target === maze) {
        clearTimeout(mazeTimer);
        if (e.isIntersecting && !reduce) runMaze();
      }
    });
  }, { threshold: 0.2 });
  coverObs.observe(bits);
  coverObs.observe(maze);

  /* ---------- Reveal on scroll ---------- */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  $$(".reveal, .ptable, [data-split]").forEach((el) => {
    if (el.closest(".hero")) return;
    revealObs.observe(el);
  });
  requestAnimationFrame(() => $$(".hero [data-split]").forEach((el) => el.classList.add("in")));

  /* ---------- Experience: sticky year + current card ---------- */
  const yearBox = $("#exp-year");
  let shownYear = $("span", yearBox).textContent;
  function setYear(y) {
    if (y === shownYear) return;
    shownYear = y;
    const old = $("span", yearBox);
    const fresh = document.createElement("span");
    fresh.textContent = y;
    if (reduce) { yearBox.replaceChildren(fresh); return; }
    old.classList.add("out");
    setTimeout(() => { fresh.classList.add("in"); yearBox.replaceChildren(fresh); }, 200);
  }
  const expItems = $$(".exp-list li");
  const expObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      expItems.forEach((li) => li.classList.toggle("current", li === e.target));
      setYear(e.target.dataset.year);
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  expItems.forEach((li) => expObs.observe(li));

  /* ---------- Copy email ---------- */
  const copyBtn = $("#copy-mail");
  const copyStatus = $("#copy-status");
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(copyBtn.dataset.mail);
      copyStatus.textContent = "Email copied to your clipboard.";
      copyBtn.querySelector("i").className = "ph ph-check";
    } catch (e) {
      copyStatus.textContent = "Couldn't copy automatically. The address is " + copyBtn.dataset.mail + ".";
    }
    setTimeout(() => { copyStatus.textContent = ""; copyBtn.querySelector("i").className = "ph ph-copy"; }, 3200);
  });

  /* ---------- Magnetic primary buttons ---------- */
  if (finePointer && !reduce) {
    $$(".magnetic").forEach((b) => {
      b.addEventListener("pointermove", (e) => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1)}px, ${((e.clientY - r.top - r.height / 2) * 0.28).toFixed(1)}px)`;
      });
      b.addEventListener("pointerleave", () => { b.style.transform = ""; });
    });
  }

  /* ---------- Smooth in-page links ----------
     CSS scroll-behavior: smooth is off once JS runs (html.js): it made ScrollTrigger measure mid-scroll whenever
     the page loaded already scrolled (a #link or a reload). */
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.classList.contains("skip") || e.defaultPrevented) return;
    const target = a.getAttribute("href") === "#top" ? document.body : document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    history.pushState(null, "", a.getAttribute("href"));
  });

  /* ---------- GSAP: scroll-linked motion ---------- */
  if (window.gsap && window.ScrollTrigger && !reduce) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(".hero-ghost", { yPercent: 28, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

    const mm = gsap.matchMedia();
    mm.add("(min-width: 961px)", () => {
      gsap.to("#exp-progress", { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".exp-list", start: "top 60%", end: "bottom 60%", scrub: true } });
    });
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }
})();
