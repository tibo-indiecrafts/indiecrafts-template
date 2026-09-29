import { defineConfig } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";
import { readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// ---- Auto-generated "Source reference" sidebar ----
// Per-file docs live under docs/reference/ mirroring the code tree. Hand-listing
// ~800 of them is untenable, so this walks the folder and builds a nested,
// collapsed tree (wahio-style: reference is collapsed, grouped by folder). The
// curated guide sidebar above stays hand-written and newcomer-first.
const DOCS_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const REF_ROOT = join(DOCS_ROOT, "reference");

function refTree(absDir, urlBase) {
  const entries = readdirSync(absDir).sort();
  const groups = [];
  const leaves = [];
  for (const e of entries) {
    const abs = join(absDir, e);
    if (statSync(abs).isDirectory()) {
      const items = refTree(abs, `${urlBase}/${e}`);
      if (items.length) groups.push({ text: e, collapsed: true, items });
    } else if (e.endsWith(".md") && e !== "index.md") {
      leaves.push({
        text: e.replace(/\.md$/, ""),
        link: `${urlBase}/${e.replace(/\.md$/, "")}`,
      });
    }
  }
  return [...groups, ...leaves]; // folders first, then files
}

const sourceReference = existsSync(REF_ROOT)
  ? [
      {
        text: "Source reference",
        collapsed: true,
        items: refTree(REF_ROOT, "/reference"),
      },
    ]
  : [];

// Documentation site for the indiecrafts.dev template.
//   npm install          (from docs/, once)
//   npm run docs:dev     → http://localhost:3002
//   npm run docs:build   → static output in .vitepress/dist (deploy to any static host)
//
// docs/ is a repo-root sibling of code/ and MIRRORS THE CODE SPINE:
//   projects/ · packages/{shared,web}/ · modules/web/ · shared/{api,cron,workers,db,infra,scripts,architecture,client-intake}
// The sidebar mirrors those folders. Add a doc = drop the .md in the folder that
// matches the code it documents + add one sidebar line here (see contributing/how-we-document).
export default withMermaid(
  defineConfig({
    title: "indiecrafts.dev",
    description: "Documentation for the config-first Next.js template.",
    // Genuine in-site broken links now FAIL the build. The allow-list below covers
    // intentional pointers into the code tree (source of truth, outside the docs
    // root), localhost pillar links, and the cp-synced changelog copies' relative
    // links (a `sync:changelog` artifact). See contributing/how-we-document § links.
    ignoreDeadLinks: [
      /\/code\//,
      /_registry(\.md)?$/,
      /DESIGN(\.md)?$/,
      /CLAUDE(\.md)?$/,
      /\/\.claude\//,
      /^https?:\/\/localhost/,
    ],
    cleanUrls: true,
    lastUpdated: true,
    // CLAUDE.md is agent memory, not a published page — keep it out of the site.
    srcExclude: ["**/CLAUDE.md", "**/.claude/**"],
    themeConfig: {
      search: { provider: "local" },
      nav: [
        { text: "Home", link: "/" },
        { text: "Quick start", link: "/quick-start" },
        { text: "Web app", link: "/projects/web/website/setup/new-client" },
        { text: "Blog", link: "/modules/web/blog/" },
        { text: "Contributing", link: "/contributing/how-we-document" },
        { text: "Changelog", link: "/CHANGELOG" },
        // Internal cross-pillar nav (Code/Docs/Method/Lab) — LOCAL DEV ONLY. The
        // Method + Lab sites are private (never deployed to a client-reachable
        // URL), so this whole block is hidden outside dev. See
        // `shared/architecture/workspace` § Deployment.
        ...(process.env.NODE_ENV === "production"
          ? []
          : [
              {
                text: "Pillars (dev)",
                items: [
                  { text: "Code (app · :3000)", link: "http://localhost:3000" },
                  { text: "Docs (:3002)", link: "http://localhost:3002" },
                  { text: "Method (:3003)", link: "http://localhost:3003" },
                  { text: "Lab (:3004)", link: "http://localhost:3004" },
                ],
              },
            ]),
      ],
      sidebar: [
        {
          text: "Getting started",
          collapsed: false,
          items: [
            { text: "Quick start", link: "/quick-start" },
            {
              text: "Installation",
              link: "/projects/web/website/setup/environment",
            },
            { text: "Platform overview", link: "/getting-started" },
          ],
        },
        {
          text: "Contributing",
          collapsed: false,
          items: [
            { text: "How we document", link: "/contributing/how-we-document" },
            {
              text: "Architecture decisions (ADRs)",
              link: "/contributing/adr/",
            },
            { text: "ADR template", link: "/contributing/adr/0000-template" },
            {
              text: "ADR 0001 — Capacitor over Expo",
              link: "/contributing/adr/0001-capacitor-over-expo",
            },
          ],
        },
        {
          text: "Web app · Setup & operations",
          collapsed: false,
          items: [
            {
              text: "Workspace & deployment",
              link: "/shared/architecture/workspace",
            },
            {
              text: "Deployment (Cloudflare)",
              link: "/projects/web/website/setup/deployment",
            },
            {
              text: "Cloudflare as code (IaC)",
              link: "/shared/infra/cloudflare-iac",
            },
            { text: "Backups", link: "/projects/web/website/setup/backups" },
            {
              text: "Environment setup",
              link: "/projects/web/website/setup/environment",
            },
            {
              text: "New client",
              link: "/projects/web/website/setup/new-client",
            },
            {
              text: "Brand setup",
              link: "/projects/web/website/setup/brand-setup",
            },
            {
              text: "Launch checklist",
              link: "/projects/web/website/setup/launch-checklist",
            },
            {
              text: "Operations",
              link: "/projects/web/website/setup/operations",
            },
            { text: "Scripts", link: "/projects/web/website/setup/scripts" },
            { text: "Testing", link: "/projects/web/website/setup/testing" },
            {
              text: "On-the-fly checks",
              link: "/projects/web/website/setup/on-the-fly-checks",
            },
            {
              text: "Maintenance mode",
              link: "/projects/web/website/setup/maintenance-mode",
            },
          ],
        },
        {
          text: "Web app · Configuration & architecture",
          collapsed: false,
          items: [
            {
              text: "Project organization",
              link: "/projects/web/website/config/project-organization",
            },
            {
              text: "Multi-app architecture",
              link: "/shared/architecture/multi-app",
            },
            {
              text: "Feature flags",
              link: "/projects/web/website/config/feature-flags",
            },
            {
              text: "API security limits",
              link: "/projects/web/website/config/security-limits",
            },
            {
              text: "Authentication (Clerk)",
              link: "/projects/web/website/config/auth",
            },
            {
              text: "Data retention + audit (GDPR)",
              link: "/projects/web/website/config/data-retention",
            },
            {
              text: "Admin settings + backups",
              link: "/projects/web/website/config/settings",
            },
            {
              text: "Cookie consent (geo modes)",
              link: "/projects/web/website/config/cookie-consent-geo",
            },
            {
              text: "Security hardening (Cloudflare)",
              link: "/projects/web/website/config/security-hardening",
            },
            {
              text: "Breach response (GDPR)",
              link: "/projects/web/website/config/breach-response",
            },
            {
              text: "Records of processing (ROPA)",
              link: "/projects/web/website/config/ropa",
            },
            {
              text: "Sub-processors & transfers",
              link: "/projects/web/website/config/sub-processors",
            },
            {
              text: "DPIA template",
              link: "/projects/web/website/config/dpia-template",
            },
            {
              text: "Privacy by regime & scope",
              link: "/projects/web/website/config/privacy-by-regime",
            },
            {
              text: "Email preferences",
              link: "/projects/web/website/config/email-preferences",
            },
            {
              text: "Clerk emails",
              link: "/projects/web/website/config/clerk-emails",
            },
            {
              text: "Churn tracking",
              link: "/projects/web/website/config/churn",
            },
            {
              text: "Navigation",
              link: "/projects/web/website/config/navigation",
            },
            {
              text: "Legal pages",
              link: "/projects/web/website/config/legal-pages",
            },
            {
              text: "i18n & routing",
              link: "/projects/web/website/config/i18n-and-routing",
            },
            {
              text: "Theme modes",
              link: "/projects/web/website/config/theme-modes",
            },
            {
              text: "Images (Sanity CDN)",
              link: "/projects/web/website/config/images",
            },
            {
              text: "App changelog (code + design)",
              link: "/projects/web/website/changelog",
            },
          ],
        },
        {
          text: "Web app · Design & content",
          collapsed: true,
          items: [
            {
              text: "Design decisions (log)",
              link: "/projects/web/website/design/decisions",
            },
            {
              text: "Design critique (ordered)",
              link: "/projects/web/website/design/design-critique",
            },
            {
              text: "Homepage (page-builder)",
              link: "/projects/web/website/features/homepage",
            },
            { text: "Sections", link: "/projects/web/website/design/sections" },
            {
              text: "Typography & fonts",
              link: "/projects/web/website/design/typography",
            },
            {
              text: "Adaptive & responsive",
              link: "/projects/web/website/design/adaptive-responsive",
            },
            {
              text: "Icons & favicons",
              link: "/projects/web/website/design/icons",
            },
            {
              text: "Featured articles",
              link: "/projects/web/website/design/featured-articles",
            },
            {
              text: "Video embeds",
              link: "/projects/web/website/design/video-embeds",
            },
            {
              text: "Error pages",
              link: "/projects/web/website/design/error-pages",
            },
          ],
        },
        {
          text: "Web app · SEO & discovery",
          collapsed: false,
          items: [
            {
              text: "SEO metadata",
              link: "/projects/web/website/seo/seo-metadata",
            },
            {
              text: "Editing SEO in Sanity",
              link: "/projects/web/website/seo/editing-seo-in-sanity",
            },
            {
              text: "Structured data",
              link: "/projects/web/website/seo/structured-data-cookbook",
            },
            { text: "FAQ", link: "/projects/web/website/seo/faq" },
            {
              text: "LLM endpoints",
              link: "/projects/web/website/seo/llms-endpoints",
            },
            {
              text: "robots & environments",
              link: "/projects/web/website/seo/robots-and-environments",
            },
            { text: "Analytics", link: "/projects/web/website/seo/analytics" },
            {
              text: "Security headers",
              link: "/projects/web/website/seo/security-headers",
            },
          ],
        },
        {
          text: "Other surfaces",
          collapsed: true,
          items: [
            { text: "Admin dashboard", link: "/projects/web/admin/" },
            { text: "App (lean web surface)", link: "/projects/web/app/" },
            {
              text: "Storybook (design-system gallery)",
              link: "/projects/web/tools/storybook",
            },
            {
              text: "Mobile shell (Capacitor)",
              link: "/projects/mobile/main/",
            },
          ],
        },
        {
          text: "Shared services & infra",
          collapsed: true,
          items: [
            { text: "API worker", link: "/shared/api/" },
            { text: "Cron worker", link: "/shared/cron/" },
            { text: "Background workers (jobs)", link: "/shared/workers/" },
            {
              text: "Toolchain scripts & registries",
              link: "/shared/scripts/",
            },
            { text: "Database (D1)", link: "/shared/db/README" },
            { text: "Infra (Cloudflare)", link: "/shared/infra/README" },
          ],
        },
        {
          text: "Modules",
          collapsed: true,
          items: [
            { text: "Overview", link: "/modules/README" },
            { text: "Linking a module", link: "/modules/linking-a-module" },
            { text: "Changelog", link: "/modules/changelog" },
            { text: "Blog · Overview", link: "/modules/web/blog/" },
            {
              text: "Blog · Sanity setup",
              link: "/modules/web/blog/sanity-setup",
            },
            {
              text: "Blog · Editor guide",
              link: "/modules/web/blog/editor-guide",
            },
            {
              text: "Blog · Body editor",
              link: "/modules/web/blog/body-editor",
            },
            { text: "Blog · Image gallery", link: "/modules/web/blog/gallery" },
            { text: "Blog · Comments", link: "/modules/web/blog/comments" },
            {
              text: "Blog · Architecture",
              link: "/modules/web/blog/blog-architecture",
            },
            {
              text: "Blog · Sanity tokens",
              link: "/modules/web/blog/sanity-tokens",
            },
            { text: "Newsletter", link: "/modules/web/newsletter/" },
            { text: "Waitlist", link: "/modules/web/waitlist/" },
            { text: "Contact", link: "/modules/web/contact/" },
          ],
        },
        {
          text: "Shared · Architecture",
          collapsed: true,
          items: [
            {
              text: "Local development",
              link: "/shared/architecture/local-development",
            },
            {
              text: "Multi-app architecture",
              link: "/shared/architecture/multi-app",
            },
            {
              text: "Platform deploy (registry · CI)",
              link: "/shared/architecture/platform-deploy",
            },
            {
              text: "First deployment (runbook · URLs)",
              link: "/shared/architecture/first-deployment",
            },
            {
              text: "Mobile shell",
              link: "/shared/architecture/cross-platform-shell",
            },
            {
              text: "Authentication (cross-app)",
              link: "/shared/architecture/auth",
            },
            {
              text: "Workspace & delivery",
              link: "/shared/architecture/workspace",
            },
          ],
        },
        {
          text: "Shared · Client intake forms",
          collapsed: true,
          items: [
            {
              text: "1 · SEO content",
              link: "/shared/client-intake/1-seo-content",
            },
            {
              text: "2 · Business details",
              link: "/shared/client-intake/2-business-details",
            },
            {
              text: "3 · AI index (llms)",
              link: "/shared/client-intake/3-ai-index-llms",
            },
            {
              text: "4 · Content & FAQ",
              link: "/shared/client-intake/4-content-and-faq",
            },
          ],
        },
        {
          text: "Packages",
          collapsed: true,
          items: [
            { text: "Overview", link: "/packages/README" },
            { text: "Linking a package", link: "/packages/linking-a-package" },
            { text: "Changelog", link: "/packages/changelog" },
            {
              text: "Shared",
              collapsed: true,
              items: [
                { text: "announcement", link: "/packages/shared/announcement" },
                { text: "auth", link: "/packages/shared/auth" },
                { text: "compliance", link: "/packages/shared/compliance" },
                { text: "config", link: "/packages/shared/config" },
                { text: "format", link: "/packages/shared/format" },
                {
                  text: "gated-delivery",
                  link: "/packages/shared/gated-delivery",
                },
                { text: "logger", link: "/packages/shared/logger" },
                { text: "query (TanStack)", link: "/packages/shared/query" },
                { text: "security", link: "/packages/shared/security" },
                {
                  text: "security-events",
                  link: "/packages/shared/security-events",
                },
                { text: "ui-fonts", link: "/packages/shared/ui-fonts" },
                { text: "ui-tokens", link: "/packages/web/ui-tokens" },
                { text: "utils", link: "/packages/shared/utils" },
              ],
            },
            {
              text: "Web",
              collapsed: true,
              items: [
                { text: "announcement", link: "/packages/web/announcement" },
                { text: "auth", link: "/packages/web/auth" },
                { text: "compliance", link: "/packages/web/compliance" },
                { text: "email", link: "/packages/web/email" },
                { text: "i18n", link: "/packages/web/i18n" },
                {
                  text: "locale-suggest",
                  link: "/packages/web/locale-suggest",
                },
                { text: "page-builder", link: "/packages/web/page-builder" },
                { text: "sanity", link: "/packages/web/sanity" },
                { text: "schema", link: "/packages/web/schema" },
                {
                  text: "security-reports",
                  link: "/packages/web/security-reports",
                },
                { text: "system-pages", link: "/packages/web/system-pages" },
                { text: "ui", link: "/packages/web/ui" },
                { text: "ui-components", link: "/packages/web/ui-components" },
                { text: "ui-icons", link: "/packages/web/ui-icons" },
                { text: "version", link: "/packages/web/version" },
              ],
            },
          ],
        },
        ...sourceReference,
      ],
    },
  }),
);
