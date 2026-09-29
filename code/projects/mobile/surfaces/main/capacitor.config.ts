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
    // The app's NativeBridge hides it once the page is up.
    SplashScreen: { launchAutoHide: false },
  },
};

export default config;
