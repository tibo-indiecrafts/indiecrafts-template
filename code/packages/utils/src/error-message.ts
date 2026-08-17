/**
 * Extract a human-readable message from an unknown thrown value.
 *
 * Handles a Zod-style error (an object with an `issues[]` array of `{ message }`)
 * without importing `zod` — so `utils` stays dependency-free — then a plain
 * `Error`, then anything else via `String()`.
 */
export function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "issues" in error) {
    const { issues } = error as { issues?: unknown };
    if (Array.isArray(issues)) {
      const messages = issues
        .map((issue) =>
          issue && typeof issue === "object" && "message" in issue
            ? String((issue as { message: unknown }).message)
            : "",
        )
        .filter(Boolean);
      if (messages.length > 0) return messages.join(". ");
    }
  }
  if (error instanceof Error) return error.message;
  return String(error);
}
