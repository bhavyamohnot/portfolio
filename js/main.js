/* Bhavya Mohnot · portfolio interactions. No frameworks, no build step. */
(() => {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const C = window.CONFIG, P = window.PROJECTS, E = window.EXPERIENCE, S = window.SKILLS, G = window.GEARS, D = window.DATA;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const num = (n) => Number(n).toLocaleString("en-US");
  const byId = (id) => P.find((p) => p.id === id);
  const raf2 = (fn) => requestAnimationFrame(() => requestAnimationFrame(fn));

  /* ── toast ─────────────────────────────────────────────── */
  let toastT;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove("show"), 2200);
  }

  /* ── theme: blueprint ⇄ render ─────────────────────────── */
  function setTheme(t) {
    if (t === root.dataset.theme) return;
    const apply = () => {
      root.dataset.theme = t;
      try { localStorage.setItem("bm-theme", t); } catch (e) { /* private mode */ }
      $('meta[name="theme-color"]').content = t === "product" ? "#f3f4ef" : "#0a2140";
    };
    if (!reduce && document.startViewTransition) {
      const sl = $("#scanline");
      sl.classList.remove("go"); void sl.offsetWidth; sl.classList.add("go");
      document.startViewTransition(apply);
    } else apply();
    toast(t === "product" ? "Rendered ✓  Switch back any time" : "Back to the blueprint");
  }
  const toggleTheme = () => setTheme(root.dataset.theme === "product" ? "blueprint" : "product");
  $("#modeBtn").addEventListener("click", toggleTheme);

  /* ── scroll ruler + active nav ─────────────────────────── */
  const rulerFill = $("#rulerFill");
  const navLinks = $$("[data-nav]");
  const navIO = new IntersectionObserver((es) => {
    es.forEach((e) => {
      if (e.isIntersecting) navLinks.forEach((a) => a.classList.toggle("on", a.dataset.nav === e.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  ["work", "experience", "toolkit", "about", "contact"].forEach((id) => navIO.observe(document.getElementById(id)));

  /* ── reveal on scroll ──────────────────────────────────── */
  const revealIO = new IntersectionObserver((es) => {
    es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); revealIO.unobserve(e.target); } });
  }, { threshold: 0.12 });
  const observeReveal = () => $$("[data-reveal]:not(.in)").forEach((el) => revealIO.observe(el));

  /* ── gears (shared geometry) ───────────────────────────── */
  // Tooth profile: rise 0→.2, tip .2→.5, fall .5→.7, root .7→1 (fractions of one tooth pitch).
  function gearD(cx, cy, r, R, n, phase) {
    const s = (Math.PI * 2) / n, pt = (rad, a) => `${(cx + rad * Math.cos(a)).toFixed(2)} ${(cy + rad * Math.sin(a)).toFixed(2)}`;
    let d = `M ${pt(r, phase)}`;
    for (let i = 0; i < n; i++) {
      const a = phase + i * s;
      d += ` L ${pt(R, a + 0.2 * s)} A ${R} ${R} 0 0 1 ${pt(R, a + 0.5 * s)} L ${pt(r, a + 0.7 * s)} A ${r} ${r} 0 0 1 ${pt(r, a + s)}`;
    }
    return d + " Z";
  }
  // Place a chain of meshing gears: each one after the first sits at `angle` from the previous,
  // at the sum of pitch radii, with its phase set so a gap faces the driver's tooth.
  function meshChain(specs) {
    const out = [];
    specs.forEach((g, i) => {
      const s = (Math.PI * 2) / g.n, pitch = (g.r + g.R) / 2;
      const o = { ...g, s, pitch };
      if (i === 0) { o.phase = g.phase || 0; o.ratio = 1; }
      else {
        const p = out[i - 1], ang = g.angle;
        o.cx = p.cx + (p.pitch + pitch) * Math.cos(ang);
        o.cy = p.cy + (p.pitch + pitch) * Math.sin(ang);
        let u = ang - (p.phase + 0.35 * p.s);
        u = ((u % p.s) + p.s) % p.s; if (u > p.s / 2) u -= p.s;
        o.phase = ang + Math.PI + u * (s / p.s) - 0.85 * s;
        o.ratio = -p.ratio * (p.n / g.n);
      }
      o.d = gearD(o.cx, o.cy, o.r, o.R, o.n, o.phase);
      out.push(o);
    });
    return out;
  }

  /* ── hero drawing ──────────────────────────────────────── */
  const heroGears = meshChain([
    { cx: 130, cy: 290, r: 62, R: 76, n: 14 },
    { r: 29.5, R: 39.5, n: 7, angle: Math.atan2(-122, 66) },
  ]);
  $("#gearBigPath").setAttribute("d", heroGears[0].d);
  $("#gearSmallPath").setAttribute("d", heroGears[1].d);
  $("#gearSmallHub").setAttribute("cx", heroGears[1].cx.toFixed(1));
  $("#gearSmallHub").setAttribute("cy", heroGears[1].cy.toFixed(1));
  $$("#heroSvg .draw").forEach((el, i) => { el.style.animationDelay = reduce ? "0s" : `${0.1 + i * 0.035}s`; });

  const gBig = $("#gearBig"), gSmall = $("#gearSmall");
  let heroAngle = 0, heroVel = reduce ? 0 : 0.25, heroVisible = true, dragging = null, lastScroll = scrollY;
  const drawHeroGears = () => {
    gBig.setAttribute("transform", `rotate(${heroAngle.toFixed(2)} ${heroGears[0].cx} ${heroGears[0].cy})`);
    gSmall.setAttribute("transform", `rotate(${(heroAngle * heroGears[1].ratio).toFixed(2)} ${heroGears[1].cx.toFixed(2)} ${heroGears[1].cy.toFixed(2)})`);
  };
  function heroLoop() {
    if (!heroVisible) return;
    if (!dragging) {
      heroAngle += heroVel;
      const idle = reduce ? 0 : 0.25;
      heroVel = idle + (heroVel - idle) * 0.96;
    }
    drawHeroGears();
    requestAnimationFrame(heroLoop);
  }
  new IntersectionObserver(([e]) => {
    const was = heroVisible; heroVisible = e.isIntersecting;
    if (heroVisible && !was) requestAnimationFrame(heroLoop);
  }).observe($("#hero"));
  requestAnimationFrame(heroLoop);

  const svgPoint = (svg, x, y) => { const p = svg.createSVGPoint(); p.x = x; p.y = y; return p.matrixTransform(svg.getScreenCTM().inverse()); };
  const angleAt = (ev) => { const p = svgPoint($("#heroSvg"), ev.clientX, ev.clientY); return (Math.atan2(p.y - heroGears[0].cy, p.x - heroGears[0].cx) * 180) / Math.PI; };
  gBig.addEventListener("pointerdown", (ev) => { dragging = { a: angleAt(ev), t: performance.now() }; gBig.setPointerCapture(ev.pointerId); ev.preventDefault(); });
  gBig.addEventListener("pointermove", (ev) => {
    if (!dragging) return;
    const a = angleAt(ev); let d = a - dragging.a; if (d > 180) d -= 360; if (d < -180) d += 360;
    heroAngle += d; heroVel = d; dragging.a = a; drawHeroGears();
  });
  const endDrag = () => { if (dragging) { dragging = null; heroVel = Math.max(-25, Math.min(25, heroVel)); } };
  gBig.addEventListener("pointerup", endDrag);
  gBig.addEventListener("pointercancel", endDrag);
  gBig.addEventListener("keydown", (ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); heroVel = 18; } });

  addEventListener("scroll", () => {
    const h = root.scrollHeight - innerHeight;
    rulerFill.style.width = `${h > 0 ? (scrollY / h) * 100 : 0}%`;
    if (!reduce) heroVel += (scrollY - lastScroll) * 0.03;
    lastScroll = scrollY;
  }, { passive: true });

  // blueprint guide lines that follow the cursor in the hero
  const hero = $("#hero"), gx = $("#gx"), gy = $("#gy"), gxy = $("#gxy");
  hero.addEventListener("pointermove", (ev) => {
    if (ev.pointerType !== "mouse") return;
    const r = hero.getBoundingClientRect(), x = ev.clientX - r.left, y = ev.clientY - r.top;
    gx.style.top = `${y}px`; gy.style.left = `${x}px`;
    gxy.style.left = `${Math.min(x + 12, r.width - 120)}px`; gxy.style.top = `${y + 12}px`;
    gxy.textContent = `x ${String(Math.round(x)).padStart(3, "0")} · y ${String(Math.round(y)).padStart(3, "0")}`;
  });

  /* ── counters ──────────────────────────────────────────── */
  const statIO = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    statIO.disconnect();
    $$("[data-count]").forEach((el) => {
      const to = +el.dataset.count, suf = el.dataset.suffix || "", t0 = performance.now(), dur = reduce ? 1 : 1300;
      const step = (t) => {
        const k = Math.min(1, (t - t0) / dur), v = Math.round(to * (1 - Math.pow(1 - k, 3)));
        el.textContent = num(v) + suf;
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.4 });
  statIO.observe($("#stats"));

  /* ── tooltip ───────────────────────────────────────────── */
  const tip = $("#tip");
  function tipAt(html, x, y) {
    tip.innerHTML = html; tip.hidden = false;
    const w = tip.offsetWidth, h = tip.offsetHeight;
    let left = x + 14, top = y + 14;
    if (left + w > innerWidth - 8) left = x - w - 14;
    if (top + h > innerHeight - 8) top = y - h - 14;
    tip.style.left = `${Math.max(8, left)}px`; tip.style.top = `${Math.max(8, top)}px`;
  }
  const tipHide = () => { tip.hidden = true; };
  function bindTip(el, html) {
    el.addEventListener("pointermove", (ev) => tipAt(html(), ev.clientX, ev.clientY));
    el.addEventListener("pointerleave", tipHide);
    el.addEventListener("focus", () => { const r = el.getBoundingClientRect(); tipAt(html(), r.left + r.width / 2, r.bottom - 6); });
    el.addEventListener("blur", tipHide);
  }

  /* ── projects: filters + cards ─────────────────────────── */
  const cats = ["All", ...new Set(P.flatMap((p) => p.cats))];
  const filters = $("#filters");
  filters.innerHTML = cats.map((c) => {
    const n = c === "All" ? P.length : P.filter((p) => p.cats.includes(c)).length;
    return `<button class="chip" aria-pressed="${c === "All"}" data-cat="${esc(c)}">${esc(c)}<span class="n">${n}</span></button>`;
  }).join("");
  filters.addEventListener("click", (ev) => {
    const b = ev.target.closest("[data-cat]"); if (!b) return;
    $$(".chip", filters).forEach((c) => c.setAttribute("aria-pressed", c === b));
    const cat = b.dataset.cat;
    $$(".spec").forEach((card) => {
      const show = cat === "All" || byId(card.dataset.id).cats.includes(cat);
      card.classList.toggle("hide", !show);
    });
  });

  function previewFeedback() {
    const t = D.fa.Notion.topics.slice(0, 3), max = t[0].pct;
    return `<div class="spec-preview" aria-hidden="true"><span class="pv-k">LIVE DATA · NOTION COMPLAINTS, % OF REVIEWS</span>
      <div class="hbars">${t.map((x) => `<div class="hbar" style="cursor:default"><span class="hb-l">${esc(x.name)}</span><span class="hb-track"><span class="hb-fill" style="width:${(x.pct / max) * 100}%"></span></span><span class="hb-v">${x.pct}%</span></div>`).join("")}</div></div>`;
  }
  $("#specs").innerHTML = P.map((p, i) => `
    <article class="spec${i === 0 ? " big" : ""}" data-id="${p.id}" data-reveal>
      <div style="display:flex;flex-direction:column;gap:10px">
        <div class="spec-top"><span class="spec-code">${p.code}</span><span>${esc(p.cats.join(" · ").toUpperCase())}</span></div>
        <h3>${esc(p.title)}</h3>
        <p class="sub">${esc(p.subtitle)}</p>
        <p class="hook">${esc(p.hook)}</p>
        <div class="spec-metric"><span class="v">${esc(p.metric.value)}</span><span class="l">${esc(p.metric.label)}</span></div>
        <div class="spec-foot"><ul class="tags">${p.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
          <button class="open" style="background:none;border:0;padding:0" data-open="${p.id}">Open spec <span class="arr">→</span></button></div>
      </div>
      ${i === 0 ? previewFeedback() : ""}
    </article>`).join("");
  $("#specs").addEventListener("click", (ev) => {
    if (ev.target.closest("a")) return;
    const card = ev.target.closest(".spec"); if (card) openSpec(card.dataset.id);
  });

  /* ── spec modal ────────────────────────────────────────── */
  const modal = $("#specModal"), mBody = $("#modalBody");
  function openSpec(id) {
    const p = byId(id); if (!p) return;
    mBody.innerHTML = `
      <div class="m-head">
        <div><p class="m-code">${p.code} · ${esc(p.cats.join(" · ").toUpperCase())}</p>
          <h2 class="m-title" id="mTitle">${esc(p.title)}</h2><p class="m-sub">${esc(p.subtitle)}</p></div>
        <button class="x" data-close aria-label="Close">✕</button>
      </div>
      <p class="m-problem">${p.problem}</p>
      <p class="m-label">Live demo · real project data</p>
      <div class="demo" id="demo"></div>
      <div class="m-cols">
        <div><p class="m-label">What I did</p><ol class="m-list">${p.did.map((x) => `<li>${x}</li>`).join("")}</ol></div>
        <div><p class="m-label">What I found</p><ol class="m-list">${p.result.map((x) => `<li>${x}</li>`).join("")}</ol></div>
      </div>
      <div class="m-links">${p.links.map((l, i) => `<a class="btn${i === 0 ? " btn-primary" : ""}" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join("")}</div>`;
    DEMOS[p.demo]($("#demo"));
    if (!modal.open) modal.showModal();
    modal.scrollTop = 0;
    history.replaceState(null, "", `#spec-${id}`);
  }
  modal.addEventListener("click", (ev) => { if (ev.target === modal || ev.target.closest("[data-close]")) modal.close(); });
  modal.addEventListener("close", () => { tipHide(); if (location.hash.startsWith("#spec-")) history.replaceState(null, "", "#work"); });

  /* ── demos ─────────────────────────────────────────────── */
  const DEMOS = {
    feedback(el) {
      let app = "Notion", sel = null;
      const render = () => {
        const A = D.fa[app], topics = A.topics.slice(0, 8), max = Math.max(...topics.map((t) => t.pct));
        sel = sel && topics.find((t) => t.id === sel) ? sel : topics[0].id;
        const t = topics.find((x) => x.id === sel);
        el.innerHTML = `
          <div class="demo-h"><div><p class="demo-t">What ${app} users complain about</p>
            <p class="demo-s">% of ${num(A.reviews)} reviews with a complaint on each topic · tap a bar for the evidence</p></div>
            <div class="seg" role="group" aria-label="App">${["Notion", "Evernote"].map((a) => `<button aria-pressed="${a === app}" data-app="${a}">${a}</button>`).join("")}</div></div>
          <div class="fa-grid">
            <div class="hbars">${topics.map((x) => `<button class="hbar" aria-pressed="${x.id === sel}" data-t="${x.id}">
              <span class="hb-l">${esc(x.name)}</span><span class="hb-track"><span class="hb-fill" data-w="${(x.pct / max) * 100}"></span></span><span class="hb-v">${x.pct}%</span></button>`).join("")}</div>
            <div class="fa-detail">
              <p class="demo-t">${esc(t.name)}</p>
              <div class="fa-stats">
                <div class="mini"><span class="k">Complaints</span><span class="v">${num(t.complaints)}</span></div>
                <div class="mini"><span class="k">High severity</span><span class="v">${t.high == null ? "–" : t.high + "%"}</span></div>
                <div class="mini"><span class="k">Avg stars</span><span class="v">${t.stars == null ? "–" : t.stars.toFixed(2)}</span></div>
              </div>
              ${t.quotes.map((q) => `<blockquote class="quote">“${esc(q.q)}”<small>${num(q.likes)} people found this helpful</small></blockquote>`).join("")}
              ${app === "Evernote" && A.switching ? `<p class="switch-row"><b>Where leavers say they're going:</b> ${A.switching.map((s) => `${esc(s.to)} ${s.n}`).join(" · ")}</p>` : ""}
            </div>
          </div>`;
        raf2(() => $$(".hb-fill", el).forEach((f) => { f.style.width = `${f.dataset.w}%`; }));
      };
      el.addEventListener("click", (ev) => {
        const a = ev.target.closest("[data-app]"), b = ev.target.closest("[data-t]");
        if (a) { app = a.dataset.app; sel = null; render(); }
        else if (b) { sel = b.dataset.t; render(); el.querySelector(`[data-t="${sel}"]`).focus(); }
      });
      render();
    },

    tradelens(el) {
      const checks = [
        ["91 unit tests", "pass"], ["22 fixed cases", "pass"], ["Planted habits found (388-fill month)", "3 / 3"],
        ["Recall@3 on unseen traders", "95%"], ["False alarms", "3%"],
      ];
      el.innerHTML = `
        <div class="demo-h"><div><p class="demo-t">The ship bar, set before writing code</p><p class="demo-s">Press run to replay the checks TradeLens had to pass</p></div>
          <button class="btn btn-primary" id="tlRun">Run checks ▸</button></div>
        <div class="tl-grid">
          <ul class="checks">${checks.map(([k, v]) => `<li><span class="ic" aria-hidden="true">✓</span><span>${k}</span><span class="res">${v}</span></li>`).join("")}</ul>
          <div class="habit">
            <span class="rank">HABIT #1 OF 3 · TEST MONTH</span>
            <p class="demo-t" style="margin:6px 0 0">Expiry-day options</p>
            <div class="cost">₹30,131</div>
            <p class="demo-s" style="margin:0">the costliest habit TradeLens found in the test month</p>
            <div class="acts"><span>See the trades</span><span>Try this instead</span><span>This is wrong</span></div>
            <p class="demo-s" style="margin-top:10px">Illustration of a habit card. Every card has a "this is wrong" button: that's the trust metric.</p>
          </div>
        </div>`;
      const run = () => {
        const items = $$(".checks li", el); items.forEach((li) => li.classList.remove("done"));
        items.forEach((li, i) => setTimeout(() => li.classList.add("done"), reduce ? 0 : 350 + i * 420));
        $("#tlRun", el).textContent = "Run again ↻";
      };
      $("#tlRun", el).addEventListener("click", run);
      setTimeout(run, 400);
    },

    olist(el) {
      const pts = D.olist, W = 560, H = 250, m = { l: 34, r: 18, t: 18, b: 40 };
      const iw = W - m.l - m.r, ih = H - m.t - m.b, xs = (i) => m.l + (iw / (pts.length - 1)) * i, ys = (v) => m.t + ih * (1 - (v - 1) / 4);
      const line = pts.map((p, i) => `${i ? "L" : "M"}${xs(i).toFixed(1)} ${ys(p.stars).toFixed(1)}`).join(" ");
      const area = `${line} L${xs(pts.length - 1)} ${ys(1)} L${xs(0)} ${ys(1)} Z`;
      el.innerHTML = `
        <div class="demo-h"><div><p class="demo-t">Average review stars vs days delivered late</p>
          <p class="demo-s">${num(pts.reduce((a, p) => a + p.orders, 0))} delivered orders with a review · drag the slider or hover the line</p></div></div>
        <div class="ol-wrap">
          <svg class="chart-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Average rating falls from 4.29 stars on time to 1.70 stars at 8 or more days late">
            ${[1, 2, 3, 4, 5].map((v) => `<line class="grid" x1="${m.l}" x2="${W - m.r}" y1="${ys(v)}" y2="${ys(v)}"/><text x="${m.l - 8}" y="${ys(v) + 4}" text-anchor="end">${v}★</text>`).join("")}
            <line class="axis" x1="${m.l}" x2="${W - m.r}" y1="${ys(1)}" y2="${ys(1)}"/>
            ${pts.map((p, i) => `<text x="${xs(i)}" y="${H - m.b + 18}" text-anchor="middle">${p.late === "On time" ? "on time" : p.late}</text>`).join("")}
            <text x="${W - m.r}" y="${H - 4}" text-anchor="end">days late →</text>
            <path d="${area}" style="fill:var(--s1);opacity:.1"/>
            <path d="${line}" style="fill:none;stroke:var(--s1);stroke-width:2;stroke-linejoin:round;stroke-linecap:round"/>
            <line id="olGuide" class="axis" y1="${m.t}" y2="${ys(1)}" style="stroke-dasharray:0"/>
            ${pts.map((p, i) => `<circle class="olpt" data-i="${i}" cx="${xs(i)}" cy="${ys(p.stars)}" r="4.5" style="fill:var(--s1);stroke:var(--surface);stroke-width:2"/>`).join("")}
            <text class="lbl" x="${xs(0) + 8}" y="${ys(pts[0].stars) - 10}">${pts[0].stars.toFixed(2)}</text>
            <text class="lbl" x="${xs(pts.length - 1)}" y="${ys(pts[pts.length - 1].stars) - 12}" text-anchor="middle">${pts[pts.length - 1].stars.toFixed(2)}</text>
            ${pts.map((p, i) => `<rect class="olhit" data-i="${i}" x="${xs(i) - iw / (pts.length - 1) / 2}" y="${m.t}" width="${iw / (pts.length - 1)}" height="${ih}" fill="transparent"/>`).join("")}
          </svg>
          <div class="ol-read">
            <div class="ol-stars" id="olV">4.29</div>
            <div class="stars" aria-hidden="true">★★★★★<span class="stars-fill" id="olFill">★★★★★</span></div>
            <p class="ol-cap" id="olCap"></p>
            <input class="ol-range" id="olRange" type="range" min="0" max="${pts.length - 1}" step="1" value="0" aria-label="Days delivered late">
          </div>
        </div>
        <div class="fa-stats" style="margin-top:16px">
          <div class="mini"><span class="k">Repeat purchase rate</span><span class="v">3.0%</span></div>
          <div class="mini"><span class="k">At-risk high-value customers</span><span class="v">13.9k</span></div>
          <div class="mini"><span class="k">Win-back break-even</span><span class="v">~R$22</span></div>
        </div>`;
      const set = (i) => {
        const p = pts[i];
        $("#olV", el).textContent = `${p.stars.toFixed(2)}★`;
        $("#olFill", el).style.width = `${(p.stars / 5) * 100}%`;
        $("#olCap", el).textContent = `${p.late === "On time" ? "Delivered on time or early" : `Delivered ${p.late} day${p.late === "1" ? "" : "s"} late`} · ${num(p.orders)} orders`;
        $("#olRange", el).value = i;
        $("#olRange", el).setAttribute("aria-valuetext", `${p.late === "On time" ? "on time" : p.late + " days late"}: ${p.stars} stars`);
        const g = $("#olGuide", el); g.setAttribute("x1", xs(i)); g.setAttribute("x2", xs(i));
        $$(".olpt", el).forEach((c) => c.setAttribute("r", +c.dataset.i === i ? 7 : 4.5));
      };
      $("#olRange", el).addEventListener("input", (ev) => set(+ev.target.value));
      $$(".olhit", el).forEach((r) => r.addEventListener("pointerenter", () => set(+r.dataset.i)));
      set(0);
    },

    starbucks(el) {
      let mode = "roi";
      const render = () => {
        const rows = [...D.starbucks].sort((a, b) => (mode === "roi" ? b.roi - a.roi : b.wasted - a.wasted));
        const max = Math.max(...rows.map((r) => (mode === "roi" ? r.roi : r.wasted)));
        el.innerHTML = `
          <div class="demo-h"><div><p class="demo-t">${mode === "roi" ? "Extra spend per $1 of reward, by offer" : "% of completed offers that were never opened"}</p>
            <p class="demo-s">8 reward offers · hover a bar for the funnel</p></div>
            <div class="seg" role="group" aria-label="Measure"><button aria-pressed="${mode === "roi"}" data-m="roi">Return per $1</button><button aria-pressed="${mode === "wasted"}" data-m="wasted">Wasted %</button></div></div>
          <div class="legend" style="margin-bottom:10px"><span><i style="background:var(--s1)"></i>Discount</span><span><i style="background:var(--s2)"></i>BOGO</span></div>
          <div class="hbars">${rows.map((r) => {
            const v = mode === "roi" ? r.roi : r.wasted;
            return `<div class="hbar" tabindex="0" data-l="${esc(r.label)}"><span class="hb-l">${esc(r.label)}</span><span class="hb-track"><span class="hb-fill${r.type === "BOGO" ? " s2" : ""}" data-w="${(v / max) * 100}"></span></span><span class="hb-v">${mode === "roi" ? "$" + v.toFixed(2) : v + "%"}</span></div>`;
          }).join("")}</div>
          <div class="timeline-note" style="margin:16px 0 0"><span class="big">30%</span><span>of all reward money ($49k of $165k) went to people who completed an offer <b>without ever opening it</b>. Informational messages with no reward still added ~$50k in spend.</span></div>`;
        $$(".hbar", el).forEach((b) => {
          const r = rows.find((x) => x.label === b.dataset.l);
          bindTip(b, () => `<b>${esc(r.label)}</b> (${r.type})<br>Viewed by ${r.view}% · wasted ${r.wasted}%<br>Reward cost $${num(r.cost)}<br>Extra spend $${num(r.lift)} → $${r.roi.toFixed(2)} per $1`);
        });
        raf2(() => $$(".hb-fill", el).forEach((f) => { f.style.width = `${f.dataset.w}%`; }));
      };
      el.addEventListener("click", (ev) => { const b = ev.target.closest("[data-m]"); if (b) { mode = b.dataset.m; tipHide(); render(); } });
      render();
    },

    whatsapp(el) {
      el.innerHTML = `
        <div class="demo-h"><div><p class="demo-t">Share of UPI payments</p><p class="demo-s">500M WhatsApp users, and it still barely registers</p></div></div>
        <div class="wa-bars">
          <div class="wa-row"><div class="wa-l"><span>PhonePe</span><b>46.5%</b></div><div class="wa-track"><div class="wa-fill" data-w="46.5" style="background:var(--muted)"></div></div></div>
          <div class="wa-row"><div class="wa-l"><span>WhatsApp Pay</span><b>&lt;1%</b></div><div class="wa-track"><div class="wa-fill" data-w="0.9" style="background:var(--s1);min-width:4px"></div></div></div>
        </div>
        <div class="timeline-note"><span class="big">~17%</span><span>volume growth in the six months after the user cap lifted (Dec 2024). Reach was never the bottleneck: <b>Meta not funding the merchant war</b> was.</span></div>
        <p class="m-label">The strategy: 4 bets, in order</p>
        <div class="bets"><div class="bet">Wedge</div><div class="bet">Habit</div><div class="bet">Discoverability</div><div class="bet">Moat</div></div>
        <p class="demo-s" style="margin-top:12px">PRD target: <b>+10M monthly P2M payers in 24 months</b>, starting with a 500-merchant pilot gated by a randomized holdout.</p>`;
      // scale: 0–50% of the track
      raf2(() => $$(".wa-fill", el).forEach((f) => { f.style.width = `${(f.dataset.w / 50) * 100}%`; }));
    },
  };

  /* ── experience: assembly line ─────────────────────────── */
  const stations = $("#stations"), detail = $("#stationDetail");
  stations.innerHTML = E.map((x) => `
    <button class="station" role="tab" id="st-${x.id}" aria-selected="false" aria-controls="stationDetail" data-st="${x.id}" tabindex="-1">
      <span class="node">${x.dates.match(/\d{4}/)[0]}</span><span class="st-org">${esc(x.short)}</span><span class="st-date">${esc(x.role)}</span>
    </button>`).join("");
  function activateStation(id, focus) {
    const x = E.find((e) => e.id === id); if (!x) return;
    $$(".station", stations).forEach((b) => { const on = b.dataset.st === id; b.setAttribute("aria-selected", on); b.tabIndex = on ? 0 : -1; if (on && focus) b.focus(); });
    detail.setAttribute("aria-labelledby", `st-${id}`);
    detail.innerHTML = `
      <div><p class="role">${esc(x.role)}</p><p class="org">${esc(x.org)}</p><p class="when">${esc(x.dates)}</p>
        <ul class="tags">${x.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></div>
      <div><p class="line1">${esc(x.line)}</p><ul class="b">${x.bullets.map((b) => `<li>${b}</li>`).join("")}</ul></div>`;
    detail.classList.remove("swap"); void detail.offsetWidth; detail.classList.add("swap");
  }
  stations.addEventListener("click", (ev) => { const b = ev.target.closest("[data-st]"); if (b) activateStation(b.dataset.st); });
  stations.addEventListener("keydown", (ev) => {
    const ids = E.map((e) => e.id), cur = ids.indexOf($('[aria-selected="true"]', stations).dataset.st);
    const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[ev.key];
    if (k) { ev.preventDefault(); activateStation(ids[(cur + k + ids.length) % ids.length], true); }
  });
  activateStation(E[E.length - 1].id);

  /* ── BOM ───────────────────────────────────────────────── */
  let part = 0;
  const usedLabel = (id) => { const p = byId(id); if (p) return [p.code, p.title]; const x = E.find((e) => e.id === id); return [x.short, `${x.role}, ${x.org}`]; };
  $("#bom").innerHTML = S.map((g) => `
    <div class="bom-col"><div class="bom-h"><h3>${esc(g.group)}</h3><span>${g.items.length} PARTS</span></div>
      ${g.items.map((it) => `<div class="bom-row"><span class="bom-no">P-${String(++part).padStart(2, "0")}</span>
        <div><div class="bom-name">${esc(it.name)}</div><div class="used">${it.used.map((u) => { const [l, t] = usedLabel(u); return `<button data-used="${u}" title="${esc(t)}">${esc(l)}</button>`; }).join("")}</div></div></div>`).join("")}
    </div>`).join("");
  function goTo(id) {
    if (byId(id)) return openSpec(id);
    document.getElementById("experience").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    activateStation(id);
  }
  $("#bom").addEventListener("click", (ev) => { const b = ev.target.closest("[data-used]"); if (b) goTo(b.dataset.used); });

  /* ── about: meshing gears ──────────────────────────────── */
  const aboutGears = meshChain([
    { key: "discover", cx: 125, cy: 150, r: 74, R: 90, n: 16 },
    { key: "prioritize", r: 53.5, R: 69.5, n: 12, angle: (35 * Math.PI) / 180 },
    { key: "ship", r: 43.25, R: 59.25, n: 10, angle: (-50 * Math.PI) / 180 },
  ]);
  const gearsSvg = $("#gearsSvg");
  gearsSvg.innerHTML = aboutGears.map((g) => `
    <g class="g" data-g="${g.key}" tabindex="0" role="button" aria-label="${G[g.key].title}">
      <g class="rot"><path d="${g.d}"/><circle class="hub" cx="${g.cx.toFixed(1)}" cy="${g.cy.toFixed(1)}" r="${(g.r * 0.18).toFixed(1)}"/></g>
      <text x="${g.cx.toFixed(1)}" y="${(g.cy + g.r * 0.45).toFixed(1)}" text-anchor="middle">${G[g.key].title}</text>
    </g>`).join("");
  const gearPanel = $("#gearPanel");
  function setGear(key) {
    $$(".g", gearsSvg).forEach((g) => g.classList.toggle("on", g.dataset.g === key));
    const i = aboutGears.findIndex((g) => g.key === key);
    gearPanel.innerHTML = `<p class="gp-k">GEAR 0${i + 1} OF 03</p><h3>${G[key].title}</h3><p>${esc(G[key].text)}</p>`;
  }
  gearsSvg.addEventListener("click", (ev) => { const g = ev.target.closest(".g"); if (g) setGear(g.dataset.g); });
  gearsSvg.addEventListener("pointerover", (ev) => { const g = ev.target.closest(".g"); if (g) { setGear(g.dataset.g); gearBoost = 1; } });
  gearsSvg.addEventListener("pointerleave", () => { gearBoost = 0; });
  gearsSvg.addEventListener("keydown", (ev) => { const g = ev.target.closest(".g"); if (g && (ev.key === "Enter" || ev.key === " ")) { ev.preventDefault(); setGear(g.dataset.g); } });
  gearsSvg.addEventListener("focusin", (ev) => { const g = ev.target.closest(".g"); if (g) setGear(g.dataset.g); });
  setGear("discover");
  let gearAngle = 0, gearBoost = 0, gearsOn = false;
  const rots = $$(".rot", gearsSvg);
  function gearLoop() {
    if (!gearsOn) return;
    gearAngle += 0.18 + gearBoost * 0.9;
    aboutGears.forEach((g, i) => rots[i].setAttribute("transform", `rotate(${(gearAngle * g.ratio).toFixed(2)} ${g.cx.toFixed(2)} ${g.cy.toFixed(2)})`));
    requestAnimationFrame(gearLoop);
  }
  if (!reduce) new IntersectionObserver(([e]) => { const was = gearsOn; gearsOn = e.isIntersecting; if (gearsOn && !was) requestAnimationFrame(gearLoop); }).observe(gearsSvg);

  /* ── contact ───────────────────────────────────────────── */
  $("#crNo").textContent = `CR-${String(1000 + Math.floor(Math.random() * 9000))}`;
  async function copyEmail() {
    try { await navigator.clipboard.writeText(C.email); toast("Email copied ✓"); }
    catch (e) { location.href = `mailto:${C.email}`; }
  }
  $("#copyEmail").addEventListener("click", copyEmail);
  const form = $("#crForm"), note = $("#formNote");
  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const f = Object.fromEntries(new FormData(form));
    if (f.botcheck) return;
    if (!f.name.trim() || !/^\S+@\S+\.\S+$/.test(f.email) || !f.message.trim()) { note.textContent = "Please fill in your name, a valid email and a message."; return; }
    const subject = `${f.type} · from ${f.name}`;
    if (!C.web3formsKey) {
      location.href = `mailto:${C.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`${f.message}\n\n${f.name} (${f.email})`)}`;
      note.textContent = "Opening your email app…";
      return;
    }
    note.textContent = "Sending…";
    try {
      const r = await fetch("https://api.web3forms.com/submit", {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ access_key: C.web3formsKey, subject: `Portfolio: ${subject}`, from_name: f.name, name: f.name, email: f.email, type: f.type, message: f.message }),
      });
      const j = await r.json();
      if (!j.success) throw new Error(j.message);
      form.reset(); note.textContent = `${$("#crNo").textContent} received ✓ It's in my inbox. Thank you!`;
    } catch (e) { note.innerHTML = `That didn't send. Please email me directly at <a href="mailto:${C.email}">${C.email}</a>.`; }
  });

  /* ── command menu ──────────────────────────────────────── */
  const cmdk = $("#cmdk"), cIn = $("#cmdkInput"), cList = $("#cmdkList");
  const scrollTo = (id) => () => document.getElementById(id).scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  const COMMANDS = [
    ...["work", "experience", "toolkit", "about", "contact"].map((id) => ({ label: `Go to ${id[0].toUpperCase() + id.slice(1)}`, group: "Navigate", run: scrollTo(id) })),
    ...P.map((p) => ({ label: `${p.code} · ${p.title}`, group: "Open spec", run: () => openSpec(p.id) })),
    ...E.map((x) => ({ label: `${x.role} · ${x.short}`, group: "Experience", run: () => goTo(x.id) })),
    { label: "Open résumé (PDF)", group: "Action", run: () => open(C.resume, "_blank", "noopener") },
    { label: "Copy email address", group: "Action", run: copyEmail },
    { label: "Ask my AI twin", group: "Action", run: () => openChat() },
    { label: "Switch blueprint ⇄ render", group: "Action", run: toggleTheme },
    { label: "LinkedIn", group: "Link", run: () => open(C.linkedin, "_blank", "noopener") },
    { label: "GitHub", group: "Link", run: () => open(C.github, "_blank", "noopener") },
  ];
  let cSel = 0, cShown = COMMANDS;
  function cRender() {
    const q = cIn.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    cShown = COMMANDS.filter((c) => q.every((w) => `${c.label} ${c.group}`.toLowerCase().includes(w)));
    cSel = Math.min(cSel, Math.max(0, cShown.length - 1));
    cList.innerHTML = cShown.length
      ? cShown.map((c, i) => `<li role="option" id="c${i}" aria-selected="${i === cSel}" data-i="${i}"><span>${esc(c.label)}</span><span class="grp">${c.group}</span></li>`).join("")
      : `<li aria-disabled="true"><span>No match. Try "spec" or "email".</span></li>`;
    cIn.setAttribute("aria-activedescendant", cShown.length ? `c${cSel}` : "");
    const s = $(`#c${cSel}`, cList); if (s) s.scrollIntoView({ block: "nearest" });
  }
  function openCmdk() { if (modal.open) modal.close(); cIn.value = ""; cSel = 0; cRender(); cmdk.showModal(); cIn.focus(); }
  function runCmd(i) { const c = cShown[i]; if (!c) return; cmdk.close(); c.run(); }
  $("#cmdkBtn").addEventListener("click", openCmdk);
  cIn.addEventListener("input", () => { cSel = 0; cRender(); });
  cIn.addEventListener("keydown", (ev) => {
    if (ev.key === "ArrowDown") { ev.preventDefault(); cSel = (cSel + 1) % Math.max(1, cShown.length); cRender(); }
    else if (ev.key === "ArrowUp") { ev.preventDefault(); cSel = (cSel - 1 + cShown.length) % Math.max(1, cShown.length); cRender(); }
    else if (ev.key === "Enter") { ev.preventDefault(); runCmd(cSel); }
  });
  cList.addEventListener("click", (ev) => { const li = ev.target.closest("[data-i]"); if (li) runCmd(+li.dataset.i); });
  cmdk.addEventListener("click", (ev) => { if (ev.target === cmdk) cmdk.close(); });
  addEventListener("keydown", (ev) => {
    const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
    if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === "k") { ev.preventDefault(); cmdk.open ? cmdk.close() : openCmdk(); }
    else if (ev.key === "/" && !typing && !cmdk.open) { ev.preventDefault(); openCmdk(); }
    else if (ev.key === "Escape" && !chat.hidden && !modal.open && !cmdk.open) closeChat();
  });
  if (/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) $$(".k")[0].textContent = "⌘";

  /* ── AI twin chat ──────────────────────────────────────── */
  const chat = $("#chat"), msgs = $("#chatMsgs"), fab = $(".chat-fab"), cInput = $("#chatInput");
  const chatHistory = [];
  const SUGG = ["What did you build with LLMs?", "Walk me through TradeLens", "Biggest insight from the Olist data?", "What roles are you looking for?"];
  const fmtBot = (t) => esc(t)
    .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
    .replace(/^\s*[*-]\s+/gm, "• ")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/(?<![="'>])(https?:\/\/[^\s)<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
    .replace(/(?<![:\w.+-])([\w.+-]+@[\w-]+\.[a-z]{2,})(?![^<]*<\/a>)/gi, '<a href="mailto:$1">$1</a>');
  function addMsg(who, text, cls = "") {
    const d = document.createElement("div");
    d.className = `msg ${who} ${cls}`;
    d.innerHTML = who === "bot" ? fmtBot(text) : esc(text);
    msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight;
    return d;
  }
  function openChat() {
    chat.hidden = false; fab.classList.add("hidden");
    if (!msgs.children.length) {
      addMsg("bot", "Hi! I'm Bhavya's AI twin. I answer from my résumé and project write-ups, so ask me about the work, the numbers or the tools.");
      $("#chatSugg").innerHTML = SUGG.map((s) => `<button>${esc(s)}</button>`).join("");
    }
    cInput.focus();
  }
  function closeChat() { chat.hidden = true; fab.classList.remove("hidden"); fab.focus(); }
  $$("[data-open-chat]").forEach((b) => b.addEventListener("click", openChat));
  $("#chatClose").addEventListener("click", closeChat);
  $("#chatSugg").addEventListener("click", (ev) => { const b = ev.target.closest("button"); if (b) send(b.textContent); });
  $("#chatForm").addEventListener("submit", (ev) => { ev.preventDefault(); send(cInput.value); });
  let busy = false;
  async function send(text) {
    text = text.trim().slice(0, 500);
    if (!text || busy) return;
    busy = true; cInput.value = ""; $("#chatSugg").innerHTML = "";
    addMsg("me", text); chatHistory.push({ role: "user", text });
    const typing = addMsg("bot", "Thinking…", "typing");
    const ctl = new AbortController(), to = setTimeout(() => ctl.abort(), 25000);
    try {
      const r = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: chatHistory.slice(-8) }), signal: ctl.signal });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.reply) throw new Error(j.error || r.status);
      typing.remove(); addMsg("bot", j.reply); chatHistory.push({ role: "model", text: j.reply });
    } catch (e) {
      typing.remove(); chatHistory.pop();
      addMsg("bot", `My AI twin can't answer right now. Email me at ${C.email} and I'll reply myself.`);
    } finally { clearTimeout(to); busy = false; }
  }

  /* ── boot ──────────────────────────────────────────────── */
  observeReveal();
  const m = location.hash.match(/^#spec-(\w+)/);
  if (m && byId(m[1])) setTimeout(() => openSpec(m[1]), 300);
})();
