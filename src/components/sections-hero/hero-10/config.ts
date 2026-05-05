/**
 * Block key — kebab-case folder slug. Used to look up translations under
 * `blocks.<key>.*`.
 *
 * Hero composes a centered headline + body + AI prompt-input mock
 * (`ProductPrompt`) — minimal, no CTAs. All visible strings translate
 * via `./en.json`; the prompt mock content is decorative and lives
 * inside `ui-illustrations/product-prompt.tsx`.
 */
export const hero10Key = "hero-10" as const;
export const hero10Namespace = "blocks.hero-10" as const;
