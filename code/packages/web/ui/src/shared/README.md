# `shared/` — platform-agnostic primitive contracts

For code that both `../web/` and `../native/` primitives reuse with **no** platform runtime: variant
definitions (`cva` maps), prop/type contracts, size scales. Exported as `@indiecrafts/packages-web-ui/shared/<name>`
(`./shared/*` → `src/shared/*.ts`).

Empty today — the shadcn primitives carry their own `cva` inline. Extract here only when a second
platform (or a real second consumer) needs the same contract; until then, YAGNI.
