// Metro config for this Expo app inside the pnpm monorepo.
//
//   1. watchFolders = [monorepoRoot] — the workspace bricks' real source lives under
//      code/packages/**, outside the app folder Metro watches by default.
//   2. unstable_enablePackageExports — the bricks expose subpath exports (e.g.
//      @indiecrafts/packages-shared-system-pages/native → ./src/native/index.ts).
//
// The babel transform injects `require("@babel/runtime/helpers/…")`; pnpm otherwise
// only nests @babel/runtime under a transitive package, out of Metro's reach — so it is
// declared as a direct dependency of this app (see package.json) to sit at
// node_modules/@babel/runtime where Metro's default resolution finds it.
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
// code/projects/mobile/surfaces/main → repo root is five levels up.
const monorepoRoot = path.resolve(projectRoot, "../../../../..");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [monorepoRoot];
config.resolver.unstable_enablePackageExports = true;
// With package exports on, Metro can mis-resolve bare `react` to the sibling
// `@types/react` package (types-only: empty `main`, only `"types"` export conditions)
// and then fail on its unresolvable `main`. `@types/*` packages are compile-time only
// and never belong in a runtime bundle, so block them from module resolution outright.
config.resolver.blockList = [/[/\\]node_modules[/\\]@types[/\\].*/];

// Single React copy. The repo holds two Reacts — the web surfaces use React 19, this app
// (like all of Expo SDK 52) uses React 18.3.1. pnpm hoists the web's React 19 to where
// `expo-router` resolves it, so without this the bundle ends up with expo-router on React
// 19 while react-dom / react-native-web reconcile with React 18.3.1. Two Reacts → the
// React-18 renderer receives React-19 elements and silently commits an empty tree (blank
// screen, no error). Pin every `react` / `react-dom` request to the app's single copy.
const reactRoot = path.dirname(
  require.resolve("react/package.json", { paths: [projectRoot] }),
);
const reactDomRoot = path.dirname(
  require.resolve("react-dom/package.json", { paths: [projectRoot] }),
);
const reactAliases = { react: reactRoot, "react-dom": reactDomRoot };
const upstreamResolve = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  for (const [name, dir] of Object.entries(reactAliases)) {
    if (moduleName === name || moduleName.startsWith(name + "/")) {
      // Redirect the bare package and its subpaths (react/jsx-runtime, …) to the one copy.
      const target = dir + moduleName.slice(name.length);
      return context.resolveRequest(context, target, platform);
    }
  }
  return upstreamResolve
    ? upstreamResolve(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
