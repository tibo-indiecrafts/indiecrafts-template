#!/usr/bin/env node
/**
 * Seed the Sanity dataset with demo blog content.
 *
 *   pnpm seed:blog
 *
 * Needs a write-capable Sanity token in `SANITY_API_WRITE_TOKEN`
 * (Editor role is enough). Get one at:
 *   https://www.sanity.io/manage/personal/project/qy2pp5sn/api → Tokens.
 *
 * Idempotent: re-running re-applies the same `_id`s via `createOrReplace`,
 * so editing the data here and re-running updates content in place
 * instead of duplicating it.
 *
 * Creates:
 *   - 3 authors (language-agnostic — names stay the same)
 *   - 3 categories per locale (en + fr)
 *   - 5 posts per locale, including 2 in-depth "fast prototyping" articles
 *   - 4 quotes (testimonials, language-tagged)
 *   - 3 people (team members)
 *   - 4 logos (brand placeholders)
 *   - 1 contact form
 *   - 1 blog singleton with ALL 17 modules wired into frontpageModules
 *     and a representative subset in postModules
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

/** PortableText block builder — single paragraph of plain text. */
const p = (text) => ({
  _type: "block",
  _key: key("b"),
  style: "normal",
  markDefs: [],
  children: [{ _type: "span", _key: key("s"), text, marks: [] }],
});

/** PortableText heading. */
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

/** Bullet list item. */
const li = (text) => ({
  _type: "block",
  _key: key("b"),
  style: "normal",
  listItem: "bullet",
  level: 1,
  markDefs: [],
  children: [{ _type: "span", _key: key("s"), text, marks: [] }],
});

/** Paragraph with one strong span. */
const pStrong = (lead, strong, tail = "") => {
  const sKey = key("s");
  return {
    _type: "block",
    _key: key("b"),
    style: "normal",
    markDefs: [],
    children: [
      { _type: "span", _key: key("s"), text: lead, marks: [] },
      { _type: "span", _key: sKey, text: strong, marks: ["strong"] },
      ...(tail ? [{ _type: "span", _key: key("s"), text: tail, marks: [] }] : []),
    ],
  };
};

/** Paragraph with one link mark. */
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

// ─── Doc definitions ───────────────────────────────────────────

