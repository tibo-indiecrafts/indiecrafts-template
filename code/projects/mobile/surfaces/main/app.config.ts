/**
 * Define the Expo app config for the mobile surface.
 *
 * @see docs/reference/projects/mobile/main/app.config.md
 */
import type { ExpoConfig } from "expo/config";

// Expo app config. `name`/`slug`/`scheme`/bundle ids are per client — `pnpm
// project:rename <slug>` rewrites them (and eas.json's api-URL prefix) automatically.
// `owner`, `extra.eas.projectId`, and the `updates.url` are written by `eas init`
// (they tie the app to your Expo account + EAS Update feed). The placeholders below
// keep the config typed until you run it; a `deploy:mobile:main:<env>` build resolves
// the env's api origin from eas.json's `EXPO_PUBLIC_API_URL`.
const EAS_PROJECT_ID = "EAS_PROJECT_ID"; // ← `eas init` fills this (a uuid)
const config: ExpoConfig = {
  name: "indiecrafts",
  slug: "indiecrafts",
  scheme: "indiecrafts",
  version: "0.1.0",
  orientation: "portrait",
  owner: "EXPO_ACCOUNT", // ← your Expo account/organization username
  ios: { bundleIdentifier: "dev.indiecrafts.app", supportsTablet: true },
  android: { package: "dev.indiecrafts.app" },
  plugins: ["expo-router"],
  experiments: { typedRoutes: true },
  // EAS Update (OTA): runtimeVersion pins which native binary an update targets;
  // the feed is keyed by the eas.json `channel` (development/preview/production).
  runtimeVersion: { policy: "appVersion" },
  updates: { url: `https://u.expo.dev/${EAS_PROJECT_ID}` },
  extra: { eas: { projectId: EAS_PROJECT_ID } },
};

export default config;
