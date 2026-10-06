/* PinnakleFlow v4 — behaviour, the eight product screens and the scroll story. */
(() => {
  const D = window.PF, $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const G = window.gsap, ST = window.ScrollTrigger; if (G && ST) G.registerPlugin(ST);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, mobile = () => innerWidth <= 860;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  history.scrollRestoration = 'manual';
  const cleanUrl = () => { if (location.hash) history.replaceState(null, '', location.pathname + location.search); };
  cleanUrl(); scrollTo(0, 0);
  $$('[data-year]').forEach(e => e.textContent = new Date().getFullYear());
  const P = D.people, srcColor = n => (D.channels.find(c => c[0] === n) || ['', '#0F8A5F'])[1];
  const stars = n => '★'.repeat(n) + '☆'.repeat(5 - n);
  const onceVisible = (el, fn, th = .3) => { if (!el) return; new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { o.disconnect(); fn(); } }, { threshold: th }).observe(el); };
  const countEl = el => { const t = +el.dataset.count, pre = el.dataset.prefix || '', suf = el.dataset.suffix || ''; if (!G || reduce) { el.textContent = pre + t.toLocaleString() + suf; return; } const o = { v: 0 }; G.to(o, { v: t, duration: 1.3, ease: 'power2.out', onUpdate: () => { el.textContent = pre + Math.round(o.v).toLocaleString() + suf; } }); };

  /* ---------- product screens ---------- */
  const SIDE = [['inbox', '💬'], ['pipeline', '📋'], ['calendar', '📅'], ['workflow', '⚡'], ['pay', '💳'], ['dash', '📈'], ['rep', '⭐'], ['sites', '🧩']];
  const tags = p => `<span class="tg">${(p.tags || []).map(t => `<i>${esc(t)}</i>`).join('')}</span>`;
  const inboxScreen = () => `<div class="screen" data-k="inbox"><div class="app-top"><b>💬 Conversations</b><span class="pill live">Live · 7 open</span></div><div class="inbox"><div class="ib-list">${P.map((p, i) => `<div class="ib-row ${i === 0 ? 'on' : ''}" data-i="${i}"><img src="${p.ph}" alt="" loading="lazy"><div><b>${esc(p.n)}</b><span><i class="src" style="background:${srcColor(p.src)}"></i>${esc(p.last)}</span></div><em>${p.t}</em></div>`).join('')}</div><div class="ib-thread" data-th></div></div></div>`;
  const inboxThread = i => { const p = P[i]; const T = [
    [['them', 'Hi, I saw your reel about the whitening offer. Is that still on?'], ['us', `Hi ${p.n.split(' ')[0]}! Yes, through the end of the month. Want me to hold a slot for you?`], ['them', 'Tuesday morning if you have it'], ['us', 'Tuesday 10:30 is open. Confirm here: pinnk.le/b/2kx'], ['them', p.last], ['ai', 'Suggested reply: “Perfect, you are booked. A reminder lands the day before.”']],
    [['them', '📵 Missed call from Marcus, 3 min ago'], ['us', 'Sorry we missed you, Marcus. This is Tampa Roofing. Want an estimate on the roof or a call back?'], ['them', 'Estimate. House is in Tampa, Westchase'], ['us', 'Luis can come Thursday or Friday. Which suits?'], ['them', p.last], ['ai', 'Suggested reply: “Friday 2 pm it is. Luis will text when he is 20 minutes away.”']],
    [['them', 'Just finished the masterclass replay. How do I apply?'], ['us', 'Great to hear, Dana. The application is two minutes: pinnk.le/apply'], ['them', p.last], ['ai', 'Suggested reply: “Got it. Pick a fit-call slot here: pinnk.le/fit”']],
  ][i % 3]; return `<div class="who"><img src="${p.ph}" alt=""><div><b>${esc(p.n)}</b><span>${esc(p.src)} · ${esc(p.co)} · ${esc(p.v)}</span></div>${tags(p)}</div>${T.map(([c, t]) => `<div class="bub ${c}">${c === 'ai' ? '<b>Assistant</b>' : ''}${esc(t)}</div>`).join('')}<div class="ib-compose">Type a reply, or tap the suggestion…<b>Send</b></div>`; };
  const pipeScreen = () => { const cols = [['🆕', 'New'], ['💬', 'Contacted'], ['📅', 'Booked'], ['📄', 'Estimate sent'], ['✅', 'Won']]; const by = { New: [4], Contacted: [1], Booked: [0, 5], 'Estimate sent': [3, 2], Won: [6] }; const num = v => +v.replace(/[$,]/g, '');
    return `<div class="screen" data-k="pipeline"><div class="app-top"><b>📋 Pipeline · Sales</b><span class="pill">$49,240 open · 7 deals</span></div><div class="pipe">${cols.map(([e, c]) => `<div class="col" data-col="${c}"><h5><span style="color:var(--ink-2);font-size:12px">${e} ${c}</span><span>${by[c].length}</span></h5><div class="tot">$${by[c].reduce((a, i) => a + num(P[i].v), 0).toLocaleString()}</div>${by[c].map(i => `<div class="card" data-i="${i}" style="--sc:${srcColor(P[i].src)}"><b>${esc(P[i].co)}</b><span>${esc(P[i].n)} · ${esc(P[i].src)}</span>${tags(P[i])}<div class="av"><img src="${P[i].ph}" alt="" loading="lazy"><em>${P[i].v}</em><small>${P[i].t}</small></div></div>`).join('')}</div>`).join('')}</div></div>`; };
  const calScreen = () => { const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']; let cells = ''; for (let d = 1; d <= 28; d++) cells += `<div class="c ${[3, 7, 9, 14, 16, 21, 23].includes(d) ? 'has' : ''} ${d === 14 ? 'today' : ''}">${d}</div>`;
    return `<div class="screen" data-k="calendar"><div class="app-top"><b>📅 Calendars · Consult (round robin)</b><span class="pill">🎥 Zoom attached · reminders 24 h + 2 h</span></div><div class="cal"><div class="cal-grid">${days.map(d => `<div class="d">${d}</div>`).join('')}${cells}</div><div class="cal-side"><h6>Tue 14 · Dr. Maya</h6>${['9:00', '9:30', '10:30', '11:00', '2:00', '3:30'].map((t, i) => `<div class="slot ${i === 2 ? 'booked' : ''}" data-i="${i}"><b>${t}</b><span>${i === 2 ? '🦷 Priya N.' : 'Open'}</span></div>`).join('')}</div></div></div>`; };
  const wfScreen = () => `<div class="screen" data-k="workflow"><div class="app-top"><b>⚡ Workflows · Missed-call text back</b><span class="pill live">Published</span></div><div class="wf"><div class="wf-stat"><b>1,284</b>runs · 30 days</div><div class="wf-col">
    <div class="node-w trig"><i>📵</i><div><b>Trigger: call status</b><span>Missed, no voicemail</span></div></div><div class="wf-link"><i></i></div>
    <div class="node-w wait"><i>⏱️</i><div><b>Wait 60 seconds</b><span>unless they called back</span></div></div><div class="wf-link"><i></i></div>
    <div class="node-w"><i>💬</i><div><b>Send SMS</b><span>“Sorry we missed you…”</span></div></div><div class="wf-link"><i></i></div>
    <div class="node-w cond"><i>🔀</i><div><b>If / else</b><span>Replied within 10 min?</span></div></div><div class="wf-link"><i></i></div>
    <div class="wf-branch"><div class="node-w"><i>📅</i><div><b>Yes → booking link</b><span>Consult calendar</span></div></div><div class="node-w"><i>🙋</i><div><b>No → task for front desk</b><span>Call back today</span></div></div></div>
  </div></div></div>`;
  const payScreen = () => `<div class="screen" data-k="pay"><div class="app-top"><b>💳 Payments</b><span class="pill">Stripe connected · your account</span></div><div class="payv"><div class="inv-list">
    ${[[6, 'INV-0231 · HVAC tune-up', '$640', 'paid', '✅ Paid'], [3, 'EST-0098 · Kitchen remodel', '$23,000', 'sent', '📄 Estimate viewed'], [0, 'INV-0232 · Whitening consult', '$1,200', 'due', '⏳ Due Tue'], [2, 'LINK · Career cohort deposit', '$497', 'paid', '✅ Paid'], [5, 'PROP-0044 · Listing agreement', '—', 'sent', '✍️ Awaiting e-sign']].map(([i, t, v, c, l]) => `<div class="inv"><img src="${P[i].ph}" alt="" loading="lazy"><div><b>${esc(t)}</b><span>${esc(P[i].n)}</span></div><em>${v}</em><span class="ps ${c}">${l}</span></div>`).join('')}
  </div><div class="pay-side"><div class="pay-k"><span>Collected this month</span><b data-count="18640" data-prefix="$">$0</b></div><div class="pay-k"><span>Outstanding</span><b>$24,200</b></div><div class="pay-link"><b>🔗 Payment link · Deposit</b>Sent by text the moment a card moves to “Estimate accepted”.<code>pay.pinnakleflow.com/glow/deposit</code></div></div></div></div>`;
  const dashScreen = () => `<div class="screen" data-k="dash"><div class="app-top"><b>📈 Dashboard · This week</b><span class="pill">📬 Sent every Friday</span></div><div class="dash">
    <div class="kpi"><span>Pipeline value</span><b data-count="49240" data-prefix="$">$0</b><em>↑ 12% vs last week</em></div><div class="kpi"><span>Calls booked</span><b data-count="23">0</b><em>↑ 6</em></div><div class="kpi"><span>Show rate</span><b data-count="84" data-suffix="%">0%</b><em>↑ 9 pts</em></div><div class="kpi"><span>New reviews</span><b data-count="11">0</b><em>4.9 ★ avg</em></div>
    <div class="chart"><svg viewBox="0 0 400 140" preserveAspectRatio="none"><defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2EC48A" stop-opacity=".35"/><stop offset="1" stop-color="#2EC48A" stop-opacity="0"/></linearGradient></defs><path class="area" d="M0,120 C40,110 60,95 100,90 S160,80 200,62 S260,50 300,38 S360,22 400,14 L400,140 L0,140Z"/><path class="ln" d="M0,120 C40,110 60,95 100,90 S160,80 200,62 S260,50 300,38 S360,22 400,14"/></svg></div>
    <div class="src-list"><div>Instagram DMs<span>38%</span><i style="--w:38%;--c:#E1306C"></i></div><div>Missed calls<span>24%</span><i style="--w:24%;--c:#D97706"></i></div><div>Web form<span>19%</span><i style="--w:19%;--c:#6E56CF"></i></div><div>Google Business<span>12%</span><i style="--w:12%;--c:#4285F4"></i></div><div>Referral<span>7%</span><i style="--w:7%"></i></div></div></div></div>`;
  const repScreen = () => `<div class="screen" data-k="rep"><div class="app-top"><b>⭐ Reputation</b><span class="pill">Google + Facebook</span></div><div class="rep"><div class="rep-score"><b>4.9</b><div class="stars">★★★★★</div><span>212 reviews · 11 this week · 94% from text requests</span></div><div class="rep-list">
    <div class="rv-item"><b>Priya N.</b> <span class="stars">★★★★★</span><div>Booked by text at 9 pm, seen Tuesday. Painless.</div><div class="ai">✍️ Drafted reply: “Thank you, Priya. 9 pm texts are exactly why we set it up.”</div></div>
    <div class="rv-item"><b>Tom B.</b> <span class="stars">★★★★★</span><div>Quick quote, quicker fix.</div><div class="ai">✍️ Drafted reply: “Appreciate it, Tom. See you at the spring tune-up.”</div></div>
    <div class="rv-item"><b>Aisha R.</b> <span class="stars">★★★★☆</span><div>Great valuation call, slightly late.</div><div class="ai">🙋 Flagged for a human reply.</div></div></div></div></div>`;
  const sitesScreen = () => `<div class="screen" data-k="sites"><div class="app-top"><b>🧩 Pages &amp; funnels</b><span class="pill">4 live · every form → inbox</span></div><div class="sites"><div class="site-list"><div class="on">Book a consult<em>1,204 views</em></div><div>Whitening offer<em>618</em></div><div>New-patient form<em>402</em></div><div>Masterclass replay<em>95</em></div></div>
  <div class="site-prev"><div class="sb"><i></i><i></i><i></i></div><div class="pg"><h4>Book your whitening consult</h4><p>Pick a time with Dr. Maya. Reminders by text. Reschedule in one tap.</p><div class="fld">Your name</div><div class="fld">Mobile number</div><div class="fbtn">See available times →</div><div class="stat">📊 38% of visitors book · source tracked to the ad, post or search that sent them</div></div></div></div></div>`;
  const appShell = (id, active) => `<div class="app" id="${id}"><div class="app-bar"><i></i><i></i><i></i><div class="url"><b>app.</b>pinnakleflow.com/${active}</div></div><div class="app-body"><div class="app-side"><img src="assets/brand/icon-dark-square.svg" alt="">${SIDE.map(([k, e]) => `<i data-k="${k}" title="${k}">${e}</i>`).join('')}</div><div class="app-main">${inboxScreen()}${pipeScreen()}${calScreen()}${wfScreen()}${payScreen()}${dashScreen()}${repScreen()}${sitesScreen()}</div></div></div>`;
  const showScreen = (app, k) => { $$('.screen', app).forEach(s => s.classList.toggle('on', s.dataset.k === k)); $$('.app-side i', app).forEach(i => i.classList.toggle('on', i.dataset.k === k)); $('.url', app).innerHTML = `<b>app.</b>pinnakleflow.com/${k}`;
    const s = $(`.screen[data-k="${k}"]`, app); if (!s || s.dataset.played) return; s.dataset.played = 1;
    if (k === 'inbox') { const th = $('[data-th]', s); if (th && !th.innerHTML) th.innerHTML = inboxThread(0); }
    if (k === 'dash' || k === 'pay') $$('[data-count]', s).forEach(countEl);
    if (k === 'workflow' && G && !reduce) { const links = $$('.wf-link i', s), nodes = $$('.node-w', s); const tl = G.timeline({ repeat: -1, repeatDelay: 1.2 }); nodes.forEach((n, i) => { tl.add(() => nodes.forEach((x, j) => x.classList.toggle('lit', j === i)), i * .7); if (links[i]) tl.fromTo(links[i], { y: 0, opacity: 1 }, { y: 14, opacity: 0, duration: .5, ease: 'power1.in' }, i * .7 + .2); }); }
    if (k === 'pipeline' && G && !reduce) { const card = $('.card[data-i="1"]', s); const to = $('.col[data-col="Booked"]', s); if (card && to) setTimeout(() => { const a = card.getBoundingClientRect(); to.appendChild(card); const b = card.getBoundingClientRect(); card.classList.add('moving'); G.fromTo(card, { x: a.left - b.left, y: a.top - b.top }, { x: 0, y: 0, duration: .9, ease: 'power3.inOut', onComplete: () => card.classList.remove('moving') }); $$('.col', s).forEach(c => { $('h5 span:last-child', c).textContent = $$('.card', c).length; }); }, 1400); }
    if (k === 'calendar') { const slot = $('.slot[data-i="4"]', s); if (slot) setTimeout(() => { slot.classList.add('lit'); slot.lastElementChild.textContent = '🏠 Marcus H.'; setTimeout(() => { slot.classList.remove('lit'); slot.classList.add('booked'); }, 900); }, 1000); } };
  const wireInbox = app => app.addEventListener('click', e => { const r = e.target.closest('.ib-row'); if (r) { $$('.ib-row', app).forEach(x => x.classList.toggle('on', x === r)); $('[data-th]', app).innerHTML = inboxThread(+r.dataset.i); } });
  const hero = $('#heroApp'); hero.innerHTML = appShell('heroAppWin', 'inbox'); showScreen($('#heroAppWin'), 'inbox'); wireInbox($('#heroAppWin'));
  if (!reduce) { let hi = 0; setInterval(() => { if (document.hidden || mobile()) return; hi = (hi + 1) % 3; const r = $$('.ib-row', hero)[hi]; if (r) r.click(); }, 7000); }
  const tour = $('#tourApp'); tour.innerHTML = appShell('tourAppWin', 'inbox'); wireInbox($('#tourAppWin'));
  $('#tourTabs').innerHTML = D.screens.map((s, i) => `<button type="button" class="tt ${i === 0 ? 'on' : ''}" data-k="${s.k}"><span>${s.e}</span>${esc(s.n)}</button>`).join('');
  let tourUser = false, tourIdx = 0;
  const setTour = k => { $$('.tt').forEach(b => b.classList.toggle('on', b.dataset.k === k)); showScreen($('#tourAppWin'), k); $('#tourNote').textContent = D.screens.find(x => x.k === k).t; if (k === 'inbox') { const th = $('[data-th]', tour); if (th && !th.innerHTML) th.innerHTML = inboxThread(1); } };
  $('#tourTabs').addEventListener('click', e => { const b = e.target.closest('.tt'); if (b) { setTour(b.dataset.k); tourUser = true; b.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' }); } }); setTour('inbox');
  onceVisible(tour, () => setInterval(() => { if (tourUser || document.hidden) return; tourIdx = (tourIdx + 1) % D.screens.length; setTour(D.screens[tourIdx].k); }, 3800), .25);

  /* ---------- nav, progress, mobile bar ---------- */
  const nav = $('#nav'), links = $('#navLinks'), tog = $('.nav-toggle'), mobBar = $('#mobBar');
  tog.addEventListener('click', () => { const o = nav.classList.toggle('open'); links.classList.toggle('open', o); tog.setAttribute('aria-expanded', o); });
  document.addEventListener('click', e => { const a = e.target.closest('a[href^="#"]'); if (!a) return; const id = a.getAttribute('href'); e.preventDefault(); if (id === '#top') scrollTo({ top: 0, behavior: 'smooth' }); else { const t = $(id); if (t) { const y = t.getBoundingClientRect().top + scrollY - (mobile() ? 56 : 70); scrollTo({ top: y, behavior: 'smooth' }); } } nav.classList.remove('open'); links.classList.remove('open'); tog.setAttribute('aria-expanded', 'false'); setTimeout(cleanUrl, 50); });
  const secs = ['story', 'tour', 'stations', 'niches', 'offers', 'start', 'faq'];
  let tick = false; addEventListener('scroll', () => { if (tick) return; tick = true; requestAnimationFrame(() => { tick = false; const y = scrollY; nav.classList.toggle('scrolled', y > 8); const h = document.documentElement; $('.progress').style.width = (y / (h.scrollHeight - h.clientHeight) * 100) + '%'; $('#toTop').classList.toggle('on', y > innerHeight * 1.5); let cur = ''; secs.forEach(id => { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top < innerHeight * .4) cur = id; }); $$('.nav-links a[href^="#"]').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur)); if (mobBar) { const near = $('#connect').getBoundingClientRect().top < innerHeight; mobBar.classList.toggle('on', y > innerHeight * .9 && !near); } }); }, { passive: true });

  /* ---------- reveal ---------- */
  const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), { threshold: .08, rootMargin: '0px 0px -6% 0px' });
  const watch = () => $$('.rv:not(.in)').forEach(el => io.observe(el));
  $('#chanList').innerHTML = D.channels.map(([n, c]) => `<span class="pl" style="--c:${c}"><i></i>${esc(n)}</span>`).join('');

  /* ---------- opening ---------- */
  const intro = $('#intro'); const heroIn = () => { $$('.hero .rv').forEach(el => el.classList.add('in')); };
  if (intro && G && !reduce) { const g = $('#introLines'); let s = ''; for (let i = 0; i < 16; i++) { const y0 = 40 + (i / 15) * 520; s += `<path d="M-50,${y0} C${300 + Math.random() * 200},${y0} ${520 + Math.random() * 100},300 840,300"/>`; } g.innerHTML = s;
    G.timeline({ onComplete: () => intro.remove() })
      .to('#introPour', { clipPath: 'circle(28% at 24% 50%)', duration: .6, ease: 'power3.out' }, 0)
      .to('.intro-word', { opacity: 1, y: 0, duration: .45, ease: 'power3.out' }, .25)
      .to('#introLines path', { strokeDashoffset: 0, duration: .9, ease: 'power2.inOut', stagger: { each: .025, from: 'start' } }, .4)
      .to('#introPour', { clipPath: 'circle(0% at 24% 50%)', duration: .7, ease: 'power3.in' }, .75)
      .to('#introNode', { attr: { r: 18 }, fill: '#2EC48A', duration: .4, ease: 'back.out(3)' }, 1.1)
      .add(heroIn, 1.5).to(intro, { opacity: 0, duration: .5, ease: 'power2.inOut' }, 1.65);
    setTimeout(() => { if ($('#intro')) { $('#intro').remove(); heroIn(); } }, 3400);
  } else { if (intro) intro.remove(); heroIn(); }

  /* ---------- STORY: one lead, one minute ---------- */
  { const list = $('#chapters'), thread = $('#phThread'), badge = $('#storyBadge'), swn = $('#swNum'), arc = $('#swArc'), sub = $('#phSub');
    list.innerHTML = D.story.map((c, i) => `<li class="ch" data-i="${i}"><div class="when">${c.sec <= 60 && i < 5 ? `<b>${String(c.sec).padStart(2, '0')}s</b>` : ''}${esc(c.when)}</div><h3>${esc(c.h)}</h3><p>${esc(c.p)}</p><span class="tag">⚙️ ${esc(c.badge)}</span></li>`).join('');
    let cur = -1, timers = [], history = [];
    const add = (kind, text, meta) => { const d = document.createElement('div'); d.className = 'msg ' + kind; d.innerHTML = kind === 'typing' ? '<i></i><i></i><i></i>' : kind === 'missed' ? `📵 ${esc(text)} <small>${esc(meta || '')}</small>` : esc(text); thread.appendChild(d); requestAnimationFrame(() => d.classList.add('in')); const max = mobile() ? 3 : 7; while (thread.children.length > max) thread.firstChild.remove(); return d; };
    const setClock = s => { swn.textContent = Math.round(s); arc.style.strokeDashoffset = 276 - 276 * clamp(s / 60, 0, 1); };
    const show = i => { if (i === cur) return; const fwd = i > cur; cur = i; timers.forEach(clearTimeout); timers = []; $$('.ch', list).forEach((li, k) => li.classList.toggle('on', k === i)); const c = D.story[i]; badge.textContent = c.badge; sub.textContent = i >= 5 ? c.when : 'Text message · from your number';
      /* rebuild the thread up to this chapter so scrolling back still reads correctly */
      thread.innerHTML = ''; for (let k = 0; k < i; k++) D.story[k].ph.forEach(m => add(m[0], m[1], m[2]));
      $$('.msg', thread).forEach(m => m.classList.add('in'));
      setClock(c.sec);
      if (!fwd || reduce) { c.ph.forEach(m => add(m[0], m[1], m[2])); return; }
      let t = 0; c.ph.forEach((m, k) => { if (m[0] === 'out' || m[0] === 'them') { timers.push(setTimeout(() => add('typing', ''), t)); t += 650; } timers.push(setTimeout(() => { const ty = $('.typing', thread); if (ty) ty.remove(); add(m[0], m[1], m[2]); }, t)); t += 900; }); };
    const chObs = new IntersectionObserver(es => { es.forEach(x => { if (x.isIntersecting) show(+x.target.dataset.i); }); }, { rootMargin: mobile() ? '-35% 0px -45% 0px' : '-45% 0px -45% 0px', threshold: 0 });
    $$('.ch', list).forEach(li => chObs.observe(li)); show(0);
    $('#core5List').innerHTML = D.core5.map((n, i) => `<span class="cp">${['📵', '⚡', '⏰', '⭐', '🔁'][i]} ${esc(n)}</span>`).join(''); }

  /* ---------- STACK: 21 tools fold into one ---------- */
  { const cols = $('#stackCols'), board = $('#stackBoard'); const colors = ['#E1306C', '#C5221F', '#6E56CF', '#0A66C2', '#D97706', '#0EA5E9', '#16A34A', '#F2B01E', '#7C3AED', '#2563EB', '#E5484D', '#0F8A5F'];
    let n = 0; cols.innerHTML = D.stack.map(([g, items]) => `<div class="sk"><h4>${esc(g)}</h4>${items.map(t => `<span class="chip" style="--c:${colors[n++ % colors.length]}"><i></i>${esc(t)}<s>$</s></span>`).join('')}</div>`).join('');
    const chips = $$('.chip', board), total = chips.length; $$('.stack-meter b').forEach(b => b.textContent = total); $('.stack-sec .h2 .em') && null;
    const meter = p => { const left = Math.max(1, Math.round(total - (total - 1) * p)); $('#stackLogins').textContent = left; $('#stackBills').textContent = left; $('#stackLost').textContent = left === 1 ? 0 : left; };
    if (G && ST && !reduce && !mobile()) {
      const core = $('.stack-core'); const tl = G.timeline({ scrollTrigger: { trigger: board, start: 'top 100px', end: '+=720', pin: true, pinSpacing: true, anticipatePin: 1, scrub: .6, onUpdate: st => meter(st.progress), onLeave: () => board.classList.add('done'), onEnterBack: () => board.classList.remove('done') } });
      chips.forEach((ch, i) => { const r = ch.getBoundingClientRect(), b = board.getBoundingClientRect(); const dx = b.left + b.width / 2 - (r.left + r.width / 2), dy = b.top + b.height / 2 - (r.top + r.height / 2); tl.to(ch, { x: dx, y: dy, scale: .25, opacity: 0, duration: 1, ease: 'power2.in' }, (i / total) * .8); });
      tl.to(core, { opacity: 1, scale: 1, duration: .5, ease: 'back.out(1.6)' }, .55);
    } else { meter(1); board.classList.add('done'); } }

  /* ---------- STATIONS ---------- */
  { const grid = $('#stations-grid'); grid.insertAdjacentHTML('beforeend', D.stations.map((s, i) => `<div class="stn" data-i="${i}"><div class="st-head"><span class="e">${s.e}</span><div><b>${esc(s.n)}</b><small>station ${i + 1} of 4</small></div></div><p>${esc(s.t)}</p><ul>${s.mods.map(m => `<li>${esc(m)}</li>`).join('')}</ul></div>`).join(''));
    const sts = $$('.stn', grid); const lead = $('#stLead'); const E = ['🙋', '📅', '💳', '💚'];
    const place = k => { sts.forEach((s, i) => s.classList.toggle('on', i === k)); lead.textContent = E[k]; lead.style.left = (k * 33.33) + '%'; }; place(0); if (!reduce && !mobile()) { let k = 0; onceVisible(grid, () => setInterval(() => { if (document.hidden) return; k = (k + 1) % 4; place(k); }, 2600), .3); } }

  /* ---------- NICHES ---------- */
  { const tabs = $('#nicheTabs'), nb = $('#nicheBody'), ni = $('#nicheImgs'), np = $('#nicheProof');
    tabs.innerHTML = D.niches.map((n, i) => `<button type="button" class="nt" data-i="${i}"><span>${n.e}</span>${esc(n.n)}</button>`).join(''); ni.innerHTML = D.niches.map((n, i) => `<img src="${n.img}" alt="${esc(n.n)}" loading="lazy" decoding="async" width="1200" height="900">`).join('');
    let idx = -1, auto; const set = (i, user) => { if (i === idx) return; idx = i; const n = D.niches[i]; $$('.nt', tabs).forEach((b, k) => b.classList.toggle('on', k === i)); $$('img', ni).forEach((im, k) => { im.classList.toggle('out', im.classList.contains('on') && k !== i); im.classList.toggle('on', k === i); }); np.innerHTML = `<b>${esc(n.proof.k)}</b><span>${esc(n.proof.v)}</span><small>${esc(n.proof.who)}</small>`; nb.innerHTML = `<div class="eyebrow">${n.e} ${esc(n.n)}</div><h3 class="h3">${esc(n.h)}</h3><ul class="build">${n.build.map((b, k) => `<li style="--i:${k}">${esc(b)}</li>`).join('')}</ul>`; if (user) { clearInterval(auto); $$('.nt', tabs)[i].scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' }); } };
    tabs.addEventListener('click', e => { const b = e.target.closest('.nt'); if (b) set(+b.dataset.i, true); }); set(0);
    onceVisible($('#niche'), () => { auto = setInterval(() => { if (!document.hidden) set((idx + 1) % D.niches.length); }, 6500); }); }

  /* ---------- NUMBERS + live counter ---------- */
  { const ng = $('#numGrid'); ng.innerHTML = D.numbers.map(n => `<div class="num"><b data-count="${n.k}" data-suffix="${esc(n.suf)}">0</b><span class="bars">${n.bars.map((h, j) => `<i style="--h:${h};--j:${j}"></i>`).join('')}</span><span class="t">${esc(n.t)}</span><span class="s">${esc(n.s)}</span></div>`).join('');
    const nio = new IntersectionObserver((es, o) => es.forEach(x => { if (x.isIntersecting) { $$('[data-count]', x.target).forEach(countEl); x.target.classList.add('in'); o.unobserve(x.target); } }), { threshold: .3 }); $$('.num', ng).forEach(n => nio.observe(n));
    const lc = $('#liveCount'); const t0 = Date.now(); const upd = () => { lc.textContent = Math.floor((Date.now() - t0) / 1000 / 3.6).toLocaleString(); }; setInterval(upd, 1000); upd(); }

  /* ---------- REVIEWS ---------- */
  { const grid = $('#revGrid'), tabs = $('#revTabs'); const SRC = { google: ['G', 'Google'], trustpilot: ['★', 'Trustpilot'], facebook: ['f', 'Facebook'] };
    grid.innerHTML = D.reviews.map(r => `<div class="rev" data-src="${r.src}"><div class="top"><img src="${r.ph}" alt="" loading="lazy"><div><b>${esc(r.n)}</b><span>${esc(r.r)}</span></div><span class="src-badge ${r.src}" title="${SRC[r.src][1]}">${SRC[r.src][0]}</span></div><div class="meta"><span class="st">${stars(r.st)}</span><span>${esc(r.d)}</span><span class="vf">✓ Verified client</span></div><p>${esc(r.q)}</p></div>`).join('');
    const all = [['all', '🌐 All'], ['google', 'G Google'], ['trustpilot', '★ Trustpilot'], ['facebook', 'f Facebook']];
    tabs.innerHTML = all.map(([k, l], i) => `<button type="button" class="rt-b ${i === 0 ? 'on' : ''}" data-k="${k}">${l}</button>`).join('');
    tabs.addEventListener('click', e => { const b = e.target.closest('.rt-b'); if (!b) return; $$('.rt-b', tabs).forEach(x => x.classList.toggle('on', x === b)); $$('.rev', grid).forEach(r => r.classList.toggle('hide', b.dataset.k !== 'all' && r.dataset.src !== b.dataset.k)); $('#revSrcLabel').textContent = b.dataset.k === 'all' ? 'Google, Trustpilot, Facebook' : SRC[b.dataset.k][1]; }); }

  /* ---------- OFFERS, START, LAUNCH, FAQ, TAPE ---------- */
  $('#offerGrid').innerHTML = D.offers.map((o, i) => `<div class="offer rv ${o.hot ? 'hot' : ''}" data-d="${i}"><div class="top"><span class="e">${o.e}</span><h4>${esc(o.n)}</h4><span class="tag">${esc(o.tag)}</span></div><p class="who">${esc(o.who)}</p><span class="inc">Core five, weekly report, a human who answers</span><ul>${o.get.map(g => `<li>${esc(g)}</li>`).join('')}</ul><ol class="how"><span class="how-l">How it runs</span>${(o.how||[]).map(([w,t])=>`<li><b>${esc(w)}</b><span>${esc(t)}</span></li>`).join('')}</ol><div class="promise">${esc(o.promise)}</div><a class="cta" href="https://tidycal.com/pinnaklemedia/15-minute-meeting" target="_blank" rel="noopener" data-book>Scope it on a call →</a></div>`).join('');
  $('#addons').innerHTML = D.addons.map(a => `<span class="ad">${esc(a)}</span>`).join('');
  { const s = D.start; $('#startH').innerHTML = esc(s.h).replace('$1', '<span class="em">$1</span>'); $('#startP').textContent = s.p; $('#startSteps').innerHTML = s.steps.map(([d, h, t]) => `<li><span class="day">${esc(d)}</span><div><b>${esc(h)}</b><p>${esc(t)}</p></div></li>`).join(''); $('#startWhy').textContent = s.why; }
  $('#launchGrid').innerHTML = '<i class="fill"></i>' + D.launch.map((l, i) => `<div class="lw" style="--i:${i}" data-e="${l.e}"><div class="card"><span class="wk">${esc(l.w)}</span><h4>${esc(l.n)}</h4><p>${esc(l.d)}</p></div></div>`).join('');
  $('#faqList').innerHTML = D.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('');
  $('#faqLd').textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: D.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });
  const tp = D.tape.map(([k, t]) => `<span><i></i><b>${esc(k)}</b>${esc(t)}</span>`).join(''); $('#tape').innerHTML = tp + tp;

  /* ---------- form ---------- */
  const fm = $('#freeForm'); $('#freePage').value = location.href;
  fm.addEventListener('submit', async e => { e.preventDefault(); let ok = true; $$('[required]', fm).forEach(i => { const bad = !i.value.trim() || !i.checkValidity(); i.classList.toggle('bad', bad); if (bad) ok = false; }); if (!ok) return; $('button[type=submit]', fm).disabled = true; const data = new FormData(fm); const box = fm.closest('.free'); const done = msg => { box.classList.add('sent'); box.insertAdjacentHTML('beforeend', `<div class="free-ok">${msg}</div>`); };
    try { await fetch(fm.action, { method: 'POST', body: new URLSearchParams(data), mode: 'no-cors' }); done(`<b>Got it, ${esc(data.get('name').split(' ')[0])}.</b> Your audit request is in the studio inbox. Expect the map within two business days.`); }
    catch (err) { location.href = `mailto:pinnaklemedia@gmail.com?subject=${encodeURIComponent('Flow audit request')}&body=${['Name: ' + data.get('name'), 'Email: ' + data.get('email'), 'Link: ' + data.get('link'), 'Business: ' + data.get('niche'), 'Leads today: ' + (data.get('notes') || '-')].join('%0D%0A')}`; done('Your email app opened with everything filled in.'); } });

  /* ---------- booking modal: opens instantly, calendar warms up in the background ---------- */
  const bm = $('#bookModal'), fr = $('iframe', bm), body = $('.bm-body', bm); let warmed = false;
  const warm = () => { if (warmed) return; warmed = true; fr.addEventListener('load', () => { if (fr.src !== 'about:blank') body.classList.add('ready'); }, { once: true }); fr.src = fr.dataset.src; setTimeout(() => body.classList.add('ready'), 6000); };
  const open = () => { warm(); bm.classList.add('open'); document.body.style.overflow = 'hidden'; }; const close = () => { bm.classList.remove('open'); document.body.style.overflow = ''; };
  document.addEventListener('click', e => { if (e.target.closest('[data-book]')) { e.preventDefault(); open(); } if (e.target.closest('[data-close]')) close(); });
  $$('[data-book]').forEach(b => b.addEventListener('pointerenter', warm, { once: true, passive: true }));
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  if (G && !reduce && matchMedia('(pointer:fine)').matches) $$('.btn-mag').forEach(b => { b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(); G.to(b, { x: (e.clientX - r.left - r.width / 2) * .16, y: (e.clientY - r.top - r.height / 2) * .22, duration: .4, ease: 'power2.out' }); }); b.addEventListener('mouseleave', () => G.to(b, { x: 0, y: 0, duration: .6, ease: 'elastic.out(1,.5)' })); });

  watch(); addEventListener('load', () => { watch(); if (ST) setTimeout(() => ST.refresh(), 300); const idle = window.requestIdleCallback || (f => setTimeout(f, 2500)); idle(() => { if (!mobile()) warm(); }); });
})();
