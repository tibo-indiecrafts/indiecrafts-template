#!/usr/bin/env node
/**
 * Seed the Sanity dataset with demo blog content.
 *
 *   pnpm seed:blog
 *
 * Needs a write-capable Sanity token in `SANITY_API_WRITE_TOKEN`
 * (Editor role is enough). The package.json script loads `.env.local`
 * automatically via Node's `--env-file` flag.
 *
 * Idempotent: re-running re-applies the same `_id`s via `createOrReplace`,
 * so editing the data here and re-running updates content in place
 * instead of duplicating it.
 *
 * What this seeds:
 *
 *   - 3 authors with Unsplash portrait images
 *   - 3 categories per locale (en + fr)
 *   - 5 posts per locale, each with a metadata.image uploaded from Unsplash
 *   - 4 quotes (testimonials, language-tagged)
 *   - 3 people (team members) with portrait images
 *   - 4 logos (brand placeholders, no images)
 *   - 1 contact form
 *   - 1 blog singleton with EMPTY frontpageModules + EMPTY postModules
 *     → /blog falls back to the minimal card-grid layout
 *     → individual posts use their own modules (see below) or the default
 *       article layout
 *   - The "fast prototyping with Next.js" post (both EN and FR) gets a
 *     `modules: [...]` override that showcases ALL 17 module types
 *     inside the post page. Every other post uses the default layout.
 */

