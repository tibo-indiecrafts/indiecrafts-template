import { defineConfig } from "vitepress";

// Documentation site for the indiecrafts.dev template.
//   npm install          (from docs/, once)
//   npm run docs:dev     → http://localhost:3002
//   npm run docs:build   → static output in .vitepress/dist (deploy to Vercel)
//
// Every .md file under docs/ is a page. The sidebar mirrors the folders:
// cross-cutting topics (setup / config / design / seo / client-intake) plus
// per-feature docs under features/<name>/ (e.g. features/blog/). Add a new
// doc = drop the .md in the right folder + add one sidebar line here.
export default defineConfig({
  title: "indiecrafts.dev",
  description: "Documentation for the config-first Next.js template.",
  ignoreDeadLinks: true,
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    search: { provider: "local" },
    nav: [
      { text: "Home", link: "/" },
      { text: "Setup", link: "/setup/new-client" },
      { text: "Config", link: "/config/project-organization" },
      { text: "SEO", link: "/seo/seo-metadata" },
      { text: "Blog", link: "/features/blog/sanity-setup" },
      { text: "Client intake", link: "/client-intake/1-seo-content" },
    ],
    sidebar: [
      {
        text: "Setup & operations",
        collapsed: false,
        items: [
          { text: "New client", link: "/setup/new-client" },
          { text: "Brand setup", link: "/setup/brand-setup" },
          { text: "Launch checklist", link: "/setup/launch-checklist" },
          { text: "Operations", link: "/setup/operations" },
          { text: "Scripts", link: "/setup/scripts" },
          { text: "Maintenance mode", link: "/setup/maintenance-mode" },
        ],
      },
      {
        text: "Configuration & architecture",
        collapsed: false,
        items: [
          { text: "Project organization", link: "/config/project-organization" },
          { text: "Feature flags", link: "/config/feature-flags" },
          { text: "i18n & routing", link: "/config/i18n-and-routing" },
          { text: "Theme modes", link: "/config/theme-modes" },
          { text: "Migration (feature-based)", link: "/config/migration-feature-based" },
        ],
      },
      {
        text: "Design & content",
        collapsed: true,
        items: [
          { text: "Sections", link: "/design/sections" },
          { text: "Typography & fonts", link: "/design/typography" },
          { text: "Responsive design", link: "/design/responsive-design" },
          { text: "Icons & favicons", link: "/design/icons" },
          { text: "Featured articles", link: "/design/featured-articles" },
          { text: "Video embeds", link: "/design/video-embeds" },
          { text: "Error pages", link: "/design/error-pages" },
        ],
      },
      {
        text: "SEO & discovery",
        collapsed: false,
        items: [
          { text: "SEO metadata", link: "/seo/seo-metadata" },
          { text: "Structured data", link: "/seo/structured-data-cookbook" },
          { text: "FAQ", link: "/seo/faq" },
          { text: "LLM endpoints", link: "/seo/llms-endpoints" },
          { text: "robots & environments", link: "/seo/robots-and-environments" },
          { text: "Analytics", link: "/seo/analytics" },
          { text: "Security headers", link: "/seo/security-headers" },
        ],
      },
      {
        text: "Features · Blog (Sanity)",
        collapsed: true,
        items: [
          { text: "Sanity setup", link: "/features/blog/sanity-setup" },
          { text: "Editor guide", link: "/features/blog/editor-guide" },
          { text: "Body editor", link: "/features/blog/body-editor" },
          { text: "Blog architecture", link: "/features/blog/blog-architecture" },
          { text: "Sanity tokens", link: "/features/blog/sanity-tokens" },
        ],
      },
      {
        text: "Client intake forms",
        collapsed: true,
        items: [
          { text: "1 · SEO content", link: "/client-intake/1-seo-content" },
          { text: "2 · Business details", link: "/client-intake/2-business-details" },
          { text: "3 · AI index (llms)", link: "/client-intake/3-ai-index-llms" },
          { text: "4 · Content & FAQ", link: "/client-intake/4-content-and-faq" },
        ],
      },
    ],
  },
});
