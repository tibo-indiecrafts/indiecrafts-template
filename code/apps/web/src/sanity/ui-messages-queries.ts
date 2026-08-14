import { defineQuery } from "next-sanity";

/**
 * The whole per-locale UI-dictionary document (`uiMessages.en` / `.fr`). No
 * projection — every field is a chrome string (or a nested group of them). Read
 * by `getUiMessages` (`src/lib/ui-messages.ts`), which strips the system fields
 * and overlays the result on the bundled `messages/<locale>.json` fallback.
 */
export const uiMessagesQuery = defineQuery(`*[_id == $id][0]`);
