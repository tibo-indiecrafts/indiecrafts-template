// Storybook stand-in for `expo-secure-store` (OS Keychain/Keystore) — an in-memory
// Map so `@/lib/secure-storage` resolves without a native module in the browser.
const store = new Map<string, string>();

export async function getItemAsync(key: string): Promise<string | null> {
  return store.get(key) ?? null;
}

export async function setItemAsync(key: string, value: string): Promise<void> {
  store.set(key, value);
}

export async function deleteItemAsync(key: string): Promise<void> {
  store.delete(key);
}

export default { getItemAsync, setItemAsync, deleteItemAsync };
