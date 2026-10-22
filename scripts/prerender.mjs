#!/usr/bin/env node
/* Pinnakle Media — static prerender for crawlers and AI tools.
   Reads data.js (window.PM) and writes plain HTML for the JS-rendered home-page
   sections into index.html, between <!-- ssr:NAME --> ... <!-- /ssr:NAME -->
   markers, plus the FAQPage JSON-LD in <script id="faqLd">.

   Every top-level prerendered node carries data-ssr. app.js removes those nodes
   on start-up and renders the interactive version exactly as before, so the
   design is unchanged for visitors while curl / Googlebot / AI crawlers see the
   real text. Re-run after every data.js change:

     node scripts/prerender.mjs
*/
import fs from 'fs';
import vm from 'vm';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'data.js'), 'utf8'), ctx);
const D = ctx.window.PM;
if (!D) throw new Error('data.js did not define window.PM');

const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const client = slug => (slug && D.C[slug]) || null;
const initials = name => name.replace(/·.*$/, '').trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
const avatar = slug => {
  const c = client(slug);
  if (!c) return '<span class="ini">PM</span>';
  if (!c.photo) return `<span class="ini">${initials(c.name)}</span>`;
  return `<img src="${c.photo}" alt="${esc(c.short)} profile picture" loading="lazy" data-ini="${initials(c.name)}">`;
};
const srcKey = s => { s = (s || '').toLowerCase(); if (s.includes('slack')) return 'slack'; if (s.includes('mail')) return 'email'; if (s.includes('whatsapp') || s.includes('telegram')) return 'whatsapp'; if (s.includes('deck')) return 'deck'; return 'call'; };
const ytThumb = id => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
const winCat = k => (k.startsWith('$') || /lead|payout/i.test(k)) ? 'money' : /[%×→KM]|\/mo/.test(k) ? 'growth' : 'volume';

const blocks = {};

/* channels + brands marquees (JS doubles them for the loop) */
blocks.ticker = D.marquee.map(s => { const c = client(s); return c ? `<div class="tchip" data-ssr data-client="${s}">${avatar(s)}<div><b>${esc(c.short)}</b><span>${esc(c.subs || c.niche)}</span></div></div>` : ''; }).join('');
blocks.brands = (D.brands || []).map(([s, line]) => { const c = client(s); return c ? `<div class="bchip" data-ssr data-client="${s}">${avatar(s)}<div><b>${esc(c.short)}</b><span>${esc(line)}</span></div></div>` : ''; }).join('');

/* featured case studies */
blocks.bento = D.cases.map(k => {
  const c = client(k.slug) || { short: k.slug, niche: '', platform: '' };
  const chips = k.chips.map(([t, kind]) => `<span class="chip ${kind}">${esc(t)}</span>`).join('');
  const proof = k.proof ? `<div class="proof-img"><img src="${k.proof}" alt="YouTube Studio analytics for ${esc(c.short)}" loading="lazy"></div>` : '';
  return `<article class="case ${k.theme || ''} ${k.size || ''}" data-ssr data-case="${k.slug}"><div class="case-meta"><span class="tag">${esc(k.tag)}</span><span class="plat">${esc(c.platform)}</span></div><div class="who">${avatar(k.slug)}<div><b>${esc(c.short)}</b><span>${esc(c.niche)}</span></div></div><div class="bigrow"><div class="case-big"><span class="n">${esc(k.big)}</span><span class="u">${esc(k.unit)}</span></div></div><h4 class="case-title">${esc(k.title)}</h4><p class="case-desc">${esc(k.desc)}</p><div class="chips">${chips}</div>${proof}</article>`;
}).join('\n');

/* results board (rows sit after the header row) */
blocks.wins = D.wins.map(([k, slug, , short, year]) => {
  const c = client(slug);
  return `<div class="wrow ${winCat(k)}" data-ssr data-client="${slug}"><span class="wk">${esc(k)}</span> <span class="wc">${avatar(slug)}<span>${esc(c ? c.short : '')}</span></span> <span class="wt">${esc(short || '')}</span> <span class="wy">${esc(year || '')}</span></div>`;
}).join('\n');

/* video testimonials */
blocks.vgrid = D.videoTestimonials.map(v => {
  const c = client(v.client); const poster = v.poster || (v.yt ? ytThumb(v.yt) : '');
  return `<div class="vcard" data-ssr ${v.client ? `data-client="${v.client}"` : ''}><div class="thumb" style="background-image:url('${poster}')"><div class="cap">${esc(c ? c.short : 'Client message')}</div></div><div class="vmeta"><b>${esc(v.title)}</b><span>${esc(v.meta)}</span></div></div>`;
}).join('\n');

