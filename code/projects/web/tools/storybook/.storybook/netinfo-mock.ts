// Storybook stand-in for `@react-native-community/netinfo` — `useNetworkStatus`
// subscribes once and never expects an update in a story, so a static "online"
// listener that never fires (and unsubscribes cleanly) is enough.
type Listener = (state: { isConnected: boolean; isInternetReachable: boolean | null }) => void;

const NetInfo = {
  addEventListener(_listener: Listener): () => void {
    return () => {};
  },
};

export default NetInfo;
