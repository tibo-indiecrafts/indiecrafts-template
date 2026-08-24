"use client";

import { useState } from "react";
import { cn } from "@indiecrafts/packages-shared-utils/cn";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import { requestExport } from "../shared/export-self";

export interface ExportCopy {
  heading: string;
  body: string;
  button: string;
  pending: string;
  success: string;
  error: string;
}

export interface ExportSectionProps {
  copy: ExportCopy;
  apiUrl: string;
  getToken: () => Promise<string | null>;
  onExported?: (url: string) => void;
}

type Status = "idle" | "pending" | "success" | "error";

/**
 * The shared "Download my data" section (web, shadcn) — Clerk/Next-free, so the
 * `app` web surface AND the Electron renderer both use it. Takes `getToken` + `apiUrl`
 * as props and drives `requestExport`; copy is injected — no next-intl inside.
 */
export function ExportSection({
  copy,
  apiUrl,
  getToken,
  onExported,
}: ExportSectionProps) {
  const [status, setStatus] = useState<Status>("idle");

  async function onClick() {
    if (status === "pending") return;
    setStatus("pending");
    const result = await requestExport({ apiUrl, getToken });
    if (result.ok) {
      window.open(result.url, "_blank", "noopener");
      onExported?.(result.url);
      setStatus("success");
    } else {
      setStatus("error");
    }
  }

  const statusText =
    status === "success"
      ? copy.success
      : status === "error"
        ? copy.error
        : null;

  return (
    <div className={cn("bg-card text-foreground rounded-xl border p-4")}>
      <p className="text-sm font-semibold">{copy.heading}</p>
      <p className="text-muted-foreground mt-1 text-sm">{copy.body}</p>

      <div className="mt-3 space-y-3">
        <Button
          type="button"
          onClick={() => void onClick()}
          disabled={status === "pending"}
        >
          {status === "pending" ? copy.pending : copy.button}
        </Button>

        {statusText ? (
          <p role="status" className="text-muted-foreground text-sm">
            {statusText}
          </p>
        ) : null}
      </div>
    </div>
  );
}
