# LocaleSuggest

"This site is available in {your language}" strip. Non-intrusive — a top strip that
keeps the visitor on the page and **never auto-redirects** (the best-practice
pattern). Switch or dismiss both remember the choice in a cookie, so it stops
suggesting.

next-intl already redirects a _first_ visit to `/` to the browser language, so this
targets the residual mismatch: a returning visitor or a shared `/fr/…` link whose
active locale differs from the browser preference. The app layout reads
`Accept-Language` server-side (`detectPreferredLocale`) + the dismiss cookie and
renders this only when they disagree. Copy is the `localeSuggest` Sanity singleton
(`getLocaleSuggest`); `{language}` is filled with the target language's native name
(`localeMap[code].label`) — never a flag. Switch reuses `useLocaleSwitch`
(`@indiecrafts/packages-web-i18n`).
