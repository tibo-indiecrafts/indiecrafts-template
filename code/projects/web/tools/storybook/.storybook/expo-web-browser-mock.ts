// Storybook stand-in for `expo-web-browser` — `sign-in.tsx` calls
// `maybeCompleteAuthSession()` at module scope; the real module reaches for a native
// module that doesn't exist in the browser, so this is a harmless no-op result.
export function maybeCompleteAuthSession() {
  return { type: "success" } as const;
}

export default { maybeCompleteAuthSession };