const authors = [
  {
    _id: "author.ada",
    _type: "author",
    name: "Ada Lovelace",
    position: "Founder · Analytic Studio",
    slug: { _type: "slug", current: "ada-lovelace" },
    bio: [p("Mathematician, writer, and self-described 'enchantress of numbers'.")],
  },
  {
    _id: "author.grace",
    _type: "author",
    name: "Grace Hopper",
    position: "Engineering · USNR",
    slug: { _type: "slug", current: "grace-hopper" },
    bio: [p("Compiler pioneer. If it works, ship it; ask forgiveness, not permission.")],
  },
  {
    _id: "author.tim",
    _type: "author",
    name: "Tim Berners-Lee",
    position: "Web architect",
    slug: { _type: "slug", current: "tim-berners-lee" },
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

const people = [
  {
    _id: "person.maya",
    _type: "person",
    name: "Maya Chen",
    role: "Founder",
    bio: "Ex-Stripe. Three exits, all bootstrapped.",
  },
  {
    _id: "person.luis",
    _type: "person",
    name: "Luis Martínez",
    role: "Head of Design",
    bio: "Ex-Airbnb. Cares about kerning more than caffeine.",
  },
  {
    _id: "person.yuki",
    _type: "person",
    name: "Yuki Tanaka",
    role: "Lead Engineer",
    bio: "Compiler nerd. Talks to herself in Lisp.",
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
  metadata: {
    title,
    description,
    slug: { _type: "slug", current: slug },
    noIndex: false,
  },
});

const posts = [
  // ── EN: 2 in-depth fast-prototyping pieces + 3 fillers ──
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
      h(3, "Skip these"),
      li(
        "CMS integration. Hard-code copy until you've written the same paragraph three times.",
      ),
      li("Authentication. Most MVPs don't need it."),
      li("A design system. Use defaults until friction proves otherwise."),
      h(2, "When to slow down"),
      p(
        "The moment you have a second person editing copy, set up a CMS. The moment two people share a feature flag, write it down. Premature infrastructure is the enemy.",
      ),
      blockquote(
        "Make it work, make it right, make it fast — in that order. — Kent Beck",
      ),
      h(2, "Closing thought"),
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
      h(2, "The hour-by-hour timeline"),
      h(3, "Friday evening (2h)"),
      p(
        "Fork the template, set the brand colors, paste in the copy you already have, push the first deploy.",
      ),
      h(3, "Saturday (6h)"),
      p(
        "Wire up content, hook up the form, add real imagery, write the SEO description, ship.",
      ),
      h(3, "Sunday (3h)"),
      p(
        "Test on a phone, fix the three things that always break (touch targets, contrast, footer overflow), hand off.",
      ),
      h(2, "What about polish?"),
      p("Polish is what week two is for. The weekend is for proving it works."),
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
    body: [
      p(
        "The dirty secret of agency work is that every site is the same site with different colors. Conventions encode the sameness; configuration captures the differences.",
      ),
      h(2, "What configuration buys you"),
      li("Brand theming without touching components."),
      li("Per-client feature flags (does this one need a blog? cookies?)."),
      li("Faster onboarding — new contractor reads one file, ships the next day."),
      h(2, "Where it falls down"),
      p(
        "Config can leak into the layer it shouldn't touch. If a component reads the brand color through three layers of abstraction, that's not configuration — that's an obstacle course.",
      ),
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
    body: [
      p(
        "If you've ever set up an email-only contact form with Resend, SendGrid, or a serverless function — you've over-engineered.",
      ),
      p(
        "Netlify Forms scans your `public/__forms.html` at build time and treats any matching POST to `/` as a submission. No JS required.",
      ),
      h(2, "How it works"),
      li("Declare each form once in `public/__forms.html`."),
      li("Submit a URL-encoded POST to `/` with a `form-name` field that matches."),
      li(
        "View submissions in the Netlify dashboard. Configure email/Slack notifications there.",
      ),
      blockquote(
        "If a third party will do it for free and not mess it up, that's the right answer.",
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
      p("That's it. No vendor."),
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
      h(2, "Jour deux : contenu et analytics"),
      p(
        "L'après-midi du jour deux, vous avez une page unique avec du contenu réel, un formulaire de contact et des métriques au niveau du trafic. Résistez à l'envie d'en ajouter.",
      ),
      h(3, "À sauter pour l'instant"),
      li(
        "Intégration CMS. Codez le contenu en dur jusqu'à avoir réécrit trois fois le même paragraphe.",
      ),
      li("Authentification. La plupart des MVP n'en ont pas besoin."),
      li("Un design system. Restez avec les défauts jusqu'à preuve du contraire."),
      h(2, "Quand ralentir"),
      p(
        "Dès qu'une deuxième personne édite le contenu, installez un CMS. Dès que deux personnes partagent un feature flag, documentez-le. L'infrastructure prématurée est l'ennemi.",
      ),
      blockquote(
        "Faites que ça marche, faites que ça soit juste, faites que ça soit rapide — dans cet ordre. — Kent Beck",
      ),
      h(2, "Pour finir"),
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
    body: [
      p(
        "La plupart des missions freelance meurent en réunion cadrage. Voici comment les maintenir en vie : engagez-vous sur une fenêtre de 48 h dès le départ, et dites-le.",
      ),
      h(2, "Cadrer avant de cadrer"),
      p(
        "Avant la première ligne de code, mettez-vous d'accord sur les trois pages, le formulaire unique, et la cible de déploiement. Tout le reste, c'est de la v2.",
      ),
      li("Une landing page avec hero + features + contact."),
      li("Une page légale (ou aucune — vérifiez si elle est vraiment requise)."),
      li("Un endpoint de soumission (Netlify Forms ou un service email-to-API)."),
      h(2, "Le planning heure par heure"),
      h(3, "Vendredi soir (2 h)"),
      p(
        "Forkez le template, posez les couleurs, collez le contenu déjà disponible, lancez le premier déploiement.",
      ),
      h(3, "Samedi (6 h)"),
      p(
        "Câblez le contenu, branchez le formulaire, ajoutez de vraies images, rédigez la description SEO, livrez.",
      ),
      h(3, "Dimanche (3 h)"),
      p(
        "Testez sur téléphone, corrigez les trois bugs habituels (zones tactiles, contraste, débordement du footer), faites la passation.",
      ),
      h(2, "Et le polish alors ?"),
      p(
        "Le polish, c'est pour la semaine d'après. Le week-end sert à prouver que ça marche.",
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
    body: [
      p(
        "Le secret mal gardé du travail d'agence : chaque site est le même site, avec des couleurs différentes. Les conventions encodent la similitude ; la configuration capture les différences.",
      ),
      h(2, "Ce que la configuration permet"),
      li("Thématisation de marque sans toucher aux composants."),
      li("Feature flags par client (celui-là veut-il un blog ? des cookies ?)."),
      li(
        "Onboarding plus rapide — le nouveau contractor lit un fichier, livre le lendemain.",
      ),
      h(2, "Où elle déraille"),
      p(
        "La config peut déborder sur les couches qu'elle ne devrait pas toucher. Si un composant lit la couleur de marque à travers trois niveaux d'abstraction, ce n'est plus de la configuration — c'est un parcours d'obstacles.",
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
    body: [
      p(
        "Si vous avez déjà monté un formulaire de contact email-only avec Resend, SendGrid ou une fonction serverless — vous avez sur-ingénieré.",
      ),
      p(
        "Netlify Forms scanne `public/__forms.html` au moment du build et traite toute requête POST vers `/` avec un champ `form-name` correspondant comme une soumission. Sans JS.",
      ),
      h(2, "Mécanique"),
      li("Déclarez chaque formulaire une fois dans `public/__forms.html`."),
      li("Soumettez une requête POST URL-encodée vers `/` avec un champ `form-name`."),
      li(
        "Consultez les soumissions dans le dashboard Netlify. Configurez-y les notifications email / Slack.",
      ),
      blockquote("Si un tiers le fait gratuitement et bien, c'est la bonne réponse."),
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
    body: [
      p(
        "Les SaaS de bannière cookies font payer cher un problème qui se résume à un booléen.",
      ),
      h(2, "Ce qu'il vous faut réellement"),
      li("Une bannière qui apparaît à la première visite et disparaît après un clic."),
      li("Une clé `cookie-consent` dans localStorage."),
      li(
        "Si vous chargez Google Analytics, intégrez Consent Mode v2 — `analytics_storage` à `denied` par défaut, bascule en `granted` à l'acceptation.",
      ),
      p("Voilà. Pas de vendor."),
    ],
  }),
];

// ─── Blog singleton: showcase ALL 17 modules ───────────────────

const blog = {
  _id: "blog",
  _type: "blog",
  frontpageModules: [
    {
      _type: "module.blog-index",
      _key: key("m"),
      eyebrow: "Indiecrafts Journal",
      title: "Read, learn, ship",
      intro:
        "Notes from the workshop — engineering, product, and the stories behind shipping fast.",
      hidden: false,
    },
    {
      _type: "module.breadcrumbs",
      _key: key("m"),
      items: [
        { _key: key("c"), label: "Home", href: "/" },
        { _key: key("c"), label: "Blog" },
      ],
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
      imagePosition: "right",
      hidden: false,
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
      _type: "module.blog-post-list",
      _key: key("m"),
      title: "Latest posts",
      intro: "Newest first.",
      limit: 9,
      featuredOnly: false,
    },
    {
      _type: "module.quote-list",
      _key: key("m"),
      title: "What people say",
      quotes: [
        { _type: "reference", _ref: "quote.en.lovelace", _key: key("q") },
        { _type: "reference", _ref: "quote.en.hopper", _key: key("q") },
        { _type: "reference", _ref: "quote.fr.lovelace", _key: key("q") },
        { _type: "reference", _ref: "quote.fr.hopper", _key: key("q") },
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
      _type: "module.callout",
      _key: key("m"),
      variant: "info",
      content: [
        pStrong(
          "Heads up: ",
          "the blog feature flag is OFF by default",
          " — flip it in src/config/index.ts to enable these routes in production.",
        ),
      ],
    },
    {
      _type: "module.callout",
      _key: key("m"),
      variant: "warning",
      content: [
        p(
          "If you fork this for an EU-targeted site with analytics, also turn on the cookieBanner flag.",
        ),
      ],
    },
    {
      _type: "module.callout",
      _key: key("m"),
      variant: "success",
      content: [
        p(
          "All AA contrast checks pass on the default theme — verify with pnpm verify:contrast.",
        ),
      ],
    },
    {
      _type: "module.callout",
      _key: key("m"),
      variant: "danger",
      content: [
        p(
          "Avoid editing src/components/ui-primitives/* by hand — they're shadcn-managed.",
        ),
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
      _type: "module.prose",
      _key: key("m"),
      width: "wide",
      content: [
        h(2, "Open source, built in the open"),
        p(
          "The template is MIT-licensed. PRs welcome on the indiecrafts.dev repo — see CONTRIBUTING.md for the conventions we hold each other to.",
        ),
      ],
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
      html: '<div style="margin: 4rem auto; max-width: 64rem; padding: 1.5rem; text-align: center; border-radius: 0.75rem; background: var(--muted); color: var(--muted-foreground); font-size: 0.875rem;">This block is a <code>module.custom-html</code> — raw HTML the editor controls. Lock the Studio role if you need to restrict access.</div>',
    },
  ],
  postModules: [
    {
      _type: "module.breadcrumbs",
      _key: key("m"),
      items: [
        { _key: key("c"), label: "Home", href: "/" },
        { _key: key("c"), label: "Blog", href: "/blog" },
        { _key: key("c"), label: "Article" },
      ],
    },
    { _type: "module.blog-post-content", _key: key("m") },
    {
      _type: "module.quote-list",
      _key: key("m"),
      title: "What others say",
      quotes: [{ _type: "reference", _ref: "quote.en.hopper", _key: key("q") }],
    },
    { _type: "module.blog-post-list", _key: key("m"), title: "Keep reading", limit: 3 },
  ],
};

// ─── Run ────────────────────────────────────────────────────────

const allDocs = [
  ...authors,
  ...categories,
  ...quotes,
  ...people,
  ...logos,
  ...forms,
  ...posts,
  blog,
];

async function run() {
  console.log(`Seeding ${allDocs.length} documents into ${projectId}/${dataset}…`);
  let tx = client.transaction();
  for (const doc of allDocs) tx = tx.createOrReplace(doc);
  const res = await tx.commit({ visibility: "async" });
  console.log(`✓ Committed transaction ${res.transactionId}`);
  console.log("");
  console.log("Next steps:");
  console.log("  - Set features.blog = true in src/config/index.ts");
  console.log("  - pnpm dev → open http://localhost:3000/en/blog and /fr/blog");
  console.log(
    "  - Open the Studio at /studio → Blog → Layout (singleton) to see the module mix",
  );
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