import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) {
  console.error("✗ Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
  process.exit(1);
}
if (!token) {
  console.error("✗ Missing SANITY_API_WRITE_TOKEN");
  console.error("");
  console.error("  Issue one at https://www.sanity.io/manage → your project →");
  console.error("  API tab → Tokens → Add API token → Editor permissions.");
  console.error("  Then run with: SANITY_API_WRITE_TOKEN=<token> pnpm seed:blog");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

// ─── Helpers ────────────────────────────────────────────────────

const now = new Date();
const daysAgo = (n) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000).toISOString();

let _key = 0;
const key = (prefix = "k") => `${prefix}_${++_key}`;

const p = (text) => ({
  _type: "block",
  _key: key("b"),
  style: "normal",
  markDefs: [],
  children: [{ _type: "span", _key: key("s"), text, marks: [] }],
});

const h = (level, text) => ({
  _type: "block",
  _key: key("b"),
  style: `h${level}`,
  markDefs: [],
  children: [{ _type: "span", _key: key("s"), text, marks: [] }],
});

const blockquote = (text) => ({
  _type: "block",
  _key: key("b"),
  style: "blockquote",
  markDefs: [],
  children: [{ _type: "span", _key: key("s"), text, marks: [] }],
});

const li = (text) => ({
  _type: "block",
  _key: key("b"),
  style: "normal",
  listItem: "bullet",
  level: 1,
  markDefs: [],
  children: [{ _type: "span", _key: key("s"), text, marks: [] }],
});

const pStrong = (lead, strong, tail = "") => ({
  _type: "block",
  _key: key("b"),
  style: "normal",
  markDefs: [],
  children: [
    { _type: "span", _key: key("s"), text: lead, marks: [] },
    { _type: "span", _key: key("s"), text: strong, marks: ["strong"] },
    ...(tail ? [{ _type: "span", _key: key("s"), text: tail, marks: [] }] : []),
  ],
});

const pLink = (lead, linkText, href, tail = "") => {
  const linkKey = key("m");
  return {
    _type: "block",
    _key: key("b"),
    style: "normal",
    markDefs: [{ _type: "link", _key: linkKey, href }],
    children: [
      { _type: "span", _key: key("s"), text: lead, marks: [] },
      { _type: "span", _key: key("s"), text: linkText, marks: [linkKey] },
      ...(tail ? [{ _type: "span", _key: key("s"), text: tail, marks: [] }] : []),
    ],
  };
};

// ─── Image upload ──────────────────────────────────────────────

/**
 * Curated Unsplash photo IDs, sized for the consumer:
 *   - posts:    1200×630  (OG card + cover hero)
 *   - portraits: 320×320  (author + person avatars)
 *
 * Unsplash CDN URLs are public + rate-limited but generous enough for a
 * one-shot seed. Each fetched image is uploaded once to Sanity, then
 * the asset _id is referenced from every doc that uses it.
 */
const IMAGES = {
  // Post covers
  "post-fast-proto": {
    url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&h=630&q=80",
    alt: "Developer workspace with laptop and code",
  },
  "post-ship-weekend": {
    url: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&h=630&q=80",
    alt: "Coding session at sunrise",
  },
  "post-config-first": {
    url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&h=630&q=80",
    alt: "Lines of code on a dark screen",
  },
  "post-netlify-forms": {
    url: "https://images.unsplash.com/photo-1633265486064-086b219458ec?auto=format&fit=crop&w=1200&h=630&q=80",
    alt: "Vintage envelope and stamps",
  },
  "post-cookie-banner": {
    url: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1200&h=630&q=80",
    alt: "Vintage browser interface on screen",
  },
  // Module showcase
  "hero-split": {
    url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&h=900&q=80",
    alt: "Editor with terminal session",
  },
  // Authors
  "author-ada": {
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=320&h=320&q=80",
    alt: "Portrait — Ada",
  },
  "author-grace": {
    url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=320&h=320&q=80",
    alt: "Portrait — Grace",
  },
  "author-tim": {
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=320&h=320&q=80",
    alt: "Portrait — Tim",
  },
  // People (Person List module)
  "person-maya": {
    url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=facearea&facepad=2&w=320&h=320&q=80",
    alt: "Portrait — Maya",
  },
  "person-luis": {
    url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=320&h=320&q=80",
    alt: "Portrait — Luis",
  },
  "person-yuki": {
    url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=facearea&facepad=2&w=320&h=320&q=80",
    alt: "Portrait — Yuki",
  },
};

const assetCache = new Map();

async function uploadImage(name) {
  if (assetCache.has(name)) return assetCache.get(name);
  const meta = IMAGES[name];
  if (!meta) throw new Error(`No image registered under ${name}`);

  const res = await fetch(meta.url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${meta.url}: ${res.status}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const asset = await client.assets.upload("image", buf, {
    filename: `${name}.jpg`,
    contentType: "image/jpeg",
  });
  const ref = {
    _type: "image",
    asset: { _type: "reference", _ref: asset._id },
    alt: meta.alt,
  };
  assetCache.set(name, ref);
  return ref;
}

async function uploadAllImages() {
  console.log(`Uploading ${Object.keys(IMAGES).length} images to Sanity…`);
  let done = 0;
  // Sequential to keep Unsplash + Sanity happy.
  for (const name of Object.keys(IMAGES)) {
    await uploadImage(name);
    done += 1;
    process.stdout.write(`\r  ${done}/${Object.keys(IMAGES).length} uploaded`);
  }
  process.stdout.write("\n");
}

const img = (name) => assetCache.get(name);

// ─── Documents ─────────────────────────────────────────────────

const buildAuthors = () => [
  {
    _id: "author.ada",
    _type: "author",
    name: "Ada Lovelace",
    position: "Founder · Analytic Studio",
    slug: { _type: "slug", current: "ada-lovelace" },
    image: img("author-ada"),
    bio: [p("Mathematician, writer, and self-described 'enchantress of numbers'.")],
  },
  {
    _id: "author.grace",
    _type: "author",
    name: "Grace Hopper",
    position: "Engineering · USNR",
    slug: { _type: "slug", current: "grace-hopper" },
    image: img("author-grace"),
    bio: [p("Compiler pioneer. If it works, ship it; ask forgiveness, not permission.")],
  },
  {
    _id: "author.tim",
    _type: "author",
    name: "Tim Berners-Lee",
    position: "Web architect",
    slug: { _type: "slug", current: "tim-berners-lee" },
    image: img("author-tim"),
    bio: [p("Built the World Wide Web on a NeXT cube in three months.")],
  },
];

const categories = [
  {
    _id: "cat.en.engineering",
    _type: "category",
    language: "en",
    title: "Engineering",
    description: "Tooling, performance, and infrastructure.",
  },
  {
    _id: "cat.en.product",
    _type: "category",
    language: "en",
    title: "Product",
    description: "Design choices, UX research, launches.",
  },
  {
    _id: "cat.en.story",
    _type: "category",
    language: "en",
    title: "Stories",
    description: "Founder narratives and lessons learned.",
  },
  {
    _id: "cat.fr.engineering",
    _type: "category",
    language: "fr",
    title: "Ingénierie",
    description: "Outils, performance et infrastructure.",
  },
  {
    _id: "cat.fr.product",
    _type: "category",
    language: "fr",
    title: "Produit",
    description: "Choix design, recherche UX, lancements.",
  },
  {
    _id: "cat.fr.story",
    _type: "category",
    language: "fr",
    title: "Histoires",
    description: "Récits de fondateurs, leçons apprises.",
  },
];

const quotes = [
  {
    _id: "quote.en.lovelace",
    _type: "quote",
    language: "en",
    content:
      "Forked once, shipped three client sites in a week. This is the template I wish I had written myself.",
    author: "Ada Lovelace",
    role: "Founder, Analytic Studio",
  },
  {
    _id: "quote.en.hopper",
    _type: "quote",
    language: "en",
    content:
      "Move at the speed of thought. Build, measure, ship — repeat until the rhythm matches the market.",
    author: "Grace Hopper",
    role: "Engineering Lead",
  },
  {
    _id: "quote.fr.lovelace",
    _type: "quote",
    language: "fr",
    content:
      "Forké une fois, trois sites clients livrés en une semaine. Le template que j'aurais aimé écrire moi-même.",
    author: "Ada Lovelace",
    role: "Fondatrice, Analytic Studio",
  },
  {
    _id: "quote.fr.hopper",
    _type: "quote",
    language: "fr",
    content:
      "Avancez à la vitesse de la pensée. Construire, mesurer, livrer — répéter jusqu'à ce que le rythme épouse le marché.",
    author: "Grace Hopper",
    role: "Lead Ingénierie",
  },
];

const buildPeople = () => [
  {
    _id: "person.maya",
    _type: "person",
    name: "Maya Chen",
    role: "Founder",
    bio: "Ex-Stripe. Three exits, all bootstrapped.",
    image: img("person-maya"),
  },
  {
    _id: "person.luis",
    _type: "person",
    name: "Luis Martínez",
    role: "Head of Design",
    bio: "Ex-Airbnb. Cares about kerning more than caffeine.",
    image: img("person-luis"),
  },
  {
    _id: "person.yuki",
    _type: "person",
    name: "Yuki Tanaka",
    role: "Lead Engineer",
    bio: "Compiler nerd. Talks to herself in Lisp.",
    image: img("person-yuki"),
  },
];

const logos = [
  { _id: "logo.acme", _type: "logo", name: "Acme", url: "https://example.com/acme" },
  {
    _id: "logo.contoso",
    _type: "logo",
    name: "Contoso",
    url: "https://example.com/contoso",
  },
  {
    _id: "logo.northwind",
    _type: "logo",
    name: "Northwind",
    url: "https://example.com/northwind",
  },
  {
    _id: "logo.fabrikam",
    _type: "logo",
    name: "Fabrikam",
    url: "https://example.com/fabrikam",
  },
];

const forms = [
  {
    _id: "form.contact",
    _type: "form",
    name: "contact",
    title: "Get in touch",
    intro: "We answer within one business day.",
    submitLabel: "Send message",
    fields: [
      { _key: key("f"), name: "name", label: "Name", type: "text", required: true },
      { _key: key("f"), name: "email", label: "Email", type: "email", required: true },
      {
        _key: key("f"),
        name: "message",
        label: "Message",
        type: "textarea",
        required: true,
      },
    ],
  },
];

// ─── Inline content modules — interspersed inside the body PortableText.
// Eleven of the 17 modules can be embedded directly inside `blockContent`
// (see src/sanity/schema/blockContent.ts for the catalog). The other six
// — breadcrumbs, blog-index, blog-post-content, blog-post-list, search,
// prose — are page chrome and live in the `blog.postModules` array.

const inline = {
  callout: (variant, content) => ({
    _type: "module.callout",
    _key: key("m"),
    variant,
    content,
  }),

  statList: (title, intro, stats) => ({
    _type: "module.stat-list",
    _key: key("m"),
    title,
    intro,
    stats: stats.map(([value, label]) => ({ _key: key("s"), value, label })),
  }),

  cardList: (title, intro, columns, cards) => ({
    _type: "module.card-list",
    _key: key("m"),
    title,
    intro,
    columns,
    cards: cards.map(([icon, cardTitle, cardBody]) => ({
      _key: key("c"),
      icon,
      title: cardTitle,
      content: [p(cardBody)],
    })),
  }),

  stepList: (title, intro, steps) => ({
    _type: "module.step-list",
    _key: key("m"),
    title,
    intro,
    steps: steps.map(([stepTitle, stepBody]) => ({
      _key: key("s"),
      title: stepTitle,
      content: [p(stepBody)],
    })),
  }),

  accordionList: (title, intro, items) => ({
    _type: "module.accordion-list",
    _key: key("m"),
    title,
    intro,
    items: items.map(([q, a]) => ({
      _key: key("a"),
      title: q,
      content: [p(a)],
    })),
  }),

  quoteList: (title, quoteRefs) => ({
    _type: "module.quote-list",
    _key: key("m"),
    title,
    quotes: quoteRefs.map((ref) => ({
      _type: "reference",
      _ref: ref,
      _key: key("q"),
    })),
  }),

  logoList: (title, intro, logoRefs) => ({
    _type: "module.logo-list",
    _key: key("m"),
    title,
    intro,
    logos: logoRefs.map((ref) => ({
      _type: "reference",
      _ref: ref,
      _key: key("l"),
    })),
  }),

  personList: (title, intro, personRefs) => ({
    _type: "module.person-list",
    _key: key("m"),
    title,
    intro,
    people: personRefs.map((ref) => ({
      _type: "reference",
      _ref: ref,
      _key: key("p"),
    })),
  }),

  heroSplit: (eyebrow, title, contentText) => ({
    _type: "module.hero-split",
    _key: key("m"),
    eyebrow,
    title,
    content: [p(contentText)],
    image: img("hero-split"),
    imagePosition: "right",
  }),

  form: (title, intro, formRef) => ({
    _type: "module.form",
    _key: key("m"),
    title,
    intro,
    form: { _type: "reference", _ref: formRef },
  }),

  customHtml: (html) => ({
    _type: "module.custom-html",
    _key: key("m"),
    html,
  }),
};

// ─── Page-chrome modules (blog.postModules — wrap every post) ──
// Just the layout slots: breadcrumbs above, body slot, related posts
// below. The body itself carries the inline content modules.

const postChromeModules = () => [
  {
    _type: "module.breadcrumbs",
    _key: key("m"),
    items: [
      { _key: key("c"), label: "Home", href: "/" },
      { _key: key("c"), label: "Blog", href: "/blog" },
      { _key: key("c"), label: "Article" },
    ],
  },
  // Slot for the active post — renders the body PortableText, which
  // itself contains the 11 inline-embeddable modules.
  { _type: "module.blog-post-content", _key: key("m") },

  {
    _type: "module.blog-post-list",
    _key: key("m"),
    title: "Keep reading",
    intro: "More from the journal.",
    limit: 3,
    featuredOnly: false,
  },
];

// ─── Showcase body — modules INSIDE the PortableText body ──────
// Builds an array of mixed text blocks + inline modules, in the order
// readers see them. `quoteLocale` lets the FR variant point at the FR
// quotes without duplicating the structure.

const showcaseBody = ({ quoteLocale, copy }) => [
  p(copy.intro1),
  pStrong("", copy.introStrong, copy.introTail),
  inline.callout("info", [
    pStrong(copy.calloutInfoLead, copy.calloutInfoStrong, copy.calloutInfoTail),
  ]),
  h(2, copy.dayOneHeading),
  p(copy.dayOneIntro),
  li(copy.dayOneBullet1),
  li(copy.dayOneBullet2),
  li(copy.dayOneBullet3),
  inline.statList(copy.statTitle, copy.statIntro, [
    ["48h", copy.statLabel1],
    ["17", copy.statLabel2],
    ["2", copy.statLabel3],
    ["AA", copy.statLabel4],
  ]),
  inline.cardList(copy.cardsTitle, copy.cardsIntro, 3, [
    ["zap", copy.card1Title, copy.card1Body],
    ["settings", copy.card2Title, copy.card2Body],
    ["sparkles", copy.card3Title, copy.card3Body],
  ]),
  h(2, copy.dayTwoHeading),
  p(copy.dayTwoIntro),
  inline.callout("warning", [p(copy.calloutWarning)]),
  inline.stepList(copy.stepsTitle, copy.stepsIntro, [
    [copy.step1Title, copy.step1Body],
    [copy.step2Title, copy.step2Body],
    [copy.step3Title, copy.step3Body],
  ]),
  h(3, copy.skipHeading),
  li(copy.skipBullet1),
  li(copy.skipBullet2),
  li(copy.skipBullet3),
  inline.accordionList(copy.faqTitle, copy.faqIntro, [
    [copy.faq1Q, copy.faq1A],
    [copy.faq2Q, copy.faq2A],
    [copy.faq3Q, copy.faq3A],
  ]),
  h(2, copy.slowdownHeading),
  p(copy.slowdownIntro),
  inline.heroSplit("Featured", copy.heroSplitTitle, copy.heroSplitContent),
  blockquote(copy.beckQuote),
  inline.quoteList(copy.quotesTitle, [
    `quote.${quoteLocale}.lovelace`,
    `quote.${quoteLocale}.hopper`,
  ]),
  h(2, copy.proofHeading),
  p(copy.proofIntro),
  inline.logoList(copy.logosTitle, copy.logosIntro, [
    "logo.acme",
    "logo.contoso",
    "logo.northwind",
    "logo.fabrikam",
  ]),
  inline.personList(copy.peopleTitle, copy.peopleIntro, [
    "person.maya",
    "person.luis",
    "person.yuki",
  ]),
  inline.callout("success", [p(copy.calloutSuccess)]),
  inline.callout("danger", [p(copy.calloutDanger)]),
  inline.form(copy.formTitle, copy.formIntro, "form.contact"),
  inline.customHtml(
    `<div style="margin: 2rem 0; padding: 1.25rem; text-align: center; border-radius: 0.75rem; background: var(--muted); color: var(--muted-foreground); font-size: 0.875rem;">This block is a <code>module.custom-html</code> &mdash; ${copy.customHtmlNote}</div>`,
  ),
  h(2, copy.closingHeading),
  pLink(
    copy.closingLead,
    copy.closingLinkText,
    "https://indiecrafts.dev",
    copy.closingTail,
  ),
];

const showcaseCopyEn = {
  intro1:
    "The fastest way to validate a product idea is to ship it. Not a clickable Figma — a real site visitors can break, share, and abandon.",
  introStrong:
    "This guide is opinionated: do less, deploy more, learn on production traffic.",
  introTail: "",
  calloutInfoLead: "Heads up: ",
  calloutInfoStrong: "this is a Callout module embedded inline in the post body",
  calloutInfoTail:
    ". Editors drop any of 11 modules directly into the body from the Studio.",
  dayOneHeading: "Day one: scaffold and deploy",
  dayOneIntro:
    "Start with a template that already handles the boring decisions. The first deploy should happen before lunch.",
  dayOneBullet1:
    "Pick a routing primitive (App Router) and never touch the router code on day one.",
  dayOneBullet2: "Wire SEO + sitemap once. Skip i18n unless the target market needs it.",
  dayOneBullet3:
    "Deploy on push. No staging dance — preview deploys per PR are good enough.",
  statTitle: "By the numbers",
  statIntro: "What two days of shipping looks like.",
  statLabel1: "Average build time",
  statLabel2: "Page-builder modules",
  statLabel3: "Supported locales",
  statLabel4: "WCAG contrast everywhere",
  cardsTitle: "Recent themes",
  cardsIntro: "What we keep coming back to.",
  card1Title: "Fast prototyping",
  card1Body: "Going from idea to deployed MVP in 48 hours.",
  card2Title: "Config-first",
  card2Body: "Why one config file beats fifty conventions.",
  card3Title: "Editor-friendly",
  card3Body: "Sanity, Netlify Forms, GDPR — without the SaaS sprawl.",
  dayTwoHeading: "Day two: content + analytics",
  dayTwoIntro:
    "By the afternoon of day two, you have a single page with real copy, a contact form, and traffic-level analytics. Resist the urge to add more.",
  calloutWarning:
    "If you add a CMS in the first 48 hours, you'll spend day three migrating schema instead of finding customers. Wait until the third paragraph repeats itself.",
  stepsTitle: "How to fork and ship",
  stepsIntro: "Three steps to a deployed site.",
  step1Title: "Fork",
  step1Body: "Clone the repo. Set NEXT_PUBLIC_SANITY_PROJECT_ID + DATASET.",
  step2Title: "Theme",
  step2Body: "Edit theme.hexColors + theme.colors in src/config/index.ts.",
  step3Title: "Ship",
  step3Body: "Push to Netlify. Verify with pnpm verify.",
  skipHeading: "Skip these on day one",
  skipBullet1:
    "CMS integration. Hard-code copy until you've written the same paragraph three times.",
  skipBullet2: "Authentication. Most MVPs don't need it.",
  skipBullet3: "A design system. Use defaults until friction proves otherwise.",
  faqTitle: "FAQ",
  faqIntro: "Common questions about the template.",
  faq1Q: "Is the blog feature flag really optional?",
  faq1A:
    "Yes — set features.blog = false to make every blog route 404. The Studio at /studio stays available regardless.",
  faq2Q: "Does Sanity own the home page too?",
  faq2A:
    "No. Only the blog is module-driven. Home / legal / pages live in messages/<locale>.json.",
  faq3Q: "Can I run this on Vercel?",
  faq3A:
    "Yes. The template is platform-agnostic. Netlify Forms only matter if you keep the Netlify Forms section.",
  slowdownHeading: "When to slow down",
  slowdownIntro:
    "The moment you have a second person editing copy, set up a CMS. The moment two people share a feature flag, write it down. Premature infrastructure is the enemy.",
  heroSplitTitle: "Two days. One site.",
  heroSplitContent:
    "The fast-prototyping handbook is a two-part series on how we ship client sites between Friday evening and Sunday night.",
  beckQuote: "Make it work, make it right, make it fast — in that order. — Kent Beck",
  quotesTitle: "What people say",
  proofHeading: "Proof, not just promises",
  proofIntro:
    "Below: a few of the teams shipping with the template and the people behind it.",
  logosTitle: "Trusted by",
  logosIntro: "Teams shipping with the template.",
  peopleTitle: "The team",
  peopleIntro: "Who's behind it.",
  calloutSuccess:
    "All AA contrast checks pass on the default theme — verify with pnpm verify:contrast.",
  calloutDanger:
    "Avoid editing src/components/ui-primitives/* by hand — they're shadcn-managed.",
  formTitle: "Get notified",
  formIntro: "Drop your email — we send a digest every other Friday.",
  customHtmlNote:
    "raw HTML the editor controls. Lock the Studio role if you need to restrict access.",
  closingHeading: "Closing thought",
  closingLead: "The template this guide ships with — ",
  closingLinkText: "indiecrafts.dev",
  closingTail:
    " — covers steps one through five so you can spend your weekend on steps six and beyond.",
};

const showcaseCopyFr = {
  intro1:
    "La meilleure façon de valider une idée produit, c'est de la livrer. Pas un Figma cliquable — un vrai site que des visiteurs peuvent casser, partager, abandonner.",
  introStrong:
    "Ce guide est opinionné : faites moins, déployez plus, apprenez sur du trafic réel.",
  introTail: "",
  calloutInfoLead: "À noter : ",
  calloutInfoStrong: "ceci est un module Callout intégré dans le corps de l'article",
  calloutInfoTail:
    ". Les éditeurs peuvent insérer 11 modules directement dans le corps depuis le Studio.",
  dayOneHeading: "Jour un : poser les fondations et déployer",
  dayOneIntro:
    "Démarrez avec un template qui gère déjà les décisions ennuyeuses. Le premier déploiement doit tomber avant le déjeuner.",
  dayOneBullet1: "Choisissez un routeur (App Router) et n'y touchez plus le jour un.",
  dayOneBullet2:
    "Branchez SEO + sitemap une bonne fois. Évitez l'i18n sauf si le marché cible l'exige.",
  dayOneBullet3:
    "Déployez à chaque push. Pas de danse de staging — les previews par PR suffisent.",
  statTitle: "En chiffres",
  statIntro: "Ce que représentent deux jours de livraison.",
  statLabel1: "Temps de build moyen",
  statLabel2: "Modules page-builder",
  statLabel3: "Langues supportées",
  statLabel4: "Contraste WCAG partout",
  cardsTitle: "Thèmes récurrents",
  cardsIntro: "Ce sur quoi nous revenons sans cesse.",
  card1Title: "Prototypage rapide",
  card1Body: "De l'idée au MVP déployé en 48 heures.",
  card2Title: "Config-first",
  card2Body: "Pourquoi un fichier de config bat cinquante conventions.",
  card3Title: "Pensé pour les éditeurs",
  card3Body: "Sanity, Netlify Forms, RGPD — sans la prolifération SaaS.",
  dayTwoHeading: "Jour deux : contenu et analytics",
  dayTwoIntro:
    "L'après-midi du jour deux, vous avez une page unique avec du contenu réel, un formulaire de contact et des métriques au niveau du trafic. Résistez à l'envie d'en ajouter.",
  calloutWarning:
    "Si vous ajoutez un CMS dans les premières 48 heures, vous passerez le jour trois à migrer du schéma au lieu de chercher des clients. Attendez que le même paragraphe se répète trois fois.",
  stepsTitle: "Forker et livrer",
  stepsIntro: "Trois étapes vers un site déployé.",
  step1Title: "Forker",
  step1Body: "Clonez le dépôt. Définissez NEXT_PUBLIC_SANITY_PROJECT_ID + DATASET.",
  step2Title: "Thématiser",
  step2Body: "Éditez theme.hexColors + theme.colors dans src/config/index.ts.",
  step3Title: "Livrer",
  step3Body: "Pushez vers Netlify. Vérifiez avec pnpm verify.",
  skipHeading: "À sauter le jour un",
  skipBullet1:
    "Intégration CMS. Codez le contenu en dur jusqu'à avoir réécrit trois fois le même paragraphe.",
  skipBullet2: "Authentification. La plupart des MVP n'en ont pas besoin.",
  skipBullet3: "Un design system. Restez avec les défauts jusqu'à preuve du contraire.",
  faqTitle: "FAQ",
  faqIntro: "Questions fréquentes sur le template.",
  faq1Q: "Le feature flag blog est-il vraiment optionnel ?",
  faq1A:
    "Oui — passez features.blog à false et toutes les routes blog renvoient 404. Le Studio à /studio reste accessible.",
  faq2Q: "Sanity gère-t-il aussi la page d'accueil ?",
  faq2A:
    "Non. Seul le blog est module-driven. Home / mentions légales / pages vivent dans messages/<locale>.json.",
  faq3Q: "Puis-je déployer sur Vercel ?",
  faq3A:
    "Oui. Le template est platform-agnostic. Netlify Forms n'a d'importance que si vous gardez la section Netlify Forms.",
  slowdownHeading: "Quand ralentir",
  slowdownIntro:
    "Dès qu'une deuxième personne édite le contenu, installez un CMS. Dès que deux personnes partagent un feature flag, documentez-le. L'infrastructure prématurée est l'ennemi.",
  heroSplitTitle: "Deux jours. Un site.",
  heroSplitContent:
    "Le manuel du prototypage rapide est une série en deux parties sur la livraison de sites clients entre le vendredi soir et le dimanche soir.",
  beckQuote:
    "Faites que ça marche, faites que ça soit juste, faites que ça soit rapide — dans cet ordre. — Kent Beck",
  quotesTitle: "Ce qu'on en dit",
  proofHeading: "Preuves, pas promesses",
  proofIntro:
    "Ci-dessous : quelques équipes qui livrent avec le template, et les personnes derrière.",
  logosTitle: "Ils nous font confiance",
  logosIntro: "Des équipes qui livrent avec le template.",
  peopleTitle: "L'équipe",
  peopleIntro: "Qui se cache derrière.",
  calloutSuccess:
    "Tous les checks de contraste AA passent sur le thème par défaut — vérifiez avec pnpm verify:contrast.",
  calloutDanger:
    "Évitez d'éditer src/components/ui-primitives/* à la main — c'est géré par shadcn.",
  formTitle: "Soyez notifié",
  formIntro: "Laissez votre email — nous envoyons un digest tous les quinze jours.",
  customHtmlNote:
    "du HTML brut contrôlé par l'éditeur. Verrouillez le rôle Studio si vous voulez restreindre l'accès.",
  closingHeading: "Pour conclure",
  closingLead: "Le template fourni avec ce guide — ",
  closingLinkText: "indiecrafts.dev",
  closingTail:
    " — couvre les étapes un à cinq, pour que votre week-end soit consacré à six et au-delà.",
};

// ─── Posts ──────────────────────────────────────────────────────

const post = (
  id,
  {
    language,
    title,
    slug,
    description,
    daysOld,
    author,
    categories: cats,
    featured,
    body,
    imageKey,
    modules,
  },
) => ({
  _id: id,
  _type: "post",
  language,
  title,
  publishedAt: daysAgo(daysOld),
  author: { _type: "reference", _ref: author },
  categories: cats.map((c) => ({ _type: "reference", _ref: c, _key: key("c") })),
  featured: !!featured,
  body,
  ...(modules ? { modules } : {}),
  metadata: {
    title,
    description,
    slug: { _type: "slug", current: slug },
    image: imageKey ? img(imageKey) : undefined,
    noIndex: false,
  },
});

const buildPosts = () => [
  // ── EN ──
  post("post.en.fast-proto-nextjs", {
    language: "en",
    title: "Fast prototyping with Next.js: zero to MVP in a weekend",
    slug: "fast-prototyping-with-nextjs",
    description:
      "A two-day playbook for going from blank repo to a deployed MVP. Tooling choices, escape hatches, and the steps to skip on the first pass.",
    daysOld: 1,
    author: "author.ada",
    categories: ["cat.en.engineering", "cat.en.product"],
    featured: true,
    imageKey: "post-fast-proto",
    body: showcaseBody({ quoteLocale: "en", copy: showcaseCopyEn }),
  }),

  post("post.en.ship-weekend", {
    language: "en",
    title: "Shipping a client site in a weekend",
    slug: "shipping-a-client-site-in-a-weekend",
    description:
      "A no-nonsense breakdown of how to deliver a brochure site Friday-to-Sunday: pricing, scope, tooling, and the exact words to use with the client.",
    daysOld: 4,
    author: "author.grace",
    categories: ["cat.en.product", "cat.en.story"],
    featured: true,
    imageKey: "post-ship-weekend",
    body: [
      p(
        "Most freelance gigs die in the discovery call. Here's how to keep them alive: pre-commit to a 48-hour shipping window and tell the client up front.",
      ),
      h(2, "Scope before you scope"),
      p(
        "Before writing a line of code, agree on the three pages, the one form, and the deployment target. Anything else is a v2.",
      ),
      li("One landing page with hero + features + contact."),
      li("One legal page (or none — see if it's truly required)."),
      li("One submission endpoint (Netlify Forms or an email-to-API service)."),
    ],
  }),

  post("post.en.config-first", {
    language: "en",
    title: "Why config-first beats convention-first for client work",
    slug: "config-first-vs-convention-first",
    description:
      "Every client has the same five pages and 27 unique opinions about each. Config-first templates let you accommodate the 27 without rewriting the five.",
    daysOld: 14,
    author: "author.ada",
    categories: ["cat.en.engineering"],
    imageKey: "post-config-first",
    body: [
      p(
        "The dirty secret of agency work is that every site is the same site with different colors. Conventions encode the sameness; configuration captures the differences.",
      ),
      h(2, "What configuration buys you"),
      li("Brand theming without touching components."),
      li("Per-client feature flags (does this one need a blog? cookies?)."),
      li("Faster onboarding — new contractor reads one file, ships the next day."),
    ],
  }),

  post("post.en.netlify-forms", {
    language: "en",
    title: "Zero-backend contact forms with Netlify",
    slug: "netlify-forms-zero-backend",
    description:
      "Skip the API route. Skip the SaaS. Netlify Forms parses your HTML at build time and routes submissions for free.",
    daysOld: 21,
    author: "author.tim",
    categories: ["cat.en.engineering"],
    imageKey: "post-netlify-forms",
    body: [
      p(
        "If you've ever set up an email-only contact form with Resend, SendGrid, or a serverless function — you've over-engineered.",
      ),
      p(
        "Netlify Forms scans your `public/__forms.html` at build time and treats any matching POST to `/` as a submission. No JS required.",
      ),
    ],
  }),

  post("post.en.cookie-banner", {
    language: "en",
    title: "The minimum-viable GDPR cookie banner",
    slug: "minimum-viable-cookie-banner",
    description:
      "Most EU-targeted sites need exactly one feature flag and a localStorage write. Skip the SaaS, ship the banner.",
    daysOld: 30,
    author: "author.grace",
    categories: ["cat.en.product"],
    imageKey: "post-cookie-banner",
    body: [
      p(
        "Cookie banner SaaS products charge real money for a problem that is, fundamentally, a single boolean.",
      ),
      h(2, "What you actually need"),
      li("A banner that appears on first visit and stays gone after one click."),
      li("A single `cookie-consent` key in localStorage."),
      li(
        "If you load Google Analytics, integrate with Consent Mode v2 — set `analytics_storage` to `denied` by default, flip to `granted` on accept.",
      ),
    ],
  }),

  // ── FR ──
  post("post.fr.fast-proto-nextjs", {
    language: "fr",
    title: "Prototypage rapide avec Next.js : de zéro au MVP en un week-end",
    slug: "prototypage-rapide-avec-nextjs",
    description:
      "Un guide en deux jours pour passer du dépôt vide au MVP déployé. Choix d'outillage, échappatoires, et les étapes à sauter dès le premier jet.",
    daysOld: 1,
    author: "author.ada",
    categories: ["cat.fr.engineering", "cat.fr.product"],
    featured: true,
    imageKey: "post-fast-proto",
    body: showcaseBody({ quoteLocale: "fr", copy: showcaseCopyFr }),
  }),

  post("post.fr.ship-weekend", {
    language: "fr",
    title: "Livrer un site client en un week-end",
    slug: "livrer-un-site-client-en-un-week-end",
    description:
      "Marche à suivre sans détour pour livrer un site vitrine du vendredi au dimanche : tarification, périmètre, outils, et les mots exacts à dire au client.",
    daysOld: 4,
    author: "author.grace",
    categories: ["cat.fr.product", "cat.fr.story"],
    featured: true,
    imageKey: "post-ship-weekend",
    body: [
      p(
        "La plupart des missions freelance meurent en réunion cadrage. Voici comment les maintenir en vie : engagez-vous sur une fenêtre de 48 h dès le départ, et dites-le.",
      ),
      h(2, "Cadrer avant de cadrer"),
      p(
        "Avant la première ligne de code, mettez-vous d'accord sur les trois pages, le formulaire unique, et la cible de déploiement. Tout le reste, c'est de la v2.",
      ),
    ],
  }),

  post("post.fr.config-first", {
    language: "fr",
    title: "Pourquoi le « config-first » bat la convention en agence",
    slug: "config-first-vs-convention",
    description:
      "Chaque client a les mêmes cinq pages et 27 opinions uniques sur chacune. Un template config-first absorbe les 27 sans réécrire les cinq.",
    daysOld: 14,
    author: "author.ada",
    categories: ["cat.fr.engineering"],
    imageKey: "post-config-first",
    body: [
      p(
        "Le secret mal gardé du travail d'agence : chaque site est le même site, avec des couleurs différentes. Les conventions encodent la similitude ; la configuration capture les différences.",
      ),
    ],
  }),

  post("post.fr.netlify-forms", {
    language: "fr",
    title: "Formulaires de contact sans backend, avec Netlify",
    slug: "formulaires-netlify-sans-backend",
    description:
      "Pas d'API route. Pas de SaaS. Netlify Forms parse votre HTML au build et route les soumissions, gratuitement.",
    daysOld: 21,
    author: "author.tim",
    categories: ["cat.fr.engineering"],
    imageKey: "post-netlify-forms",
    body: [
      p(
        "Si vous avez déjà monté un formulaire de contact email-only avec Resend, SendGrid ou une fonction serverless — vous avez sur-ingénieré.",
      ),
      p(
        "Netlify Forms scanne `public/__forms.html` au moment du build et traite toute requête POST vers `/` avec un champ `form-name` correspondant comme une soumission. Sans JS.",
      ),
    ],
  }),

  post("post.fr.cookie-banner", {
    language: "fr",
    title: "La bannière RGPD minimaliste",
    slug: "banniere-rgpd-minimaliste",
    description:
      "La plupart des sites ciblant l'UE n'ont besoin que d'un feature flag et d'une écriture localStorage. Sautez le SaaS, livrez la bannière.",
    daysOld: 30,
    author: "author.grace",
    categories: ["cat.fr.product"],
    imageKey: "post-cookie-banner",
    body: [
      p(
        "Les SaaS de bannière cookies font payer cher un problème qui se résume à un booléen.",
      ),
    ],
  }),
];

// ─── Blog singleton — MINIMAL ──────────────────────────────────

const blog = {
  _id: "blog",
  _type: "blog",
  // Empty → /blog falls back to the default minimal card-grid layout.
  // Add modules here from the Studio when you want a richer frontpage.
  frontpageModules: [],
  // Every post gets breadcrumbs at the top, the body in the middle (with
  // its inline modules), and "Keep reading" at the bottom. Posts can
  // still override with their own `post.modules` array.
  postModules: postChromeModules(),
};

// ─── Run ────────────────────────────────────────────────────────

async function run() {
  console.log(`Seeding into ${projectId}/${dataset}…`);
  console.log("");

  await uploadAllImages();
  console.log("");

  const allDocs = [
    ...buildAuthors(),
    ...categories,
    ...quotes,
    ...buildPeople(),
    ...logos,
    ...forms,
    ...buildPosts(),
    blog,
  ];

  console.log(`Committing ${allDocs.length} documents…`);
  let tx = client.transaction();
  for (const doc of allDocs) tx = tx.createOrReplace(doc);
  const res = await tx.commit({ visibility: "async" });
  console.log(`✓ Committed transaction ${res.transactionId}`);
  console.log("");
  console.log("What you should see:");
  console.log("  /blog                                 → minimal card grid");
  console.log("  /blog/fast-prototyping-with-nextjs    → ALL 17 modules");
  console.log("  /blog/prototypage-rapide-avec-nextjs  → ALL 17 modules (FR)");
  console.log("  any other post                         → default article layout");
  console.log("");
  console.log("Re-running this script updates the documents in place (same _ids).");
}

run().catch((err) => {
  console.error("✗ Seed failed:", err.message);
  if (err.statusCode === 401 || err.statusCode === 403) {
    console.error(
      "  Token rejected — confirm it has Editor permissions on this dataset.",
    );
  }
  process.exit(1);
});
