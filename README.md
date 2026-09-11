# Pinnakle Media — Case Studies & Testimonials (v3)

Static site: `index.html` + `styles.css` + `app.js` + `data.js` (+ `assets/`). No build step.

- **Content** lives in `data.js` (`window.PM`): clients (`C`), case studies (`cases`), wins, timeline, video testimonials, written quotes (`quotes`, grouped one card per client), work samples, "beyond editing" cards, team.
- **Run locally:** any static server, e.g. `python3 -m http.server 8766` in this folder, then open http://localhost:8766/.
- **Deploy:** Netlify project `pinnakle-case-studies` (site id `e52e6457-617d-4978-ba86-c65a3f2c352f`). Drag-and-drop this folder in the Netlify UI, or use the Netlify MCP deploy command.
- **Motion:** GSAP 3.13 + ScrollTrigger + MotionPathPlugin from cdnjs; everything respects `prefers-reduced-motion`. The opening curtain shows once per browser session (`sessionStorage` key `pm-seen`).
- **Receipts:** `assets/receipts/` holds cropped screenshots (YouTube Studio, WhatsApp, email) with confidential figures blurred; edit the `receipts` list in `data.js` to add more. Originals of the two large testimonial videos live in `../testimonial-videos/`; the YouTube (unlisted) copies are `vqWtlqUQ9bc` (Elijah Eagle) and `cmra3jv0onM` (ThriveWell).
- **Founder photos:** LinkedIn profile pictures (Sept 2026). Client photos: YouTube/Instagram avatars, verified against live channel data.