/* written testimonials, grouped by client like app.js */
{
  const groups = new Map();
  D.quotes.forEach(q => { if (!groups.has(q.c)) groups.set(q.c, []); groups.get(q.c).push(q); });
  const order = [...groups.entries()].sort((a, b) => (b[1].some(q => q.star) ? 1 : 0) - (a[1].some(q => q.star) ? 1 : 0) || b[1].length - a[1].length);
  blocks.tgrid = order.map(([slug, qs], i) => {
    const sorted = [...qs].sort((a, b) => (b.star ? 1 : 0) - (a.star ? 1 : 0));
    const main = sorted[0], rest = sorted.slice(1, 3); const c = client(slug);
    const short = c ? c.short : ''; let role = main.role || '';
    if (short && role === short) role = ''; else if (short && role.startsWith(short + ' · ')) role = role.slice(short.length + 3);
    const sub = [(short && short !== main.who) ? short : '', role].filter(Boolean).join(' · ');
    const lines = rest.map(q => `<div class="ql"><span>“${esc(q.q)}”</span> <small>${esc(q.src)} · ${esc(q.date)}</small></div>`).join('');
    return `<figure class="tcard ${main.star ? 'star' : ''} ${i >= 9 ? 'extra' : ''}" data-ssr data-client="${slug}" data-src="${srcKey(main.src)}"><span class="src">${esc(main.src)} · ${esc(main.date)}</span><blockquote class="q">${esc(main.q)}</blockquote>${lines}<figcaption class="who">${avatar(slug)}<div><b>${esc(main.who)}</b> <span>${esc(sub)}</span></div></figcaption></figure>`;
  }).join('\n');
}

/* services: the eight core services + retainer extras */
blocks.svc = `<ul class="ssr-svc" data-ssr>` + D.services.core.map(([n, w, p], i) => `<li class="cs"><span class="n">${String(i + 1).padStart(2, '0')}</span> <h4>${esc(n)}</h4> <p>${esc(w)}</p> <span class="pr">${esc(p)}</span></li>`).join('') + `</ul>`;
blocks.svcMore = `<span class="al" data-ssr>Also inside a retainer</span>` + D.services.more.map(x => `<span data-ssr>${esc(x)}</span>`).join(' ');

/* founders */
blocks.founders = D.team.founders.map((f, i) => {
  const title = f.role.split(' · ')[0];
  return `<div class="fcard" data-ssr><span class="fnum">${i === 0 ? 'Founder · since Dec 2022' : 'Co-founder · since Dec 2022'}</span><img src="${f.photo}" alt="${esc(f.name)}, ${esc(title)} of Pinnakle Media" data-ini="${initials(f.name)}"><div><h4>${esc(f.name)}</h4><div class="role">${esc(f.role)}</div><p>${esc(f.text)}</p><div class="fx">${(f.chips || []).map(c => `<span>${esc(c)}</span>`).join('')}</div>${f.li ? `<a class="li" href="${f.li}" target="_blank" rel="noopener">LinkedIn ↗</a>` : ''}</div></div>`;
}).join('\n');

/* FAQ, same markup as app.js */
blocks.faq = D.faq.map(([q, a], i) => `<details data-ssr ${i === 0 ? 'open' : ''}><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('\n');

const faqLd = JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: D.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }).replace(/</g, '\\u003c');

/* write */
const file = path.join(ROOT, 'index.html');
let html = fs.readFileSync(file, 'utf8');
for (const [name, body] of Object.entries(blocks)) {
  const re = new RegExp(`<!-- ssr:${name} -->[\\s\\S]*?<!-- /ssr:${name} -->`);
  if (!re.test(html)) throw new Error(`marker <!-- ssr:${name} --> not found in index.html`);
  html = html.replace(re, () => `<!-- ssr:${name} -->\n${body}\n<!-- /ssr:${name} -->`);
}
const ldRe = /<script type="application\/ld\+json" id="faqLd">[\s\S]*?<\/script>/;
if (!ldRe.test(html)) throw new Error('faqLd script not found');
html = html.replace(ldRe, () => `<script type="application/ld+json" id="faqLd">${faqLd}</script>`);
fs.writeFileSync(file, html);
console.log('prerendered:', Object.entries(blocks).map(([k, v]) => `${k} ${v.length}b`).join(', '), '· faqLd', D.faq.length, 'Q');
