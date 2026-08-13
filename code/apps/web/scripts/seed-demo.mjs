#!/usr/bin/env node
/**
 * Seed the Sanity dataset with demo blog content.
 *
 *   pnpm seed
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
 * Every content document is translated (plugin-managed `language`): each entity
 * has an EN + FR version linked by a `translation.metadata` doc.
 *
 *   - 3 authors per locale (6 docs) with Unsplash portrait images
 *   - 3 categories per locale (6 docs)
 *   - 10 tags per locale (20 docs)
 *   - 5 posts per locale (10 docs), each with a metadata.image from Unsplash
 *   - 2 quotes per locale (4 docs, testimonials)
 *   - 3 people per locale (6 docs, team members) with portrait images
 *   - `translation.metadata` docs linking every EN↔FR set
 *   - 1 `siteMeta.<locale>` singleton per language — the per-language SEO source:
 *     tagline / description / keywords, OG share card (uploaded from
 *     `scripts/seed-media/` — og.png / og-fr.png), llms.txt summary + resources,
 *     and per-page title/description overrides (home / blog / legal)
 *   - 1 `siteSettings` singleton — logo + favicon/app icon (from `scripts/seed-media/`),
 *     social profiles, business entity, one demo global schema (Service)
 *   - 1 blog singleton with EMPTY postModules
 *     → /blog falls back to the minimal card-grid layout
 *     → individual posts use their own modules (see below) or the default
 *       article layout
 *   - The "fast prototyping with Next.js" post (both EN and FR) gets a
 *     `modules: [...]` override that showcases the inline module types
 *     (gallery excluded — it needs uploaded images). Every other post uses
 *     the default layout.
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** Local seed media — checked-in assets uploaded to Sanity (vs the Unsplash URLs). */
const MEDIA_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "seed-media");

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
  console.error("  Then run with: SANITY_API_WRITE_TOKEN=<token> pnpm seed");
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

const numli = (text) => ({
  _type: "block",
  _key: key("b"),
  style: "normal",
  listItem: "number",
  level: 1,
  markDefs: [],
  children: [{ _type: "span", _key: key("s"), text, marks: [] }],
});

// Paragraph mixing plain + decorated spans. `decorations` is an array of
// `[text, marks[]]`; `marks` can be ["strong"], ["em"], ["code"], etc.
const pMixed = (parts) => ({
  _type: "block",
  _key: key("b"),
  style: "normal",
  markDefs: [],
  children: parts.map(([text, marks = []]) => ({
    _type: "span",
    _key: key("s"),
    text,
    marks,
  })),
});

const imgBlock = (name, alt = "") => {
  const ref = img(name);
  if (!ref) throw new Error(`imgBlock: image "${name}" not in cache`);
  return {
    _type: "image",
    _key: key("img"),
    asset: ref.asset,
    alt,
  };
};

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

// ─── Local media (from scripts/seed-media/) ────────────────────
// The OG share cards live in the repo, not on Unsplash. Uploaded to Sanity and
// referenced by the `siteMeta.<locale>` singletons so the Studio ships a real
// per-language OG image out of the box (editors can then replace it).
const LOCAL_MEDIA = {
  "og.en": { file: "og.png", contentType: "image/png", alt: "indiecrafts.dev" },
  "og.fr": { file: "og-fr.png", contentType: "image/png", alt: "indiecrafts.dev" },
  logo: { file: "logo.png", contentType: "image/png", alt: "indiecrafts.dev" },
  icon: { file: "icon.png", contentType: "image/png", alt: "indiecrafts.dev" },
};

async function uploadLocalMedia() {
  for (const [name, meta] of Object.entries(LOCAL_MEDIA)) {
    const buf = readFileSync(path.join(MEDIA_DIR, meta.file));
    const asset = await client.assets.upload("image", buf, {
      filename: meta.file,
      contentType: meta.contentType,
    });
    assetCache.set(name, {
      _type: "image",
      asset: { _type: "reference", _ref: asset._id },
      alt: meta.alt,
    });
  }
}

// One `siteMeta.<locale>` singleton per language — the SOLE runtime source for
// the site's per-language SEO (no config fallback): tagline / description /
// keywords, the OG card, the llms.txt summary + resources, and per-page
// `<title>` / description overrides. Read by `getSiteSeo` (src/lib/seo/site-seo.ts).
const res = (name, href) => ({ _key: key("res"), name, href });
const pgSeo = (pageId, title, description, keywords, llmsFull, llmsSummary) => ({
  _key: key("pg"),
  pageId,
  title,
  description,
  keywords,
  llmsSummary,
  llmsFull,
});

const buildSiteMeta = () => [
  {
    _id: "siteMeta.en",
    _type: "siteMeta",
    language: "en",
    ogImage: img("og.en"),
    tagline: "The config-first Next.js template for client websites.",
    description:
      "A highly modular, SEO-ready, i18n-ready, accessibility-first Next.js template. Fork it, edit the config, ship.",
    keywords: "Next.js template, client websites, SEO, i18n, Sanity, Tailwind",
    llms: {
      summary: "A config-first Next.js template for shipping client websites fast.",
      paragraph:
        "Indie Crafts is a modular, SEO-ready, i18n-ready Next.js template for freelancers and studios. Fork it, edit one config file, and ship a client site in a weekend.",
      full: "# Indie Crafts\n\nA config-first Next.js 16 template for freelancers and studios who ship client websites. The whole site — SEO, Open Graph, structured data, logo, icons, and this llms.txt — is edited per language in Sanity, with no code changes after launch.\n\nThe pages below are the site's public surface; each is described in the section that follows.",
      resources: [res("Documentation", "https://indiecrafts.dev")],
    },
    systemPages: {
      maintenance: {
        status: "Scheduled maintenance",
        title: "We'll be back shortly",
        body: "The site is briefly offline for planned updates. It'll be back to normal soon — thanks for waiting.",
        contact: "Need to reach us in the meantime?",
      },
      notFound: {
        eyebrow: "404",
        title: "Page not found",
        description: "The page you requested doesn't exist or has moved.",
        homeLabel: "← Back home",
      },
    },
    pageSeo: [
      pgSeo(
        "home",
        "Indie Crafts — ship client websites fast",
        "A config-first Next.js template: modular, SEO-ready, i18n-ready. Fork it, edit the config, ship.",
        "Next.js template, client websites, freelance",
        "## What Indie Crafts is\n\nA config-first Next.js 16 template for freelancers and studios shipping client websites. Edit one config file, compose sections, and deploy in a weekend.\n\n## Highlights\n\n- SEO, Open Graph, structured data, and llms.txt — all editable per language in Sanity.\n- i18n (English + French by default), accessibility-first, Tailwind v4 design tokens.\n- Optional Sanity-powered blog with a 13-module page builder.",
        "The config-first Next.js template for client websites — home page.",
      ),
      pgSeo(
        "blog",
        "Blog — building fast with Next.js",
        "Notes on shipping client work: tooling, config-first architecture, and the trade-offs that keep sites lean.",
        "Next.js, Sanity, freelance, DX",
      ),
      pgSeo(
        "author",
        "Authors",
        "Meet the writers and contributors behind every article.",
        "authors, contributors, writers",
      ),
      pgSeo("category", "Categories", "Browse articles by topic.", "categories, topics"),
      pgSeo("tag", "Tags", "Browse articles by tag.", "tags, topics"),
      pgSeo(
        "legal-notice",
        "Legal notice",
        "Publisher, ownership, and hosting information for this site.",
        "legal notice, imprint, publisher",
      ),
      pgSeo(
        "privacy",
        "Privacy policy",
        "How we collect, use, and protect your personal data (GDPR).",
        "privacy policy, GDPR, personal data",
      ),
      pgSeo(
        "cookies",
        "Cookie policy",
        "The cookies this site uses and how to manage your consent.",
        "cookie policy, consent, tracking",
      ),
      pgSeo(
        "terms",
        "Terms of use",
        "The terms governing your use of this website.",
        "terms of use, conditions",
      ),
      pgSeo(
        "terms-of-sale",
        "Terms of sale",
        "The terms that apply to purchases made on this site.",
        "terms of sale, purchases",
      ),
    ],
  },
  {
    _id: "siteMeta.fr",
    _type: "siteMeta",
    language: "fr",
    ogImage: img("og.fr"),
    tagline: "Le template Next.js config-first pour sites clients.",
    description:
      "Un template Next.js très modulaire, prêt pour le SEO, l'i18n et l'accessibilité. Forkez, éditez la config, livrez.",
    keywords: "template Next.js, sites clients, SEO, i18n, Sanity, Tailwind",
    llms: {
      summary: "Un template Next.js config-first pour livrer vite des sites clients.",
      paragraph:
        "Indie Crafts est un template Next.js modulaire, prêt pour le SEO et l'i18n, pour freelances et studios. Forkez, éditez un fichier de config, et livrez un site client en un week-end.",
      full: "# Indie Crafts\n\nUn template Next.js 16 config-first pour freelances et studios qui livrent des sites clients. Tout le site — SEO, Open Graph, données structurées, logo, icônes, et ce llms.txt — s'édite par langue dans Sanity, sans code après le lancement.\n\nLes pages ci-dessous forment la surface publique du site ; chacune est décrite dans la section qui suit.",
      resources: [res("Documentation", "https://indiecrafts.dev")],
    },
    systemPages: {
      maintenance: {
        status: "Maintenance planifiée",
        title: "De retour très bientôt",
        body: "Le site est momentanément hors ligne pour des mises à jour planifiées. Tout revient bientôt à la normale — merci de votre patience.",
        contact: "Besoin de nous joindre entre-temps ?",
      },
      notFound: {
        eyebrow: "404",
        title: "Page introuvable",
        description: "La page demandée n'existe pas ou a été déplacée.",
        homeLabel: "← Retour à l'accueil",
      },
    },
    pageSeo: [
      pgSeo(
        "home",
        "Indie Crafts — livrez des sites clients vite",
        "Un template Next.js config-first : modulaire, prêt pour le SEO et l'i18n. Forkez, éditez la config, livrez.",
        "template Next.js, sites clients, freelance",
        "## Ce qu'est Indie Crafts\n\nUn template Next.js 16 config-first pour freelances et studios qui livrent des sites clients. Éditez un fichier de config, composez des sections, et déployez en un week-end.\n\n## Points clés\n\n- SEO, Open Graph, données structurées et llms.txt — tout est éditable par langue dans Sanity.\n- i18n (anglais + français par défaut), accessibilité, tokens de design Tailwind v4.\n- Blog optionnel propulsé par Sanity avec un page-builder de 13 modules.",
        "Le template Next.js config-first pour sites clients — page d'accueil.",
      ),
      pgSeo(
        "blog",
        "Blog — construire vite avec Next.js",
        "Notes sur la livraison de projets clients : outillage, architecture config-first, et les arbitrages qui gardent les sites légers.",
        "Next.js, Sanity, freelance, DX",
      ),
      pgSeo(
        "author",
        "Auteurs",
        "Découvrez les auteurs et contributeurs derrière chaque article.",
        "auteurs, contributeurs",
      ),
      pgSeo(
        "category",
        "Catégories",
        "Parcourez les articles par thème.",
        "catégories, thèmes",
      ),
      pgSeo("tag", "Tags", "Parcourez les articles par tag.", "tags, thèmes"),
      pgSeo(
        "legal-notice",
        "Mentions légales",
        "Informations sur l'éditeur, le responsable et l'hébergement du site.",
        "mentions légales, éditeur, hébergeur",
      ),
      pgSeo(
        "privacy",
        "Politique de confidentialité",
        "Comment nous collectons, utilisons et protégeons vos données personnelles (RGPD).",
        "confidentialité, RGPD, données personnelles",
      ),
      pgSeo(
        "cookies",
        "Politique de cookies",
        "Les cookies utilisés par ce site et comment gérer votre consentement.",
        "cookies, consentement, suivi",
      ),
      pgSeo(
        "terms",
        "Conditions générales d'utilisation",
        "Les conditions régissant l'utilisation de ce site.",
        "CGU, conditions d'utilisation",
      ),
      pgSeo(
        "terms-of-sale",
        "Conditions générales de vente",
        "Les conditions applicables aux achats effectués sur ce site.",
        "CGV, achats, vente",
      ),
    ],
  },
];

