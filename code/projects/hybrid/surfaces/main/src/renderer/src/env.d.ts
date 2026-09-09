// The API the preload exposes on `window` via contextBridge (src/preload/index.ts) +
// the build-time `import.meta.env` vars. Keep this in sync with the preload + vite env.
/// <reference types="vite/client" />
export {};

declare global {
  interface ImportMetaEnv {
    /** The marketing-site origin the legal link-out + version poll target. */
    readonly VITE_WEBSITE_URL?: string;
    /** Canonical web account URL the "Manage account" link opens (default `${VITE_WEBSITE_URL}/account`). */
    readonly VITE_ACCOUNT_URL?: string;
    /** The shared api Worker origin — the announcements read target. */
    readonly VITE_API_URL?: string;
    /** The build id baked in at build time — the version-check compares against this. */
    readonly VITE_BUILD_ID?: string;
    /** Per-deployment namespace for browser-owned keys (consent / locale). */
    readonly VITE_SITE_PREFIX?: string;
    /** Clerk publishable key (PUBLIC). Set → sign-in is enabled in the renderer. */
    readonly VITE_CLERK_PUBLISHABLE_KEY?: string;
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  interface Window {
    desktop: {
      version: string;
      /** Run the shared AI agent (main-process fetch; token stays out of the renderer). */
      runAgent: (
        name: string,
        context: string,
        locale: string,
      ) => Promise<unknown>;
      /** Open a URL in the user's real browser (legal link-out). */
      openExternal: (url: string) => Promise<void>;
      /** Open the Clerk OAuth authorize URL in the OS browser (deep-link flow). */
      startOAuth: (url: string) => Promise<void>;
      /** Log a sign-in to the audit api (main-process fetch; token stays out of the DOM). */
      logSignIn: (userId: string, sessionId?: string) => Promise<void>;
      /** Subscribe to the validated OAuth callback; returns an unsubscribe. */
      onOAuthCallback: (
        handler: (data: { state: string; rotatingTokenNonce?: string }) => void,
      ) => () => void;
    };
  }
}
