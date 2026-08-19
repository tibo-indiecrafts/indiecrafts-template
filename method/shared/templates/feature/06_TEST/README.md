# 06 · TEST

**gstack:** `/qa` (diff-aware browser QA + auto regression tests) · `/qa-only`
(report only) · `/benchmark` (Core Web Vitals)
**Your skills:** `accessibility-pass`, `webapp-testing`, `react-doctor`
**gstack writes:** QA reports + screenshots → `<repo>/.gstack/qa-reports/`
**Check against:** `method/shared/engineering/engineering-standards.md` (testing + DoD).

**Verify in the browser (don't skip):** `/run` the app → **connect the dev tab** (`/connect-chrome`,
not a blank one) → screenshot **375 / 768 / 1280** → review the images. Green tests ≠ looked-at — a
screen you have not seen is not done. Full checklist → the app's `visual-verification` rule
(`code/projects/web/surfaces/website/.claude/rules/visual-verification.md`); prerequisites → the app's
`setup/environment.md` **Browser verification** section.

Save here: QA report copy, bug list, regression tests added, perf baseline.
