/**
 * The guard around a form's own fields: honeypot, consent, Turnstile, error — plus the shared input and button.
 *
 * @see docs/reference/packages/web/ui-components/src/web/form/GuardedFields.md
 */
// Client-side parts (no "use client" entry: only the client forms render them, so a
// function prop like `onSubmit` never crosses a server boundary).
import type { ComponentProps, ReactNode } from "react";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import { Input } from "@indiecrafts/packages-web-ui/web/input";
import { Checkbox } from "@indiecrafts/packages-web-ui/web/checkbox";
import { Label } from "@indiecrafts/packages-web-ui/web/label";
import { cn } from "@indiecrafts/packages-shared-utils/cn";
import { TurnstileWidget } from "./TurnstileWidget";
import type { GuardedSubmit } from "./useGuardedSubmit";

/**
 * The `<form>` with the guard around the form's own fields: the honeypot first (off-screen,
 * hidden from assistive tech — only bots fill it), then `children`, then the consent box,
 * Turnstile, an optional `footer` (a full-width submit), and the error line.
 */
export function GuardedFields({
  guard,
  onSubmit,
  consentText,
  errorText,
  banner,
  footer,
  className,
  children,
}: {
  guard: GuardedSubmit;
  onSubmit: () => void;
  consentText: string;
  errorText: string;
  banner: boolean;
  footer?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className={cn("space-y-3", className)}
    >
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
      >
        <label>
          Website
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={guard.honeypot}
            onChange={(e) => guard.setHoneypot(e.target.value)}
          />
        </label>
      </div>

      {children}

      {/* Always shown: submit stays disabled until it is ticked. */}
      <div className="flex items-start gap-2.5 text-left">
        <Checkbox
          id={`${guard.uid}-consent`}
          checked={guard.consent}
          onCheckedChange={(v) => guard.setConsent(v === true)}
          className={banner ? "border-primary-foreground/40" : undefined}
        />
        <Label
          htmlFor={`${guard.uid}-consent`}
          className={cn(
            "text-xs leading-snug font-normal",
            banner ? "text-primary-foreground" : "text-muted-foreground",
          )}
        >
          {consentText}
        </Label>
      </div>

      <TurnstileWidget key={guard.tokenKey} onToken={guard.setToken} />

      {footer}

      {guard.status === "error" ? (
        <p
          role="alert"
          aria-live="assertive"
          className={cn(
            "text-sm",
            banner ? "text-primary-foreground" : "text-destructive",
          )}
        >
          {errorText}
        </p>
      ) : null}
    </form>
  );
}

/** A labelled text input — the label is the placeholder, read by screen readers only. */
export function FormInput({
  id,
  label,
  banner,
  ...input
}: { id: string; label: string; banner: boolean } & ComponentProps<
  typeof Input
>) {
  return (
    <>
      <Label htmlFor={id} className="sr-only">
        {label}
      </Label>
      <Input
        id={id}
        placeholder={label}
        className={
          banner
            ? "bg-background dark:bg-background text-foreground"
            : undefined
        }
        {...input}
      />
    </>
  );
}

/** The submit button, disabled until the guard allows it. */
export function SubmitButton({
  guard,
  banner,
  className,
  children,
}: {
  guard: GuardedSubmit;
  banner: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Button
      type="submit"
      variant={banner ? "secondary" : "default"}
      disabled={!guard.canSubmit}
      className={className}
    >
      {children}
    </Button>
  );
}
