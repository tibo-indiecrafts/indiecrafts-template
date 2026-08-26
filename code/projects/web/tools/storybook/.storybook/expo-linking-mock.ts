// Storybook stand-in for `expo-linking` — `sign-in.tsx` uses `createURL` to build the
// OAuth redirect URL; a fixed string is enough since no story actually starts an SSO flow.
export function createURL(path: string): string {
  return `https://storybook.local${path}`;
}

export default { createURL };
