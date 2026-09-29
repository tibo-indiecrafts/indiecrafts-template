/**
 * Resolve the URL the Capacitor shell loads.
 *
 * @see docs/reference/projects/mobile/main/src/server-url.md
 */

/**
 * The hosted `app` surface origin the shell loads, from `CAP_SERVER_URL`. Required —
 * the dev scripts set it (`http://localhost:3002`, via `adb reverse` on Android); a
 * release build sets the deployed app URL. Returns the origin (no trailing slash).
 */
export function resolveServerUrl(
  env: Record<string, string | undefined>,
): string {
  const raw = env.CAP_SERVER_URL?.trim();
  if (!raw)
    throw new Error("CAP_SERVER_URL is required (e.g. http://localhost:3002)");
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error(`CAP_SERVER_URL is not a valid URL: ${raw}`);
  }
  if (url.protocol !== "http:" && url.protocol !== "https:")
    throw new Error(`CAP_SERVER_URL must be http(s): ${raw}`);
  return url.origin;
}
