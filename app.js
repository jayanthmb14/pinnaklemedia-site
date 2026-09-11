/* Pinnakle Media — case-study site v3 · motion + rendering
   Renders from window.PM (data.js). Motion: GSAP 3 + ScrollTrigger + MotionPath
   with graceful fallback when GSAP is unavailable. */
(() => {
  const D = window.PM;
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const cleanUrl = () => { if (location.hash) history.replaceState(null, '', location.pathname + location.search); };
  cleanUrl(); scrollTo(0, 0);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const G = window.gsap; const ST = window.ScrollTrigger; const MP = window.MotionPathPlugin;
  if (G && ST) { G.registerPlugin(ST); if (MP) G.registerPlugin(MP); }
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const client = slug => (slug && D.C[slug]) || null;
  const initials = name => name.replace(/·.*$/, '').trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const avatar = (slug, cls = '') => {
    const c = client(slug);
    if (!c) return `<span class="ini ${cls}">PM</span>`;
    if (!c.photo) return `<span class="ini ${cls}">${initials(c.name)}</span>`;
    return `<img class="${cls}" src="${c.photo}" alt="${esc(c.short)}" loading="lazy" data-ini="${initials(c.name)}" onerror="PMimgFail(this)">`;
  };
  window.PMimgFail = img => { const s = document.createElement('span'); s.className = img.className + ' ini'; s.textContent = img.dataset.ini || 'PM'; img.replaceWith(s); };
  const curve = (arr, w, h, x0 = 0, pad = 4) => {
    const mx = Math.max(...arr), mn = Math.min(...arr); const n = arr.length - 1;
    const pts = arr.map((v, i) => [x0 + i / n * w, h - pad - (v - mn) / (mx - mn || 1) * (h - pad * 2)]);
    let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
    for (let i = 1; i < pts.length; i++) { const [a, b] = pts[i - 1], [c, e] = pts[i]; const cx = (a + c) / 2; d += ` C${cx.toFixed(1)},${b.toFixed(1)} ${cx.toFixed(1)},${e.toFixed(1)} ${c.toFixed(1)},${e.toFixed(1)}`; }
    return { d, pts };
  };
  const ytThumb = id => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const PLAY = '<div class="play"><svg viewBox="0 0 24 24" fill="#0f0f0f"><path d="M8 5v14l11-7z"/></svg></div>';
  const srcKey = s => { s = (s || '').toLowerCase(); if (s.includes('slack')) return 'slack'; if (s.includes('mail')) return 'email'; if (s.includes('whatsapp') || s.includes('telegram')) return 'whatsapp'; if (s.includes('call') || s.includes('review') || s.includes('tidycal') || s.includes('notes')) return 'call'; if (s.includes('deck')) return 'deck'; return 'other'; };

  /* ---------------- per-case charts (each case gets its own shape) ---------------- */
  const VIZ = D.viz || {};
  const vizSvg = slug => {
    const v = VIZ[slug]; if (!v) return ''; const W = 120, H = 48; let inner = '';
    if (v.t === 'bars') {
      const n = v.d.length, gap = 3, bw = (W - gap * (n - 1)) / n, mx = Math.max(...v.d);
      inner = v.d.map((x, i) => { const h = Math.max(2, x / mx * (H - 4)); const hi = v.hi ? v.hi.includes(i) : i >= n - 3; return `<rect class="bar ${hi ? 'hi' : ''}" x="${(i * (bw + gap)).toFixed(1)}" y="${(H - h).toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="2"/>`; }).join('');
    } else if (v.t === 'spike' || v.t === 'area') {
      const { d, pts } = curve(v.d, W, H); const mx = Math.max(...v.d);
      const spikes = v.t === 'spike' ? v.d.map((x, i) => x > mx * .5 ? `<circle class="dot hi" cx="${pts[i][0].toFixed(1)}" cy="${pts[i][1].toFixed(1)}" r="3.5"/>` : '').join('') : `<circle class="dot hi" cx="${pts[pts.length - 1][0].toFixed(1)}" cy="${pts[pts.length - 1][1].toFixed(1)}" r="3.5"/>`;
      inner = `<path class="ar" d="${d} L${W},${H} L0,${H} Z"/><path class="ln" d="${d}"/>${spikes}`;
    } else if (v.t === 'step') {
      const n = v.d.length, mx = Math.max(...v.d); const pts = v.d.map((x, i) => [i / (n - 1) * W, H - 4 - x / mx * (H - 12)]);
      let d = `M${pts[0][0]},${pts[0][1].toFixed(1)}`; for (let i = 1; i < n; i++) d += ` H${pts[i][0].toFixed(1)} V${pts[i][1].toFixed(1)}`;
      const m = v.marker; inner = `<path class="ln" d="${d}"/>${m != null ? `<circle class="dot hi" cx="${pts[m][0].toFixed(1)}" cy="${pts[m][1].toFixed(1)}" r="4"/><text class="mk" x="${(pts[m][0] + 7).toFixed(1)}" y="${(pts[m][1] + 3).toFixed(1)}">$</text>` : ''}`;
    } else if (v.t === 'ratio') {
      const n = v.n, k = v.k, gap = 4, pw = (W - gap * (n - 1)) / n;
      inner = Array.from({ length: n }, (_, i) => `<rect class="pill ${i < k ? 'hi' : ''}" x="${(i * (pw + gap)).toFixed(1)}" y="${i < k ? 4 : 14}" width="${pw.toFixed(1)}" height="${i < k ? H - 4 : H - 14}" rx="3"/>`).join('');
    } else if (v.t === 'beforeafter') {
      const all = [...v.a.map(x => [x, 0]), ...v.b.map(x => [x, 1])], n = all.length, gap = 3, bw = (W - gap * (n - 1) - 8) / n, mx = Math.max(...v.b);
      inner = all.map(([x, hi], i) => { const h = Math.max(2, x / mx * (H - 4)); return `<rect class="bar ${hi ? 'hi' : ''}" x="${(i * (bw + gap) + (hi ? 8 : 0)).toFixed(1)}" y="${(H - h).toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="2"/>`; }).join('');
      const sx = (v.a.length * (bw + gap) + 2).toFixed(1); inner += `<line class="stem" x1="${sx}" x2="${sx}" y1="2" y2="${H}" stroke-dasharray="2 3"/>`;
    } else if (v.t === 'dots') {
      const n = v.d.length, mx = Math.max(...v.d), mn = Math.min(...v.d);
      inner = v.d.map((x, i) => { const cx = (i / (n - 1) * (W - 8) + 4).toFixed(1), cy = (H - 4 - (x - mn) / (mx - mn || 1) * (H - 12)).toFixed(1); return `<line class="stem" x1="${cx}" x2="${cx}" y1="${cy}" y2="${H}"/><circle class="sc" cx="${cx}" cy="${cy}" r="${x === mx ? 4.5 : 3.2}"/>`; }).join('');
    } else if (v.t === 'dual') {
      const all = [...v.a, ...v.b], mx = Math.max(...all), mn = Math.min(...all);
      const path = (arr, x0, x1) => { const n = arr.length - 1; const pts = arr.map((x, i) => [x0 + i / n * (x1 - x0), H - 10 - (x - mn) / (mx - mn || 1) * (H - 16)]); let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`; for (let i = 1; i < pts.length; i++) { const [a, b] = pts[i - 1], [c, e] = pts[i]; const cx = (a + c) / 2; d += ` C${cx.toFixed(1)},${b.toFixed(1)} ${cx.toFixed(1)},${e.toFixed(1)} ${c.toFixed(1)},${e.toFixed(1)}`; } return d; };
      inner = `<path class="ln grey" d="${path(v.a, 0, W * .45)}"/><path class="ln" d="${path(v.b, W * .55, W)}"/><text class="lbl" x="0" y="${H}">before</text><text class="lbl" x="${W * .55}" y="${H}">after</text>`;
    } else if (v.t === 'grid') {
      const r = v.rows, c = v.cols, cw = W / c, ch = H / r;
      inner = Array.from({ length: r * c }, (_, i) => `<circle class="cell hi" cx="${((i % c) * cw + cw / 2).toFixed(1)}" cy="${(Math.floor(i / c) * ch + ch / 2).toFixed(1)}" r="${(Math.min(cw, ch) * .3).toFixed(1)}"/>`).join('');
    }
    return `<div class="viz ${v.c || ''}"><svg viewBox="0 0 ${W} ${H}" aria-hidden="true" data-viz="${v.t}">${inner}</svg></div>`;
  };

  /* ---------------- render: ticker ---------------- */
  const ticker = $('#ticker');
  if (ticker) {
    const items = D.marquee.map(s => { const c = client(s); return `<div class="tchip" data-client="${s}">${avatar(s)}<div><b>${esc(c.short)}</b><span>${esc(c.subs || c.niche)}</span></div></div>`; }).join('');
    ticker.innerHTML = items + items;
  }

  /* ---------------- render: brands row + receipts ---------------- */
  const brands = $('#brands');
  if (brands) { const items = (D.brands || []).map(([s, line]) => { const c = client(s); return c ? `<div class="bchip" data-client="${s}">${avatar(s)}<div><b>${esc(c.short)}</b><span>${esc(line)}</span></div></div>` : ''; }).join(''); brands.innerHTML = items + items; }
  const receiptsFor = slug => { const rs = (D.receipts || []).filter(r => r.c === slug); return rs.length ? `<h5>Receipts</h5><div class="rgal">${rs.map(r => `<figure><img src="${r.img}" alt="${esc(r.title)}" loading="lazy"><figcaption><span class="rs">${esc(r.src)}</span>${esc(r.title)} · ${esc(r.text)}</figcaption></figure>`).join('')}</div>` : ''; };
  const hasReceipt = slug => (D.receipts || []).some(r => r.c === slug);

  /* ---------------- render: hero avatars (rotating stack) ---------------- */
  const hv = $('#heroAvatars');
  if (hv) {
    const pool = D.marquee.filter(s => client(s));
    const N = innerWidth > 760 ? 9 : 6;
    hv.innerHTML = pool.slice(0, N).map(s => `<span class="av" title="${esc(client(s).short)}">${avatar(s)}</span>`).join('');
    if (G && !reduce) { let idx = N; setInterval(() => { const slot = $$('.av', hv)[idx % N]; const s = pool[idx % pool.length]; idx++; if (!slot || document.hidden) return; G.to(slot, { scale: 0, rotation: -40, duration: .28, ease: 'power2.in', onComplete: () => { slot.innerHTML = avatar(s); slot.title = client(s).short; G.to(slot, { scale: 1, rotation: 0, duration: .55, ease: 'back.out(2)' }); } }); }, 2400); }
  }

  /* ---------------- render: cases ---------------- */
  const bento = $('#bento');
  if (bento) {
    bento.innerHTML = D.cases.map((k, i) => {
      const c = client(k.slug);
      const chips = k.chips.map(([t, kind]) => `<span class="chip ${kind}">${esc(t)}</span>`).join('') + (hasReceipt(k.slug) && !k.proof ? '<span class="chip proof">Dashboard screenshot</span>' : '');
      const meta = `<div class="case-meta"><span class="tag">${esc(k.tag)}</span><span class="plat">${esc(c.platform)}</span></div>`;
      const who = `<div class="who">${avatar(k.slug)}<div><b>${esc(c.short)}</b><span>${esc(c.niche)}</span></div></div>`;
      const big = `<div class="bigrow"><div class="case-big"><span class="n">${esc(k.big)}</span><span class="u">${esc(k.unit)}</span></div>${vizSvg(k.slug)}</div>`;
      if (k.theme === 'proof') {
        return `<article class="case wide proof rv" data-case="${k.slug}" data-d="${i % 3}">
          <div class="proof-grid"><div class="proof-txt">${meta}${who}${big}<div class="case-title">${esc(k.title)}</div><p class="case-desc">${esc(k.desc)}</p><div class="chips">${chips}</div><span class="case-more">Open case study <span class="arrow">→</span></span></div>
          <div class="proof-img" data-label="${esc(k.proofLabel || 'YouTube Studio · 28 days')}"><img src="${k.proof}" alt="YouTube Studio analytics for ${esc(c.short)}" loading="lazy"></div></div></article>`;
      }
      const money = k.theme === 'money' ? `<div class="money-fx" aria-hidden="true">${Array.from({ length: 14 }, (_, j) => `<i style="left:${(j * 7 + 3) % 96}%;animation-delay:${(j * .37) % 2.4}s;font-size:${16 + (j % 3) * 6}px">$</i>`).join('')}</div>` : '';
      return `<article class="case ${k.theme} ${k.size || ''} rv" data-case="${k.slug}" data-d="${i % 3}">
        <div class="case-corner"></div>${money}${meta}${who}${big}
        <div class="case-title">${esc(k.title)}</div><p class="case-desc">${esc(k.desc)}</p>
        <div class="chips">${chips}</div><span class="case-more">Open case study <span class="arrow">→</span></span></article>`;
    }).join('');
  }
  const winCat = k => (k.startsWith('$') || /lead|payout/i.test(k)) ? 'money' : /[%×→KM]|\/mo/.test(k) ? 'growth' : 'volume';
  const wins = $('#wins');
  if (wins) wins.insertAdjacentHTML('beforeend', D.wins.map(([k, slug, t, short, year], i) => {
    const c = client(slug); const letters = [...k].map((ch, j) => `<i style="--i:${j}">${esc(ch)}</i>`).join('');
    return `<div class="wrow ${winCat(k)} rv" data-client="${slug}" data-d="${i % 3}"><span class="wk">${letters}</span><span class="wc">${avatar(slug)}<span>${esc(c ? c.short : '')}</span></span><span class="wt">${esc(short || '')}</span><span class="wy">${esc(year || '')}</span></div>`;
  }).join(''));

  /* numbers: "how we know" graphics */
  $$('.how .dots').forEach(d => d.innerHTML = Array.from({ length: 100 }, (_, i) => `<i style="--i:${i}"></i>`).join(''));
  $$('.how .strip').forEach(d => d.innerHTML = Array.from({ length: 30 }, (_, i) => `<i style="--i:${i};--h:${((i * 37) % 100) / 100}"></i>`).join(''));
  if (!fine) $$('.num').forEach(n => n.addEventListener('click', () => { const o = n.classList.contains('open'); $$('.num.open').forEach(x => x.classList.remove('open')); if (!o) n.classList.add('open'); }));
  /* LinkedIn cadence grid */
  $$('.cad').forEach(d => d.innerHTML = Array.from({ length: 30 }, (_, i) => `<i style="--i:${i};--o:${(0.35 + ((i * 53) % 65) / 100).toFixed(2)}"></i>`).join(''));

  /* ---------------- vehicles: the ride upgrades every year ---------------- */
  const MARK = (x, y, s) => `<use href="#pm-mark" x="${x}" y="${y}" width="${s}" height="${s}"/>`;
  const WHEEL = (cx, cy, r, spokes = true) => `<g class="wheel"><circle cx="${cx}" cy="${cy}" r="${r}"/>${spokes ? `<path d="M${cx} ${cy - r + 2}V${cy + r - 2}M${cx - r + 2} ${cy}H${cx + r - 2}"/>` : ''}</g>`;
  const VEH = [
    /* 2022 · hand cart */
    `<g class="veh"><path class="bd" d="M16 20h34v15H16z"/>${MARK(28, 23, 10)}<path class="st" d="M50 24l18-11M50 35h4"/>${WHEEL(28, 38, 5.5)}${WHEEL(44, 38, 5.5)}</g>`,
    /* 2023 · bicycle */
    `<g class="veh"><path class="st" d="M20 34l12-16h16l10 16M32 18l7 16H20M39 34l9-16M48 18l4-6M28 14h9M30 14l2 4M52 12l6 1"/>${MARK(34, 22, 9)}${WHEEL(20, 34, 9)}${WHEEL(58, 34, 9)}</g>`,
    /* 2024 · car */
    `<g class="veh"><path class="bd" d="M8 34v-8q0-4 4-4h10l8-10h22l8 10h10q4 0 4 4v8z"/><path class="gl" d="M32 14h18l6 8H26z"/>${MARK(36, 24, 9)}<circle class="lamp" cx="70" cy="27" r="2"/>${WHEEL(22, 35, 6)}${WHEEL(60, 35, 6)}</g>`,
    /* 2025 · metro */
    `<g class="veh"><path class="st" d="M30 10l4-6h10"/><path class="bd" d="M6 30V16q0-6 6-6h50q14 0 14 14v6q0 4-4 4H10q-4 0-4-4z"/><rect class="gl" x="12" y="15" width="12" height="9" rx="2"/><rect class="gl" x="28" y="15" width="12" height="9" rx="2"/><rect class="gl" x="44" y="15" width="10" height="9" rx="2"/>${MARK(58, 15, 9)}<circle class="lamp" cx="71" cy="27" r="2.2"/>${WHEEL(18, 37, 4, false)}${WHEEL(30, 37, 4, false)}${WHEEL(52, 37, 4, false)}${WHEEL(64, 37, 4, false)}</g>`,
    /* 2026 · rocket */
    `<g class="veh"><ellipse class="glow" cx="40" cy="41" rx="22" ry="3"/><path class="flame" d="M16 22L1 15l6 7-6 7z"/><path class="bd" d="M20 13L10 5v12zM20 31l-10 8V27z"/><path class="bd" d="M18 13h34q14 4 20 9-6 5-20 9H18q-3 0-3-3V16q0-3 3-3z"/><path class="gl" d="M52 13q14 4 20 9-6 5-20 9z"/><circle class="bd" cx="38" cy="22" r="6.5"/>${MARK(32.5, 16.5, 11)}</g>`,
  ];
  const pylon = (i, h) => {
    if (i === 0) return `<path class="py" d="M0 0V${h}M-9 16H9"/>`;
    if (i === 1) return `<path class="py" d="M0 0V${h}"/><path class="py f" d="M0 18H18V30H0z"/>`;
    if (i === 2) return `<path class="py" d="M0 0V${h}M0 30Q0 18 14 18"/><circle class="lamp" cx="16" cy="18" r="4.5"/>`;
    if (i === 3) { let ties = ''; for (let y = 24; y < h; y += 34) ties += `M-7 ${y}H7`; return `<path class="py" d="M-7 0V${h}M7 0V${h}${ties}"/><path class="py f" d="M-18 ${h - 6}H18V${h}H-18z"/>`; }
    let z = 'M-9 0', y = 0, s = 1; while (y < h - 16) { y += 16; z += `L${9 * s} ${y}`; s = -s; }
    return `<path class="py" d="M-9 0V${h}M9 0V${h}"/><path class="py" d="${z}" opacity=".7"/><circle class="lamp" cx="0" cy="-16" r="3.5"/>`;
  };

  /* ---------------- render: ascent (timeline) ---------------- */
  const ST_X = [100, 340, 600, 860, 1100], ST_Y = [420, 360, 290, 210, 140], GROUND = 500;
  const cablePath = 'M100,420 C220,420 230,360 340,360 S490,290 600,290 S750,210 860,210 S990,140 1100,140';
  const svgA = $('#ascentSvg'), stage = $('#ascentStage');
  const statsHtml = t => `<div class="ystats">${(t.stats || []).map(([v, l]) => `<div><b>${esc(v)}</b><span>${esc(l)}</span></div>`).join('')}</div>`;
  const facesHtml = (t, n = 6) => t.clients.slice(0, n).map(s => { const c = client(s); return c ? `<img src="${c.photo}" alt="${esc(c.short)}" title="${esc(c.short)}" loading="lazy" data-ini="${initials(c.name)}" onerror="PMimgFail(this)">` : ''; }).join('') + (t.clients.length > n ? `<span class="more">+${t.clients.length - n} more</span>` : '');
  if (svgA && stage) {
    const stations = D.timeline.map((t, i) => `<g class="station" data-i="${i}" transform="translate(${ST_X[i]},${ST_Y[i]})">${pylon(i, GROUND - ST_Y[i])}<circle class="node" r="9"/><text y="62" text-anchor="middle">${t.year}</text><text class="sub" y="84" text-anchor="middle">${esc(t.label)}</text></g>`).join('');
    svgA.innerHTML = `<path class="cable" d="${cablePath}"/><path class="cable-done" id="cableDone" d="${cablePath}"/>${stations}
      <g class="gondola" id="gondola">${VEH.map((v, i) => `<g class="vwrap" transform="translate(-40,-44)"><g class="vslot" data-v="${i}">${v}</g></g>`).join('')}</g>`;
    stage.insertAdjacentHTML('beforeend', D.timeline.map((t, i) => {
      const above = i <= 2; const left = ST_X[i] / 1200 * 100, top = ST_Y[i] / 520 * 100;
      return `<div class="yearcard" data-i="${i}" data-year-i="${i}" style="left:${left}%;top:${top}%;transform-origin:center;${above ? 'translate:-50% calc(-100% - 70px)' : 'translate:-50% 104px'}"><div class="yhead"><h4>${esc(t.hl || t.title)}</h4><svg class="yveh" viewBox="0 0 80 44" aria-hidden="true">${VEH[i]}</svg></div>${statsHtml(t)}<div class="faces">${facesHtml(t)}</div><span class="ycta">Read the full ${t.year} story →</span></div>`;
    }).join(''));
  }
  const mob = $('#ascentMobile'), stripSvg = $('#stripSvg');
  if (mob) mob.insertAdjacentHTML('beforeend', D.timeline.map((t, i) => `<div class="mstop" data-i="${i}" data-year-i="${i}"><div class="mhd"><div><div class="y">${t.year}</div><div class="l">${esc(t.label)}</div></div><svg class="mveh" viewBox="0 0 80 44" aria-hidden="true">${VEH[i]}</svg></div><h4>${esc(t.title)}</h4><p>${esc(t.text)}</p>${statsHtml(t)}<div class="faces">${facesHtml(t)}</div><div class="chips">${t.chips.map(c => `<span class="chip">${esc(c)}</span>`).join('')}</div><span class="ycta">Read the full ${t.year} story →</span></div>`).join(''));
  const MX = [28, 112, 196, 280, 364], MY = [118, 99, 79, 59, 38], MGROUND = 136;
  const stripPath = 'M28,118 C60,118 70,99 112,99 S160,79 196,79 S240,59 280,59 S325,38 364,38';
  if (stripSvg) stripSvg.innerHTML = `<path class="cable" d="${stripPath}"/><path class="cable-done" id="stripDone" d="${stripPath}"/>` +
    D.timeline.map((t, i) => `<g class="sst" data-i="${i}" transform="translate(${MX[i]},${MY[i]})"><path class="py" d="M0 0V${MGROUND - MY[i]}"/><circle r="5"/><text y="${MGROUND - MY[i] + 12}" text-anchor="middle">${t.year}</text></g>`).join('') +
    `<text class="odo-s" id="odoStrip" x="384" y="14" text-anchor="end"><tspan id="odoStripM">Nov</tspan> 2022</text><g id="gondolaM">${VEH.map((v, i) => `<g class="vwrap" transform="translate(-26,-28) scale(.65)"><g class="vslot" data-v="${i}">${v}</g></g>`).join('')}</g>`;

  const SRC_ICON = {
    slack: '<svg viewBox="0 0 24 24"><path d="M6 15a2 2 0 1 1-2-2h2zm1 0a2 2 0 0 1 4 0v5a2 2 0 0 1-4 0zM9 6a2 2 0 1 1 2-2v2zm0 1a2 2 0 0 1 0 4H4a2 2 0 0 1 0-4zm9 2a2 2 0 1 1 2 2h-2zm-1 0a2 2 0 0 1-4 0V4a2 2 0 0 1 4 0zm-2 9a2 2 0 1 1-2 2v-2zm0-1a2 2 0 0 1 0-4h5a2 2 0 0 1 0 4z"/></svg>',
    email: '<svg viewBox="0 0 24 24"><path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h17A1.5 1.5 0 0 1 22 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 18.5v-13zm2 .7v.6l8 5 8-5v-.6l-8 5-8-5zm0 2.9V18h16V9.1l-8 5-8-5z"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3a.5.5 0 0 0 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 12 12 0 0 0 4.6 4c1.7.7 2.1.6 2.8.5a2.4 2.4 0 0 0 1.6-1.1 2 2 0 0 0 .1-1.1c0-.1-.2-.2-.5-.3z"/></svg>',
    call: '<svg viewBox="0 0 24 24"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.6 1 1 0 0 1-.25 1z"/></svg>',
    deck: '<svg viewBox="0 0 24 24"><path d="M3 4h18v2h-1v10H4V6H3V4zm3 4v6h12V8H6zm5 10h2v1.6l2.5 2.4-1.4 1.4L12 19.3l-2.1 2.1-1.4-1.4L11 17.6V18z"/></svg>',
    review: '<svg viewBox="0 0 24 24"><path d="M3 17.3V21h3.7L17.8 9.9l-3.7-3.7L3 17.3zm17.7-10.2a1 1 0 0 0 0-1.4l-2.4-2.4a1 1 0 0 0-1.4 0l-1.8 1.8 3.7 3.7 1.9-1.7z"/></svg>',
  };
  /* ---------------- playbooks: LinkedIn → Instagram → YouTube ---------------- */
  const PB_LOGO = { tiktok: 'M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-1.8-2.5V9.7a5.7 5.7 0 1 0 4.9 5.7V9.1a7.3 7.3 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.2-1.6z', reddit: 'M22 12.1a2.2 2.2 0 0 0-3.7-1.6 10.7 10.7 0 0 0-5.8-1.8l1-4.6 3.2.7a1.5 1.5 0 1 0 .2-1l-3.6-.8a.5.5 0 0 0-.6.4l-1.1 5.3a10.8 10.8 0 0 0-5.9 1.8 2.2 2.2 0 1 0-2.4 3.6 4.3 4.3 0 0 0 0 .7c0 3.4 3.9 6.1 8.7 6.1s8.7-2.7 8.7-6.1a4.3 4.3 0 0 0 0-.7 2.2 2.2 0 0 0 1.3-2zM7 13.6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zm8.6 4.1a5.6 5.6 0 0 1-3.6 1.1 5.6 5.6 0 0 1-3.6-1.1.4.4 0 0 1 .6-.6 4.8 4.8 0 0 0 3 .9 4.8 4.8 0 0 0 3-.9.4.4 0 0 1 .6.6zm-.3-2.6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z', x: 'M17.8 3h3l-6.7 7.7L22 21h-6.2l-4.8-6.3L5.4 21h-3l7.2-8.2L2 3h6.3l4.4 5.8L17.8 3zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5z', linkedin: 'M20.4 2H3.6A1.6 1.6 0 0 0 2 3.6v16.8A1.6 1.6 0 0 0 3.6 22h16.8a1.6 1.6 0 0 0 1.6-1.6V3.6A1.6 1.6 0 0 0 20.4 2zM8 19H5V9h3v10zM6.5 7.7a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4zM19 19h-3v-4.9c0-1.2 0-2.7-1.6-2.7s-1.9 1.3-1.9 2.6V19h-3V9h2.9v1.4a3.2 3.2 0 0 1 2.8-1.6c3 0 3.6 2 3.6 4.6V19z', instagram: 'M12 2.2c3.2 0 3.6 0 4.8.1 3.2.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 3.9 4 2.4 7.2 2.3c1.2-.1 1.6-.1 4.8-.1zm0 4.7a5.1 5.1 0 1 0 0 10.2 5.1 5.1 0 0 0 0-10.2zm0 8.4a3.3 3.3 0 1 1 0-6.6 3.3 3.3 0 0 1 0 6.6zm5.3-9.8a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z', youtube: 'M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .6 12a31 31 0 0 0 .4 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .4-4.8 31 31 0 0 0-.4-4.8zM9.7 15.1V8.9l6 3.1-6 3.1z' };
  const AV_SVG = '<svg viewBox="0 0 40 40"><defs><linearGradient id="avg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FBE100"/><stop offset="1" stop-color="#F6951B"/></linearGradient></defs><circle cx="20" cy="20" r="20" fill="url(#avg)"/><path d="M8 40c1-8 6-12 12-12s11 4 12 12z" fill="#1F2A44"/><path d="M14.5 27.5h11" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><circle cx="20" cy="16" r="7.5" fill="#F3C9A5"/><path d="M12.4 15.2c.4-5.2 3.7-7.6 7.6-7.6s7.2 2.4 7.6 7.6c-1.6-1.9-3.9-2.6-7.6-2.6s-6 .7-7.6 2.6z" fill="#2B1B12"/><path d="M14.8 17.2h3.4M21.8 17.2h3.4" stroke="#1F2A44" stroke-width="1.4" stroke-linecap="round"/></svg>';
  const pbEl = $('#playbook'); let pbState = -1, pbBusy = false, pbPending = -1;
  const setDial = i => { const d = $('#pbDial'); if (!d) return; $$('.dl', d).forEach((x, k) => x.classList.toggle('on', k === i)); const cur = $('.dl-cursor', d); if (cur) { const y = i * (pbEl.classList.contains('compact') ? 42 : 50); if (G && !reduce) G.to(cur, { y, duration: .55, ease: 'power3.inOut' }); else cur.style.transform = `translateY(${y}px)`; } };
  const pbPhone = pb => `<div class="li-head"><span class="li-av" aria-hidden="true">${AV_SVG}</span><div><b>${esc(pb.phone.who)}</b><span>${esc(pb.phone.sub)}</span></div></div>
      <div class="li-stat"><span>${esc(pb.phone.label)}</span><b><span data-count="${pb.phone.n}" data-suffix="${esc(pb.phone.suffix)}">0</span></b><em>${esc(pb.phone.up)}</em></div>
      <div class="li-posts" aria-hidden="true"><i></i><i></i><i></i></div><div class="li-react">${pb.phone.react.map(([n, l]) => `<span><b data-count="${n}">0</b> ${esc(l)}</span>`).join('')}</div>
      <div class="li-bars">${pb.phone.bars.map(h => `<i style="--h:${h}"></i>`).join('')}</div>
      <div class="li-cad"><span>${esc(pb.phone.cad)}</span><div class="cad">${Array.from({ length: 30 }, (_, i) => `<i style="--i:${i};--o:${(.25 + ((i * 7) % 10) / 12).toFixed(2)}"></i>`).join('')}</div></div><div class="li-src"><span><i></i>Source: ${esc(pb.source)}</span><span>Updated Sep 2026</span></div>`;
  const pbSideHtml = pb => `<div class="eyebrow" style="margin-bottom:8px">${esc(pb.eyebrow)}</div><h3 class="h3">${pb.title}</h3><p class="small muted" style="max-width:46ch;margin:10px 0 18px">${esc(pb.intro)}</p><ol class="pb-steps">${pb.steps.map(([b, t], i) => `<li style="--i:${i}"><b>${esc(b)}</b>${esc(t)}</li>`).join('')}</ol>${pb.clients && pb.clients.length ? `<div class="pb-proof"><span class="faces">${pb.clients.map(sl => avatar(sl)).join('')}</span><span>Run for <b>${pb.clients.map(sl => client(sl) ? client(sl).short : '').filter(Boolean).join(', ')}</b> · every number traces to a dashboard, report or payment.</span></div>` : `<div class="pb-proof"><span>${esc(pb.source)}. We publish results only once a client dashboard shows them.</span></div>`}`;
  const pbResHtml = pb => pb.results.map(([k, t]) => `<div><span class="k">${esc(k)}</span><span>${esc(t)}</span></div>`).join('');
  const setPlaybook = (i, instant) => {
    if (!pbEl || !D.playbooks || i === pbState) return;
    if (pbBusy) { pbPending = i; return; }
    const pb = D.playbooks[i]; pbState = i;
    $$('#pbTabs button').forEach((b, k) => b.classList.toggle('on', k === i));
    const apply = () => {
      pbEl.style.setProperty('--pb', pb.color); pbEl.style.setProperty('--pb2', pb.color2); document.body.style.setProperty('--pb', pb.color); document.body.style.setProperty('--pb2', pb.color2);
      const lg = $('#pbLogo path'); if (lg) lg.setAttribute('d', PB_LOGO[pb.key] || '');
      setDial(i);
      $('#pbCard').innerHTML = pbPhone(pb); $('#pbSide').innerHTML = pbSideHtml(pb); $('#pbResults').innerHTML = pbResHtml(pb);
      $$('#pbCard [data-count]').forEach(countEl);
    };
    if (instant || !G || reduce) { apply(); return; }
    pbBusy = true; pbEl.classList.add('sw');
    const ph = $('.phone');
    G.timeline({ onComplete: () => { pbBusy = false; if (pbPending >= 0 && pbPending !== pbState) { const n = pbPending; pbPending = -1; setPlaybook(n); } else pbPending = -1; } })
      .to(ph, { rotateY: 90, duration: .22, ease: 'power2.in' })
      .add(() => { apply(); pbEl.classList.remove('sw'); })
      .to(ph, { rotateY: 0, duration: .36, ease: 'power2.out' });
  };
  if (pbEl && D.playbooks) {
    $('#pbTabs').innerHTML = D.playbooks.map((pb, i) => `<button type="button" role="tab" style="--c:${pb.color}"><i></i>${esc(pb.name)}</button>`).join('');
    const dial = $('#pbDial'); if (dial) dial.insertAdjacentHTML('beforeend', D.playbooks.map((pb, i) => `<span class="dl" data-key="${pb.key}"><svg viewBox="0 0 24 24"><path d="${PB_LOGO[pb.key] || ''}"/></svg><span class="dl-lbl">${esc(pb.name)} · ${String(i + 1).padStart(2, '0')}/${String(D.playbooks.length).padStart(2, '0')}</span></span>`).join(''));
    $$('#pbTabs button').forEach((b, i) => b.addEventListener('click', () => { pbManual = true; setPlaybook(i); }));
  }
  let pbManual = false;
  setTimeout(() => setPlaybook(0, true), 0);
  /* ---------------- render: testimonials ---------------- */
  const vgrid = $('#vgrid');
  if (vgrid) vgrid.innerHTML = D.videoTestimonials.map((v, i) => {
    const c = client(v.client); const poster = v.poster || (v.yt ? ytThumb(v.yt) : '');
    return `<div class="vcard rv" data-video="${v.yt ? 'yt:' + v.yt : 'mp4:' + v.mp4}" data-orient="${v.orient}" ${v.client ? `data-client="${v.client}"` : ''} data-d="${i % 4}"><div class="thumb" style="background-image:url('${poster}')">${PLAY}<div class="cap">${esc(c ? c.short : 'Client message')}</div></div><div class="vmeta"><b>${esc(v.title)}</b><span>${esc(v.meta)}</span></div></div>`;
  }).join('');
  const tgrid = $('#tgrid');
  if (tgrid) {
    const groups = new Map();
    D.quotes.forEach(q => { if (!groups.has(q.c)) groups.set(q.c, []); groups.get(q.c).push(q); });
    const order = [...groups.entries()].sort((a, b) => (b[1].some(q => q.star) ? 1 : 0) - (a[1].some(q => q.star) ? 1 : 0) || b[1].length - a[1].length);
    tgrid.innerHTML = order.map(([slug, qs], i) => {
      const sorted = [...qs].sort((a, b) => (b.star ? 1 : 0) - (a.star ? 1 : 0));
      const main = sorted[0], rest = sorted.slice(1, 3); const c = client(slug);
      const short = c ? c.short : ''; let role = main.role || '';
      if (short && role === short) role = ''; else if (short && role.startsWith(short + ' · ')) role = role.slice(short.length + 3);
      const sub = [(short && short !== main.who) ? short : '', role].filter(Boolean).join(' · ');
      const lines = rest.map(q => `<div class="ql"><span>“${esc(q.q)}”</span><small>${esc(q.src)} · ${esc(q.date)}</small></div>`).join('');
      return `<div class="tcard rv ${main.star ? 'star' : ''} ${i >= 9 ? 'extra' : ''}" data-client="${slug}" data-src="${srcKey(main.src)}" data-d="${i % 3}" style="--i:${Math.max(0, i - 9)}"><span class="src">${SRC_ICON[srcKey(main.src)] || ''}${esc(main.src)} · ${esc(main.date)}</span><div class="q">${esc(main.q)}</div>${lines}<div class="who">${avatar(slug)}<div><b>${esc(main.who)}</b><span>${esc(sub)}</span></div></div></div>`;
    }).join('');
    const btn = $('#moreQuotes'); if (btn) btn.textContent = `Show all ${order.length} clients`;
  }

  /* ---------------- render: work ---------------- */
  const shorts = $('#shorts');
  if (shorts) shorts.innerHTML = D.samples.shorts.map((s, i) => {
    const c = client(s.client); const brand = c ? `<span class="brand">${avatar(s.client)}${esc(c.short)}</span>` : `<span class="brand">Pinnakle sample</span>`;
    const poster = s.poster || ytThumb(s.yt);
    return `<div class="short rv" data-video="yt:${s.yt}" data-orient="portrait" data-d="${i % 5}" style="background-image:url('${poster}')">${s.loop ? `<video muted loop playsinline preload="none" src="${s.loop}"></video>` : ''}${brand}${PLAY}<div class="cap">${esc(s.title)}${s.views ? ` · <span style="opacity:.8">${esc(s.views)}</span>` : ''}</div></div>`;
  }).join('');
  const longs = $('#longs');
  if (longs) longs.innerHTML = D.samples.longs.map((s, i) => `<div class="long rv" data-video="yt:${s.yt}" data-orient="landscape" data-d="${i % 3}" style="background-image:url('${ytThumb(s.yt)}')">${PLAY}<div class="cap">${esc(s.title)}</div></div>`).join('');
  const thumbs = $('#thumbs');
  if (thumbs) thumbs.innerHTML = D.samples.thumbs.map(([src, cap], i) => `<figure class="rv" data-d="${i % 3}"><img src="${src}" alt="${esc(cap)} thumbnail" loading="lazy"><figcaption>${esc(cap)}</figcaption></figure>`).join('');
  const covers = $('#covers');
  if (covers) covers.innerHTML = D.samples.covers.map((src, i) => `<img class="rv" data-d="${i % 4}" src="${src}" alt="Pinnakle Media reel cover" loading="lazy">`).join('');
  const beyond = $('#beyond');
  if (beyond) beyond.innerHTML = D.beyond.map((b, i) => `<div class="bcard rv" data-d="${i % 3}"><div class="media">${b.video ? `<video src="${b.video}" poster="${b.poster}" muted playsinline loop preload="none" data-hoverplay></video>` : `<img src="${b.img}" alt="${esc(b.title)}" loading="lazy">`}</div><div class="body"><span class="tag">${esc(b.tag)}</span><h4>${esc(b.title)}</h4><p>${esc(b.text)}</p>${b.link ? `<a class="more" href="${b.link}" target="_blank" rel="noopener">Visit ↗</a>` : ''}</div></div>`).join('');

  /* ---------------- render: team ---------------- */
  const founders = $('#founders');
  if (founders) founders.innerHTML = D.team.founders.map((f, i) => `<div class="fcard rv"><span class="fnum">${i === 0 ? 'Founder · since Dec 2022' : 'Co-founder · since Dec 2022'}</span><img src="${f.photo}" alt="${esc(f.name)}" data-ini="${initials(f.name)}" onerror="PMimgFail(this)"><div><h4>${esc(f.name)}</h4><div class="role">${esc(f.role)}</div><p>${esc(f.text)}</p><div class="fx">${(f.chips || []).map(c => `<span>${esc(c)}</span>`).join('')}</div>${f.li ? `<a class="li" href="${f.li}" target="_blank" rel="noopener">LinkedIn ↗</a>` : ''}</div></div>`).join('');
  const teamNow = $('#teamNow');
  if (teamNow) teamNow.innerHTML = D.team.now.map(([n, r], i) => `<div class="tm rv" data-d="${i % 5}"><b>${esc(n)}</b><span>${esc(r)}</span></div>`).join('');
  const alumni = $('#alumni');
  if (alumni) alumni.innerHTML = `<b>Editors and teammates who shaped the work since 2022:</b> ${D.team.alumni.map(esc).join(' · ')}.`;

  const svc = $('#svc');
  if (svc && D.services) {
    svc.innerHTML = D.services.core.map(([n, w, p, col, ic], i) => `<div class="cs rv" data-d="${i % 4}" style="--hc:${col}"><span class="n">${String(i + 1).padStart(2, '0')}</span><span class="ic"><svg viewBox="0 0 24 24">${ic}</svg></span><span class="wm"><svg viewBox="0 0 24 24">${ic}</svg></span><h4>${esc(n)}</h4><p>${esc(w)}</p><span class="pr">${esc(p)}</span></div>`).join('');
    const bub = $('#svcBubble'); if (bub) { const say = t => { bub.classList.add('sw'); setTimeout(() => { bub.textContent = t; bub.classList.remove('sw'); }, 220); }; $$('.cs', svc).forEach((card, i) => { const [n, , p] = D.services.core[i]; const on = () => say(`${n}: ${p}.`); card.addEventListener('mouseenter', on); card.addEventListener('click', on); }); }
    const mo = $('#svcMore'); if (mo) mo.innerHTML = `<span class="al">Also inside a retainer</span>` + D.services.more.map((x, i) => `<span style="--c:${D.services.core[i % 8][3]}">${esc(x)}</span>`).join('');
  }
  const dc = $('#driveCard'); if (dc && D.library) { dc.href = D.library.url; const n = $('#driveNote'); if (n) n.textContent = D.library.note; const ch = $('#driveChips'); if (ch && D.library.niches) ch.innerHTML = D.library.niches.map((x, i) => `<span style="--i:${i}">${esc(x)}</span>`).join(''); }

  /* ---------------- hover identity card (desktop) ---------------- */
  const idc = document.createElement('div'); idc.className = 'idcard'; document.body.appendChild(idc);
  if (fine) {
    let cur = null;
    const show = (slug, x, y) => { const c = client(slug); if (!c) return hide(); if (cur !== slug) { idc.innerHTML = `${avatar(slug)}<div><b>${esc(c.name)}</b><span>${esc(c.niche)} · ${esc(c.platform)}</span>${c.subs ? `<span>${esc(c.subs)}</span>` : ''}<span class="tag2">Verified client${c.since ? ' · since ' + esc(c.since) : ''}</span></div>`; cur = slug; } place(x, y); idc.classList.add('on'); };
    const place = (x, y) => { const w = 270, h = 92; let l = x + 18, t = y + 18; if (l + w > innerWidth - 12) l = x - w - 18; if (t + h > innerHeight - 12) t = y - h - 18; idc.style.left = l + 'px'; idc.style.top = t + 'px'; };
    const hide = () => { idc.classList.remove('on'); cur = null; };
    document.addEventListener('mousemove', e => { const el = e.target.closest('.vcard, .wrow[data-client], .tchip, .bchip'); if (el && el.dataset.client && !e.target.closest('.modal')) show(el.dataset.client, e.clientX, e.clientY); else hide(); }, { passive: true });
  }

  /* ---------------- modal ---------------- */
  const modal = $('#modal'), mbox = $('#modalBox');
  const openModal = html => { mbox.innerHTML = `<button class="close" aria-label="Close">×</button>${html}`; modal.classList.add('open'); requestAnimationFrame(() => modal.classList.add('in')); document.body.style.overflow = 'hidden'; $('.close', mbox).focus(); };
  const closeModal = () => { modal.classList.remove('in'); setTimeout(() => { modal.classList.remove('open'); mbox.innerHTML = ''; document.body.style.overflow = ''; }, 350); };
  modal.addEventListener('click', e => { if (e.target.classList.contains('bg') || e.target.classList.contains('close')) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });
  const videoHtml = (v, orient) => {
    if (v.startsWith('yt:')) { const id = v.slice(3); return `<div class="mvideo ${orient === 'portrait' ? 'portrait' : ''}"><iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen title="Video"></iframe></div>`; }
    return `<div class="mvideo ${orient === 'portrait' ? 'portrait' : ''}"><video src="${v.slice(4)}" controls autoplay playsinline></video></div>`;
  };
  const clientHead = (slug, extra = '') => { const c = client(slug); if (!c) return `<div class="mhead"><span class="ini">PM</span><div><h3>Pinnakle Media client</h3><div class="meta">${extra}</div></div></div>`; return `<div class="mhead">${avatar(slug)}<div><h3>${esc(c.name)}</h3><div class="meta">${esc(c.niche)} · ${esc(c.platform)}${c.since ? ` · client ${esc(c.since)}${c.until ? ' → ' + esc(c.until) : ''}` : ''}${extra}</div></div></div>`; };
  const clientLinks = slug => { const c = client(slug); return c && c.channel ? `<div class="mlinks"><a class="btn btn-ghost" href="${c.channel}" target="_blank" rel="noopener">Visit ${esc(c.short)} ↗</a></div>` : ''; };
  const quoteBlock = q => `<div class="mq" data-src="${srcKey(q.src)}">“${esc(q.q)}”<small>${esc(q.who)} · ${esc(q.src)}, ${esc(q.date)}</small></div>`;
  const openCase = slug => {
    const k = D.cases.find(x => x.slug === slug); if (!k) return;
    const quotes = D.quotes.filter(q => q.c === slug).slice(0, 3);
    openModal(`${clientHead(slug)}<div class="mbody"><div class="case-big"><span>${esc(k.big)}</span><span class="u">${esc(k.unit)}</span></div><div class="case-title">${esc(k.title)}</div><p style="color:var(--ink-2);font-size:15px;margin-top:8px">${esc(k.desc)}</p>
      <h5>What we did</h5><ul>${(k.did || []).map(d => `<li>${esc(d)}</li>`).join('')}</ul>
      <h5>Results</h5><div class="chips">${k.chips.map(([t, kind]) => `<span class="chip ${kind}">${esc(t)}</span>`).join('')}</div>
      ${k.proof ? `<h5>Proof</h5><img src="${k.proof}" alt="Analytics screenshot" style="border-radius:12px;box-shadow:var(--sh)">${k.proof2 ? `<img src="${k.proof2}" alt="Video analytics" style="border-radius:12px;box-shadow:var(--sh);margin-top:10px">` : ''}` : ''}
      ${receiptsFor(slug)}
      ${quotes.length ? `<h5>In their words</h5>${quotes.map(quoteBlock).join('')}` : ''}
      ${k.testimonial ? `<h5>Video testimonial</h5>${videoHtml(k.testimonial === 'bkbq' ? 'mp4:assets/video/bkbq-testimonial.mp4' : 'yt:' + k.testimonial, k.testimonial === 'bkbq' || k.testimonial === '805KmIDmzNo' || k.testimonial === 'EfHn0koliq0' ? 'portrait' : 'landscape')}` : k.video ? `<h5>Sample</h5>${videoHtml('yt:' + k.video, 'portrait')}` : ''}
      ${k.link ? `<div class="mlinks"><a class="btn btn-ghost" href="${k.link}" target="_blank" rel="noopener">Watch the 44K-view Reel ↗</a></div>` : ''}${clientLinks(slug)}</div>`);
  };
  const openClient = slug => {
    const k = D.cases.find(x => x.slug === slug); if (k) return openCase(slug);
    const c = client(slug); const quotes = D.quotes.filter(q => q.c === slug); const win = D.wins.filter(w => w[1] === slug);
    openModal(`${clientHead(slug)}<div class="mbody">${c && c.subs ? `<div class="case-big"><span>${esc(c.subs)}</span></div>` : ''}${win.length ? `<h5>The work</h5><ul>${win.map(w => `<li>${w[2]}</li>`).join('')}</ul>` : ''}${receiptsFor(slug)}${quotes.length ? `<h5>In their words</h5>${quotes.map(quoteBlock).join('')}` : ''}${clientLinks(slug)}</div>`);
  };
  const openVideo = (v, orient, slug) => openModal(`${slug ? clientHead(slug) : ''}<div class="mbody">${videoHtml(v, orient)}</div>`);
  const openYear = i => {
    const t = D.timeline[i]; if (!t) return;
    openModal(`<div class="mhead"><svg class="yveh" viewBox="0 0 80 44" style="width:84px;height:46px;flex:none" aria-hidden="true">${VEH[i]}</svg><div><div class="eyebrow" style="margin-bottom:6px">${t.year} · ${esc(t.label)}</div><h3>${esc(t.hl || t.title)}</h3></div></div>
      <div class="mbody ymodal"><div class="story">${(t.story || [t.text]).map(p => `<p>${esc(p)}</p>`).join('')}</div>${statsHtml(t)}<h5>Milestones</h5><div class="chips">${t.chips.map(c => `<span class="chip">${esc(c)}</span>`).join('')}</div><h5>Clients who joined</h5><div class="ycl">${t.clients.map(s => { const c = client(s); return c ? `<span data-client="${s}">${avatar(s)}${esc(c.short)}</span>` : ''; }).join('')}</div></div>`);
  };
  document.addEventListener('click', e => {
    const a = e.target.closest('a'); if (a && a.closest('.modal')) return;
    const yr = e.target.closest('[data-year-i]'); if (yr && !e.target.closest('.modal')) return openYear(+yr.dataset.yearI);
    const cs = e.target.closest('[data-case]'); if (cs) return openCase(cs.dataset.case);
    const vd = e.target.closest('[data-video]'); if (vd) return openVideo(vd.dataset.video, vd.dataset.orient, vd.dataset.client);
    const cl = e.target.closest('[data-client]'); if (cl && (!cl.closest('.modal') || cl.closest('.ycl'))) return openClient(cl.dataset.client);
  });

  /* ---------------- tabs, show-more ---------------- */
  $$('.tab[data-tab]').forEach(t => t.addEventListener('click', () => { $$('.tab[data-tab]').forEach(x => x.classList.toggle('active', x === t)); $$('[data-panel]').forEach(p => p.classList.toggle('hidden', p.dataset.panel !== t.dataset.tab)); ST && ST.refresh(); }));
  const more = $('#moreQuotes'); if (more) more.addEventListener('click', () => { $('#tgrid').classList.add('all'); $$('.tcard.extra').forEach(c => { c.classList.remove('extra'); c.classList.add('in'); }); more.remove(); ST && ST.refresh(); });
  const moreW = $('#moreWins'); if (moreW) moreW.addEventListener('click', () => { $('#wins').classList.add('all'); moreW.remove(); ST && ST.refresh(); });

  /* ---------------- hover-play loops ---------------- */
  $$('.short video, [data-hoverplay]').forEach(v => {
    const box = v.closest('.short') || v.closest('.media');
    const play = () => { v.play().then(() => box.classList.add('playing')).catch(() => {}); };
    const stop = () => { v.pause(); box.classList.remove('playing'); };
    if (fine) { box.addEventListener('mouseenter', play); box.addEventListener('mouseleave', stop); }
    else if ('IntersectionObserver' in window) { new IntersectionObserver(es => es.forEach(x => x.isIntersecting ? play() : stop()), { threshold: .6 }).observe(box); }
  });

  /* ---------------- nav ---------------- */
  const nav = $('.nav'), toggle = $('.nav-toggle'), progress = $('.progress');
  const onScroll = () => { nav.classList.toggle('scrolled', scrollY > 12); const h = document.documentElement; progress.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100).toFixed(2) + '%'; };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  toggle.addEventListener('click', () => { nav.classList.toggle('open'); document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : ''; });
  $$('.nav-links a').forEach(a => a.addEventListener('click', e => {
    nav.classList.remove('open'); document.body.style.overflow = '';
    const id = a.getAttribute('href'); if (!id.startsWith('#')) return;
    const sec = $(id); if (!sec) return; e.preventDefault();
    sec.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); cleanUrl();
    setTimeout(() => sectionFlourish(id), reduce ? 0 : 650);
  }));
  const logoLink = $('#logoLink'); if (logoLink) logoLink.addEventListener('click', e => { e.preventDefault(); scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); cleanUrl(); });
  document.addEventListener('click', e => { const a = e.target.closest('main a[href^="#"], footer a[href^="#"]'); if (!a) return; const sec = $(a.getAttribute('href')); if (!sec) return; e.preventDefault(); sec.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); cleanUrl(); });
  const sectionFlourish = id => {
    if (!G) return;
    if (id === '#results') { replayNumbers(); }
    if (id === '#cases') { G.fromTo('#bento .case', { scale: .97, opacity: .6 }, { scale: 1, opacity: 1, duration: .6, ease: 'power3.out', stagger: .05, clearProps: 'transform,opacity' }); }
    if (id === '#timeline') { G.fromTo('.station circle.node', { attr: { r: 9 } }, { attr: { r: 14 }, duration: .35, yoyo: true, repeat: 1, stagger: .12, ease: 'power2.inOut' }); }
    if (id === '#testimonials') { G.fromTo('#vgrid .vcard', { y: 16, opacity: .5 }, { y: 0, opacity: 1, duration: .6, stagger: .06, ease: 'power3.out', clearProps: 'all' }); }
    if (id === '#work') { G.fromTo('#shorts .short', { rotate: -2, scale: .96 }, { rotate: 0, scale: 1, duration: .5, stagger: .04, ease: 'back.out(1.6)', clearProps: 'transform' }); }
    if (id === '#team') { G.fromTo('#founders .fcard img', { filter: 'grayscale(1)' }, { filter: 'grayscale(0)', duration: .8, yoyo: true, repeat: 1 }); }
  };

  /* ---------------- reveal ---------------- */
  const revealAll = () => $$('.rv').forEach(el => el.classList.add('in'));
  if (reduce || !('IntersectionObserver' in window)) revealAll();
  else { const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); if (innerWidth <= 700 && x.target.classList.contains('case')) $$('#bento .case').forEach(c => { c.classList.add('in'); io.unobserve(c); }); if (x.target.classList.contains('playbook')) $$('[data-count]', x.target).forEach(countEl);  io.unobserve(x.target); } }), { threshold: .08, rootMargin: '0px 0px -6% 0px' }); $$('.rv').forEach(el => io.observe(el)); }

  /* ---------------- counters + bars ---------------- */
  const fmt = (n, dec) => { const s = n.toFixed(dec); const [a, b] = s.split('.'); return a.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (b ? '.' + b : ''); };
  const countEl = el => {
    const t = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
    if (reduce || !G) { el.textContent = pre + fmt(t, dec) + suf; return; }
    const o = { v: 0 }; G.to(o, { v: t, duration: 1.8, ease: 'power3.out', onUpdate: () => { el.textContent = pre + fmt(o.v, dec) + suf; } });
  };
  const growBars = tile => { const bars = $$('.bars i', tile); if (!G) { bars.forEach(b => b.style.transform = 'scaleY(1)'); return; } bars.forEach((b, i) => G.fromTo(b, { scaleY: .08 }, { scaleY: .35 + i * .16, duration: .9, delay: i * .08, ease: 'power3.out' })); };
  const replayNumbers = () => $$('.num').forEach(t => { $$('[data-count]', t).forEach(countEl); growBars(t); });
  if ('IntersectionObserver' in window) { const cio = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { $$('[data-count]', x.target).forEach(countEl); growBars(x.target); cio.unobserve(x.target); } }), { threshold: .5 }); $$('.num').forEach(t => cio.observe(t)); } else replayNumbers();

  /* money canvas (green dollars drifting up in the revenue tile) */
  const mc = $('#moneyCanvas');
  if (mc && !reduce) {
    const ctx = mc.getContext('2d'); let W, H, ps = []; const N = 26;
    const size = () => { const r = mc.getBoundingClientRect(); W = mc.width = r.width * devicePixelRatio; H = mc.height = r.height * devicePixelRatio; ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); };
    size(); addEventListener('resize', size);
    const mk = () => ({ x: Math.random() * (W / devicePixelRatio), y: (H / devicePixelRatio) + 20 + Math.random() * 80, s: 10 + Math.random() * 12, v: .25 + Math.random() * .6, a: Math.random() * 6.28, o: .25 + Math.random() * .5 });
    for (let i = 0; i < N; i++) { const p = mk(); p.y = Math.random() * (H / devicePixelRatio); ps.push(p); }
    let running = false;
    const draw = () => { if (!running) return; ctx.clearRect(0, 0, W, H); ps.forEach(p => { p.y -= p.v; p.a += .02; if (p.y < -20) Object.assign(p, mk()); ctx.globalAlpha = p.o; ctx.fillStyle = '#4ADE80'; ctx.font = `800 ${p.s}px "Bricolage Grotesque",sans-serif`; ctx.fillText('$', p.x + Math.sin(p.a) * 6, p.y); }); ctx.globalAlpha = 1; requestAnimationFrame(draw); };
    new IntersectionObserver(es => es.forEach(x => { running = x.isIntersecting; if (running) draw(); })).observe(mc);
  }

  /* ---------------- hero: chart + chips + lines ---------------- */
  const heroIntro = (afterIntro = false) => {
    $$('.hero .rv').forEach(el => el.classList.add('in'));
    const lineP = $('#lineP'), area = $('#areaP'), dot = $('#dotP');
    if (!lineP) return;
    const len = lineP.getTotalLength(); lineP.style.strokeDasharray = len; lineP.style.strokeDashoffset = afterIntro ? 0 : len;
    if (G && !reduce) {
      if (afterIntro) { G.set(area, { opacity: 1 }); G.set(dot, { scale: 1, transformOrigin: 'center' }); }
      else { G.to(lineP, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut', delay: .1 }); G.fromTo(area, { opacity: 0 }, { opacity: 1, duration: .9, delay: .8 }); G.fromTo(dot, { scale: 0, transformOrigin: 'center' }, { scale: 1, duration: .45, delay: 1.5, ease: 'back.out(3)' }); }
      if (!afterIntro) G.to('.fchip', { opacity: 1, y: 0, scale: 1, duration: .8, ease: 'elastic.out(1,.6)', stagger: .12, delay: .6 });
      G.to('.board', { y: -6, duration: 3.2, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: afterIntro ? 1.3 : 0 });
      $$('.fchip').forEach((c, i) => G.to(c, { y: i % 2 ? 8 : -8, duration: 2.6 + i * .4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 2 + i * .2 }));
      $$('.kpi .k[data-count]').forEach(countEl);
    } else { lineP.style.strokeDashoffset = 0; $$('.fchip').forEach(c => { c.style.opacity = 1; c.style.transform = 'none'; }); $$('.kpi .k[data-count]').forEach(countEl); }
  };
  const chart = $('#chart');
  if (chart) {
    const vals = [8, 11, 10, 14, 19, 17, 24, 31, 29, 40, 52, 66, 82];
    const W = 520, H = 200, pad = 14; const n = vals.length - 1, mx = 90;
    const pts = vals.map((v, i) => [pad + i / n * (W - pad * 2), H - pad - v / mx * (H - pad * 2)]);
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; const cx = (x0 + x1) / 2; d += ` C${cx},${y0} ${cx},${y1} ${x1},${y1}`; }
    $('#lineP').setAttribute('d', d); $('#areaP').setAttribute('d', `${d} L${pts[n][0]},${H - pad} L${pts[0][0]},${H - pad} Z`);
    const [lx, ly] = pts[n]; $('#dotP').setAttribute('cx', lx); $('#dotP').setAttribute('cy', ly);
    const ilp = $('#ilPath'); if (ilp) { ilp.setAttribute('d', d); const ild = $('#ilDot'); if (ild) { ild.setAttribute('cx', lx); ild.setAttribute('cy', ly); } }
  }

  /* ---------------- opening: the proof, scattered, then swept up into place ---------------- */
  const intro = $('#intro'), cloud = $('#introCloud');
  const buildIntro = () => {
    let seed = 11; const r = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    const items = [];
    D.marquee.slice(0, 12).forEach(s => { const c = client(s); if (c) items.push(`<div class="ichip">${avatar(s)}<span>${esc(c.short)}</span></div>`); });
    D.wins.slice(0, 6).forEach(([k]) => items.push(`<div class="ichip metric ${k.startsWith('$') || /lead/.test(k) ? 'money' : ''}"><div><b>${esc(k)}</b></div></div>`));
    D.cases.filter(k => !['sold-by-seller', 'truthseekah', 'crypto-giant', 'dudley'].includes(k.slug)).slice(0, 7).forEach(k => items.push(`<div class="ichip metric ${k.theme === 'money' ? 'money' : ''}"><div><b>${esc(k.big)}</b><span>${esc(k.unit)}</span></div></div>`));
    D.quotes.filter(q => q.star).slice(0, 6).forEach(q => items.push(`<div class="ichip quote">${esc(q.q.split(' ').slice(0, 7).join(' '))}…</div>`));
    [['YouTube', '#FF0000'], ['Instagram', '#E1306C'], ['TikTok', '#0F0F0F'], ['LinkedIn', '#0A66C2'], ['Facebook', '#1877F2']].forEach(([n, c]) => items.push(`<div class="ichip plat"><i style="--pc:${c}"></i>${n}</div>`));
    for (let i = 0; i < 4; i++) items.push('<div class="ichip coin">$</div>');
    items.push('<div class="ichip stars">★★★★★</div>', '<div class="ichip metric"><div><b>11M+</b><span>views on client channels</span></div></div>', '<div class="ichip metric"><div><b>3,000+</b><span>videos delivered</span></div></div>', '<div class="ichip metric"><div><b>100+</b><span>creators &amp; brands</span></div></div>');
    cloud.innerHTML = items.map(h => h.replace('class="ichip', `style="left:${(5 + r() * 90).toFixed(1)}%;top:${(6 + r() * 86).toFixed(1)}%;transform:translate(-50%,-50%) rotate(${(r() * 24 - 12).toFixed(1)}deg) scale(${(.84 + r() * .26).toFixed(2)})" class="ichip`)).join('');
    /* the hero's own stat cards start scattered too: identical clones, so they land as themselves */
    $$('.fchip[data-fly]').forEach(t => { const cl = t.cloneNode(true); cl.className = 'fchip fly'; cl.dataset.fly = t.dataset.fly; cl.style.cssText = `left:${(8 + r() * 84).toFixed(1)}%;top:${(8 + r() * 80).toFixed(1)}%;transform:translate(-50%,-50%) rotate(${(r() * 20 - 10).toFixed(1)}deg)`; cloud.appendChild(cl); });
    if (G) G.to($$('.ichip, .fchip.fly', cloud), { y: '+=7', duration: 1.3, yoyo: true, repeat: -1, ease: 'sine.inOut', force3D: true, stagger: { each: .015, from: 'random' } });
  };
  const runIntro = () => {
    $$('.hero .rv').forEach(el => el.classList.add('now', 'in')); void document.body.offsetWidth;
    const rest = $$('.ichip', cloud); const flyers = $$('.fchip.fly', cloud);
    G.killTweensOf([...rest, ...flyers]);
    const vh = innerHeight;
    const tl = G.timeline({ onComplete: () => { intro.remove(); $$('.hero .rv.now').forEach(el => el.classList.remove('now')); $('.hero').classList.add('rdy'); } });
    const ang = Math.atan2((12 - 57) / 100 * innerHeight, (78 - 64) / 100 * innerWidth) * 180 / Math.PI; G.set('.intro-head', { rotation: ang, scale: 0, transformOrigin: '28% 50%' });
    tl.to('.intro-arrow .ia', { strokeDashoffset: 0, duration: .7, ease: 'power2.inOut' }, 0)
      .to('.intro-head', { opacity: 1, scale: 1, rotation: ang, duration: .18, ease: 'back.out(3)' }, .62);
    tl.to(rest, { y: (i, el) => -(vh * .85 + (i % 5) * 70), x: (i, el) => (50 - parseFloat(el.style.left)) * 2.4, rotation: i => (i % 2 ? 6 : -6), opacity: 0, duration: .75, ease: 'power3.inOut', stagger: { each: .005, from: 'random' } }, .15);
    flyers.forEach((el, i) => {
      const t = $(`.board .fchip[data-fly="${el.dataset.fly}"]`);
      if (!t || !t.offsetParent) { tl.to(el, { y: -vh, opacity: 0, duration: .7, ease: 'power3.inOut' }, .2); return; }
      G.set(t, { y: 0, scale: 1, opacity: 0 });
      const a = el.getBoundingClientRect(), b = t.getBoundingClientRect();
      const dx = (b.left + b.width / 2) - (a.left + a.width / 2), dy = (b.top + b.height / 2) - (a.top + a.height / 2);
      tl.to(el, { x: '+=' + dx, y: '+=' + dy, rotation: 0, duration: .8, ease: 'power3.inOut', onComplete: () => { G.set(t, { opacity: 1 }); el.style.opacity = 0; } }, .22 + i * .04);
    });
    tl.to('.intro-bg', { opacity: 0, duration: .3, ease: 'power2.out' }, innerWidth < 700 ? .6 : .45)
      .add(() => heroIntro(true), .42)
      .to('.intro-arrow, .intro-head', { opacity: 0, duration: .35, ease: 'power2.out' }, 1.05);
  };
  if (intro && cloud && G && !reduce) {
    buildIntro();
    let started = false; const start = () => { if (started) return; started = true; runIntro(); };
    const fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    Promise.race([fontsReady, new Promise(r => setTimeout(r, 650))]).then(() => setTimeout(start, 120));
    setTimeout(start, 1100);
    setTimeout(() => { const el = $('#intro'); if (el) { el.remove(); $$('.hero .rv').forEach(x => { x.classList.add('in'); x.classList.remove('now'); }); } $('.hero').classList.add('rdy'); }, 3200);
  } else { if (intro) intro.remove(); $('.hero').classList.add('rdy'); if (document.readyState === 'complete') heroIntro(); else addEventListener('load', () => heroIntro()); }
  addEventListener('load', () => { if (ST) setTimeout(() => ST.refresh(), 200); });
  [...document.images].forEach(i => { i.decoding = 'async'; });
  /* nudge: if someone sits at the top for a while, hint that the story is below; never shown twice */
  { const toast = $('#toast'); let shown = false, hideT; const say = (t, ms = 5000) => { if (!toast) return; toast.lastElementChild.textContent = t; toast.classList.add('on'); clearTimeout(hideT); hideT = setTimeout(() => toast.classList.remove('on'), ms); };
    const idle = setTimeout(() => { if (!shown && scrollY < 80 && !document.hidden) { shown = true; say('Scroll to see the climb ↓'); } }, 9000);
    addEventListener('scroll', () => { if (scrollY > 80) { clearTimeout(idle); if (toast && toast.classList.contains('on')) toast.classList.remove('on'); } }, { passive: true });
    const tt = $('#toTop'); if (tt) { addEventListener('scroll', () => tt.classList.toggle('on', scrollY > innerHeight * 1.5), { passive: true }); tt.addEventListener('click', e => { e.preventDefault(); scrollTo({ top: 0, behavior: 'smooth' }); cleanUrl(); }); } }
  { const mf = $$('.case .money-fx'); if (mf.length) { const mio = new IntersectionObserver(es => es.forEach(x => x.target.classList.toggle('vis', x.isIntersecting)), { threshold: .05 }); mf.forEach(m => mio.observe(m.closest('.case'))); } }
  { const wk = $('.week'); if (wk) new IntersectionObserver(es => es.forEach(x => wk.classList.toggle('run', x.isIntersecting)), { threshold: .1 }).observe(wk); }
  $$('.fcard').forEach(f => f.addEventListener('click', e => { if (!e.target.closest('a')) f.classList.toggle('hov'); }));
  /* copy guard: images, right-click, copy/cut, drag, save/view-source/print shortcuts */
  document.addEventListener('contextmenu', e => { if (!e.target.closest('input, textarea')) e.preventDefault(); });
  document.addEventListener('dragstart', e => { if (!e.target.closest('input, textarea')) e.preventDefault(); });
  ['copy', 'cut'].forEach(ev => document.addEventListener(ev, e => { if (!e.target.closest('input, textarea')) { e.preventDefault(); if (e.clipboardData) e.clipboardData.setData('text/plain', '© Pinnakle Media · pinnaklemedia.com'); } }));
  document.addEventListener('keydown', e => { const k = e.key.toLowerCase(); if ((e.metaKey || e.ctrlKey) && ['s', 'u', 'p', 'a', 'c', 'x'].includes(k) && !e.target.closest('input, textarea')) e.preventDefault(); if (k === 'f12' || ((e.metaKey || e.ctrlKey) && e.shiftKey && ['i', 'j', 'c'].includes(k))) e.preventDefault(); });

  /* ---------------- scroll-driven bits ---------------- */
  if (G && ST && !reduce) {
    G.to('.hero-bg .r1', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    G.to('.hero-bg .r2', { yPercent: 24, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    G.to('.hero-bg .glow', { yPercent: 30, scale: 1.15, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    /* per-case charts draw when in view */
    $$('.viz svg').forEach(svg => {
      const tl = G.timeline({ scrollTrigger: { trigger: svg, start: 'top 92%', once: true } });
      const bars = $$('.bar', svg), lines = $$('.ln', svg), dots = $$('.dot, .sc, .cell', svg), areas = $$('.ar', svg), pills = $$('.pill.hi', svg);
      if (bars.length) tl.to(bars, { scaleY: 1, duration: .7, ease: 'power3.out', stagger: .05 }, 0);
      lines.forEach(p => { const len = p.getTotalLength(); G.set(p, { strokeDasharray: len, strokeDashoffset: len }); tl.to(p, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.out' }, 0); });
      if (areas.length) tl.fromTo(areas, { opacity: 0 }, { opacity: 1, duration: .8 }, .4);
      if (dots.length) tl.to(dots, { scale: 1, duration: .5, ease: 'back.out(2.5)', stagger: .04 }, .3);
      if (pills.length) tl.fromTo(pills, { opacity: 0, scaleY: .3, transformOrigin: 'bottom' }, { opacity: 1, scaleY: 1, duration: .6, ease: 'power3.out', stagger: .08 }, 0);
    });
    const pf = $('#pipeFill'); if (pf) G.to(pf, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', scrollTrigger: { trigger: '.pipe', start: 'top 80%', once: true } });
    G.fromTo('.pstep', { x: 90, opacity: 0 }, { x: 0, opacity: 1, duration: .9, ease: 'power3.out', stagger: .14, scrollTrigger: { trigger: '.pipe', start: 'top 82%', once: true } });
    G.fromTo('.week', { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: '.week', start: 'top 88%', once: true } });
    G.fromTo('.pb-side', { x: 80, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.playbook', start: 'top 80%', once: true } });
    const pipe = $('.pipe'); if (pipe) { const dot = document.createElement('i'); dot.className = 'pipe-dot'; pipe.appendChild(dot); const steps = $$('.pstep'); G.fromTo(dot, { left: '4%' }, { left: '96%', ease: 'none', scrollTrigger: { trigger: pipe, start: 'top 85%', end: 'bottom 25%', scrub: .4, onUpdate: st => { const k = Math.min(steps.length - 1, Math.floor(st.progress * steps.length)); steps.forEach((s, i) => s.classList.toggle('lit', i === k)); } } }); }
    if (pbEl && D.playbooks) {
      if (innerWidth > 860) {
        const fit = () => { pbEl.classList.remove('compact', 'tight'); if (innerHeight < 960) pbEl.classList.add('compact'); if (innerHeight < 740) pbEl.classList.add('tight'); ST.refresh(); $$('.pb-dial .dl').forEach((x, k) => { if (x.classList.contains('on')) { const cur = $('.dl-cursor'); if (cur) G.set(cur, { y: k * (pbEl.classList.contains('compact') ? 42 : 50) }); } }); };
        setTimeout(fit, 80); addEventListener('load', () => setTimeout(fit, 300)); addEventListener('resize', fit);
        ST.create({ trigger: pbEl, start: 'top 76px', end: '+=' + (D.playbooks.length * 330), pin: true, pinSpacing: true, anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: -1, onUpdate: st => { const k = Math.min(D.playbooks.length - 1, Math.floor(st.progress * D.playbooks.length)); setPlaybook(k); }, onToggle: st => document.body.classList.toggle('themed', st.isActive) });
      } else {
        let k = 0; setInterval(() => { if (pbManual || document.hidden) return; const r = pbEl.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return; k = (k + 1) % D.playbooks.length; setPlaybook(k); }, 5200);
        ST.create({ trigger: pbEl, start: 'top 70%', end: 'bottom 30%', onToggle: st => document.body.classList.toggle('themed', st.isActive) });
      }
    }
  } else { $$('.viz .bar, .viz .dot, .viz .sc, .viz .cell').forEach(e => e.style.transform = 'none'); }

  /* mobile: nudge the case strip once so the swipe is obvious */
  if (G && !fine && bento && 'IntersectionObserver' in window) new IntersectionObserver((es, o) => es.forEach(x => { if (x.isIntersecting) { G.fromTo(bento, { scrollLeft: 0 }, { scrollLeft: 56, duration: .55, delay: .5, yoyo: true, repeat: 1, ease: 'power2.inOut' }); o.disconnect(); } }), { threshold: .4 }).observe(bento);
  /* case tilt (fine pointers only) */
  if (fine && !reduce) $$('.case').forEach(card => {
    card.addEventListener('mousemove', e => { const r = card.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; card.style.transform = `perspective(900px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateY(-4px)`; });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
  /* magnetic buttons */
  if (fine && !reduce && G) $$('.btn-primary, .btn-brand').forEach(b => {
    b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(); G.to(b, { x: (e.clientX - r.left - r.width / 2) * .18, y: (e.clientY - r.top - r.height / 2) * .3, duration: .4, ease: 'power3.out' }); });
    b.addEventListener('mouseleave', () => G.to(b, { x: 0, y: 0, duration: .6, ease: 'elastic.out(1,.5)' }));
  });

  /* ---------------- the ascent (scroll-driven, pinned once fully in view) ---------------- */
  const setStage = () => {
    if (!stage) return; const wrapW = stage.parentElement.clientWidth; const head = $('#ascentPin .ascent-head'); const headH = head ? head.offsetHeight : 120;
    const maxH = Math.max(340, innerHeight - 72 - headH - 70);
    let h = wrapW * 520 / 1200, w = wrapW; if (h > maxH) { h = maxH; w = h * 1200 / 520; }
    stage.style.width = Math.round(w) + 'px'; stage.style.height = Math.round(h) + 'px';
  };
  setStage(); addEventListener('resize', setStage);
  const stationT = [0.02, 0.26, 0.5, 0.74, 0.98];
  const smooth = x => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const START = { y: 2022, m: 10 }, TOTAL = 46; /* Nov 2022 → Sep 2026 */
  let lastOdo = -1;
  const setOdo = (p, mEl, yEl, stripEl) => { const k = Math.round(clamp(p, 0, 1) * TOTAL); if (k === lastOdo) return; lastOdo = k; const mi = (START.m + k) % 12, yy = START.y + Math.floor((START.m + k) / 12); if (mEl) { mEl.textContent = MONTHS[mi]; mEl.classList.remove('tick'); void mEl.offsetWidth; mEl.classList.add('tick'); } if (yEl && yEl.textContent !== String(yy)) { yEl.textContent = yy; yEl.classList.remove('tick'); void yEl.offsetWidth; yEl.classList.add('tick'); } if (stripEl) stripEl.innerHTML = `<tspan>${MONTHS[mi]}</tspan> ${yy}`; };
  const head = $('#ascentPin .ascent-head'), hlEl = $('#ascentHl');
  const scenes = $$('#ascentPin .scene');
  const setProgress = p => {
    if (scenes.length) { let si = 0; stationT.forEach((t, i) => { if (p >= t - .02) si = i; }); scenes.forEach((sc, i) => sc.classList.toggle('on', i === si)); $('#ascentPin').classList.toggle('night', si === 4); }
    setOdo(p, $('#odoM'), $('#odoY'), null);
    if (head && hlEl) { let yi = 0; stationT.forEach((t, i) => { if (p >= t - .02) yi = i; }); const hl = D.timeline[yi].hl || D.timeline[yi].title; if (hlEl.dataset.hl !== hl) { hlEl.dataset.hl = hl; hlEl.innerHTML = [...hl].map((ch, k) => ch === ' ' ? ' ' : `<span class="ch" style="--i:${k}">${esc(ch)}</span>`).join(''); } head.classList.toggle('live', p > .03); }
    $$('.station').forEach((s, i) => s.classList.toggle('on', p >= stationT[i] - .02));
    $$('.yearcard').forEach((c, i) => c.classList.toggle('on', p >= stationT[i] - .02 && (i === 4 || p < stationT[i + 1] - .02)));
    const done = $('#cableDone'); if (done) { const len = done.getTotalLength(); done.style.strokeDasharray = len; done.style.strokeDashoffset = len * (1 - p); }
    $$('.vslot').forEach((v, j) => {
      const fin = j === 0 ? 1 : smooth((p - (stationT[j] - .07)) / .06), fout = j === 4 ? 1 : 1 - smooth((p - (stationT[j + 1] - .07)) / .06);
      const o = fin * fout; if (G) G.set(v, { opacity: o, scale: .8 + .2 * o, y: (1 - o) * 10, transformOrigin: '50% 100%' }); else v.style.opacity = o;
    });
  };
  if (stage && svgA && G && ST && MP && !reduce && innerWidth > 1100) {
    G.set('#gondola', { transformOrigin: '50% 100%' });
    const tl = G.timeline({ scrollTrigger: { trigger: '#ascentPin', start: 'top 72px', end: '+=1300', pin: true, pinSpacing: true, anticipatePin: 1, scrub: .5, invalidateOnRefresh: true, onUpdate: s => setProgress(s.progress) } });
    tl.to('#gondola', { motionPath: { path: '#cableDone', align: '#cableDone', alignOrigin: [0.5, 1], autoRotate: true }, ease: 'none', duration: 1 }, 0);
    tl.to('#gondola .wheel', { rotation: 1080, transformOrigin: '50% 50%', ease: 'none', duration: 1 }, 0);
    G.to('#gondola .flame', { scaleX: .55, duration: .11, yoyo: true, repeat: -1, transformOrigin: '100% 50%', ease: 'sine.inOut' });
    setProgress(0);
  } else if (stage && svgA) {
    setProgress(1); const g = $('#gondola'); if (g) g.setAttribute('transform', 'translate(1100,140)');
  }
  /* mobile ascent: the same ride, on a strip that stays pinned at the top while the year cards scroll */
  if (mob && stripSvg) {
    const cards = $$('.mstop', mob), done = $('#stripDone'), gm = $('#gondolaM'); const len = done.getTotalLength(); done.style.strokeDasharray = len;
    const sT = [0, .25, .5, .75, 1];
    const upd = () => {
      const line = innerHeight * .5; let f = 0;
      cards.forEach((c, i) => { const r = c.getBoundingClientRect(); const on = r.top < line; c.classList.toggle('on', on); if (on) f = i + clamp((line - r.top) / (r.height + 14), 0, 1) * .999; });
      const p = clamp(f / (cards.length - 1), 0, 1);
      setOdo(p, null, null, $('#odoStrip'));
      { let yi = 0; sT.forEach((t, i) => { if (p >= t - .02) yi = i; }); const sh = $('#stripHl'), sl = $('#stripLbl'); const hl = D.timeline[yi].hl || D.timeline[yi].title; if (sh && sh.dataset.hl !== hl) { sh.dataset.hl = hl; sh.innerHTML = [...hl].map((ch, k) => ch === ' ' ? ' ' : `<span class="ch" style="--i:${k}">${esc(ch)}</span>`).join(''); if (sl) sl.textContent = `${D.timeline[yi].year} · ${D.timeline[yi].label}`; } const strip = $('#ascentStrip'); if (strip && strip.dataset.scene !== String(yi)) strip.dataset.scene = yi; }
      done.style.strokeDashoffset = len * (1 - p);
      const pt = done.getPointAtLength(p * len), pt2 = done.getPointAtLength(Math.min(len, p * len + 4));
      const ang = Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180 / Math.PI;
      gm.setAttribute('transform', `translate(${pt.x.toFixed(1)},${pt.y.toFixed(1)}) rotate(${ang.toFixed(1)})`);
      $$('.sst', stripSvg).forEach((s, i) => s.classList.toggle('on', p >= sT[i] - .02));
      $$('.vslot', gm).forEach((v, j) => { const fin = j === 0 ? 1 : smooth((p - (sT[j] - .09)) / .07), fout = j === 4 ? 1 : 1 - smooth((p - (sT[j + 1] - .09)) / .07); const o = fin * fout; v.style.opacity = o; v.style.transform = `translateY(${(1 - o) * 8}px) scale(${(.8 + .2 * o).toFixed(3)})`; v.style.transformOrigin = '40px 44px'; });
      $$('.wheel', gm).forEach(w => { w.style.transformBox = 'fill-box'; w.style.transformOrigin = 'center'; w.style.transform = `rotate(${Math.round(p * 1080)}deg)`; });
    };
    addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
  }
  /* station click → jump card */
  $$('.station').forEach(s => s.addEventListener('click', () => openYear(+s.dataset.i)));

  /* active nav */
  if ('IntersectionObserver' in window) {
    const links = $$('.nav-links a[href^="#"]');
    const so = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + x.target.id)); }), { rootMargin: '-40% 0px -55% 0px' });
    $$('main section[id]').forEach(s => so.observe(s));
  }
  const y = $('[data-year]'); if (y) y.textContent = new Date().getFullYear();
})();
