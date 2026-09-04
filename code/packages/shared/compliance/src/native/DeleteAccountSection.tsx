import { useState } from "react";
import { TextInput, View } from "react-native";
import {
  Button,
  ThemedText,
  useColor,
} from "@indiecrafts/packages-mobile-ui-native";
import type { DeleteAccountCopy } from "../shared/account-copy";
import {
  submitAccountErasure,
  type ErasureSelfResult,
} from "../shared/erasure-self";

export interface DeleteAccountSectionProps {
  copy: DeleteAccountCopy;
  apiUrl: string;
  getToken: () => Promise<string | null>;
  onDeleted: () => void | Promise<void>;
  /** Optional reverification seam (unused this slice) — return false to abort. */
  beforeConfirm?: () => Promise<boolean>;
}

type Status = "idle" | "pending" | ErasureSelfResult;

/**
 * The shared "Delete my account" section (native, RN) — Clerk-free, drives the same
 * `submitAccountErasure` as the web sibling. Takes `getToken` + `apiUrl` as props;
 * copy is injected — no react-intl inside.
 */
export function DeleteAccountSection({
  copy,
  apiUrl,
  getToken,
  onDeleted,
  beforeConfirm,
}: DeleteAccountSectionProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const border = useColor("border");
  const fg = useColor("foreground");
  const danger = useColor("destructive");

  async function onConfirm() {
    if (!email.trim() || status === "pending") return;
    if (beforeConfirm && !(await beforeConfirm())) return;
    setStatus("pending");
    const result = await submitAccountErasure({
      apiUrl,
      getToken,
      email: email.trim(),
    });
    setStatus(result);
    if (result === "done" || result === "partial") await onDeleted();
  }

  const message =
    status === "done"
      ? copy.success
      : status === "partial"
        ? copy.partial
        : status === "mismatch"
          ? copy.mismatch
          : status === "error"
            ? copy.error
            : null;

  return (
    <View style={{ gap: 8 }}>
      <ThemedText variant="title">{copy.heading}</ThemedText>
      <ThemedText variant="muted">{copy.body}</ThemedText>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder={copy.emailPlaceholder}
        placeholderTextColor={border}
        autoCapitalize="none"
        keyboardType="email-address"
        inputMode="email"
        accessibilityLabel={copy.emailLabel}
        style={{
          height: 44,
          borderWidth: 1,
          borderColor: border,
          borderRadius: 8,
          paddingHorizontal: 12,
          color: fg,
        }}
      />
      <Button
        variant="destructive"
        label={status === "pending" ? copy.pending : copy.confirmButton}
        onPress={() => void onConfirm()}
        disabled={status === "pending" || email.trim().length === 0}
      />
      {message ? (
        // Only a real failure is shown in the danger colour; a successful (or
        // partial) erasure reads as neutral, so success never looks like an error.
        status === "error" || status === "mismatch" ? (
          <ThemedText style={{ color: danger }}>{message}</ThemedText>
        ) : (
          <ThemedText variant="muted">{message}</ThemedText>
        )
      ) : null}
    </View>
  );
}
