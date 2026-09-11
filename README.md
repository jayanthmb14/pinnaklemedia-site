# Pinnakle Media — pinnaklemedia.com

The public website of **Pinnakle Media**, a video editing and channel-growth studio based in Bengaluru, India. The site is a single long-scroll page of case studies, client testimonials and the story of how the studio works, built as plain HTML, CSS and JavaScript with no build step.

Live: **https://pinnaklemedia.com**

---

## About Pinnakle Media

Pinnakle Media (a brand of PKJMB Media Pvt Ltd, incorporated 22 December 2023) started in October 2022 as *Cut To Pro*, a one-person editing service, and was co-founded on 6 December 2022 by **Jayanth M B** (Founder & CEO) and **Prateek Kumar Tiwari** (Co-founder & MD). Today it is a ten-person team that runs content for creators and brands in the US, UK, Canada, Australia and India.

What the studio does:

- **Short-form editing** for YouTube Shorts, Instagram Reels and TikTok, hook-first, captioned, posted daily
- **Long-form YouTube editing** with thumbnails, titles and descriptions built to rank
- **Podcast production**, full episodes cut into clips, promos and audiograms
- **Thumbnails and design**, A/B-tested thumbnails, reel covers, carousels, channel brand kits
- **LinkedIn ghostwriting**, 30+ posts a month with daily engagement
- **Channel management**, posting to seven platforms plus a weekly video impact report every Friday
- **AI production**, avatar video, cloned voice, AI documentaries and generated B-roll
- **Growth systems**, cold email, Meta ad creative, funnels, websites and in-house automations

The site publishes the results behind that work: 100+ clients, 3,000+ videos and 11M+ views on client channels since 2022, with every figure traced to a dashboard, a weekly report or a payment record. Client names, screenshots and quotes are published with client consent.

---

## What is on the page

| Section | What it shows |
|---|---|
| Hero | Live client growth board, rotating client faces, platforms published to |
| Channels & brands | Two marquees of creator channels and B2B teams the studio works with |
| The numbers | Headline figures with a "how we know" panel behind each one |
| Case studies | 16 cards, each opening a full story with proof screenshots and client quotes; a 21-row results board |
| The ascent | A pinned, scroll-driven timeline from 2022 to 2026 (hand cart to rocket) with a story modal per year |
| Testimonials | 8 video testimonials and 44 written quotes from 22 clients, colour-coded by source |
| Work | Sample edits by format, a Drive library link and "beyond editing" projects |
| Process | The five-step pipeline, a typical client week, and playbooks for LinkedIn, Instagram, YouTube, TikTok, Reddit and X |
| Services | Eight core services and twenty more that come with a retainer |
| Team | Founders, current team and alumni |

---

## Tech

- **Stack:** `index.html`, `styles.css`, `app.js`, `data.js`, `assets/`. No framework, no bundler.
- **Content:** everything editable lives in `data.js` as `window.PM`: clients (`C`), `cases`, `wins`, `timeline`, `videoTestimonials`, `quotes`, `samples`, `beyond`, `team`, `viz`, `receipts`, `brands`, `services`, `playbooks`, `library`.
- **Motion:** GSAP 3.13 with ScrollTrigger and MotionPathPlugin from cdnjs, IntersectionObserver reveals, CSS keyframes. Everything respects `prefers-reduced-motion`.
- **Fonts:** self-hosted Bricolage Grotesque, Geist and Geist Mono (`assets/fonts/`).
- **SEO:** JSON-LD (Organization, WebSite, WebPage, Service catalogue), Open Graph and Twitter cards, `robots.txt`, `sitemap.xml`.
- **Responsive:** verified at 390, 430, 834, 1024, 1280, 1440, 1728, 1920 and 2560 px wide. The timeline switches to a sticky strip below 1100 px; the playbook block auto-compacts to fit laptop heights.

## Run locally

```bash
python3 -m http.server 8766
```

Then open http://localhost:8766/.

## Deploy

Pushes to `main` deploy automatically to Hostinger (Git deploy to `public_html`). The host caches CSS and JS for seven days, so bump the `?v=` query string on `styles.css`, `data.js` and `app.js` in `index.html` with every release.

## Adding content

- **New client:** add to `C` in `data.js` with a `photo` under `assets/clients/` (or leave empty for an initials avatar).
- **New case study:** add to `cases` and, if it has a chart, to `viz`.
- **New quote:** add to `quotes` with `src` set to Slack, Email, WhatsApp, Call, Deck or Review notes so it picks up the right colour and icon.
- **New receipt:** add the cropped screenshot to `assets/receipts/` and an entry in `receipts`. Blur any financial figure before committing.

---

## Credits and rights

Designed and built by Jayanth M B, founder of Pinnakle Media. © 2022–2026 PKJMB Media Pvt Ltd. All case studies, testimonials, screenshots, copy, illustrations, animations and code are the property of PKJMB Media Pvt Ltd and may not be copied, reproduced or reused without written permission. Client names and results remain the property of the respective clients.

Studio: [Instagram](https://www.instagram.com/pinnaklemedia/) · [LinkedIn](https://www.linkedin.com/in/pinnakle-media-87b2672a0/) · [YouTube](https://www.youtube.com/@PinnakleMedia) · pinnaklemedia@gmail.com
