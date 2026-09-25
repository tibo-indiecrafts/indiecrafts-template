#!/usr/bin/env node
// Guardrail: keep linting TYPE-INFO-FREE. A type-aware ESLint setup builds the full
// TypeScript type graph on EVERY lint run — the most memory-intensive part of linting —
// and type-aware rules don't port to Oxlint. Our lint is AST-only today; this fails CI if
// a config re-introduces the type graph, which is the ONLY way lint memory regresses.
//
// The type graph is enabled by exactly three switches (a type-aware rule can't even run
// without one of them), so those are the unambiguous things to catch:
//   · parserOptions.project        · parserOptions.projectService
//   · the *TypeChecked shared presets (recommended/strict/stylistic-type-checked)
//
//   node code/shared/scripts/checks/lint-no-types.mjs        # exit 1 on a violation
export function findTypeAware(rel, text) {
  const hits = [];
  if (/\bprojectService\b/.test(text))
    hits.push(`${rel}: sets \`projectService\` — builds the type graph.`);
  if (/parserOptions[\s\S]{0,300}?\bproject\s*:/.test(text))
    hits.push(
      `${rel}: sets \`parserOptions.project\` — builds the type graph.`,
    );
  const preset = text.match(
    /\b(recommended|strict|stylistic)-?[Tt]ype-?[Cc]hecked\b/,
  );
  if (preset)
    hits.push(
      `${rel}: extends the \`${preset[0]}\` preset — enables type-aware rules.`,
    );
  return hits;
}

// Only run the file scan as the CLI (keeps findTypeAware pure + unit-testable).
if (import.meta.url === `file://${process.argv[1]}`) {
  const { readFileSync, existsSync } = await import("node:fs");
  const { resolve, dirname } = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../../..");
  const CONFIGS = [
    "code/projects/web/surfaces/website/eslint.config.mjs",
    ".oxlintrc.json",
  ];
  const findings = [];
  for (const rel of CONFIGS) {
    const p = resolve(ROOT, rel);
    if (existsSync(p))
      findings.push(...findTypeAware(rel, readFileSync(p, "utf8")));
  }
  if (findings.length) {
    console.error(
      "✗ Linting must stay type-info-free (memory + Oxlint portability):",
    );
    for (const f of findings) console.error(`  · ${f}`);
    process.exit(1);
  }
  console.log(
    "✓ lint config is type-info-free (no TS type graph built during lint).",
  );
}
