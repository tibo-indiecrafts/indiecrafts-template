/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const tweetNotFoundKey = "tweet-not-found" as const;

/**
 * Translation namespace — `useTranslations(tweetNotFoundNamespace)` resolves keys from `en.json`.
 */
export const tweetNotFoundNamespace = "blocks.tweet-not-found" as const;
