# Project brief — <project>

One brief per project (= one gstack `<slug>` = usually one repo/startup).

- **Slug:** <slug> (must match the gstack project slug)
- **Repo:** <path or URL>
- **What it is:** <one line>
- **North star:** <the outcome>
- **Design system:** `DESIGN.md` in the repo
- **Deploy:** `/setup-deploy` done? platform: <…>
- **Reference:** app-wide inputs (screens, competitors, moodboards, flows, research) → `01_REFERENCE/` (per-feature refs live in each `features/YYYY-MM-DD_<name>/01_REFERENCE/`)

## Features

Each feature = a folder under `features/` (copy `method/shared/templates/feature/`).
gstack state for this project lives in `~/.gstack/projects/<slug>/` — symlink it
here as `_gstack/` for one-glance tracking:

```bash
ln -s ~/.gstack/projects/<slug> "_gstack"
```
