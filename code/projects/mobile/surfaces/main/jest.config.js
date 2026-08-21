// Expo's Jest preset — transforms RN/Expo modules (Metro-style) so colocated
// `*.test.ts(x)` run in the RN environment. `transformIgnorePatterns` keeps the RN
// module graph transpiled (they ship untranspiled ESM/Flow). Setup mocks the native
// AsyncStorage module. See code/docs/apps/web/setup/testing.md (native section).
module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  // pnpm nests deps under `node_modules/.pnpm/<pkg>@<ver>/node_modules/<pkg>` (not
  // flat), so the default jest-expo pattern (which expects the RN name right after
  // `node_modules/`) leaves RN/Expo untranspiled — their Flow/ESM then fails to parse.
  // This transpiles any `.pnpm` package whose path names react-native/expo/etc. The
  // workspace bricks resolve to their real TS source (outside node_modules) → always transpiled.
  transformIgnorePatterns: [
    "node_modules/.pnpm/(?!.*(react-native|@react-native|expo|@expo|@expo-google-fonts|react-navigation|@react-navigation|@react-native-async-storage))",
  ],
};