// Language-independent site settings singleton — social profiles, the
// schema.org business entity, and any extra global JSON-LD entities. SOLE
// runtime source (no config fallback); read by `getSiteSettings`.
const buildSiteSettings = () => ({
  _id: "siteSettings",
  _type: "siteSettings",
  // Brand/site name — drives <title>, OG siteName, manifest, JSON-LD WebSite.name.
  siteName: "indiecrafts.dev",
  // Logo + favicon/app icon (no dark logo in the demo — the mark works on both).
  logo: img("logo"),
  icon: img("icon"),
  social: {
    twitter: "@indiecrafts",
    linkedin: "https://www.linkedin.com/company/indiecrafts",
    github: "https://github.com/indiecrafts",
    mastodon: "https://mastodon.social/@indiecrafts",
  },
  businessType: "Organization",
  company: "Indiecrafts",
  alternateName: "Indie Crafts",
  // Demo search-engine verification codes (replace with the real ones from
  // Google Search Console / Bing Webmaster Tools). Emitted as <meta> by the layout.
  verification: {
    google: "google-site-verification-DEMO1234567890",
    bing: "DEMO-BING-0123456789ABCDEF",
  },
  // Demo analytics + cookie consent. `googleAnalyticsId` is a placeholder GA4 id;
  // `requireCookieConsent` shows the banner + gates GA until the visitor accepts.
  analytics: {
    googleAnalyticsId: "G-DEMO1234567",
    requireCookieConsent: true,
  },
  globalSchemas: [
    {
      _key: key("g"),
      schemaType: "Service",
      name: "Website design & build",
      description:
        "Design and development of fast, SEO-ready client websites on the Indie Crafts stack.",
      url: "https://indiecrafts.dev",
    },
  ],
});

// ─── Documents ─────────────────────────────────────────────────

// Authors are translated (plugin-managed `language`) — one doc per locale,
// linked EN↔FR via a `translation.metadata` doc (see `buildTranslationMeta`).
// Slugs are shared across locales; the locale prefix keeps the URLs distinct.
const buildAuthors = () => [
  // ── EN ──
  {
    _id: "author.en.ada",
    _type: "author",
    language: "en",
    name: "Ada Lovelace",
    position: "Founder · Analytic Studio",
    slug: { _type: "slug", current: "ada-lovelace" },
    image: img("author-ada"),
    bio: [p("Mathematician, writer, and self-described 'enchantress of numbers'.")],
  },
  {
    _id: "author.en.grace",
    _type: "author",
    language: "en",
    name: "Grace Hopper",
    position: "Engineering · USNR",
    slug: { _type: "slug", current: "grace-hopper" },
    image: img("author-grace"),
    bio: [p("Compiler pioneer. If it works, ship it; ask forgiveness, not permission.")],
  },
  {
    _id: "author.en.tim",
    _type: "author",
    language: "en",
    name: "Tim Berners-Lee",
    position: "Web architect",
    slug: { _type: "slug", current: "tim-berners-lee" },
    image: img("author-tim"),
    bio: [p("Built the World Wide Web on a NeXT cube in three months.")],
  },
  // ── FR ──
  {
    _id: "author.fr.ada",
    _type: "author",
    language: "fr",
    name: "Ada Lovelace",
    position: "Fondatrice · Analytic Studio",
    slug: { _type: "slug", current: "ada-lovelace" },
    image: img("author-ada"),
    bio: [
      p(
        "Mathématicienne, écrivaine, et « enchanteresse des nombres » selon ses propres mots.",
      ),
    ],
  },
  {
    _id: "author.fr.grace",
    _type: "author",
    language: "fr",
    name: "Grace Hopper",
    position: "Ingénierie · USNR",
    slug: { _type: "slug", current: "grace-hopper" },
    image: img("author-grace"),
    bio: [
      p(
        "Pionnière du compilateur. Si ça marche, livrez ; demandez pardon, pas la permission.",
      ),
    ],
  },
  {
    _id: "author.fr.tim",
    _type: "author",
    language: "fr",
    name: "Tim Berners-Lee",
    position: "Architecte du Web",
    slug: { _type: "slug", current: "tim-berners-lee" },
    image: img("author-tim"),
    bio: [p("A bâti le World Wide Web sur un cube NeXT en trois mois.")],
  },
];

const slug = (current) => ({ _type: "slug", current });

const categories = [
  {
    _id: "cat.en.engineering",
    _type: "category",
    language: "en",
    title: "Engineering",
    slug: slug("engineering"),
    description: "Tooling, performance, and infrastructure.",
  },
  {
    _id: "cat.en.product",
    _type: "category",
    language: "en",
    title: "Product",
    slug: slug("product"),
    description: "Design choices, UX research, launches.",
  },
  {
    _id: "cat.en.story",
    _type: "category",
    language: "en",
    title: "Stories",
    slug: slug("stories"),
    description: "Founder narratives and lessons learned.",
  },
  {
    _id: "cat.fr.engineering",
    _type: "category",
    language: "fr",
    title: "Ingénierie",
    slug: slug("ingenierie"),
    description: "Outils, performance et infrastructure.",
  },
  {
    _id: "cat.fr.product",
    _type: "category",
    language: "fr",
    title: "Produit",
    slug: slug("produit"),
    description: "Choix design, recherche UX, lancements.",
  },
  {
    _id: "cat.fr.story",
    _type: "category",
    language: "fr",
    title: "Histoires",
    slug: slug("histoires"),
    description: "Récits de fondateurs, leçons apprises.",
  },
];

