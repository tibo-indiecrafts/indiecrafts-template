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

// ─── Module showcase (all 17, used as post.modules) ────────────

const showcaseModules = () => [
  {
    _type: "module.breadcrumbs",
    _key: key("m"),
    items: [
      { _key: key("c"), label: "Home", href: "/" },
      { _key: key("c"), label: "Blog", href: "/blog" },
      { _key: key("c"), label: "Showcase" },
    ],
  },

  {
    _type: "module.blog-index",
    _key: key("m"),
    eyebrow: "Indiecrafts Journal",
    title: "Every module, one page",
    intro:
      "Below: each of the 17 page-builder modules rendered against the same theme tokens, so you can see how they compose.",
  },

  {
    _type: "module.hero-split",
    _key: key("m"),
    eyebrow: "Featured",
    title: "Two days. One site.",
    content: [
      p(
        "The fast-prototyping handbook is a two-part series on how we ship client sites between Friday evening and Sunday night.",
      ),
    ],
    image: img("hero-split"),
    imagePosition: "right",
  },

  {
    _type: "module.stat-list",
    _key: key("m"),
    title: "By the numbers",
    intro: "What two days of shipping looks like.",
    stats: [
      { _key: key("s"), value: "48h", label: "Average build time" },
      { _key: key("s"), value: "17", label: "Page-builder modules" },
      { _key: key("s"), value: "2", label: "Supported locales" },
      { _key: key("s"), value: "AA", label: "WCAG contrast everywhere" },
    ],
  },

  {
    _type: "module.card-list",
    _key: key("m"),
    title: "Recent themes",
    intro: "What we keep coming back to.",
    columns: 3,
    cards: [
      {
        _key: key("c"),
        icon: "zap",
        title: "Fast prototyping",
        content: [p("Going from idea to deployed MVP in 48 hours.")],
      },
      {
        _key: key("c"),
        icon: "settings",
        title: "Config-first",
        content: [p("Why one config file beats fifty conventions.")],
      },
      {
        _key: key("c"),
        icon: "sparkles",
        title: "Editor-friendly",
        content: [p("Sanity, Netlify Forms, GDPR — without the SaaS sprawl.")],
      },
    ],
  },

  {
    _type: "module.prose",
    _key: key("m"),
    width: "wide",
    content: [
      h(2, "What follows"),
      p(
        "Everything below is editor-composable. The order is arbitrary — drag modules around in the Studio to recompose the page.",
      ),
    ],
  },

  {
    _type: "module.callout",
    _key: key("m"),
    variant: "info",
    content: [
      pStrong(
        "Heads up: ",
        "this is a Callout module — info variant",
        ". Use it for context the reader needs but isn't part of the main narrative.",
      ),
    ],
  },

  {
    _type: "module.callout",
    _key: key("m"),
    variant: "success",
    content: [p("Success variant — confirmations, completed-state messaging.")],
  },

  {
    _type: "module.callout",
    _key: key("m"),
    variant: "warning",
    content: [p("Warning variant — caveats, gotchas, things to double-check.")],
  },

  {
    _type: "module.callout",
    _key: key("m"),
    variant: "danger",
    content: [
      p("Danger variant — destructive operations, deprecations, security holds."),
    ],
  },

  // The actual post body slots in here. Authoring tip: place this where
  // the reader expects the "main article" — usually near the top, with
  // contextual modules above and supplementary modules below.
  { _type: "module.blog-post-content", _key: key("m") },

  {
    _type: "module.accordion-list",
    _key: key("m"),
    title: "FAQ",
    intro: "Common questions about the template.",
    items: [
      {
        _key: key("a"),
        title: "Is the blog feature flag really optional?",
        content: [
          p(
            "Yes — set features.blog = false to make every blog route 404. The Studio at /studio stays available regardless.",
          ),
        ],
      },
      {
        _key: key("a"),
        title: "Does Sanity own the home page too?",
        content: [
          p(
            "No. Only the blog is module-driven. Home / legal / pages live in messages/<locale>.json.",
          ),
        ],
      },
      {
        _key: key("a"),
        title: "Can I run this on Vercel?",
        content: [
          p(
            "Yes. The template is platform-agnostic. Netlify Forms only matter if you keep the Netlify Forms section.",
          ),
        ],
      },
    ],
  },

  {
    _type: "module.step-list",
    _key: key("m"),
    title: "How to fork and ship",
    intro: "Three steps to a deployed site.",
    steps: [
      {
        _key: key("s"),
        title: "Fork",
        content: [p("Clone the repo. Set NEXT_PUBLIC_SANITY_PROJECT_ID + DATASET.")],
      },
      {
        _key: key("s"),
        title: "Theme",
        content: [p("Edit theme.hexColors + theme.colors in src/config/index.ts.")],
      },
      {
        _key: key("s"),
        title: "Ship",
        content: [p("Push to Netlify. Verify with pnpm verify.")],
      },
    ],
  },

  {
    _type: "module.quote-list",
    _key: key("m"),
    title: "What people say",
    quotes: [
      { _type: "reference", _ref: "quote.en.lovelace", _key: key("q") },
      { _type: "reference", _ref: "quote.en.hopper", _key: key("q") },
    ],
  },

  {
    _type: "module.logo-list",
    _key: key("m"),
    title: "Trusted by",
    intro: "Teams shipping with the template.",
    logos: [
      { _type: "reference", _ref: "logo.acme", _key: key("l") },
      { _type: "reference", _ref: "logo.contoso", _key: key("l") },
      { _type: "reference", _ref: "logo.northwind", _key: key("l") },
      { _type: "reference", _ref: "logo.fabrikam", _key: key("l") },
    ],
  },

  {
    _type: "module.person-list",
    _key: key("m"),
    title: "The team",
    intro: "Who's behind it.",
    people: [
      { _type: "reference", _ref: "person.maya", _key: key("p") },
      { _type: "reference", _ref: "person.luis", _key: key("p") },
      { _type: "reference", _ref: "person.yuki", _key: key("p") },
    ],
  },

  {
    _type: "module.search",
    _key: key("m"),
    title: "Search posts",
    placeholder: "Search by title…",
    scope: "post",
  },

  {
    _type: "module.blog-post-list",
    _key: key("m"),
    title: "Keep reading",
    intro: "More from the journal.",
    limit: 6,
    featuredOnly: false,
  },

  {
    _type: "module.form",
    _key: key("m"),
    title: "Get notified",
    intro: "Drop your email — we send a digest every other Friday.",
    form: { _type: "reference", _ref: "form.contact" },
  },

  {
    _type: "module.custom-html",
    _key: key("m"),
    html: '<div style="margin: 2rem auto; max-width: 48rem; padding: 1.5rem; text-align: center; border-radius: 0.75rem; background: var(--muted); color: var(--muted-foreground); font-size: 0.875rem;">This block is a <code>module.custom-html</code> — raw HTML the editor controls. Lock the Studio role if you need to restrict access.</div>',
  },
];

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
    modules: showcaseModules(),
    body: [
      p(
        "The fastest way to validate a product idea is to ship it. Not a clickable Figma — a real site visitors can break, share, and abandon.",
      ),
      pStrong(
        "This guide is opinionated: ",
        "do less, deploy more, learn on production traffic",
        ".",
      ),
      h(2, "Day one: scaffold and deploy"),
      p(
        "Start with a template that already handles the boring decisions. The first deploy should happen before lunch.",
      ),
      li(
        "Pick a routing primitive (App Router) and never touch the router code on day one.",
      ),
      li("Wire SEO + sitemap once. Skip i18n unless the target market needs it."),
      li("Deploy on push. No staging dance — preview deploys per PR are good enough."),
      h(2, "Day two: content + analytics"),
      p(
        "By the afternoon of day two, you have a single page with real copy, a contact form, and traffic-level analytics. Resist the urge to add more.",
      ),
      blockquote(
        "Make it work, make it right, make it fast — in that order. — Kent Beck",
      ),
      pLink(
        "The template this guide ships with — ",
        "indiecrafts.dev",
        "https://indiecrafts.dev",
        " — covers steps one through five so you can spend your weekend on steps six and beyond.",
      ),
    ],
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
    modules: showcaseModules(),
    body: [
      p(
        "La meilleure façon de valider une idée produit, c'est de la livrer. Pas un Figma cliquable — un vrai site que des visiteurs peuvent casser, partager, abandonner.",
      ),
      pStrong(
        "Ce guide est opinionné : ",
        "faites moins, déployez plus, apprenez sur du trafic réel",
        ".",
      ),
      h(2, "Jour un : poser les fondations et déployer"),
      p(
        "Démarrez avec un template qui gère déjà les décisions ennuyeuses. Le premier déploiement doit tomber avant le déjeuner.",
      ),
      li("Choisissez un routeur (App Router) et n'y touchez plus le jour un."),
      li(
        "Branchez SEO + sitemap une bonne fois. Évitez l'i18n sauf si le marché cible l'exige.",
      ),
      li(
        "Déployez à chaque push. Pas de danse de staging — les previews par PR suffisent.",
      ),
      blockquote(
        "Faites que ça marche, faites que ça soit juste, faites que ça soit rapide — dans cet ordre. — Kent Beck",
      ),
      pLink(
        "Le template fourni avec ce guide — ",
        "indiecrafts.dev",
        "https://indiecrafts.dev",
        " — couvre les étapes un à cinq, pour que votre week-end soit consacré à six et au-delà.",
      ),
    ],
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
  // Empty → individual posts use the default article layout, unless
  // a specific post sets its own `modules` (see post.modules above).
  postModules: [],
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
