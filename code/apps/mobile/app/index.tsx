import { Text, View } from "react-native";

// Home screen (expo-router). Build native screens here; reuse the tenant's data +
// logic via the React-FREE bricks (`@indiecrafts/config`/`format`/`utils`) — the
// web/DOM bricks (`ui`, `ui-components`) do NOT run on React Native.
export default function Index() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>indiecrafts — mobile scaffold</Text>
    </View>
  );
}
