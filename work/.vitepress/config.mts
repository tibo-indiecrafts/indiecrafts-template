import { defineConfig } from "vitepress";

// The lab (work/) rendered like the docs + method sites.
//   npm install   (from work/, once)   → or: pnpm work:install
//   npm run dev   → http://localhost:3004 → or: pnpm work
//   npm run build → .vitepress/dist       → or: pnpm work:build
//
// work/ is the lab: per-sprint folders (00_BRIEF…09_OUTPUTS) + MEMORY/backlog.
// This site surfaces the LAB GUIDE + the DELIVERABLES index (links to each sprint's
// 09_OUTPUTS/). Excluded: scratch/ (gitignored raw thinking), CLAUDE.md (agent memory),
// _gstack (per-sprint gstack symlink), archive/.
// Caveat: an UNFILLED stamped brief has bare <placeholders> that break the Vue build —
// fill the brief before it renders (or it stays filesystem-only).
//
// The nav's Code/Docs/Method/Lab links are LOCAL DEV URLs (:3000/:3002/:3003/:3004);
// swap for real domains on deploy.
export default defineConfig({
  title: "work",
  description: "The lab — sprint deliverables and how to run a sprint.",
  ignoreDeadLinks: true,
  cleanUrls: true,
  lastUpdated: true,
  srcExclude: ["scratch/**", "**/CLAUDE.md", "**/.claude/**", "**/_gstack/**", "archive/**"],
  themeConfig: {
    search: { provider: "local" },
    nav: [
      { text: "Overview", link: "/" },
      { text: "Deliverables", link: "/DELIVERABLES" },
      { text: "MEMORY", link: "/MEMORY" },
      { text: "Changelog", link: "/CHANGELOG" },
      {
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
        text: "The lab",
        collapsed: false,
        items: [
          { text: "Overview", link: "/" },
          { text: "Lab guide", link: "/README" },
          { text: "Deliverables index", link: "/DELIVERABLES" },
        ],
      },
      {
        text: "Working memory",
        collapsed: false,
        items: [
          { text: "MEMORY", link: "/MEMORY" },
          { text: "Backlog", link: "/backlog" },
          { text: "Changelog", link: "/CHANGELOG" },
        ],
      },
    ],
  },
});
