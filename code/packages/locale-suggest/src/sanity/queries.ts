import { defineQuery } from "next-sanity";

/**
 * Language-suggestion GROQ — the `localeSuggest` singleton. `localeString`s are
 * resolved per-request in `getLocaleSuggest` (`./reader`).
 */
export const localeSuggestQuery = defineQuery(`
  *[_id == "localeSuggest"][0]{ message, switchLabel, dismissLabel }
`);
