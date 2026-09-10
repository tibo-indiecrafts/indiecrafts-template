import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

/**
 * `true` while the device has a usable network connection, tracked via NetInfo.
 * RN has no SSR/hydration, so the idiomatic `useState` + `useEffect` subscription is
 * correct here (the web's `useOnlineStatus` uses `useSyncExternalStore` only because it
 * hydrates). Starts `true` (assume online until NetInfo reports otherwise — no false
 * offline flash at launch); `isInternetReachable === null` (unknown) also reads online,
 * so only an explicit `false` marks offline.
 */
export function useNetworkStatus(): boolean {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setOnline(
        state.isConnected !== false && state.isInternetReachable !== false,
      );
    });
    return unsubscribe;
  }, []);
  return online;
}
