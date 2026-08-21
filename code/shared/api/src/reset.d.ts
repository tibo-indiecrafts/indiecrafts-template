// Loads `@total-typescript/ts-reset` — hardens the TS stdlib: `Request.json()`/`Response.json()`
// → `unknown` (aligns with the "no `as any`, prefer `unknown` + a guard" house rule; forces
// validating a Worker request body) and `.filter(Boolean)` strips falsy. Ambient, no runtime
// import.
import "@total-typescript/ts-reset";
