import { defineConfig } from "vitepress";

// Documentation site for the indiecrafts.dev template.
//   npm install          (from docs/, once)
//   npm run docs:dev     → http://localhost:3002
//   npm run docs:build   → static output in .vitepress/dist (deploy to Vercel)
//
// docs/ is a repo-root sibling of code/ · method/ · work/, and mirrors the same
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
  srcExclude: ["**/CLAUDE.md"],
  themeConfig: {
    search: { provider: "local" },
    nav: [
      { text: "Home", link: "/" },
      { text: "Get started", link: "/getting-started" },
      { text: "Web app", link: "/apps/web/setup/new-client" },
      { text: "Blog", link: "/modules/blog/" },
      { text: "Shared", link: "/shared/client-intake/1-seo-content" },
      { text: "Changelog", link: "/CHANGELOG" },
      {
        // Cross-pillar nav — LOCAL DEV URLs; swap for real domains on deploy.
        text: "Pillars",
        items: [
          { text: "Code (app · :3000)", link: "http://localhost:3000" },
          { text: "Docs (:3002)", link: "http://localhost:3002" },
          { text: "Method (:3003)", link: "http://localhost:3003" },
          { text: "Lab (:3004)", link: "http://localhost:3004" },
        ],
      },
    ],
    sidebar: [
      {
        text: "Getting started",
        collapsed: false,
        items: [
          { text: "Platform overview", link: "/getting-started" },
        ],
      },
      {
        text: "Web app · Setup & operations",
        collapsed: false,
        items: [
          { text: "Environment setup", link: "/apps/web/setup/environment" },
          { text: "New client", link: "/apps/web/setup/new-client" },
          { text: "Brand setup", link: "/apps/web/setup/brand-setup" },
          { text: "Launch checklist", link: "/apps/web/setup/launch-checklist" },
          { text: "Operations", link: "/apps/web/setup/operations" },
          { text: "Scripts", link: "/apps/web/setup/scripts" },
          { text: "Git worktrees", link: "/apps/web/setup/git-worktrees" },
          { text: "Maintenance mode", link: "/apps/web/setup/maintenance-mode" },
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
          { text: "Feature flags", link: "/apps/web/config/feature-flags" },
          { text: "Navigation", link: "/apps/web/config/navigation" },
          { text: "Legal pages", link: "/apps/web/config/legal-pages" },
          { text: "Cookie consent", link: "/apps/web/config/cookie-consent" },
          { text: "i18n & routing", link: "/apps/web/config/i18n-and-routing" },
          { text: "Theme modes", link: "/apps/web/config/theme-modes" },
          { text: "Images (Sanity CDN)", link: "/apps/web/config/images" },
          { text: "App changelog (code + design)", link: "/apps/web/changelog" },
        ],
      },
      {
        text: "Web app · Design & content",
        collapsed: true,
        items: [
          { text: "Design decisions (log)", link: "/apps/web/design/decisions" },
          { text: "Sections", link: "/apps/web/design/sections" },
          { text: "Typography & fonts", link: "/apps/web/design/typography" },
          { text: "Responsive design", link: "/apps/web/design/responsive-design" },
          { text: "Icons & favicons", link: "/apps/web/design/icons" },
          { text: "Featured articles", link: "/apps/web/design/featured-articles" },
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
        text: "Modules",
        collapsed: true,
        items: [
          { text: "Overview", link: "/modules/README" },
          { text: "Changelog", link: "/modules/changelog" },
          { text: "Blog · Overview", link: "/modules/blog/" },
          { text: "Blog · Sanity setup", link: "/modules/blog/sanity-setup" },
          { text: "Blog · Editor guide", link: "/modules/blog/editor-guide" },
          { text: "Blog · Body editor", link: "/modules/blog/body-editor" },
          { text: "Blog · Image gallery", link: "/modules/blog/gallery" },
          { text: "Blog · Architecture", link: "/modules/blog/blog-architecture" },
          { text: "Blog · Sanity tokens", link: "/modules/blog/sanity-tokens" },
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
        text: "Shared · Agent tooling",
        collapsed: true,
        items: [
          { text: "CodeGraph (agent index)", link: "/shared/tooling/codegraph" },
          { text: "Code intelligence (LSP)", link: "/shared/tooling/code-intelligence" },
          {
            text: "Headroom (context compression)",
            link: "/shared/tooling/headroom",
          },
          {
            text: "Behavior plugins (caveman/ponytail)",
            link: "/shared/tooling/behavior-plugins",
          },
        ],
      },
      {
        text: "Packages",
        collapsed: true,
        items: [
          { text: "Overview", link: "/packages/README" },
          { text: "Changelog", link: "/packages/changelog" },
          { text: "config", link: "/packages/config" },
          { text: "utils", link: "/packages/utils" },
          { text: "sanity", link: "/packages/sanity" },
          { text: "ui", link: "/packages/ui" },
          { text: "ui-components", link: "/packages/ui-components" },
          { text: "ui-tokens", link: "/packages/ui-tokens" },
          { text: "i18n", link: "/packages/i18n" },
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
