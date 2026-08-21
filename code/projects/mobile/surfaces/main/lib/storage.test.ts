import AsyncStorage from "@react-native-async-storage/async-storage";
import { storage } from "./storage";

const getItem = AsyncStorage.getItem as jest.Mock;
const setItem = AsyncStorage.setItem as jest.Mock;

describe("storage — never-throw AsyncStorage wrapper", () => {
  afterEach(() => jest.clearAllMocks());

  it("returns the stored value on a successful read", async () => {
    getItem.mockResolvedValueOnce("fr");
    await expect(storage.get("k")).resolves.toBe("fr");
  });

  it("returns null when the store is unavailable (read rejects)", async () => {
    getItem.mockRejectedValueOnce(new Error("store disabled"));
    await expect(storage.get("k")).resolves.toBeNull();
  });

  it("swallows a write failure — the value just does not persist", async () => {
    setItem.mockRejectedValueOnce(new Error("store full"));
    await expect(storage.set("k", "v")).resolves.toBeUndefined();
  });

  it("passes the key + value through to AsyncStorage on write", async () => {
    await storage.set("k", "v");
    expect(setItem).toHaveBeenCalledWith("k", "v");
  });
});
