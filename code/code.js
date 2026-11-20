(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const docs = $$(".doc");
  const ids = docs.map((d) => d.id);
  const byId = (id) => docs.find((d) => d.id === id);
  const tabsEl = $("#tabs"), editor = $("#editor"), wb = $(".workbench");
  const narrow = matchMedia("(max-width: 860px)");
  let open = [];
  let current = null;

  /* ---------- files and tabs ---------- */
  function renderTabs() {
    tabsEl.innerHTML = open.map((id) => {
      const d = byId(id);
      return `<div class="tab" role="tab" tabindex="${id === current ? 0 : -1}" aria-selected="${id === current}" data-f="${id}"><span>${d.dataset.name}</span><span class="x" role="button" aria-label="Close ${d.dataset.name}" data-close="${id}"><i class="ph ph-x" aria-hidden="true"></i></span></div>`;
    }).join("");
  }
  function show(id, { push = true, focus = false } = {}) {
    if (!byId(id)) id = "readme";
    current = id;
    if (!open.includes(id)) open.push(id);
    docs.forEach((d) => d.classList.toggle("on", d.id === id));
    $$(".files a").forEach((a) => a.dataset.f === id ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));
    const d = byId(id);
    $("#crumbs").textContent = `${d.dataset.path} › ${d.dataset.name}`;
    $("#st-file").textContent = d.dataset.name.endsWith(".json") ? "JSON" : "Markdown";
    document.title = (id === "readme" ? "Sama Eldesouki" : d.querySelector("h1") ? d.querySelector("h1").textContent : d.dataset.name) + " · Software & AI";
    renderTabs();
    editor.scrollTop = 0;
    if (push && location.hash.slice(1) !== id) history.replaceState(null, "", "#" + id);
    if (narrow.matches) wb.classList.add("no-tree");
    syncTreeBtn();
    if (focus) editor.focus({ preventScroll: true });
  }
  function close(id) {
    open = open.filter((x) => x !== id);
    if (!open.length) open = ["readme"];
    if (id === current) show(open[open.length - 1]); else renderTabs();
  }
  tabsEl.addEventListener("click", (e) => {
    const x = e.target.closest("[data-close]");
    if (x) { e.stopPropagation(); close(x.dataset.close); return; }
    const t = e.target.closest(".tab"); if (t) show(t.dataset.f);
  });
  tabsEl.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const i = open.indexOf(current) + (e.key === "ArrowRight" ? 1 : -1);
    if (open[i]) { show(open[i]); $(".tab[aria-selected=true]").focus(); }
  });
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-f]"); if (!a) return;
    e.preventDefault(); show(a.dataset.f, { focus: true });
  });
  addEventListener("hashchange", () => show(location.hash.slice(1), { push: false }));

  /* ---------- explorer toggle ---------- */
  function syncTreeBtn() {
    const visible = !wb.classList.contains("no-tree");
    $("#toggle-tree").setAttribute("aria-expanded", String(visible));
    $("#mobile-files").setAttribute("aria-expanded", String(visible));
  }
  const toggleTree = () => { wb.classList.toggle("no-tree"); syncTreeBtn(); };
  $("#toggle-tree").addEventListener("click", toggleTree);
  $("#mobile-files").addEventListener("click", toggleTree);
  if (narrow.matches) wb.classList.add("no-tree");

  /* ---------- LexiLift reading levels (illustrative) ---------- */
  const LV = [
    "The committee postponed its decision owing to insufficient evidence regarding the proposal's long-term viability.",
    "The committee delayed its decision because there was not enough evidence that the plan would work in the long term.",
    "The committee decided to wait. They did not have enough proof that the plan would work for a long time.",
    "The group did not decide yet. They need more proof that the plan will work."
  ];
  $$(".lvl-btns button").forEach((b) => b.addEventListener("click", () => {
    $$(".lvl-btns button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    $("#lvl-text").textContent = LV[+b.dataset.l];
  }));

  /* ---------- command palette ---------- */
  const pal = $("#palette"), palIn = $("#pal-input"), palList = $("#pal-list");
  let palSel = 0, palItems = [];
  function palRender() {
    const q = palIn.value.trim().toLowerCase();
    palItems = docs.filter((d) => !q || (d.dataset.name + " " + (d.querySelector("h1") ? d.querySelector("h1").textContent : "")).toLowerCase().includes(q));
    palSel = Math.min(palSel, Math.max(0, palItems.length - 1));
    palList.innerHTML = palItems.length ? palItems.map((d, i) => `<li role="option" id="po-${d.id}" aria-selected="${i === palSel}" data-f="${d.id}"><span>${d.dataset.name}</span><small>${d.dataset.path}</small></li>`).join("") : `<li aria-disabled="true">No file matches "${q.replace(/[<>&]/g, "")}"</li>`;
    if (palItems[palSel]) palIn.setAttribute("aria-activedescendant", "po-" + palItems[palSel].id);
  }
  let lastFocus = null;
  function palOpen() { lastFocus = document.activeElement; pal.hidden = false; palIn.value = ""; palSel = 0; palRender(); palIn.focus(); }
  function palClose() { pal.hidden = true; if (lastFocus) lastFocus.focus(); }
  $("#open-palette").addEventListener("click", palOpen);
  $("#act-search").addEventListener("click", palOpen);
  palIn.addEventListener("input", () => { palSel = 0; palRender(); });
  palIn.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); palSel = Math.min(palSel + 1, palItems.length - 1); palRender(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); palSel = Math.max(palSel - 1, 0); palRender(); }
    else if (e.key === "Enter") { e.preventDefault(); if (palItems[palSel]) { pal.hidden = true; show(palItems[palSel].id, { focus: true }); } }
    else if (e.key === "Escape") palClose();
    else if (e.key === "Tab") e.preventDefault();
  });
  palList.addEventListener("click", (e) => { const li = e.target.closest("li[data-f]"); if (li) { pal.hidden = true; show(li.dataset.f, { focus: true }); } });
  pal.addEventListener("click", (e) => { if (e.target === pal) palClose(); });
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === "k" || e.key.toLowerCase() === "p")) { e.preventDefault(); pal.hidden ? palOpen() : palClose(); }
  });

  /* ---------- terminal ---------- */
  const out = $("#term-out"), input = $("#term-input");
  const hist = []; let hi = 0;
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function print(html, cls = "") { const p = document.createElement("p"); if (cls) p.className = cls; p.innerHTML = html; out.appendChild(p); out.scrollTop = out.scrollHeight; }
  const names = () => ids.map((id) => byId(id).dataset.name);
  const resolve = (arg) => {
    const a = arg.toLowerCase().replace(/\.(md|json)$/, "").replace(/^projects\/|^frontend\//, "");
    return ids.find((id) => id === a) || ids.find((id) => id.startsWith(a)) || ids.find((id) => byId(id).dataset.name.toLowerCase().startsWith(a));
  };
  const CMDS = {
    help: () => print(`<span class="acc">ls</span>            list files\n<span class="acc">open</span> &lt;file&gt;   open a project, e.g. open lunar\n<span class="acc">whoami</span>        who I am\n<span class="acc">stack</span>         what I build with\n<span class="acc">hire</span>          get in touch\n<span class="acc">github</span>        my GitHub\n<span class="acc">clear</span>         clear the terminal`),
    ls: () => print(`README.md  stack.json  experience.md  awards.md\n<span class="acc">projects/</span>  lexilift.md  lunar-navigator.md  relai.md  campus-connect.md\n           evolutionary.md  teaching-code.md  <span class="err">classified.md</span>\n<span class="acc">frontend/</span>  ember-and-spit.md  crumbwell.md  brrr.md`),
    open: (arg) => {
      if (!arg) return print("usage: open &lt;file&gt;   (try <span class=\"acc\">open lexilift</span>)", "err");
      const id = resolve(arg);
      if (!id) return print(`open: no such file: ${esc(arg)}`, "err");
      if (id === "classified") print("access denied: under NDA. Ask me about it instead: <span class=\"acc\">hire</span>", "err");
      else print(`opening ${byId(id).dataset.name}…`, "ok");
      show(id);
    },
    whoami: () => print("Sama Eldesouki. Full stack &amp; AI developer, First Class BSc Computer Science (Birmingham, 2026).\nI build accessible tools, from fine-tuned models to the interface."),
    stack: () => show("stack"),
    hire: () => { print(`Email <a href="mailto:s.ayrzpersonal@gmail.com?subject=Software%20role">s.ayrzpersonal@gmail.com</a> · <a href="https://www.linkedin.com/in/samaeldesouki" target="_blank" rel="noopener">LinkedIn</a>\nOpen to graduate roles in software and AI.`, "ok"); },
    github: () => { print('Opening <a href="https://github.com/Sayrz1" target="_blank" rel="noopener">github.com/Sayrz1</a>', "ok"); window.open("https://github.com/Sayrz1", "_blank", "noopener"); },
    clear: () => { out.innerHTML = ""; },
    sudo: () => print("Nice try. You can't sudo a hire, but you can email me: <span class=\"acc\">hire</span>", "err"),
    exit: () => print("There's no leaving. Try <span class=\"acc\">hire</span> instead."),
  };
  CMDS.cat = CMDS.open; CMDS.contact = CMDS.hire; CMDS.email = CMDS.hire; CMDS.dir = CMDS.ls; CMDS.cls = CMDS.clear;
  $("#term-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const line = input.value.trim(); input.value = "";
    print(`<span class="pu">sama@portfolio</span>:<span class="pd">~</span>$ <span class="cmd">${esc(line)}</span>`);
    if (!line) return;
    hist.push(line); hi = hist.length;
    const [cmd, ...rest] = line.split(/\s+/);
    const fn = CMDS[cmd.toLowerCase()];
    if (fn) fn(rest.join(" ")); else if (resolve(cmd)) CMDS.open(cmd);
    else print(`command not found: ${esc(cmd)}. Type <span class="acc">help</span>.`, "err");
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && hist.length) { e.preventDefault(); hi = Math.max(0, hi - 1); input.value = hist[hi]; }
    else if (e.key === "ArrowDown" && hist.length) { e.preventDefault(); hi = Math.min(hist.length, hi + 1); input.value = hist[hi] || ""; }
    else if (e.key === "Tab") {
      const m = input.value.match(/^(open|cat)\s+(\S*)$/i);
      if (!m) return;
      const hits = names().filter((n) => n.toLowerCase().startsWith(m[2].toLowerCase()));
      if (hits.length) { e.preventDefault(); if (hits.length === 1) input.value = m[1] + " " + hits[0]; else print(hits.join("  ")); }
    }
  });
  $("#act-term").addEventListener("click", () => input.focus());

  print('Welcome. Type <span class="acc">help</span>, or click a file on the left.');
  show(location.hash.slice(1) || "readme", { push: false });
})();
