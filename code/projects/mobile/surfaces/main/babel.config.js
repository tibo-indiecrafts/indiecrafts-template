// Required by every Expo app: `babel-preset-expo` runs the React Native / TypeScript
// transforms AND (SDK 50+) the expo-router integration that injects
// `EXPO_ROUTER_APP_ROOT` — the route-context root `expo-router/_ctx` scans for the
// `app/` routes. Without this file Metro falls back to a barebones transform: the
// bundle still compiles, but the router mounts an empty route tree and the app renders
// a blank screen with no error.
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
  };
};
