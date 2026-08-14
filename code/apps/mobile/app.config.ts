import type { ExpoConfig } from "expo/config";

// Expo app config. `name`/`slug`/`scheme`/bundle ids are per client — run
// `pnpm project:rename <slug>` (extend it to rewrite these) or set them by hand.
const config: ExpoConfig = {
  name: "indiecrafts",
  slug: "indiecrafts",
  scheme: "indiecrafts",
  version: "0.1.0",
  orientation: "portrait",
  ios: { bundleIdentifier: "dev.indiecrafts.app", supportsTablet: true },
  android: { package: "dev.indiecrafts.app" },
  plugins: ["expo-router"],
  experiments: { typedRoutes: true },
};

export default config;
