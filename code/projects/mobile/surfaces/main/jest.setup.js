// The native AsyncStorage module has no JS implementation off-device — use the
// package's own in-memory Jest mock so `lib/storage` can be exercised in Node.
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);
