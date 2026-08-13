# code — engineering principles (all execution work)

Auto-loads for **everything under `code/**`** — apps · packages · modules · db · infra — layered
under the root `CLAUDE.md` and above each sub-project's own `CLAUDE.md`. Universal coding hygiene
for this repo; the app/package/module files add their domain specifics on top.

1. **Reuse before invent.** Do not create a new pattern when one already exists here — reuse the
   helper, util, type, or pattern that already lives in the codebase.
2. **Edit over create.** Prefer editing an existing file to creating a new one; fewest files.
3. **Boring, readable, production-safe.** The minimum code that solves the problem; boring over
   clever; nothing speculative.
4. **Explain the _why_ before a large change** — state the reasoning first, then generate.
