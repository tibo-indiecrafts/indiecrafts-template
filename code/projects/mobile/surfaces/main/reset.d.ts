// Loads `@total-typescript/ts-reset` — hardens the TS stdlib: `Response.json()`/`.text()` →
// `unknown` (aligns with the "no `as any`, prefer `unknown` + a guard" house rule) and
// `.filter(Boolean)` strips falsy from the element type. Ambient, no runtime import. One per
// project — packages/modules are type-checked through their consuming app, so each project's
// tsconfig loads the reset for the source it compiles.
import "@total-typescript/ts-reset";
