"use client";

import { useId, useState } from "react";
import { cn } from "@indiecrafts/packages-shared-utils/cn";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import { Input } from "@indiecrafts/packages-web-ui/web/input";
import { Label } from "@indiecrafts/packages-web-ui/web/label";

export type ErasureSelfResult = "done" | "partial" | "mismatch" | "error";

export interface DeleteAccountCopy {
  heading: string;
  body: string;
  emailLabel: string;
  emailPlaceholder: string;
  confirmButton: string;
  pending: string;
  success: string;
  partial: string;
  error: string;
  mismatch: string;
}

export interface DeleteAccountSectionProps {
  copy: DeleteAccountCopy;
  apiUrl: string;
  getToken: () => Promise<string | null>;
  onDeleted: () => void | Promise<void>;
  /** Optional reverification seam (unused this slice) — return false to abort. */
  beforeConfirm?: () => Promise<boolean>;
}

/**
 * Pure, testable: the one authenticated POST to the Slice-A erasure worker route.
 */
export async function submitAccountErasure(input: {
  apiUrl: string;
  getToken: () => Promise<string | null>;
  email: string;
}): Promise<ErasureSelfResult> {
  try {
    const token = await input.getToken();
    const res = await fetch(`${input.apiUrl}/v1/erasure/self`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ email: input.email }),
    });
    if (res.status === 200) return "done";
    if (res.status === 207) return "partial"; // still erased; some stores need manual finish
    if (res.status === 400) return "mismatch"; // typed email did not match the account
    return "error";
  } catch {
    return "error";
  }
}

type Status = "idle" | "pending" | ErasureSelfResult;

/**
 * The shared "Delete my account" section (web, shadcn) — Clerk/Next-free, so the
 * `app` web surface AND the Electron renderer both use it. Takes `getToken` + `apiUrl`
 * as props and drives `submitAccountErasure`; copy is injected — no next-intl inside.
 */
export function DeleteAccountSection({
  copy,
  apiUrl,
  getToken,
  onDeleted,
  beforeConfirm,
}: DeleteAccountSectionProps) {
  const uid = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
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

  const statusText =
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
    <div className={cn("bg-card text-foreground rounded-xl border p-4")}>
      <p className="text-sm font-semibold">{copy.heading}</p>
      <p className="text-muted-foreground mt-1 text-sm">{copy.body}</p>

      <form onSubmit={onSubmit} className="mt-3 space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor={`${uid}-email`}>{copy.emailLabel}</Label>
          <Input
            id={`${uid}-email`}
            type="email"
            placeholder={copy.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          variant="destructive"
          disabled={status === "pending" || !email.trim()}
        >
          {status === "pending" ? copy.pending : copy.confirmButton}
        </Button>

        {statusText ? (
          <p role="status" className="text-muted-foreground text-sm">
            {statusText}
          </p>
        ) : null}
      </form>
    </div>
  );
}
