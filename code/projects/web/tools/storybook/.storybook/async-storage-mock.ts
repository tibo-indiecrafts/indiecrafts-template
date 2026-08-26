// Storybook stand-in for `@react-native-async-storage/async-storage` — an in-memory
// Map so `@/lib/storage` and the compliance brick's `createNativeStore` resolve
// without a native module in the browser.
const store = new Map<string, string>();

const AsyncStorage = {
  async getItem(key: string): Promise<string | null> {
    return store.get(key) ?? null;
  },
  async setItem(key: string, value: string): Promise<void> {
    store.set(key, value);
  },
  async removeItem(key: string): Promise<void> {
    store.delete(key);
  },
};

export default AsyncStorage;
