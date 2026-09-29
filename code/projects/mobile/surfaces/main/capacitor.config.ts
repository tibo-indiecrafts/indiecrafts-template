/**
 * Configure the Capacitor shell around the hosted app surface.
 *
 * @see docs/reference/projects/mobile/main/capacitor.config.md
 */
import type { CapacitorConfig } from "@capacitor/cli";
import shell from "./shell.json";
import { resolveServerUrl } from "./src/server-url";

const url = resolveServerUrl(process.env);

const config: CapacitorConfig = {
  appId: shell.appId,
  appName: shell.appName,
  webDir: "www",
  server: {
    url,
    // Plain HTTP only for local dev (localhost via adb reverse).
    cleartext: url.startsWith("http://"),
    errorPath: "offline.html",
  },
  plugins: {
    // NativeBridge (or the offline page) hides it as soon as a page is up; the auto-hide
    // is the fail-safe when neither runs (a server error page, a crash before hydration).
    SplashScreen: { launchAutoHide: true, launchShowDuration: 4000 },
  },
};

export default config;
