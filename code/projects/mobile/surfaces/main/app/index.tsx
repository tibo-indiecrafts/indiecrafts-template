import { Text, View } from "react-native";
import { defaultLocale } from "@/config";

// Home screen (expo-router). Build native screens here; reuse the tenant's data +
// logic via the React-FREE bricks (`@/config` → `@indiecrafts/config/mobile`,
// `format`, `utils`) — the web/DOM bricks (`ui`, `ui-components`) do NOT run on
// React Native.
export default function Index() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>indiecrafts — mobile scaffold ({defaultLocale})</Text>
    </View>
  );
}
