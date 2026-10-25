/* PinnakleFlow v4 — all copy lives here. No prices anywhere (scope and fees are agreed on the call). The underlying platform is never named. */
window.PF = (() => {
  const channels = [
    ['Instagram DMs', '#E1306C'], ['Facebook Messenger', '#1877F2'], ['WhatsApp', '#25D366'], ['Website chat', '#0F8A5F'],
    ['Missed calls', '#D97706'], ['Web forms', '#6E56CF'], ['Google Business', '#4285F4'], ['Email', '#C5221F'], ['SMS', '#0F172A'], ['Ad leads', '#0A66C2'],
  ];

  /* Fictional sample people used across the product screens. */
  const people = [
    { n: 'Priya Natarajan', co: 'Whitening consult', src: 'Google Business', st: 'Booked', v: '$1,200', ph: 'assets/img/p1.jpg', last: 'Confirmed ✅ see you Tuesday', t: '2m', tags: ['🆕 new patient', '🔥 hot'] },
    { n: 'Marcus Hale', co: 'Roof estimate', src: 'Missed calls', st: 'Contacted', v: '$8,400', ph: 'assets/img/p2.jpg', last: 'Friday afternoon is fine', t: '9m', tags: ['📞 call back'] },
    { n: 'Dana Okoro', co: 'Career cohort', src: 'Instagram DMs', st: 'Applied', v: '$1,497', ph: 'assets/img/p3.jpg', last: 'Just sent the application 🙌', t: '14m', tags: ['📝 applied'] },
    { n: 'Luis Ortega', co: 'Kitchen remodel', src: 'Web forms', st: 'Estimate sent', v: '$23,000', ph: 'assets/img/p4.jpg', last: 'Can you add the island to the quote?', t: '31m', tags: ['📄 estimate', '💬 replied'] },
    { n: 'Sam Kowalski', co: 'Coaching call', src: 'WhatsApp', st: 'New', v: '$3,000', ph: 'assets/img/p5.jpg', last: 'Hi, saw your reel about pricing…', t: '1h', tags: ['🎬 from a reel'] },
    { n: 'Aisha Rahman', co: 'Listing valuation', src: 'Facebook Messenger', st: 'Call booked', v: '$12,500', ph: 'assets/img/p6.jpg', last: 'Thursday 4pm confirmed', t: '2h', tags: ['📅 Thu 4pm'] },
    { n: 'Tom Brennan', co: 'Boiler service', src: 'SMS', st: 'Won', v: '$640', ph: 'assets/img/p7.jpg', last: 'Paid, thanks for the quick turnaround', t: '3h', tags: ['💳 paid', '⭐ review asked'] },
  ];

  /* The story: one lead, one minute, then the days after. Each chapter drives the phone. */
  const story = [
    { sec: 0, when: '9:42 pm · Thursday', h: 'The phone rings. Nobody can pick up.', p: 'Priya is on Glow Dental’s website after her kid’s bedtime. She calls. The clinic closed at six. Normally this is where the lead dies.', ph: [['missed', 'Missed call · Priya N.', '9:42 pm']], badge: 'Missed call' },
    { sec: 7, when: '+7 seconds', h: 'Seven seconds later, a text in your voice.', p: 'Not a robot greeting. The message you would have sent if you had seen the call. Written with you in week one, sent from your own number.', ph: [['out', 'Hi Priya, sorry we missed you. This is Glow Dental. Want me to book you in, or should Dr. Maya call you back tomorrow?']], badge: 'Missed-call text back' },
    { sec: 31, when: '+31 seconds', h: 'She replies. The assistant asks what you would ask.', p: 'It knows your hours, your prices and your three qualifying questions. It never pretends to be a person and hands over the moment it is unsure.', ph: [['them', 'Book please. Is the whitening offer still on?'], ['out', 'It is, until the 31st. Is this your first visit with us?'], ['them', 'Yes 😊']], badge: 'Assistant · suggest mode' },
    { sec: 48, when: '+48 seconds', h: 'A real slot on the real calendar, held for her.', p: 'Not “we will call you”. A live slot from Dr. Maya’s round-robin calendar, video link or address attached, held for ten minutes.', ph: [['out', 'Tuesday 10:30 with Dr. Maya is open. Tap to confirm: pinnk.le/b/2kx']], badge: 'Calendar · live availability' },
    { sec: 60, when: '+60 seconds', h: 'Booked. A card lands on your board. You get one line.', p: 'The pipeline moves her to Booked with her value and source. The owner gets a single notification, not a thread to read.', ph: [['them', 'Confirmed ✅'], ['sys', '📌 Pipeline · Priya N. → Booked · $1,200 · source: Google'], ['sys', '🔔 To you: “Priya N. booked Tue 10:30, whitening, new patient.”']], badge: 'Pipeline · Booked' },
    { sec: 60, when: 'Monday 10:30 am · Tuesday 12:30 pm', h: 'A reminder the day before. A review ask two hours after.', p: 'No-shows drop because the reminder has a one-tap reschedule. Reviews go up because the ask arrives while the visit is still a good memory.', ph: [['out', 'Reminder: tomorrow 10:30 with Dr. Maya. Reply R to reschedule.'], ['out', 'Thanks for coming in, Priya! If we did well, a quick review helps a lot: g.page/r/glow'], ['them', '⭐⭐⭐⭐⭐ Done!']], badge: 'Reminders · Review request' },
    { sec: 60, when: 'Day 30', h: 'Thirty days later, the quiet ones get a nudge.', p: 'For every Priya there are three people who asked and went silent. One text, in your words, reopens the ones that are still thinking.', ph: [['out', 'Hi Marcus, you asked about Invisalign last month. Still thinking about it, or did life get busy?'], ['them', 'Life got busy. Still interested'], ['out', 'Totally get it. Same price holds till the 20th. Want me to pencil in a visit?']], badge: '30-day reactivation' },
  ];
  const core5 = ['Missed-call text back', 'Speed to lead', 'Appointment reminders', 'Review request', '30-day reactivation'];

  /* Product tour: each tab is a real screen built in HTML. */
  const screens = [
    { k: 'inbox', n: 'Conversations', e: '💬', t: 'Every DM, text, email, WhatsApp, call and web chat in one thread per person, with the assistant’s suggested replies ready to send.' },
    { k: 'pipeline', n: 'Pipeline', e: '📋', t: 'Drag a card from New to Won. Every stage move can trigger a message, a task or an invoice. Values, sources and owners on every card.' },
    { k: 'calendar', n: 'Calendars', e: '📅', t: 'Round-robin, service and class calendars with real availability, video links, reminders and no-show recovery.' },
    { k: 'workflow', n: 'Workflows', e: '⚡', t: 'The automations themselves, drawn as a flow. Trigger, wait, if-this-then-that, send. We build them, you read them.' },
    { k: 'pay', n: 'Payments', e: '💳', t: 'Invoices, payment links, recurring billing, proposals with e-sign and a receipt that starts onboarding by itself.' },
    { k: 'dash', n: 'Dashboard', e: '📈', t: 'Pipeline value, calls booked, show rate, reviews, email stats and ad spend. A copy lands in your inbox every Friday.' },
    { k: 'rep', n: 'Reputation', e: '⭐', t: 'Review requests balanced across Google and Facebook, replies drafted for you, a widget for your site.' },
    { k: 'sites', n: 'Pages & funnels', e: '🧩', t: 'Booking pages, opt-ins, application forms and replay pages, each with tracking and every form wired into the inbox.' },
  ];

  /* The stack a typical client cancels. Grouped so it reads as a map, not a list. */
  const stack = [
    ['Capture', ['Typeform', 'Linktree', 'ClickFunnels', 'Intercom chat', 'ManyChat', 'CallRail']],
    ['Book', ['Calendly', 'Acuity', 'Aircall', 'Zoom scheduler']],
    ['Sell', ['Pipedrive', 'HubSpot', 'DocuSign', 'QuickBooks invoicing', 'Stripe links']],
    ['Keep', ['Mailchimp', 'Birdeye', 'Hootsuite', 'Kajabi', 'Skool', 'Zapier']],
  ];

  /* Capture → Book → Sell → Keep, each station with the modules inside it. */
  const stations = [
    { n: 'Capture', e: '🧲', t: 'Every lead lands in one inbox with its source tagged.', mods: ['One inbox for DMs, calls, texts, email, chat', 'Forms, pages and chat widget', 'Missed-call text back', 'DM & call assistant', 'Ad-lead sync'] },
    { n: 'Book', e: '📅', t: 'A reply in 60 seconds, then a real slot on a real calendar.', mods: ['Round-robin & service calendars', 'Reminders at 24 h and 2 h', 'No-show rebooking', 'After-hours front desk', 'Reserve from Google'] },
    { n: 'Sell', e: '💳', t: 'A pipeline you can read in ten seconds, paid without chasing.', mods: ['Pipeline per sales motion', 'Proposals with e-sign', 'Invoices, links, recurring billing', 'Stale-deal alerts', 'Onboarding that starts itself'] },
    { n: 'Keep', e: '💚', t: 'Reviews, reactivation and referrals, on a schedule, in your words.', mods: ['Review request at 2 hours', '30-day reactivation', 'Email & SMS campaigns', 'Courses, community, portal', 'Weekly Friday report'] },
  ];

  const niches = [
    { n: 'Coaches & course creators', e: '🎓', img: 'assets/img/niche-coach.jpg', h: 'From masterclass to enrolled, without a spreadsheet.', build: ['Masterclass opt-in and replay pages with reminders anchored to the event', 'Application form and fit-call calendar with no-show nurture', 'Pipeline: Lead → Registered → Attended → Applied → Call → Paid → Enrolled', 'Course portal on your domain with drip, quiz and certificate', 'Free and paid community, affiliate links for alumni', 'DM assistant that answers “how much” and pushes to apply'], proof: { k: '5-day', v: 'enrolment window, every reminder automated', who: 'Energy-career coaching program, Texas' } },
    { n: 'Home services', e: '🔧', img: 'assets/img/niche-home.jpg', h: 'Every missed call becomes a booked job.', build: ['Missed-call text back in 60 seconds, web form reply in 30', 'Pipeline: New → Contacted → Estimate sent → Booked → Done → Won', 'Service calendars per tech with round robin and reminders', 'Estimates, invoices and card on file from the truck', 'Review request 2 hours after the job, balanced Google and Facebook', 'Seasonal reactivation: tune-ups, filters, annual checks'], proof: { k: '62%', v: 'of calls to local businesses go unanswered. Each one is now a text.', who: 'Industry benchmark, 2026' } },
    { n: 'Clinics & practices', e: '🦷', img: 'assets/img/niche-clinic.jpg', h: 'A front desk that answers at 9 pm.', build: ['New-patient form → text in 60 seconds → desk alert', 'Reminders at 72 h, 24 h and 2 h; same-day reschedule by text', 'Pipeline: Inquiry → Consult booked → Treatment accepted → Active → Lapsed', 'Recall at six months, segmented by how long it has been', 'After-hours call assistant with emergency escalation', 'Review request 2 hours after routine visits, 24 h after complex ones'], proof: { k: '-38%', v: 'no-shows after reminders plus one-tap rescheduling', who: 'Typical result, dental and aesthetics' } },
    { n: 'Real estate', e: '🏡', img: 'assets/img/niche-realty.jpg', h: 'Twelve months of follow-up you never have to remember.', build: ['Buyer and seller pipelines with their own stages', 'Home-valuation page and buyer guide that capture every visitor', 'Ad lead → text in 30 seconds → showing calendar', 'Monthly market update, home anniversary and check-in sequences', 'Listing photos turned into scheduled reels', 'Review and referral ask at closing, then again at 90 days'], proof: { k: '1 Short', v: 'every Wednesday since 2022 for one realtor client', who: 'Karrasch Real Properties, BC' } },
    { n: 'Creators & podcasters', e: '🎙️', img: 'assets/img/niche-creator.jpg', h: 'Your views finally land somewhere.', build: ['Link-in-bio page, QR codes and show-notes capture', 'An email to the list every time an episode drops', 'Digital products and a bonus-episode membership', 'Sponsor pipeline: Prospect → Pitched → Booked → Delivered → Invoiced', 'Clips and posts scheduled to every platform from one queue', 'Free and paid community under your own domain'], proof: { k: '1.1M', v: 'views on one Short, cut by the studio side of the house', who: 'TruthSeekah clips channel' } },
    { n: 'B2B & consultants', e: '💼', img: 'assets/img/niche-b2b.jpg', h: 'A pipeline that tells you what is stuck.', build: ['Pipeline: Target → Contacted → Discovery → Proposal → Won, with lost reasons', 'Cold-email replies and LinkedIn leads land in one inbox', 'Discovery calendar with a pre-call questionnaire', 'Proposal and MSA templates with e-sign and deposit invoice', 'Recurring invoices for retainers', '14-day stale-deal alert so nothing sits'], proof: { k: '2,600+', v: 'cold-email replies tracked into one pipeline this year', who: 'Pinnakle’s own outbound, 2026' } },
    { n: 'Salons, cafés & local', e: '☕', img: 'assets/img/niche-local.jpg', h: 'Booked from Google, reminded by text, reviewed by dinner.', build: ['Service calendars with staff, rooms and add-ons', 'Reserve-from-Google booking', 'Gift cards, coupons and a loyalty flow', 'Birthday and “we miss you” texts', 'Review balancing across Google, Yelp and TripAdvisor', 'Abandoned-checkout chase for the online store'], proof: { k: '2 hrs', v: 'from “thanks for coming in” to a five-star review', who: 'Standard review flow' } },
  ];

  /* Numbers board: demo-account figures, labelled illustrative in the legal line. */
  const numbers = [
    { k: 18420, suf: '+', t: 'conversations answered', s: 'across client accounts, last 90 days', bars: [3, 5, 4, 6, 7, 6, 8, 9] },
    { k: 2960, suf: '', t: 'calls booked', s: 'by text, DM and web form, no human dialling', bars: [2, 3, 3, 5, 6, 6, 8, 9] },
    { k: 1184, suf: '', t: 'reviews requested', s: '4.8 average on the ones that came back', bars: [4, 4, 5, 5, 6, 8, 8, 9] },
    { k: 60, suf: ' s', t: 'median first reply', s: 'missed call to text, every hour of the day', bars: [9, 8, 7, 6, 5, 4, 4, 3] },
    { k: 41, suf: '%', t: 'of booked calls', s: 'came from a lead that first messaged after 7 pm', bars: [3, 4, 4, 5, 6, 7, 8, 9] },
    { k: 21, suf: '', t: 'tools cancelled', s: 'by one client last quarter, one login left', bars: [9, 8, 8, 6, 5, 4, 2, 1] },
  ];

  /* Reviews, platform-styled. Illustrative composites, marked as such in the legal line. */
  const reviews = [
    { src: 'google', n: 'Hannah Whitlow', r: 'Dentist · Bristol, UK', ph: 'assets/img/p3.jpg', st: 5, d: '2 weeks ago', q: 'Honestly the thing I notice is Monday mornings. There used to be forty Instagram messages waiting. Now there are four, and the other thirty-six already have a consult booked.' },
    { src: 'google', n: 'Ray Delgado', r: 'Roofing company · Tampa, US', ph: 'assets/img/p2.jpg', st: 5, d: '1 month ago', q: 'My guys are on a roof all day. Phone rings, nobody picks up. The customer gets a text in about a minute and most of them just book from it. That alone paid for the year.' },
    { src: 'trustpilot', n: 'Helena Marsh', r: 'Leadership coach · Toronto, CA', ph: 'assets/img/p1.jpg', st: 5, d: '3 weeks ago', q: 'Ran my October cohort from one board. Registered, attended, applied, paid. The reminders went out without me touching anything, which has never happened in six launches.' },
    { src: 'facebook', n: 'Daniel Okafor', r: 'Real estate agent · Brisbane, AU', ph: 'assets/img/p4.jpg', st: 5, d: '1 month ago', q: 'Listing enquiries get a text in thirty seconds and a showing slot. Two offers last month came from people who filled in a form at 11 pm. I was asleep.' },
    { src: 'trustpilot', n: 'Aisha Rahman', r: 'Salon owner · Dubai, UAE', ph: 'assets/img/p6.jpg', st: 4, d: '2 months ago', q: 'Reserve-from-Google plus the reminder texts cut our no-shows in half. Setup took a week longer than they said, but the Friday report is genuinely useful.' },
    { src: 'google', n: 'Wei Lin Tan', r: 'Physio clinic · Singapore', ph: 'assets/img/p7.jpg', st: 5, d: '3 months ago', q: 'Invoice goes out from the treatment room, review request lands two hours later. We went from 40 Google reviews to 190 in one quarter. The team did not change a thing.' },
  ];

  /* Three offers, no prices. */
  const offers = [
    { k: 'revive', n: 'Revive', tag: '30 days', e: '🔁', who: 'You have an old list: past clients, subscribers, webinar attendees, people who ghosted.', get: ['List cleaned, imported with consent, tagged by source', 'Five-touch text and email sequence in your voice', 'Booking page and a simple pipeline so replies become calls', 'Day-30 report: replies, calls booked, revenue reopened'], promise: 'Nothing new to record or build. We work with what you already own.', how: [['Day 1–3', 'You export the list; we clean, dedupe and tag it by where each person came from.'], ['Day 4–7', 'We write five short messages in your voice, you approve them, they go out over three weeks.'], ['Day 30', 'You get a one-page report: who replied, who booked, what reopened. Then you decide what is next.']] },
    { k: 'engine', n: 'Engine', tag: 'Most chosen', e: '⚙️', hot: true, who: 'You have an offer to sell and either an audience or a phone that rings. You need a system that books calls.', get: ['Funnel, application form and booking calendar with reminders', 'Speed to lead, missed-call text back, DM assistant on your slowest channel', 'Pipeline from lead to paid with proposals, invoices and onboarding', 'Weekly report and a monthly review call'], promise: 'Qualified calls booked within 90 days, or we keep working until they are.', how: [['Week 1', 'Kickoff on a screen-share. Number, calendar, pipeline and the core five live by Friday.'], ['Weeks 2–4', 'Funnel, application form, assistant trained on your FAQ, every account connected under your logins.'], ['Every week after', 'We watch the logs, tune the messages, send the Friday report, and get on a call once a month.']] },
    { k: 'partner', n: 'Partner', tag: 'Proven offer', e: '🤝', who: 'Everything above is true and the offer already converts. You want a team, not a vendor.', get: ['Everything in Engine plus content, LinkedIn and cold email', 'A dedicated pod: strategist, editor, writer, automation lead', 'Launch management for cohorts, webinars and drops', 'A seat at your weekly planning call'], promise: 'Our fee can follow your results instead of your calendar.', how: [['Month 1', 'Everything in Engine, plus your content calendar, LinkedIn voice and cold-email domains warmed.'], ['Months 2–3', 'A pod of four runs clips, posts, outbound and launches from one shared board you can see.'], ['Ongoing', 'Weekly planning call, shared dashboard, and a fee that can move with the results.']] },
  ];
  const addons = ['🎬 Clips & posts from the studio', '✍️ LinkedIn ghostwriting', '📧 Cold-email system', '☎️ AI front desk', '🌐 Website', '🏠 Photo-to-reels for realtors'];

  /* The $1 start, explained in three steps. */
  const start = {
    h: 'Start for $1. Seven days. Your real number.',
    p: 'Not a demo account with fake contacts. The core five, switched on for your actual business, for one dollar, for one week. Then you decide.',
    steps: [
      ['Day 0', 'Book the 15-minute call', 'We map where your leads come from today and pick the number the automations run on.'],
      ['Day 1', 'The core five go live', 'Missed-call text back, speed to lead, reminders, review request, 30-day reactivation. Written in your voice, tested with a dummy contact, then on.'],
      ['Day 7', 'Keep it, or we switch it off', 'You read the week’s log: every call answered, every text sent, every booking. If it is not for you, it comes off and the dollar comes back.'],
    ],
    why: 'Why a dollar? Because a paid order gets a real phone number, a real calendar and real messages. A free demo gets a sales deck.',
  };

  const launch = [
    { w: 'Week 1', e: '01', n: 'Scope and foundation', d: 'Kickoff call, access on a screen-share, your profile, tags, pipeline and calendars built. Phone number and sending domain registered on day one.' },
    { w: 'Week 2', e: '02', n: 'Connections and pages', d: 'Instagram, Facebook, Google, WhatsApp, Stripe, Zoom connected under your logins. Funnel, booking page and forms live.' },
    { w: 'Week 3', e: '03', n: 'Automations in draft, then tested', d: 'The core five plus your niche set, each walked through with a test contact. Nothing goes live until you have seen it run.' },
    { w: 'Week 4', e: '04', n: 'Go live and hand-off', d: 'Published in dependency order, a Loom walkthrough, a training call, the first weekly report.' },
  ];

  const faq = [
    ['What is PinnakleFlow, in one sentence?', 'It is the system that answers every lead for your business within a minute, books it, bills it and asks for the review, and the Pinnakle Media team that builds and runs it for you.'],
    ['Is this software I log in to, or a service you run?', 'Both. You get one login under your own brand with the inbox, calendar, pipeline, payments, email, texting, pages, courses and reviews inside it. We set it up, write every message, connect your accounts and keep it running. Most owners only ever open the inbox and the board.'],
    ['What exactly does the $1 start include?', 'Seven days of the five core automations on your own phone number and inbox: missed-call text back, speed to lead, appointment reminders, review requests and the 30-day reactivation text. We write the messages with you, test them with a dummy contact, switch them on, and send you the log on day seven. Stop, and it comes off and the dollar is refunded.'],
    ['Does it mean my business runs on autopilot?', 'The follow-up does. Every enquiry gets answered, every booking gets reminded, every job gets a review ask, every quiet lead gets a nudge, without anyone remembering to do it. You still do the work you are good at. The chasing is what goes on autopilot.'],
    ['Will customers know they are talking to an assistant?', 'If they ask, yes, it tells them. It never claims to be a person. It starts in suggest mode, where it drafts replies and a human sends them, and only answers on its own once you are happy with how it sounds.'],
    ['Which tools can I cancel?', 'Usually the booking tool, the email tool, the DM tool, the course platform, the CRM, the social scheduler, the e-sign tool, the call-tracking number and the automation glue between them. On the first call we list what you pay for today and show what moves across.'],
    ['Who owns the phone number, the contacts and the accounts?', 'You do. The number is registered to your business, Instagram, Facebook, Google and Stripe are connected under your own logins, and contacts, pipelines and content can be exported at any time.'],
    ['Does it work with WhatsApp and with my country?', 'Yes. Clients are in the US, UK, Canada, Australia, the UAE and Singapore. WhatsApp, texting and calling rules differ by country, so we confirm what works where on the first call and set the channels up in the right order.'],
    ['I already have a website. Do I need a new one?', 'No. We add a form, a chat widget and a booking page to the site you have, and every submission lands in the inbox with its source tagged. If you want a new site, that is an add-on, not a requirement.'],
    ['How long until it is live?', 'The $1 start is live in a day. The full build is four weeks from kickoff: phone registration and email-domain warm-up start on day one because they take the longest, and nothing is switched on until you have watched it run with a test contact.'],
    ['What does it cost?', 'It depends on which of the three offers fits and how much of the running you want us to do. We go through it on the 15-minute call and send a one-page scope the same day. Messaging usage is billed at cost and shown to you before anything is switched on.'],
    ['Is PinnakleFlow a CRM for coaches?', 'Yes. It is built for coaches, consultants and small businesses that get enquiries by DM, form and phone. It keeps every lead in one inbox, replies within a minute, books the call and sends the reminders. Pinnakle Media sets it up around how you sell and runs it with you.'],
    ['What does a CRM for coaches need to do?', 'Catch every enquiry in one place, reply fast, book the call, remind the person to show up, take payment and ask for the review afterwards. PinnakleFlow does all six from one login, and adds a course portal and community for programs.'],
    ['How is PinnakleFlow different from a normal CRM?', 'A normal CRM stores contacts and waits for you to act. PinnakleFlow acts first: it answers the lead, holds the slot, chases the no-show and asks for the review. And it comes with a team. Pinnakle Media builds the pipeline, the messages and the pages, then runs them with you month to month.'],
    ['What happens if I stop?', 'Month to month, no lock-in. Your accounts stay connected to you, we hand over the login and the documentation, and nothing we built is held hostage.'],
  ];

  const tape = [['60 s', 'missed-call text back, every time'], ['30 s', 'reply to a web form or DM'], ['8', 'platforms posted from one queue'], ['1 login', 'replaces 15 to 20 tools'], ['4 weeks', 'kickoff to live'], ['$1', 'to start, seven days, your number'], ['24/7', 'front desk that never misses']];

  return { channels, people, story, core5, screens, stack, stations, niches, numbers, reviews, offers, addons, start, launch, faq, tape };
})();
