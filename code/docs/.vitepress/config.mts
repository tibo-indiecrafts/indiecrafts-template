import { defineConfig } from "vitepress";

// Documentation site for the indiecrafts.dev template.
//   npm install          (from docs/, once)
//   npm run docs:dev     → http://localhost:3002
//   npm run docs:build   → static output in .vitepress/dist (deploy to Vercel)
//
// docs/ is a repo-root sibling of code/ (and the private internal folders), and mirrors the same
// spine: shared/ (cross-cutting) + apps/web · modules · packages · db · infra.
// The sidebar mirrors those folders. Add a doc = drop the .md in the folder that
// matches the code it documents + add one sidebar line here.
export default defineConfig({
  title: "indiecrafts.dev",
  description: "Documentation for the config-first Next.js template.",
  ignoreDeadLinks: true,
  cleanUrls: true,
  lastUpdated: true,
  // CLAUDE.md is agent memory, not a published page — keep it out of the site.
  srcExclude: ["**/CLAUDE.md", "**/.claude/**"],
  themeConfig: {
    search: { provider: "local" },
    nav: [
      { text: "Home", link: "/" },
      { text: "Get started", link: "/getting-started" },
      { text: "Web app", link: "/apps/web/setup/new-client" },
      { text: "Blog", link: "/modules/blog/" },
      { text: "Shared", link: "/shared/client-intake/1-seo-content" },
      { text: "Changelog", link: "/CHANGELOG" },
      // Internal cross-pillar nav (Code/Docs/Method/Lab) — LOCAL DEV ONLY. The
      // Method + Lab sites are private (never deployed to a client-reachable
      // URL), so this whole block is hidden outside dev. See
      // `apps/web/setup/workspace` § Deployment.
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
        items: [{ text: "Platform overview", link: "/getting-started" }],
      },
      {
        text: "Web app · Setup & operations",
        collapsed: false,
        items: [
          {
            text: "Local development",
            link: "/apps/web/setup/local-development",
          },
          {
            text: "Workspace & deployment",
            link: "/shared/architecture/workspace",
          },
          {
            text: "Deployment (Cloudflare)",
            link: "/apps/web/setup/deployment",
          },
          { text: "Cloudflare as code (IaC)", link: "/infra/cloudflare-iac" },
          { text: "Backups", link: "/apps/web/setup/backups" },
          { text: "Environment setup", link: "/apps/web/setup/environment" },
          { text: "New client", link: "/apps/web/setup/new-client" },
          { text: "Brand setup", link: "/apps/web/setup/brand-setup" },
          {
            text: "Launch checklist",
            link: "/apps/web/setup/launch-checklist",
          },
          { text: "Operations", link: "/apps/web/setup/operations" },
          { text: "Scripts", link: "/apps/web/setup/scripts" },
          { text: "Testing", link: "/apps/web/setup/testing" },
          {
            text: "On-the-fly checks",
            link: "/apps/web/setup/on-the-fly-checks",
          },
          {
            text: "Maintenance mode",
            link: "/apps/web/setup/maintenance-mode",
          },
        ],
      },
      {
        text: "Web app · Configuration & architecture",
        collapsed: false,
        items: [
          {
            text: "Project organization",
            link: "/apps/web/config/project-organization",
          },
          {
            text: "Multi-app architecture",
            link: "/shared/architecture/multi-app",
          },
          { text: "Feature flags", link: "/apps/web/config/feature-flags" },
          { text: "API security limits", link: "/apps/web/config/security-limits" },
          { text: "Authentication (Clerk)", link: "/apps/web/config/auth" },
          { text: "Data retention + audit (GDPR)", link: "/apps/web/config/data-retention" },
          { text: "Admin settings + backups", link: "/apps/web/config/settings" },
          { text: "Cookie consent (geo modes)", link: "/apps/web/config/cookie-consent-geo" },
          { text: "Security hardening (Cloudflare)", link: "/apps/web/config/security-hardening" },
          { text: "Breach response (GDPR)", link: "/apps/web/config/breach-response" },
          { text: "Records of processing (ROPA)", link: "/apps/web/config/ropa" },
          { text: "Sub-processors & transfers", link: "/apps/web/config/sub-processors" },
          { text: "DPIA template", link: "/apps/web/config/dpia-template" },
          { text: "Privacy by regime & scope", link: "/apps/web/config/privacy-by-regime" },
          { text: "Navigation", link: "/apps/web/config/navigation" },
          { text: "Legal pages", link: "/apps/web/config/legal-pages" },
          { text: "i18n & routing", link: "/apps/web/config/i18n-and-routing" },
          { text: "Theme modes", link: "/apps/web/config/theme-modes" },
          { text: "Images (Sanity CDN)", link: "/apps/web/config/images" },
          {
            text: "App changelog (code + design)",
            link: "/apps/web/changelog",
          },
        ],
      },
      {
        text: "Web app · Design & content",
        collapsed: true,
        items: [
          {
            text: "Design decisions (log)",
            link: "/apps/web/design/decisions",
          },
          {
            text: "Design critique (ordered)",
            link: "/apps/web/design/design-critique",
          },
          {
            text: "Homepage (page-builder)",
            link: "/apps/web/features/homepage",
          },
          { text: "Sections", link: "/apps/web/design/sections" },
          { text: "Typography & fonts", link: "/apps/web/design/typography" },
          {
            text: "Adaptive & responsive",
            link: "/apps/web/design/adaptive-responsive",
          },
          { text: "Icons & favicons", link: "/apps/web/design/icons" },
          {
            text: "Featured articles",
            link: "/apps/web/design/featured-articles",
          },
          { text: "Video embeds", link: "/apps/web/design/video-embeds" },
          { text: "Error pages", link: "/apps/web/design/error-pages" },
        ],
      },
      {
        text: "Web app · SEO & discovery",
        collapsed: false,
        items: [
          { text: "SEO metadata", link: "/apps/web/seo/seo-metadata" },
          {
            text: "Editing SEO in Sanity",
            link: "/apps/web/seo/editing-seo-in-sanity",
          },
          {
            text: "Structured data",
            link: "/apps/web/seo/structured-data-cookbook",
          },
          { text: "FAQ", link: "/apps/web/seo/faq" },
          { text: "LLM endpoints", link: "/apps/web/seo/llms-endpoints" },
          {
            text: "robots & environments",
            link: "/apps/web/seo/robots-and-environments",
          },
          { text: "Analytics", link: "/apps/web/seo/analytics" },
          { text: "Security headers", link: "/apps/web/seo/security-headers" },
        ],
      },
      {
        text: "Background Workers",
        collapsed: true,
        items: [{ text: "api · cron · jobs", link: "/apps/workers/" }],
      },
      {
        text: "Modules",
        collapsed: true,
        items: [
          { text: "Overview", link: "/modules/README" },
          { text: "Linking a module", link: "/modules/linking-a-module" },
          { text: "Changelog", link: "/modules/changelog" },
          { text: "Blog · Overview", link: "/modules/blog/" },
          { text: "Blog · Sanity setup", link: "/modules/blog/sanity-setup" },
          { text: "Blog · Editor guide", link: "/modules/blog/editor-guide" },
          { text: "Blog · Body editor", link: "/modules/blog/body-editor" },
          { text: "Blog · Image gallery", link: "/modules/blog/gallery" },
          { text: "Blog · Comments", link: "/modules/blog/comments" },
          {
            text: "Blog · Architecture",
            link: "/modules/blog/blog-architecture",
          },
          { text: "Blog · Sanity tokens", link: "/modules/blog/sanity-tokens" },
          { text: "Newsletter", link: "/modules/newsletter/" },
          { text: "Waitlist", link: "/modules/waitlist/" },
          { text: "Contact", link: "/modules/contact/" },
        ],
      },
      {
        text: "Shared · Architecture",
        collapsed: true,
        items: [
          {
            text: "Multi-app architecture",
            link: "/shared/architecture/multi-app",
          },
          {
            text: "Platform deploy (registry · CI)",
            link: "/shared/architecture/platform-deploy",
          },
          {
            text: "Cross-platform shell",
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
          { text: "config", link: "/packages/config" },
          { text: "logger", link: "/packages/logger" },
          { text: "utils", link: "/packages/utils" },
          { text: "sanity", link: "/packages/sanity" },
          { text: "schema", link: "/packages/schema" },
          { text: "page-builder", link: "/packages/page-builder" },
          { text: "ui", link: "/packages/ui" },
          { text: "ui-components", link: "/packages/ui-components" },
          { text: "ui-tokens", link: "/packages/ui-tokens" },
          { text: "ui-icons", link: "/packages/ui-icons" },
          { text: "ui-fonts", link: "/packages/ui-fonts" },
          { text: "ui-native", link: "/packages/ui-native" },
          { text: "storybook", link: "/packages/storybook" },
          { text: "i18n", link: "/packages/i18n" },
          { text: "compliance", link: "/packages/compliance" },
          { text: "compliance-shared", link: "/packages/compliance-shared" },
          { text: "email", link: "/packages/email" },
          { text: "format", link: "/packages/format" },
          { text: "security", link: "/packages/security" },
          { text: "security-reports", link: "/packages/security-reports" },
          { text: "agent (AI)", link: "/packages/agent" },
          { text: "agent-client (AI)", link: "/packages/agent-client" },
          { text: "query (TanStack)", link: "/packages/query" },
          { text: "system-pages", link: "/packages/system-pages" },
          { text: "version", link: "/packages/version" },
          { text: "version-shared", link: "/packages/version-shared" },
          { text: "announcement", link: "/packages/announcement" },
          { text: "announcement-shared", link: "/packages/announcement-shared" },
          { text: "locale-suggest", link: "/packages/locale-suggest" },
          { text: "gated-delivery", link: "/packages/gated-delivery" },
        ],
      },
      {
        text: "Db · Infra",
        collapsed: true,
        items: [
          { text: "Db", link: "/db/README" },
          { text: "Infra", link: "/infra/README" },
        ],
      },
    ],
  },
});
