import { defineConfig } from "vitepress";

// Dev-framework docs (the claude-tasks method), rendered like docs.
//   npm install   (from method/, once)   → or: pnpm method:install
//   npm run dev   → http://localhost:3003 → or: pnpm method
//   npm run build → .vitepress/dist       → or: pnpm method:build
//
// method mirrors the code: shared (cross-cutting) + per-concern folders
// (apps/web · modules · packages · infra). Sprint templates are scaffolds,
// not pages — excluded. The lab (work/) is a top-level sibling, not part of method.
export default defineConfig({
  title: "method",
  description:
    "The dev framework — how we work (claude-tasks). Mirrors the code.",
  ignoreDeadLinks: true,
  cleanUrls: true,
  lastUpdated: true,
  srcExclude: ["shared/templates/**", "**/CLAUDE.md", "**/.claude/**"],
  themeConfig: {
    search: { provider: "local" },
    nav: [
      { text: "Overview", link: "/" },
      { text: "Shared", link: "/shared/process/workflow" },
      { text: "Web app", link: "/apps/web/README" },
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
      { text: "Overview", items: [{ text: "The framework", link: "/" }] },
      {
        text: "Shared — process (the sprint)",
        collapsed: false,
        items: [
          { text: "1 · Machine setup", link: "/shared/process/setup" },
          {
            text: "2 · Project bootstrap",
            link: "/shared/process/project-bootstrap",
          },
          {
            text: "3 · Intake — Trello → brief",
            link: "/shared/process/intake",
          },
          { text: "4 · Workflow — 7 phases", link: "/shared/process/workflow" },
          { text: "System rules", link: "/shared/process/system-rules" },
          { text: "Decision matrix", link: "/shared/process/decision-matrix" },
          {
            text: "Skills & agents registry",
            link: "/shared/process/my-skills-and-agents",
          },
          {
            text: "Bench map (agents × phases)",
            link: "/shared/process/bench-map",
          },
          {
            text: "Adding a skill or agent",
            link: "/shared/process/adding-skills",
          },
          { text: "End to end", link: "/shared/process/end-to-end" },
          {
            text: "Launch playbook — project lane",
            link: "/shared/process/launch-playbook",
          },
          { text: "Commands", link: "/shared/process/command" },
          {
            text: "Client handoff (yours vs client's)",
            link: "/shared/process/client-handoff",
          },
        ],
      },
      {
        text: "Shared — engineering (the brain)",
        collapsed: false,
        items: [
          { text: "Index", link: "/shared/engineering/README" },
          { text: "Principles", link: "/shared/engineering/principles" },
          { text: "Testing", link: "/shared/engineering/testing" },
          { text: "Git & PR", link: "/shared/engineering/git-and-pr" },
          {
            text: "Tech debt (the gate)",
            link: "/shared/engineering/tech-debt",
          },
          { text: "Issue tags", link: "/shared/engineering/issue-tags" },
          {
            text: "Standards & DoD",
            link: "/shared/engineering/engineering-standards",
          },
          { text: "Writing style", link: "/shared/writing-style" },
        ],
      },
      {
        text: "Web app (code/projects/web/surfaces/website)",
        collapsed: false,
        items: [
          { text: "Index", link: "/apps/web/README" },
          { text: "Rules · naming", link: "/apps/web/rules/naming" },
          {
            text: "Rules · accessibility",
            link: "/apps/web/rules/accessibility",
          },
          {
            text: "Rules · component architecture",
            link: "/apps/web/rules/component-architecture",
          },
          {
            text: "Rules · design-token usage",
            link: "/apps/web/rules/design-token-usage",
          },
          {
            text: "Rules · figma handoff",
            link: "/apps/web/rules/figma-handoff",
          },
          {
            text: "Rules · sanity images",
            link: "/apps/web/rules/sanity-images",
          },
          {
            text: "Rules · sanity legends",
            link: "/apps/web/rules/sanity-legends",
          },
          {
            text: "Workflow · add a page",
            link: "/apps/web/workflows/add-page",
          },
          {
            text: "Workflow · adapt a library section",
            link: "/apps/web/workflows/adapt-library-section",
          },
          {
            text: "Workflow · add a page-builder block",
            link: "/apps/web/workflows/add-page-builder-block",
          },
          {
            text: "Workflow · remove a page-builder block",
            link: "/apps/web/workflows/remove-page-builder-block",
          },
          {
            text: "Workflow · design critique",
            link: "/apps/web/workflows/design-critique",
          },
        ],
      },
      {
        text: "Modules (code/modules)",
        collapsed: true,
        items: [
          { text: "Index", link: "/modules/README" },
          { text: "Feature architecture", link: "/modules/architecture" },
        ],
      },
      {
        text: "Packages (code/packages)",
        collapsed: true,
        items: [
          { text: "Index", link: "/packages/README" },
          { text: "API & data", link: "/packages/api-and-data" },
        ],
      },
      {
        text: "Db (code/shared/db)",
        collapsed: true,
        items: [
          { text: "Index", link: "/db/README" },
          { text: "Database", link: "/db/database" },
        ],
      },
      {
        text: "Infra (code/infra)",
        collapsed: true,
        items: [
          { text: "Index", link: "/infra/README" },
          {
            text: "Infrastructure & ops",
            link: "/infra/infrastructure-and-ops",
          },
          { text: "Observability", link: "/infra/observability" },
        ],
      },
      {
        text: "Shared — context",
        collapsed: true,
        items: [
          { text: "How I work", link: "/shared/context/HOW-I-WORK" },
          { text: "Voice guide", link: "/shared/context/voice-guide" },
          { text: "Audience", link: "/shared/context/audience" },
        ],
      },
      {
        text: "Shared — tooling",
        collapsed: true,
        items: [
          { text: "Overview — the whole toolchain", link: "/shared/tooling/" },
          {
            text: "Behavior plugins",
            link: "/shared/tooling/behavior-plugins",
          },
          {
            text: "CLAUDE.md system",
            link: "/shared/tooling/claude-md-system",
          },
          {
            text: "Code intelligence (LSP)",
            link: "/shared/tooling/code-intelligence",
          },
          { text: "CodeGraph", link: "/shared/tooling/codegraph" },
          { text: "Headroom", link: "/shared/tooling/headroom" },
          { text: "MCP servers", link: "/shared/tooling/mcp-servers" },
        ],
      },
      {
        text: "Reference",
        collapsed: true,
        items: [
          { text: "Overview (README)", link: "/README" },
          { text: "Product brief", link: "/apps/web/PRODUCT" },
          {
            text: "Page-builder roadmap",
            link: "/apps/web/page-builder-roadmap",
          },
        ],
      },
    ],
  },
});