const tags = [
  // EN
  {
    _id: "tag.en.nextjs",
    language: "en",
    title: "Next.js",
    slug: slug("nextjs"),
    description: "App Router, React Server Components, the whole stack.",
  },
  {
    _id: "tag.en.sanity",
    language: "en",
    title: "Sanity",
    slug: slug("sanity"),
    description: "Schemas, GROQ, Studio customization.",
  },
  {
    _id: "tag.en.tailwind",
    language: "en",
    title: "Tailwind",
    slug: slug("tailwind"),
    description: "Utility-first CSS workflows.",
  },
  {
    _id: "tag.en.seo",
    language: "en",
    title: "SEO",
    slug: slug("seo"),
    description: "Search visibility for indie sites.",
  },
  {
    _id: "tag.en.dx",
    language: "en",
    title: "DX",
    slug: slug("dx"),
    description: "Developer experience — toolchains, ergonomics, speed.",
  },
  {
    _id: "tag.en.deployment",
    language: "en",
    title: "Deployment",
    slug: slug("deployment"),
    description: "CI/CD, hosting choices, edge networks.",
  },
  {
    _id: "tag.en.privacy",
    language: "en",
    title: "Privacy",
    slug: slug("privacy"),
    description: "GDPR, consent banners, data minimization.",
  },
  {
    _id: "tag.en.freelance",
    language: "en",
    title: "Freelance",
    slug: slug("freelance"),
    description: "Pricing, scoping, contracting.",
  },
  {
    _id: "tag.en.mvp",
    language: "en",
    title: "MVP",
    slug: slug("mvp"),
    description: "Lean validation, fast first releases.",
  },
  {
    _id: "tag.en.forms",
    language: "en",
    title: "Forms",
    slug: slug("forms"),
    description: "Contact, submission, and HTML-only patterns.",
  },
  // FR
  {
    _id: "tag.fr.nextjs",
    language: "fr",
    title: "Next.js",
    slug: slug("nextjs"),
    description: "App Router, React Server Components — toute la pile.",
  },
  {
    _id: "tag.fr.sanity",
    language: "fr",
    title: "Sanity",
    slug: slug("sanity"),
    description: "Schémas, GROQ, personnalisation du Studio.",
  },
  {
    _id: "tag.fr.tailwind",
    language: "fr",
    title: "Tailwind",
    slug: slug("tailwind"),
    description: "CSS utilitaire en flux de production.",
  },
  {
    _id: "tag.fr.seo",
    language: "fr",
    title: "SEO",
    slug: slug("seo"),
    description: "Visibilité dans la recherche pour sites indépendants.",
  },
  {
    _id: "tag.fr.dx",
    language: "fr",
    title: "DX",
    slug: slug("dx"),
    description: "Expérience développeur — outillage, ergonomie, vitesse.",
  },
  {
    _id: "tag.fr.deployment",
    language: "fr",
    title: "Déploiement",
    slug: slug("deploiement"),
    description: "CI/CD, choix d'hébergement, réseaux edge.",
  },
  {
    _id: "tag.fr.privacy",
    language: "fr",
    title: "Confidentialité",
    slug: slug("confidentialite"),
    description: "RGPD, bannières de consentement, minimisation des données.",
  },
  {
    _id: "tag.fr.freelance",
    language: "fr",
    title: "Freelance",
    slug: slug("freelance"),
    description: "Tarification, cadrage, contractualisation.",
  },
  {
    _id: "tag.fr.mvp",
    language: "fr",
    title: "MVP",
    slug: slug("mvp"),
    description: "Validation rapide, premières versions minimales.",
  },
  {
    _id: "tag.fr.forms",
    language: "fr",
    title: "Formulaires",
    slug: slug("formulaires"),
    description: "Contact, soumission, patterns HTML-only.",
  },
].map((t) => ({ ...t, _type: "tag" }));

const buildQuotes = () => [
  {
    _id: "quote.en.lovelace",
    _type: "quote",
    language: "en",
    content:
      "Forked once, shipped three client sites in a week. This is the template I wish I had written myself.",
    author: "Ada Lovelace",
    role: "Founder, Analytic Studio",
    image: img("author-ada"),
  },
  {
    _id: "quote.en.hopper",
    _type: "quote",
    language: "en",
    content:
      "Move at the speed of thought. Build, measure, ship — repeat until the rhythm matches the market.",
    author: "Grace Hopper",
    role: "Engineering Lead",
    image: img("author-grace"),
  },
  {
    _id: "quote.fr.lovelace",
    _type: "quote",
    language: "fr",
    content:
      "Forké une fois, trois sites clients livrés en une semaine. Le template que j'aurais aimé écrire moi-même.",
    author: "Ada Lovelace",
    role: "Fondatrice, Analytic Studio",
    image: img("author-ada"),
  },
  {
    _id: "quote.fr.hopper",
    _type: "quote",
    language: "fr",
    content:
      "Avancez à la vitesse de la pensée. Construire, mesurer, livrer — répéter jusqu'à ce que le rythme épouse le marché.",
    author: "Grace Hopper",
    role: "Lead Ingénierie",
    image: img("author-grace"),
  },
];

// People are translated (plugin-managed `language`) — one doc per locale,
// linked EN↔FR via a `translation.metadata` doc. Names stay constant; role +
// bio are translated.
const buildPeople = () => [
  // ── EN ──
  {
    _id: "person.en.maya",
    _type: "person",
    language: "en",
    name: "Maya Chen",
    role: "Founder",
    bio: "Ex-Stripe. Three exits, all bootstrapped.",
    image: img("person-maya"),
  },
  {
    _id: "person.en.luis",
    _type: "person",
    language: "en",
    name: "Luis Martínez",
    role: "Head of Design",
    bio: "Ex-Airbnb. Cares about kerning more than caffeine.",
    image: img("person-luis"),
  },
  {
    _id: "person.en.yuki",
    _type: "person",
    language: "en",
    name: "Yuki Tanaka",
    role: "Lead Engineer",
    bio: "Compiler nerd. Talks to herself in Lisp.",
    image: img("person-yuki"),
  },
  // ── FR ──
  {
    _id: "person.fr.maya",
    _type: "person",
    language: "fr",
    name: "Maya Chen",
    role: "Fondatrice",
    bio: "Ex-Stripe. Trois sorties, toutes en bootstrap.",
    image: img("person-maya"),
  },
  {
    _id: "person.fr.luis",
    _type: "person",
    language: "fr",
    name: "Luis Martínez",
    role: "Directeur du design",
    bio: "Ex-Airbnb. Se soucie plus du crénage que de la caféine.",
    image: img("person-luis"),
  },
  {
    _id: "person.fr.yuki",
    _type: "person",
    language: "fr",
    name: "Yuki Tanaka",
    role: "Ingénieure principale",
    bio: "Passionnée de compilateurs. Se parle à elle-même en Lisp.",
    image: img("person-yuki"),
  },
];

// ─── Translation links ─────────────────────────────────────────
// One `translation.metadata` doc per EN↔FR set. The plugin uses these to jump
// between a document's translations in the Studio; the front-end locale
// switcher resolves a doc's counterpart slug through them (see
// `/api/i18n/translated-slug`). Every translated content type is linked.
// `prefix` is the id prefix ("cat" for `category`); `type` is the schema name.
const translationMeta = (type, prefix, baseKeys) =>
  baseKeys.map((base) => ({
    _id: `translation.${prefix}.${base}`,
    _type: "translation.metadata",
    schemaTypes: [type],
    translations: [
      {
        _key: "en",
        value: { _type: "reference", _ref: `${prefix}.en.${base}`, _weak: true },
      },
      {
        _key: "fr",
        value: { _type: "reference", _ref: `${prefix}.fr.${base}`, _weak: true },
      },
    ],
  }));

const buildTranslationMeta = () => [
  ...translationMeta("post", "post", [
    "fast-proto-nextjs",
    "ship-weekend",
    "config-first",
    "netlify-forms",
    "cookie-banner",
  ]),
  ...translationMeta("category", "cat", ["engineering", "product", "story"]),
  ...translationMeta("tag", "tag", [
    "deployment",
    "dx",
    "forms",
    "freelance",
    "mvp",
    "nextjs",
    "privacy",
    "sanity",
    "seo",
    "tailwind",
  ]),
  ...translationMeta("quote", "quote", ["lovelace", "hopper"]),
  ...translationMeta("author", "author", ["ada", "grace", "tim"]),
  ...translationMeta("person", "person", ["maya", "luis", "yuki"]),
  ...translationMeta("legalPage", "legal", [
    "mentions-legales",
    "confidentialite",
    "cookies",
    "cgu",
    "cgv",
  ]),
];

