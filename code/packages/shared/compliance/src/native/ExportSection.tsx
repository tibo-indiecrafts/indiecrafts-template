import { useState } from "react";
import { Linking, View } from "react-native";
import {
  Button,
  ThemedText,
  useColor,
} from "@indiecrafts/packages-mobile-ui-native";
import type { ExportCopy } from "../shared/account-copy";
import { requestExport } from "../shared/export-self";

export interface ExportSectionProps {
  copy: ExportCopy;
  apiUrl: string;
  getToken: () => Promise<string | null>;
  onExported?: (url: string) => void;
}

type Status = "idle" | "pending" | "success" | "error";

/**
 * The shared "Download my data" section (native, RN) — Clerk-free, drives the same
 * `requestExport` as the web sibling. Takes `getToken` + `apiUrl` as props; copy is
 * injected — no react-intl inside.
 */
export function ExportSection({
  copy,
  apiUrl,
  getToken,
  onExported,
}: ExportSectionProps) {
  const [status, setStatus] = useState<Status>("idle");
  const danger = useColor("destructive");

  async function onPress() {
    if (status === "pending") return;
    setStatus("pending");
    const result = await requestExport({ apiUrl, getToken });
    if (result.ok) {
      void Linking.openURL(result.url);
      onExported?.(result.url);
      setStatus("success");
    } else {
      setStatus("error");
    }
  }

  const message =
    status === "success"
      ? copy.success
      : status === "error"
        ? copy.error
        : null;

  return (
    <View style={{ gap: 8 }}>
      <ThemedText variant="title">{copy.heading}</ThemedText>
      <ThemedText variant="muted">{copy.body}</ThemedText>
      <Button
        label={status === "pending" ? copy.pending : copy.button}
        onPress={() => void onPress()}
        disabled={status === "pending"}
      />
      {message ? (
        status === "error" ? (
          <ThemedText style={{ color: danger }}>{message}</ThemedText>
        ) : (
          <ThemedText variant="muted">{message}</ThemedText>
        )
      ) : null}
    </View>
  );
}
