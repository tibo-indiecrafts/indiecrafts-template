# 0 · Intake — Trello card → sprint brief

The front door of the sprint. It turns a picked-up work item (a Trello card, a
`work/backlog.md` line, an idea) into the `00_BRIEF` that seeds a sprint. Everything after
the brief — `02_THINK … 08_REFLECT`, `09_OUTPUTS`, `DELIVERABLES.md` — already runs from here.

## The one command

```bash
node method/scripts/new-sprint.mjs "<name>" --title "<card title>" --desc "<card body>"
```

It stamps the `feature` template into `work/apps/<app>/features/<YYYY-MM-DD>_<slug>/`, fills the
brief's date, name, and branch (`feat/<slug>`), drops the card's title into **Goal** and body
into **Why**, and makes every unfilled placeholder build-safe. Alias: `npm --prefix method run
sprint:new -- "<name>" …`.

| Flag      | Default   | Effect                                                                                        |
| --------- | --------- | --------------------------------------------------------------------------------------------- |
| `<name>`  | —         | Required. The human feature name; also the folder slug + `feat/<slug>` branch.                |
| `--title` | —         | Trello card title → the brief's **Goal**.                                                     |
| `--desc`  | —         | Trello card body → the brief's **Why**.                                                       |
| `--app`   | `web`     | Which app the sprint belongs to (`work/apps/<app>/`).                                         |
| `--kind`  | `feature` | `feature` → dated feature folder; `app` → stamp an app-altitude sprint at `work/apps/<app>/`. |

## Steps

1. **Pick the card.** From your Trello board or `work/backlog.md` (Now → Next).
2. **Stamp it.** Run the command above, pasting the card's title + body into `--title` / `--desc`.
3. **Finish the brief.** Open the printed `00_BRIEF/BRIEF.md` and replace the `TODO —` lines
   (scope, done-when). The brief must be complete before `pnpm work:build` — leftover `TODO`
   text is fine, bare `<…>` is not.
4. **Run the sprint.** `/office-hours` starts `02_THINK`. Follow each stage's README.

## Notes

- **Private tooling.** The script lives in `method/` and writes into the delivery-excluded `work/`
  (tracked, `export-ignore`d — kept out of `git archive`, so it never ships in a clean hand-off), and
  there is no root `package.json` alias for the same reason.
- **No Trello API.** You paste the card's fields; the script does not call Trello. Wire an API
  pull later if the manual paste becomes a chore.
- **Backlog is the queue.** Promote a `work/backlog.md` item by running this command when you
  pick it up (see [`workflow.md`](./workflow.md) § New work).
