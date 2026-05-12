import { Link } from "@/i18n/routing";
import { LogoIcon } from "@/components/layouts/_shared/logo";
import { Button } from "@/components/ui-primitives/button";
import { Input } from "@/components/ui-primitives/input";
import { Label } from "@/components/ui-primitives/label";
import { useScopedT } from "@/i18n/scoped-t";
import { forgotPassword03Namespace } from "./config";
import type { ForgotPasswordBlock } from "./schema";

/**
 * Tailark `mist-forgot-password-1` — JSX verbatim. Recover-password
 * mirror of `mist-login-1` (login-11) / `mist-sign-up-1` (login-18):
 * plain centered `max-w-92` form on a `bg-linear-to-b from-muted
 * to-background` gradient section (no card chrome). Logo link,
 * "Forgot Your Password?" heading + muted subtitle, single email
 * field with `ring-foreground/15 border-transparent ring-1` ring-
 * style chrome, "Send Reset Link" CTA. Inline "Sign In" footer for
 * users who remember.
 */
export default function ForgotPassword(props: Readonly<ForgotPasswordBlock>) {
  const [t, tr] = useScopedT(forgotPassword03Namespace);
  const titleId = `${props.id}-title`;
  const emailId = `${props.id}-email`;
  const signinHref = props.signinHref ?? "#";
  const homeHref = props.homeHref ?? "/";
  const title = tr(props.titleKey, "title");
  const description = tr(props.descriptionKey, "description");

  return (
    <section
      aria-labelledby={titleId}
      className="from-muted to-background flex min-h-dvh bg-linear-to-b px-4 py-16 md:py-32"
    >
      <form action="#" method="post" className="m-auto h-fit w-full max-w-92">
        <div className="p-6">
          <div>
            <Link
              href={homeHref as Parameters<typeof Link>[0]["href"]}
              aria-label={t("homeAriaLabel")}
            >
              <LogoIcon />
            </Link>
            <h1 id={titleId} className="mt-6 text-xl font-semibold text-balance">
              {title}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">{description}</p>
          </div>

          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor={emailId} className="block text-sm">
                {t("emailLabel")}
              </Label>
              <Input
                type="email"
                required
                name="email"
                id={emailId}
                autoComplete="email"
                placeholder={t("emailPlaceholder")}
                className="ring-foreground/15 border-transparent ring-1"
              />
            </div>

            <Button type="submit" className="w-full" size="default">
              {t("submit")}
            </Button>
          </div>
        </div>

        <div className="px-6">
          <p className="text-muted-foreground text-sm">
            {t("signinPrompt")}
            <Button asChild variant="link" className="px-2">
              <Link href={signinHref as Parameters<typeof Link>[0]["href"]}>
                {t("signinCta")}
              </Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  );
}
