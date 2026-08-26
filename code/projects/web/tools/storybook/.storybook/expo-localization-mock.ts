// Storybook stand-in for `expo-localization` — a fixed "en" device locale so
// `ShellOverlays`' locale-suggest and `@/lib/i18n`'s detect step resolve in the browser.
export function getLocales() {
  return [
    {
      languageCode: "en",
      languageTag: "en-US",
      regionCode: "US",
      currencyCode: "USD",
      isRTL: false,
    },
  ];
}

export default { getLocales };
