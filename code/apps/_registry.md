# apps — deployable surfaces (islands)

- **web/** ● the Next.js app (live) — today it is also the **hub Studio** (edits all content).
- marketing/ admin/ mobile/ api/ workers/ ○ add when a surface exists
- docs/ → kept at repo root (npm-isolated VitePress)

**Model:** an app is a **read-lens** over one tenant's shared Sanity dataset; one **hub Studio** edits
everything (desk grouped per app); islands (modules) compose into apps. Full architecture →
[`docs/shared/architecture/multi-app.md`](../../docs/shared/architecture/multi-app.md).