// ─── Inline content modules — interspersed inside the body PortableText.
// Nine of the 14 modules can be embedded directly inside `blockContent`
// (see src/features/blog/sanity/schema/blockContent.ts for the catalog). The
// other five — breadcrumbs, blog-index, blog-post-content, blog-post-list,
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
    cards: cards.map(([cardTitle, cardBody]) => ({
      _key: key("c"),
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

  customHtml: (html) => ({
    _type: "module.custom-html",
    _key: key("m"),
    html,
  }),
};

// `blog.postModules` is shared across locales — anything hardcoded here
// (breadcrumb labels, "Keep reading" titles, etc.) would leak the same
// language to every post. We leave the array empty so the post detail
// route falls back to its `DefaultPostLayout`, which renders proper
// localized breadcrumbs + related posts via translations.
//
// Rich content INSIDE an article (callouts, card lists, stat lists, …)
// belongs in the post's `body` PortableText via the "+" insert menu —
// the 11 inline-embeddable modules live there. The post document itself
// no longer exposes a per-post layout override; chrome stays uniform.

// ─── Showcase body — modules INSIDE the PortableText body ──────
// Builds an array of mixed text blocks + inline modules, in the order
// readers see them. `quoteLocale` lets the FR variant point at the FR
// quotes without duplicating the structure.

const showcaseBody = ({ quoteLocale, copy }) => [
  p(copy.intro1),
  pStrong("", copy.introStrong, copy.introTail),
  imgBlock("post-fast-proto", copy.heroAlt),
  inline.callout("info", [
    pStrong(copy.calloutInfoLead, copy.calloutInfoStrong, copy.calloutInfoTail),
  ]),

  h(2, copy.dayOneHeading),
  pMixed([
    [copy.dayOneIntroLead, []],
    [copy.dayOneIntroCode, ["code"]],
    [copy.dayOneIntroTail, []],
  ]),
  li(copy.dayOneBullet1),
  li(copy.dayOneBullet2),
  li(copy.dayOneBullet3),
  h(3, copy.deployHeading),
  p(copy.deployIntro),
  pMixed([
    [copy.deployEmphasisLead, []],
    [copy.deployEmphasisStrong, ["strong"]],
    [copy.deployEmphasisTail, []],
  ]),
  p(copy.beforeStats),
  inline.statList(copy.statTitle, copy.statIntro, [
    ["48h", copy.statLabel1],
    ["17", copy.statLabel2],
    ["2", copy.statLabel3],
    ["AA", copy.statLabel4],
  ]),
  p(copy.afterStats),
  inline.cardList(copy.cardsTitle, copy.cardsIntro, 3, [
    [copy.card1Title, copy.card1Body],
    [copy.card2Title, copy.card2Body],
    [copy.card3Title, copy.card3Body],
  ]),
  p(copy.afterCards),

  h(2, copy.dayTwoHeading),
  p(copy.dayTwoIntro),
  inline.callout("warning", [p(copy.calloutWarning)]),
  p(copy.afterCalloutWarning),
  h(3, copy.playbookHeading),
  p(copy.playbookIntro),
  numli(copy.playbookStep1),
  numli(copy.playbookStep2),
  numli(copy.playbookStep3),
  p(copy.beforeSteps),
  inline.stepList(copy.stepsTitle, copy.stepsIntro, [
    [copy.step1Title, copy.step1Body],
    [copy.step2Title, copy.step2Body],
    [copy.step3Title, copy.step3Body],
  ]),
  p(copy.afterSteps),
  h(3, copy.skipHeading),
  li(copy.skipBullet1),
  li(copy.skipBullet2),
  li(copy.skipBullet3),
  h(4, copy.skipFootnoteHeading),
  pMixed([
    [copy.skipFootnoteLead, []],
    [copy.skipFootnoteStruck, ["strike-through"]],
    [copy.skipFootnoteTail, []],
  ]),
  p(copy.beforeFaq),
  inline.accordionList(copy.faqTitle, copy.faqIntro, [
    [copy.faq1Q, copy.faq1A],
    [copy.faq2Q, copy.faq2A],
    [copy.faq3Q, copy.faq3A],
  ]),
  p(copy.afterFaq),

  h(2, copy.slowdownHeading),
  p(copy.slowdownIntro),
  blockquote(copy.beckQuote),
  p(copy.beforeQuotes),
  inline.quoteList(copy.quotesTitle, [
    `quote.${quoteLocale}.lovelace`,
    `quote.${quoteLocale}.hopper`,
  ]),
  p(copy.afterQuotes),
  inline.personList("", "", [
    `person.${quoteLocale}.maya`,
    `person.${quoteLocale}.luis`,
    `person.${quoteLocale}.yuki`,
  ]),
  p(copy.afterTeam),
  h(4, copy.guardrailsHeading),
  p(copy.guardrailsIntro),
  inline.callout("success", [p(copy.calloutSuccess)]),
  p(copy.afterCalloutSuccess),
  inline.callout("danger", [p(copy.calloutDanger)]),
  p(copy.afterCalloutDanger),
  inline.customHtml(
    `<div style="padding: 1.25rem; text-align: center; border-radius: 0.75rem; background: var(--muted); color: var(--muted-foreground); font-size: 0.875rem;">${copy.customHtmlBody}</div>`,
  ),
  p(copy.afterCustomHtml),

  h(2, copy.closingHeading),
  pLink(
    copy.closingLead,
    copy.closingLinkText,
    "https://indiecrafts.dev",
    copy.closingTail,
  ),
  h(5, copy.editorNoteHeading),
  pMixed([
    [copy.editorNoteLead, []],
    [copy.editorNoteEm, ["em"]],
    [copy.editorNoteTail, []],
  ]),
  h(6, copy.updatedHeading),
  p(copy.updatedBody),
];

const showcaseCopyEn = {
  intro1:
    "The fastest way to validate a product idea is to ship it. Not a clickable Figma — a real site visitors can break, share, and abandon.",
  introStrong:
    "This guide is opinionated: do less, deploy more, learn on production traffic.",
  introTail: "",
  heroAlt: "Editor with a terminal — the rhythm of a Friday-night ship.",
  calloutInfoLead: "Quick note: ",
  calloutInfoStrong:
    "everything you read past this point was authored in the Sanity Studio",
  calloutInfoTail:
    ". The eight inline modules, the headings, the lists, the images — same picker that ships with every Indie Crafts site.",
  dayOneHeading: "Day one: scaffold and deploy",
  dayOneIntroLead:
    "Start with a template that already handles the boring decisions. The first deploy should happen before lunch — ",
  dayOneIntroCode: "pnpm dev",
  dayOneIntroTail:
    " and a push to main are the only commands you should need that morning. Everything else is choice, and choice is what tomorrow is for.",
  dayOneBullet1:
    "Pick a routing primitive (App Router) and never touch the router code on day one.",
  dayOneBullet2: "Wire SEO + sitemap once. Skip i18n unless the target market needs it.",
  dayOneBullet3:
    "Deploy on push. No staging dance — preview deploys per PR are good enough.",
  deployHeading: "Deploy before you decorate",
  deployIntro:
    "Treat the live URL as the milestone. Every other choice — palette, copy, illustrations — happens on a page that is already in production, watched by analytics, and within a Git revert of a green deploy.",
  deployEmphasisLead: "If it isn't deployed, it doesn't exist. ",
  deployEmphasisStrong: "Shipping is the artefact.",
  deployEmphasisTail:
    " Everything that happens in the editor up to that point is rehearsal.",
  beforeStats:
    "We tracked the last twelve weekend builds we shipped from this template. The numbers, in aggregate:",
  statTitle: "By the numbers",
  statIntro: "What two days of shipping looks like.",
  statLabel1: "Average build time",
  statLabel2: "Page-builder modules",
  statLabel3: "Supported locales",
  statLabel4: "WCAG contrast everywhere",
  afterStats:
    "Three themes drive most of the reductions. The same projects keep coming back to the same trade-offs, articulated below:",
  cardsTitle: "Recent themes",
  cardsIntro: "What we keep coming back to.",
  card1Title: "Fast prototyping",
  card1Body: "Going from idea to deployed MVP in 48 hours.",
  card2Title: "Config-first",
  card2Body: "Why one config file beats fifty conventions.",
  card3Title: "Editor-friendly",
  card3Body: "Sanity, Netlify Forms, GDPR — without the SaaS sprawl.",
  afterCards:
    "That closes day one. Push the deploy, walk away, come back tomorrow for the content pass.",
  dayTwoHeading: "Day two: content + analytics",
  dayTwoIntro:
    "By the afternoon of day two, you have a single page with real copy, a contact form, and traffic-level analytics. Resist the urge to add more.",
  calloutWarning:
    "If you add a CMS in the first 48 hours, you'll spend day three migrating schema instead of finding customers. Wait until the third paragraph repeats itself.",
  afterCalloutWarning: "Past the warning, the moves themselves are unromantic.",
  playbookHeading: "The three-move playbook",
  playbookIntro:
    "By Saturday lunch, the entire job collapses into three moves you can recite in sequence:",
  playbookStep1: "Clone the repo and point the env file at your fresh Sanity dataset.",
  playbookStep2: "Rename the brand tokens, drop in your copy, replace the hero image.",
  playbookStep3: "Push to main; let the deploy hook do the rest.",
  beforeSteps:
    "Stated in prose, that playbook expands into a step list — the same content, rendered as a vertical timeline:",
  stepsTitle: "How to fork and ship",
  stepsIntro: "Three steps to a deployed site.",
  step1Title: "Fork",
  step1Body: "Clone the repo. Set NEXT_PUBLIC_SANITY_PROJECT_ID + DATASET.",
  step2Title: "Theme",
  step2Body: "Edit theme.hexColors + theme.colors in src/config/index.ts.",
  step3Title: "Ship",
  step3Body: "Push to Netlify. Verify with pnpm verify.",
  afterSteps:
    "Three steps is the whole flow. Equally important is what you can drop entirely on day one.",
  skipHeading: "Skip these on day one",
  skipBullet1:
    "CMS integration. Hard-code copy until you've written the same paragraph three times.",
  skipBullet2: "Authentication. Most MVPs don't need it.",
  skipBullet3: "A design system. Use defaults until friction proves otherwise.",
  skipFootnoteHeading: "An older draft of this section",
  skipFootnoteLead: "An earlier draft of this list had a fourth bullet here: ",
  skipFootnoteStruck: "wire up auth on day one",
  skipFootnoteTail:
    ". Two MVPs and a launch later, we deleted it. The line is left here, struck through, as a reminder that defaults age.",
  beforeFaq:
    "Readers always ask the same three questions before they fork the repo. Worth answering up-front:",
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
  afterFaq:
    "Two days gets you the shape of the site. The question is when to stop optimizing speed.",
  slowdownHeading: "When to slow down",
  slowdownIntro:
    "The moment you have a second person editing copy, set up a CMS. The moment two people share a feature flag, write it down. Premature infrastructure is the enemy.",
  beckQuote: "Make it work, make it right, make it fast — in that order. — Kent Beck",
  beforeQuotes:
    'Beck\'s order matters because most weekend sites die at "make it right". Two voices from teams that shipped, on the value of doing less:',
  quotesTitle: "",
  afterQuotes:
    "Two testimonials, one observation: nobody who shipped fast says they regret it. The people behind those cycles:",
  afterTeam: "Those are the three people running the build rhythms you just read about.",
  guardrailsHeading: "Two guardrails before you tag the release",
  guardrailsIntro:
    "Before the tag goes up, two checks. The first congratulates a thing already working; the second warns away from a temptation that has bitten us twice.",
  calloutSuccess:
    "All AA contrast checks pass on the default theme — verify with pnpm verify:contrast.",
  afterCalloutSuccess:
    "Green calls celebrate what's right. The next one warns what to avoid.",
  calloutDanger:
    "Avoid editing src/components/ui-primitives/* by hand — they're shadcn-managed.",
  afterCalloutDanger:
    "When the schema doesn't cover what you need — a newsletter signup, a third-party widget, a partner badge — drop raw markup. The block below is one of those:",
  customHtmlBody:
    "Most newsletters and embed widgets live in a block exactly like this one — a centred frame of arbitrary HTML the editor controls end to end.",
  afterCustomHtml:
    "That is the entire surface area of the body editor. From here on out, what shows up on the page is whatever you write.",
  closingHeading: "Closing thought",
  closingLead: "The template this guide ships with — ",
  closingLinkText: "indiecrafts.dev",
  closingTail:
    " — covers steps one through five so you can spend your weekend on steps six and beyond.",
  editorNoteHeading: "Editor's note",
  editorNoteLead: "This article is part of a series. The next entry covers what to do ",
  editorNoteEm: "after",
  editorNoteTail:
    " the weekend ships — analytics, feedback loops, the first time you actually email a customer.",
  updatedHeading: "Updated",
  updatedBody:
    "March 2026 — added the deployment playbook and the day-two warning. Earlier drafts focused only on day one.",
};

const showcaseCopyFr = {
  intro1:
    "La meilleure façon de valider une idée produit, c'est de la livrer. Pas un Figma cliquable — un vrai site que des visiteurs peuvent casser, partager, abandonner.",
  introStrong:
    "Ce guide est opinionné : faites moins, déployez plus, apprenez sur du trafic réel.",
  introTail: "",
  heroAlt: "Éditeur avec terminal — le rythme d'une livraison du vendredi soir.",
  calloutInfoLead: "Petite précision : ",
  calloutInfoStrong:
    "tout ce que vous lisez à partir d'ici a été rédigé dans le Sanity Studio",
  calloutInfoTail:
    ". Les huit modules inline, les titres, les listes, les images — le même menu que chaque site Indie Crafts embarque.",
  dayOneHeading: "Jour un : poser les fondations et déployer",
  dayOneIntroLead:
    "Démarrez avec un template qui gère déjà les décisions ennuyeuses. Le premier déploiement doit tomber avant le déjeuner — ",
  dayOneIntroCode: "pnpm dev",
  dayOneIntroTail:
    " et un push vers main sont les seules commandes utiles ce matin-là. Le reste, c'est de la décision, et la décision est l'affaire du lendemain.",
  dayOneBullet1: "Choisissez un routeur (App Router) et n'y touchez plus le jour un.",
  dayOneBullet2:
    "Branchez SEO + sitemap une bonne fois. Évitez l'i18n sauf si le marché cible l'exige.",
  dayOneBullet3:
    "Déployez à chaque push. Pas de danse de staging — les previews par PR suffisent.",
  deployHeading: "Déployer avant de décorer",
  deployIntro:
    "Considérez l'URL en production comme le jalon. Tous les autres choix — palette, copy, illustrations — se font sur une page déjà déployée, observée par les analytics, à un revert Git d'un build vert.",
  deployEmphasisLead: "Si ce n'est pas déployé, ça n'existe pas. ",
  deployEmphasisStrong: "La livraison est l'artefact.",
  deployEmphasisTail:
    " Tout ce qui se passe dans l'éditeur avant ce moment-là, c'est de la répétition.",
  beforeStats:
    "Nous avons mesuré nos douze derniers builds livrés en week-end depuis ce template. Les chiffres, en agrégé :",
  statTitle: "En chiffres",
  statIntro: "Ce que représentent deux jours de livraison.",
  statLabel1: "Temps de build moyen",
  statLabel2: "Modules page-builder",
  statLabel3: "Langues supportées",
  statLabel4: "Contraste WCAG partout",
  afterStats:
    "Trois thèmes expliquent la majorité de ces réductions. Les mêmes projets reviennent toujours aux mêmes arbitrages, articulés ci-dessous :",
  cardsTitle: "Thèmes récurrents",
  cardsIntro: "Ce sur quoi nous revenons sans cesse.",
  card1Title: "Prototypage rapide",
  card1Body: "De l'idée au MVP déployé en 48 heures.",
  card2Title: "Config-first",
  card2Body: "Pourquoi un fichier de config bat cinquante conventions.",
  card3Title: "Pensé pour les éditeurs",
  card3Body: "Sanity, Netlify Forms, RGPD — sans la prolifération SaaS.",
  afterCards:
    "Voilà pour le jour un. Poussez le déploiement, fermez l'ordinateur, revenez demain pour la passe de contenu.",
  dayTwoHeading: "Jour deux : contenu et analytics",
  dayTwoIntro:
    "L'après-midi du jour deux, vous avez une page unique avec du contenu réel, un formulaire de contact et des métriques au niveau du trafic. Résistez à l'envie d'en ajouter.",
  calloutWarning:
    "Si vous ajoutez un CMS dans les premières 48 heures, vous passerez le jour trois à migrer du schéma au lieu de chercher des clients. Attendez que le même paragraphe se répète trois fois.",
  afterCalloutWarning:
    "Cette mise en garde posée, les mouvements eux-mêmes n'ont rien de romantique.",
  playbookHeading: "Le playbook en trois coups",
  playbookIntro:
    "À l'heure du déjeuner samedi, le travail entier tient en trois mouvements à réciter dans l'ordre :",
  playbookStep1: "Clonez le dépôt et pointez l'env vers votre nouveau dataset Sanity.",
  playbookStep2:
    "Renommez les tokens de marque, glissez votre contenu, remplacez l'image hero.",
  playbookStep3: "Pushez vers main ; le hook de déploiement s'occupe du reste.",
  beforeSteps:
    "Énoncé en prose, ce playbook se développe en step list — le même contenu, en timeline verticale :",
  stepsTitle: "Forker et livrer",
  stepsIntro: "Trois étapes vers un site déployé.",
  step1Title: "Forker",
  step1Body: "Clonez le dépôt. Définissez NEXT_PUBLIC_SANITY_PROJECT_ID + DATASET.",
  step2Title: "Thématiser",
  step2Body: "Éditez theme.hexColors + theme.colors dans src/config/index.ts.",
  step3Title: "Livrer",
  step3Body: "Pushez vers Netlify. Vérifiez avec pnpm verify.",
  afterSteps:
    "Trois étapes pour l'essentiel. Aussi important : ce qu'on peut entièrement laisser de côté le jour un.",
  skipHeading: "À sauter le jour un",
  skipBullet1:
    "Intégration CMS. Codez le contenu en dur jusqu'à avoir réécrit trois fois le même paragraphe.",
  skipBullet2: "Authentification. La plupart des MVP n'en ont pas besoin.",
  skipBullet3: "Un design system. Restez avec les défauts jusqu'à preuve du contraire.",
  skipFootnoteHeading: "Un brouillon plus ancien de cette section",
  skipFootnoteLead:
    "Un brouillon antérieur de cette liste avait une quatrième puce ici : ",
  skipFootnoteStruck: "brancher l'authentification le jour un",
  skipFootnoteTail:
    ". Deux MVP et un lancement plus tard, nous l'avons supprimée. La ligne reste, barrée, pour rappeler que les défauts vieillissent.",
  beforeFaq:
    "Les mêmes trois questions reviennent à chaque fois avant de forker le dépôt. Autant y répondre tout de suite :",
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
  afterFaq:
    "Deux jours suffisent à dessiner la forme du site. La vraie question : quand cesser d'optimiser la vitesse.",
  slowdownHeading: "Quand ralentir",
  slowdownIntro:
    "Dès qu'une deuxième personne édite le contenu, installez un CMS. Dès que deux personnes partagent un feature flag, documentez-le. L'infrastructure prématurée est l'ennemi.",
  beckQuote:
    "Faites que ça marche, faites que ça soit juste, faites que ça soit rapide — dans cet ordre. — Kent Beck",
  beforeQuotes:
    "L'ordre de Beck compte parce que la plupart des sites du week-end meurent à « faites que ça soit juste ». Deux voix d'équipes qui ont livré, sur la valeur d'en faire moins.",
  quotesTitle: "",
  afterQuotes:
    "Deux témoignages, une observation : personne qui a livré vite ne le regrette. Les personnes derrière ces cycles :",
  afterTeam:
    "Ce sont les trois personnes qui orchestrent les rythmes de build dont vous venez de lire.",
  guardrailsHeading: "Deux garde-fous avant la release",
  guardrailsIntro:
    "Avant que le tag ne parte, deux vérifications. La première félicite une chose déjà en place ; la seconde prévient d'une tentation qui nous a mordu deux fois.",
  calloutSuccess:
    "Tous les checks de contraste AA passent sur le thème par défaut — vérifiez avec pnpm verify:contrast.",
  afterCalloutSuccess:
    "Le vert célèbre ce qui va bien. Le suivant prévient de ce qu'il faut éviter.",
  calloutDanger:
    "Évitez d'éditer src/components/ui-primitives/* à la main — c'est géré par shadcn.",
  afterCalloutDanger:
    "Quand le schéma ne couvre pas ce qu'il vous faut — une inscription newsletter, un widget tiers, un badge partenaire — basculez en HTML brut. Le bloc ci-dessous en est un :",
  customHtmlBody:
    "La plupart des newsletters et widgets embed atterrissent dans un bloc exactement comme celui-ci — un cadre centré de HTML arbitraire que l'éditeur contrôle de bout en bout.",
  afterCustomHtml:
    "Voilà la surface complète de l'éditeur de corps. À partir d'ici, ce qui s'affiche sur la page, c'est ce que vous écrivez.",
  closingHeading: "Pour conclure",
  closingLead: "Le template fourni avec ce guide — ",
  closingLinkText: "indiecrafts.dev",
  closingTail:
    " — couvre les étapes un à cinq, pour que votre week-end soit consacré à six et au-delà.",
  editorNoteHeading: "Note de l'éditeur",
  editorNoteLead:
    "Cet article fait partie d'une série. Le prochain volet traite de ce qu'il faut faire ",
  editorNoteEm: "après",
  editorNoteTail:
    " le week-end de livraison — analytics, boucles de feedback, le premier vrai email à un client.",
  updatedHeading: "Mise à jour",
  updatedBody:
    "Mars 2026 — ajout du playbook de déploiement et de l'avertissement du jour deux. Les premiers brouillons se concentraient uniquement sur le jour un.",
};

// ─── Posts ──────────────────────────────────────────────────────

const post = (
  id,
  {
    language,
    title,
    slug: postSlug,
    description,
    // Editorial teaser shown on cards + the post page. Omit to fall back to
    // `metadata.description` (the SEO line) — the front-end resolves that.
    excerpt,
    daysOld,
    // Base author keys ("ada"), resolved to same-language docs. First = lead.
    authors,
    categories: cats,
    tags: postTags = [],
    featured,
    body,
    imageKey,
    // Optional featured video: an embed link (YouTube/Vimeo/Dailymotion). An
    // uploaded file goes in the `videoFile` field in the Studio — the seed only
    // demos the link path. `videoAutoplay`/`videoControls` are honored on the hero.
    videoUrl,
    videoAutoplay,
    videoControls,
  },
) => ({
  _id: id,
  _type: "post",
  language,
  title,
  excerpt,
  publishedAt: daysAgo(daysOld),
  // Base keys ("ada") → same-language author refs, in order (first = lead).
  authors: authors.map((a) => ({
    _type: "reference",
    _ref: `author.${language}.${a}`,
    _key: key("a"),
  })),
  categories: cats.map((c) => ({ _type: "reference", _ref: c, _key: key("c") })),
  tags: postTags.map((t) => ({ _type: "reference", _ref: t, _key: key("t") })),
  featured: !!featured,
  body,
  metadata: {
    title,
    description,
    slug: { _type: "slug", current: postSlug },
    image: imageKey ? img(imageKey) : undefined,
    noIndex: false,
    ...(videoUrl ? { videoUrl } : {}),
    ...(videoAutoplay !== undefined ? { videoAutoplay } : {}),
    ...(videoControls !== undefined ? { videoControls } : {}),
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
    excerpt:
      "Blank repo Friday, live MVP Sunday. The exact two-day path — and what to deliberately skip.",
    daysOld: 1,
    // Multi-author demo — this post is co-written (Ada leads, Grace second).
    authors: ["ada", "grace"],
    categories: ["cat.en.engineering", "cat.en.product"],
    tags: ["tag.en.nextjs", "tag.en.mvp", "tag.en.dx", "tag.en.sanity"],
    featured: true,
    imageKey: "post-fast-proto",
    // Demo featured video (embed link). Editors can instead upload their own
    // file via `videoFile`, and toggle autoplay/controls, in the Studio.
    videoUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    body: showcaseBody({ quoteLocale: "en", copy: showcaseCopyEn }),
  }),

  post("post.en.ship-weekend", {
    language: "en",
    title: "Shipping a client site in a weekend",
    slug: "shipping-a-client-site-in-a-weekend",
    description:
      "A no-nonsense breakdown of how to deliver a brochure site Friday-to-Sunday: pricing, scope, tooling, and the exact words to use with the client.",
    daysOld: 4,
    authors: ["grace"],
    categories: ["cat.en.product", "cat.en.story"],
    tags: ["tag.en.freelance", "tag.en.mvp", "tag.en.dx", "tag.en.deployment"],
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
    authors: ["ada"],
    categories: ["cat.en.engineering"],
    tags: ["tag.en.dx", "tag.en.freelance", "tag.en.nextjs"],
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
    authors: ["tim"],
    categories: ["cat.en.engineering"],
    tags: ["tag.en.forms", "tag.en.deployment", "tag.en.dx"],
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
    authors: ["grace"],
    categories: ["cat.en.product"],
    tags: ["tag.en.privacy", "tag.en.dx", "tag.en.nextjs"],
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
    excerpt:
      "Dépôt vide le vendredi, MVP en ligne le dimanche. Le chemin exact en deux jours — et ce qu'on saute volontairement.",
    daysOld: 1,
    // Démo multi-auteur·rice — article co-écrit (Ada en tête, Grace ensuite).
    authors: ["ada", "grace"],
    categories: ["cat.fr.engineering", "cat.fr.product"],
    tags: ["tag.fr.nextjs", "tag.fr.mvp", "tag.fr.dx", "tag.fr.sanity"],
    featured: true,
    imageKey: "post-fast-proto",
    videoUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    body: showcaseBody({ quoteLocale: "fr", copy: showcaseCopyFr }),
  }),

  post("post.fr.ship-weekend", {
    language: "fr",
    title: "Livrer un site client en un week-end",
    slug: "livrer-un-site-client-en-un-week-end",
    description:
      "Marche à suivre sans détour pour livrer un site vitrine du vendredi au dimanche : tarification, périmètre, outils, et les mots exacts à dire au client.",
    daysOld: 4,
    authors: ["grace"],
    categories: ["cat.fr.product", "cat.fr.story"],
    tags: ["tag.fr.freelance", "tag.fr.mvp", "tag.fr.dx", "tag.fr.deployment"],
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
    authors: ["ada"],
    categories: ["cat.fr.engineering"],
    tags: ["tag.fr.dx", "tag.fr.freelance", "tag.fr.nextjs"],
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
    authors: ["tim"],
    categories: ["cat.fr.engineering"],
    tags: ["tag.fr.forms", "tag.fr.deployment", "tag.fr.dx"],
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
    authors: ["grace"],
    categories: ["cat.fr.product"],
    tags: ["tag.fr.privacy", "tag.fr.dx", "tag.fr.nextjs"],
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
  // Empty → DefaultPostLayout takes over with translated breadcrumbs +
  // related-posts section. Populate from Studio to swap in a
  // module-driven shell that applies to every article.
  postModules: [],
  // Editable per-locale copy for the comment section (a `localeString` per
  // field). Editors change the wording in Studio → no code deploy.
  comments: {
    heading: { en: "Comments", fr: "Commentaires" },
    nameLabel: { en: "Name", fr: "Nom" },
    emailLabel: { en: "Email (optional)", fr: "E-mail (facultatif)" },
    bodyLabel: { en: "Comment", fr: "Votre commentaire" },
    consentLabel: {
      en: "I agree my name and comment can be stored and shown here.",
      fr: "J'accepte que mon nom et mon commentaire soient enregistrés et affichés.",
    },
    submitLabel: { en: "Post comment", fr: "Publier le commentaire" },
    replyLabel: { en: "Reply", fr: "Répondre" },
    cancelLabel: { en: "Cancel", fr: "Annuler" },
    successMessage: {
      en: "Thanks — your comment is awaiting review.",
      fr: "Merci — votre commentaire est en attente de validation.",
    },
    emptyMessage: {
      en: "No comments yet — be the first.",
      fr: "Aucun commentaire pour l'instant — soyez le premier.",
    },
    errorMessage: {
      en: "Something went wrong. Please try again.",
      fr: "Une erreur s'est produite. Merci de réessayer.",
    },
  },
};

// Demo comments on the featured post — one approved (visible), one pending
// (shows up in the Studio "En attente" queue). `approved` gates public display.
const comments = [
  {
    _id: "comment.demo-approved",
    _type: "comment",
    approved: true,
    authorName: "Katherine Johnson",
    body: "Exactly the two-day path I needed — the 'skip on the first pass' list saved me a whole afternoon.",
    post: { _type: "reference", _ref: "post.en.fast-proto-nextjs" },
    consent: true,
    createdAt: daysAgo(1),
  },
  {
    _id: "comment.demo-pending",
    _type: "comment",
    approved: false,
    authorName: "Alan Turing",
    body: "Would love a follow-up on the deploy step — awaiting moderation, so this one is a Studio demo.",
    post: { _type: "reference", _ref: "post.en.fast-proto-nextjs" },
    consent: true,
    createdAt: daysAgo(0),
  },
  {
    // Threaded reply → parent is the approved comment above (1-level demo).
    _id: "comment.demo-reply",
    _type: "comment",
    approved: true,
    authorName: "Ada Lovelace",
    body: "Glad it helped! The skip-list is the whole trick — ship first, refine on real traffic.",
    post: { _type: "reference", _ref: "post.en.fast-proto-nextjs" },
    parent: { _type: "reference", _ref: "comment.demo-approved" },
    consent: true,
    createdAt: daysAgo(0),
  },
];

// ─── Run ────────────────────────────────────────────────────────

async function cleanupLegacy() {
  // Order matters: Sanity blocks deletion of documents that still have
  // references pointing at them. So we strip references first, then
  // delete the orphan documents.

  // ── 1. Strip legacy module blocks from any post body (both drafts
  //       and published). The seed's `createOrReplace` covers the
  //       showcase post + blog singleton; this catches every other.
  const LEGACY_TYPES = ["module.hero-split", "module.logo-list"];
  const dirtyPosts = await client.fetch(
    `*[_type == "post" && count(body[_type in $types]) > 0]{ _id, body }`,
    { types: LEGACY_TYPES },
  );
  for (const post of dirtyPosts) {
    const cleaned = (post.body ?? []).filter((b) => !LEGACY_TYPES.includes(b._type));
    await client.patch(post._id).set({ body: cleaned }).commit();
  }

  // ── 2. Also sweep `blog` singleton's frontpageModules + postModules.
  const dirtyBlog = await client.fetch(
    `*[_type == "blog" && (count(frontpageModules[_type in $types]) > 0 || count(postModules[_type in $types]) > 0)]{ _id, frontpageModules, postModules }`,
    { types: LEGACY_TYPES },
  );
  for (const b of dirtyBlog) {
    await client
      .patch(b._id)
      .set({
        frontpageModules: (b.frontpageModules ?? []).filter(
          (m) => !LEGACY_TYPES.includes(m._type),
        ),
        postModules: (b.postModules ?? []).filter((m) => !LEGACY_TYPES.includes(m._type)),
      })
      .commit();
  }

  // ── 3. Now safe to delete orphan `logo` documents. Sweep all logos
  //       by type plus an explicit ID list covering draft copies.
  const orphanedLogoIds = [
    "logo.acme",
    "logo.contoso",
    "logo.northwind",
    "logo.fabrikam",
    "drafts.logo.acme",
    "drafts.logo.contoso",
    "drafts.logo.northwind",
    "drafts.logo.fabrikam",
  ];
  await client.delete({ query: `*[_type == "logo"]` });
  await client.delete({ query: `*[_id in $ids]`, params: { ids: orphanedLogoIds } });

  console.log(
    `✓ Cleanup: cleaned ${dirtyPosts.length} post(s) + ${dirtyBlog.length} blog singleton(s), removed orphan logos`,
  );
}

// ─── Legal pages ───────────────────────────────────────────────
// Client-editable boilerplate for the five legal pages. STARTER TEMPLATES only
// — every doc opens with a warning to have a lawyer review it and to replace the
// [bracketed] placeholders. Structure follows the LCEN (mentions légales) + RGPD
// (confidentialité) + ePrivacy (cookies) requirements.
const warnFr =
  "⚠️ Modèle de départ à faire valider par un juriste. Remplacez les mentions entre [crochets] par vos informations.";
const warnEn =
  "⚠️ Starter template — have it reviewed by a lawyer. Replace the [bracketed] fields with your own details.";

const LEGAL = {
  "mentions-legales": {
    en: {
      title: "Legal notice",
      body: [
        p(warnEn),
        h(2, "Publisher"),
        p(
          "[Company or individual name], [legal status], share capital €[amount]. Registered office: [address]. Business ID (SIRET): [number]. Trade register (RCS): [city + number]. VAT: [number]. Contact: [email] — [phone].",
        ),
        h(2, "Publication director"),
        p("[Name of the publication director]."),
        h(2, "Host"),
        p("This site is hosted by [host name], [address], [phone]."),
        h(2, "Intellectual property"),
        p(
          "All content on this site (text, images, logos) is protected by copyright. Any reproduction without prior written permission is prohibited.",
        ),
      ],
    },
    fr: {
      title: "Mentions légales",
      body: [
        p(warnFr),
        h(2, "Éditeur du site"),
        p(
          "[Nom ou dénomination sociale], [statut juridique] au capital de [montant] €. Siège social : [adresse]. SIRET : [numéro]. RCS : [ville et numéro]. N° TVA intracommunautaire : [numéro]. Contact : [email] — [téléphone].",
        ),
        h(2, "Directeur de la publication"),
        p("[Nom du directeur de la publication]."),
        h(2, "Hébergeur"),
        p("Ce site est hébergé par [nom de l'hébergeur], [adresse], [téléphone]."),
        h(2, "Propriété intellectuelle"),
        p(
          "L'ensemble des contenus de ce site (textes, images, logos) est protégé par le droit d'auteur. Toute reproduction sans autorisation écrite préalable est interdite.",
        ),
      ],
    },
  },
  confidentialite: {
    en: {
      title: "Privacy policy",
      body: [
        p(warnEn),
        h(2, "Data controller"),
        p("The controller for your personal data is [name], [address], [email]."),
        h(2, "Data we collect"),
        p(
          "[e.g. name, email, and message when you use the contact form; anonymised usage data if analytics are enabled].",
        ),
        h(2, "Why we use it (purposes)"),
        p("[e.g. to answer your enquiries, run the service, and measure audience]."),
        h(2, "Legal basis"),
        p(
          "[Consent for analytics; performance of a contract / legitimate interest for enquiries].",
        ),
        h(2, "How long we keep it"),
        p("[e.g. enquiries kept for 3 years; analytics for 13 months]."),
        h(2, "Who receives it"),
        p(
          "[Your processors — hosting, email, analytics — and any transfers outside the EU with the appropriate safeguards].",
        ),
        h(2, "Your rights"),
        p(
          "You may request access, rectification, erasure, portability, restriction, or object to processing. Contact [email]. You may also lodge a complaint with the CNIL (cnil.fr).",
        ),
        h(2, "Security"),
        p(
          "We take reasonable technical and organisational measures to protect your data.",
        ),
      ],
    },
    fr: {
      title: "Politique de confidentialité",
      body: [
        p(warnFr),
        h(2, "Responsable du traitement"),
        p("Le responsable du traitement de vos données est [nom], [adresse], [email]."),
        h(2, "Données que nous collectons"),
        p(
          "[ex. nom, email et message lors de l'utilisation du formulaire de contact ; données d'usage anonymisées si la mesure d'audience est activée].",
        ),
        h(2, "Finalités"),
        p("[ex. répondre à vos demandes, fournir le service, mesurer l'audience]."),
        h(2, "Base légale"),
        p(
          "[Consentement pour la mesure d'audience ; exécution d'un contrat / intérêt légitime pour les demandes].",
        ),
        h(2, "Durée de conservation"),
        p("[ex. demandes conservées 3 ans ; mesure d'audience 13 mois]."),
        h(2, "Destinataires et sous-traitants"),
        p(
          "[Vos sous-traitants — hébergement, email, mesure d'audience — et tout transfert hors UE avec les garanties appropriées].",
        ),
        h(2, "Vos droits"),
        p(
          "Vous disposez d'un droit d'accès, de rectification, d'effacement, de portabilité, de limitation et d'opposition. Écrivez à [email]. Vous pouvez aussi introduire une réclamation auprès de la CNIL (cnil.fr).",
        ),
        h(2, "Sécurité"),
        p(
          "Nous mettons en œuvre des mesures techniques et organisationnelles raisonnables pour protéger vos données.",
        ),
      ],
    },
  },
  cookies: {
    en: {
      title: "Cookie policy",
      body: [
        p(warnEn),
        h(2, "What is a cookie?"),
        p("A cookie is a small file stored on your device when you visit a website."),
        h(2, "Cookies we use"),
        p(
          "Strictly necessary cookies (theme, language, consent) are used without consent — the site needs them to work. Audience-measurement cookies are only set after you accept them.",
        ),
        h(2, "Your consent"),
        p(
          "The cookie banner lets you accept or refuse non-essential cookies. You can change your choice at any time.",
        ),
        h(2, "Managing cookies"),
        p("You can also delete or block cookies in your browser settings."),
      ],
    },
    fr: {
      title: "Politique de cookies",
      body: [
        p(warnFr),
        h(2, "Qu'est-ce qu'un cookie ?"),
        p(
          "Un cookie est un petit fichier déposé sur votre appareil lors de la visite d'un site web.",
        ),
        h(2, "Cookies que nous utilisons"),
        p(
          "Les cookies strictement nécessaires (thème, langue, consentement) sont utilisés sans consentement — le site en a besoin pour fonctionner. Les cookies de mesure d'audience ne sont déposés qu'après votre acceptation.",
        ),
        h(2, "Votre consentement"),
        p(
          "La bannière de cookies vous permet d'accepter ou de refuser les cookies non essentiels. Vous pouvez modifier votre choix à tout moment.",
        ),
        h(2, "Gérer les cookies"),
        p(
          "Vous pouvez également supprimer ou bloquer les cookies dans les réglages de votre navigateur.",
        ),
      ],
    },
  },
  cgu: {
    en: {
      title: "Terms of use",
      body: [
        p(warnEn),
        h(2, "Purpose"),
        p("These terms govern the use of this website."),
        h(2, "Access to the service"),
        p(
          "The site is accessible free of charge. [Owner] may interrupt access for maintenance without notice.",
        ),
        h(2, "Intellectual property"),
        p("The site and its content are protected. No reproduction without permission."),
        h(2, "Liability"),
        p(
          "The content is provided as-is, without warranty. [Owner] is not liable for indirect damage arising from use of the site.",
        ),
        h(2, "Personal data"),
        p("Data processing is described in our privacy policy."),
        h(2, "Governing law"),
        p("These terms are governed by [French] law."),
      ],
    },
    fr: {
      title: "Conditions générales d'utilisation",
      body: [
        p(warnFr),
        h(2, "Objet"),
        p("Les présentes conditions régissent l'utilisation de ce site web."),
        h(2, "Accès au service"),
        p(
          "Le site est accessible gratuitement. [Éditeur] peut interrompre l'accès pour maintenance sans préavis.",
        ),
        h(2, "Propriété intellectuelle"),
        p(
          "Le site et ses contenus sont protégés. Toute reproduction est interdite sans autorisation.",
        ),
        h(2, "Responsabilité"),
        p(
          "Les contenus sont fournis en l'état, sans garantie. [Éditeur] n'est pas responsable des dommages indirects liés à l'utilisation du site.",
        ),
        h(2, "Données personnelles"),
        p(
          "Le traitement des données est décrit dans notre politique de confidentialité.",
        ),
        h(2, "Droit applicable"),
        p("Les présentes conditions sont régies par le droit [français]."),
      ],
    },
  },
  cgv: {
    en: {
      title: "Terms of sale",
      body: [
        p(warnEn),
        h(2, "Scope"),
        p("These terms apply to every order placed on this site."),
        h(2, "Prices"),
        p("Prices are shown in [currency], [including/excluding] VAT."),
        h(2, "Order and payment"),
        p("An order is confirmed once payment is received via [payment methods]."),
        h(2, "Delivery / performance"),
        p("[Delivery times, areas, or how the service is delivered]."),
        h(2, "Right of withdrawal"),
        p(
          "For consumers, a 14-day right of withdrawal applies, except for the legal exceptions. [How to exercise it].",
        ),
        h(2, "Legal warranties"),
        p(
          "The legal warranty of conformity and the warranty against hidden defects apply.",
        ),
        h(2, "Governing law and disputes"),
        p(
          "Governed by [French] law. In case of dispute, a consumer may use the [mediator] mediation service.",
        ),
      ],
    },
    fr: {
      title: "Conditions générales de vente",
      body: [
        p(warnFr),
        h(2, "Champ d'application"),
        p("Les présentes conditions s'appliquent à toute commande passée sur ce site."),
        h(2, "Prix"),
        p("Les prix sont indiqués en [devise], [TTC/HT]."),
        h(2, "Commande et paiement"),
        p(
          "Une commande est confirmée après réception du paiement via [moyens de paiement].",
        ),
        h(2, "Livraison / exécution"),
        p("[Délais, zones de livraison, ou modalités d'exécution du service]."),
        h(2, "Droit de rétractation"),
        p(
          "Pour les consommateurs, un droit de rétractation de 14 jours s'applique, sauf exceptions légales. [Modalités d'exercice].",
        ),
        h(2, "Garanties légales"),
        p(
          "La garantie légale de conformité et la garantie des vices cachés s'appliquent.",
        ),
        h(2, "Droit applicable et litiges"),
        p(
          "Régies par le droit [français]. En cas de litige, le consommateur peut recourir au médiateur [nom du médiateur].",
        ),
      ],
    },
  },
};

const buildLegalPages = () =>
  Object.entries(LEGAL).flatMap(([pageKey, byLocale]) =>
    ["en", "fr"].map((lang) => ({
      _id: `legal.${lang}.${pageKey}`,
      _type: "legalPage",
      language: lang,
      pageKey,
      title: byLocale[lang].title,
      lastUpdated: "2026-01-01",
      body: byLocale[lang].body,
    })),
  );

// Navigation singleton — the SOLE runtime source for the header menu + footer
// columns (no config fallback), read by `getNavigation` (src/lib/navigation.ts).
// One shared structure with per-language labels (`localeString`). Internal links
// target a route KEY from the `pages` map; the resolver skips flag-disabled
// routes (e.g. CGV when `features.legal.sales` is off) — no dead links.
const navLabel = (en, fr) => ({ _type: "localeString", en, fr });
const navInternal = (route, en, fr) => ({
  _key: key("nav"),
  _type: "navItem",
  label: navLabel(en, fr),
  linkType: "internal",
  route,
  newTab: false,
});
// Rich external link for a header dropdown — carries an icon (free-text Reicon
// name) + a per-language description.
const navExternal = (url, en, fr, icon, descEn, descFr) => ({
  _key: key("nav"),
  _type: "navItem",
  label: navLabel(en, fr),
  linkType: "external",
  external: url,
  newTab: true,
  icon,
  description: navLabel(descEn, descFr),
});
// Header dropdown group — a label + a submenu of links (its own link is ignored).
const navGroup = (en, fr, children) => ({
  _key: key("nav"),
  _type: "navItem",
  label: navLabel(en, fr),
  linkType: "internal",
  children,
});

const buildNavigation = () => ({
  _id: "navigation",
  _type: "navigation",
  header: [
    navInternal("/", "Home", "Accueil"),
    navInternal("/blog", "Blog", "Blog"),
    // Demo dropdown with two rich links (icon + description).
    navGroup("Resources", "Ressources", [
      navExternal(
        "https://indiecrafts.dev",
        "Get started",
        "Commencer",
        "Rocket",
        "Fork the template and ship in a weekend.",
        "Forkez le template et livrez en un week-end.",
      ),
      navExternal(
        "https://indiecrafts.dev",
        "Security",
        "Sécurité",
        "ShieldCheck",
        "How the template handles data and headers.",
        "Comment le template gère les données et les en-têtes.",
      ),
    ]),
  ],
  footerColumns: [
    {
      _key: key("col"),
      _type: "footerColumn",
      title: navLabel("Legal", "Légal"),
      links: [
        navInternal("/legal-notice", "Legal notice", "Mentions légales"),
        navInternal("/privacy-policy", "Privacy", "Confidentialité"),
        navInternal("/cookie-policy", "Cookies", "Cookies"),
        navInternal("/terms", "Terms", "CGU"),
        navInternal("/terms-of-sale", "Terms of sale", "CGV"),
      ],
    },
  ],
});

// Cookie-consent singleton — banner copy + consent categories (with their Google
// Consent-Mode signal mapping) + the cookie inventory shown on the policy page.
// Read by `getCookieConsent` (src/lib/cookies.ts). `navLabel` builds localeStrings.
const buildCookieConsent = () => ({
  _id: "cookieConsent",
  _type: "cookieConsent",
  version: "1",
  banner: {
    title: navLabel("We respect your privacy", "Nous respectons votre vie privée"),
    body: navLabel(
      "We use cookies to run the site and, with your consent, to measure and improve it.",
      "Nous utilisons des cookies pour faire fonctionner le site et, avec votre accord, le mesurer et l'améliorer.",
    ),
  },
  categories: [
    {
      _key: key("cat"),
      _type: "cookieCategory",
      key: "necessary",
      title: navLabel("Necessary", "Nécessaires"),
      description: navLabel(
        "Required for the site to work (language, consent). Always on.",
        "Nécessaires au fonctionnement du site (langue, consentement). Toujours actifs.",
      ),
      required: true,
      consentSignals: [],
    },
    {
      _key: key("cat"),
      _type: "cookieCategory",
      key: "analytics",
      title: navLabel("Analytics", "Mesure d'audience"),
      description: navLabel(
        "Help us understand how the site is used, anonymously.",
        "Nous aident à comprendre l'usage du site, de façon anonyme.",
      ),
      required: false,
      consentSignals: ["analytics_storage"],
    },
    {
      _key: key("cat"),
      _type: "cookieCategory",
      key: "marketing",
      title: navLabel("Marketing", "Marketing"),
      description: navLabel(
        "Used to measure ad campaigns and show relevant ads.",
        "Servent à mesurer les campagnes publicitaires et à afficher des publicités pertinentes.",
      ),
      required: false,
      consentSignals: ["ad_storage", "ad_user_data", "ad_personalization"],
    },
    {
      _key: key("cat"),
      _type: "cookieCategory",
      key: "preferences",
      title: navLabel("Preferences", "Préférences"),
      description: navLabel(
        "Remember choices like your theme or embedded content.",
        "Mémorisent des choix comme votre thème ou les contenus intégrés.",
      ),
      required: false,
      consentSignals: ["functionality_storage", "personalization_storage"],
    },
  ],
  cookies: [
    {
      _key: key("ck"),
      _type: "cookieEntry",
      name: "NEXT_LOCALE",
      provider: "Indiecrafts",
      categoryKey: "necessary",
      purpose: navLabel("Remembers your chosen language.", "Mémorise la langue choisie."),
      duration: "1 year",
      party: "first",
    },
    {
      _key: key("ck"),
      _type: "cookieEntry",
      name: "_ga",
      provider: "Google Analytics",
      categoryKey: "analytics",
      purpose: navLabel(
        "Distinguishes anonymous visitors.",
        "Distingue les visiteurs anonymes.",
      ),
      duration: "2 years",
      party: "third",
    },
    {
      _key: key("ck"),
      _type: "cookieEntry",
      name: "_gid",
      provider: "Google Analytics",
      categoryKey: "analytics",
      purpose: navLabel(
        "Distinguishes visitors over 24 hours.",
        "Distingue les visiteurs sur 24 h.",
      ),
      duration: "24 hours",
      party: "third",
    },
    {
      _key: key("ck"),
      _type: "cookieEntry",
      name: "_fbp",
      provider: "Meta",
      categoryKey: "marketing",
      purpose: navLabel(
        "Measures ad campaigns from Meta.",
        "Mesure les campagnes publicitaires Meta.",
      ),
      duration: "3 months",
      party: "third",
    },
  ],
});

async function run() {
  console.log(`Seeding into ${projectId}/${dataset}…`);
  console.log("");

  await cleanupLegacy();
  console.log("");

  await uploadAllImages();
  await uploadLocalMedia();
  console.log("");

  const allDocs = [
    ...buildAuthors(),
    ...categories,
    ...tags,
    ...buildQuotes(),
    ...buildPeople(),
    ...buildPosts(),
    ...buildTranslationMeta(),
    ...buildSiteMeta(),
    buildSiteSettings(),
    ...buildLegalPages(),
    buildNavigation(),
    buildCookieConsent(),
    blog,
    ...comments,
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
