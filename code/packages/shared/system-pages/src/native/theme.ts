import { useColorScheme } from "react-native";
import { tokens } from "@indiecrafts/packages-shared-ui-tokens/native";

/**
 * The active theme's colours (hex) for the native status pages. Follows the OS
 * light/dark. These pages are shared (`shared/` scope) so they can't depend on the
 * mobile `ui-native` brick — they read the token values directly, the one home for
 * colours. Without this the RN `<Text>` defaults to black and vanishes on the dark
 * background (`#0a0a0a`).
 */
export function useColors() {
  return tokens[useColorScheme() === "dark" ? "dark" : "light"].color;
}
