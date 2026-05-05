import type { MessageKey } from "@/types/messages";

/**
 * Tailark Pro `features-5` — single hero card: a max-w-xl heading +
 * two-tone body paragraph (the trailing sentence rendered muted) sits
 * above an app-shell layout illustration with a customer-table mock
 * floated in front of it. Converted to the template pattern: props-
 * driven copy, MessageKey-typed strings, theme tokens.
 *
 * The body is split into two keys so the muted trailing sentence is
 * translatable independently from the lead sentence.
 */
export type FeaturesBlock = {
  type: "features-17";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  bodyMutedKey?: MessageKey;
};
