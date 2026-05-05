import { Link } from "@/i18n/routing";
import { LogoIcon } from "@/components/layouts/_shared/logo";
import { Button } from "@/components/ui-primitives/button";
import { Card, CardContent } from "@/components/ui-primitives/card";
import { Input } from "@/components/ui-primitives/input";
import { Separator } from "@/components/ui-primitives/separator";
import { useScopedT } from "@/i18n/scoped-t";
import { login06Namespace } from "./config";
import type { LoginBlock } from "./schema";

/**
 * Passwordless-first card: magic-link primary, password fallback, SSO.
 * Sourced from `@blocks-so/login-06`, refactored into the section
 * pattern: every visible string resolves from `blocks.login-06.*`.
 */
export default function Login(props: Readonly<LoginBlock>) {
  const [t, tr] = useScopedT(login06Namespace);
  const titleId = `${props.id}-title`;
  const title = tr(props.titleKey, "title");
  const emailId = `${props.id}-email`;
  const signupHref = props.signupHref ?? "#";
  const passwordSigninHref = props.passwordSigninHref ?? "#";
  const ssoHref = props.ssoHref ?? "#";
  const termsHref = props.termsHref ?? "#";
  const privacyHref = props.privacyHref ?? "#";

  return (
    <section
      aria-labelledby={titleId}
      className="flex min-h-dvh items-center justify-center"
    >
      <Card className="w-full max-w-sm rounded-4xl px-6 py-10 pt-14 shadow-2xs">
        <CardContent>
          <div className="flex flex-col items-center space-y-8">
            <LogoIcon />

            <div className="space-y-2 text-center">
              <h1
                id={titleId}
                className="text-foreground text-3xl font-semibold text-balance"
              >
                {title}
              </h1>
              <p className="text-muted-foreground text-sm text-pretty">
                {t("signupPrompt")}{" "}
                <Link
                  href={signupHref as Parameters<typeof Link>[0]["href"]}
                  className="text-foreground hover:underline"
                >
                  {t("signupCta")}
                </Link>
              </p>
            </div>

            <form action="#" method="post" className="w-full space-y-4">
              <div>
                <label htmlFor={emailId} className="sr-only">
                  {t("emailLabel")}
                </label>
                <Input
                  id={emailId}
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder={t("emailPlaceholder")}
                  className="w-full rounded-xl"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Button type="submit" className="w-full rounded-xl" size="lg">
                  {t("magicLinkSubmit")}
                </Button>
                <Button
                  asChild
                  variant="link"
                  className="text-muted-foreground w-full text-sm"
                >
                  <Link href={passwordSigninHref as Parameters<typeof Link>[0]["href"]}>
                    {t("passwordSignin")}
                  </Link>
                </Button>
              </div>

              <div className="flex items-center gap-4 py-2">
                <Separator className="flex-1" />
                <span className="text-muted-foreground text-sm">{t("separator")}</span>
                <Separator className="flex-1" />
              </div>

              <Button asChild variant="outline" className="w-full rounded-xl" size="lg">
                <a href={ssoHref}>{t("ssoCta")}</a>
              </Button>
            </form>

            <p className="text-muted-foreground w-11/12 text-center text-xs text-pretty">
              {t.rich("legal", {
                terms: (chunks) => (
                  <Link
                    href={termsHref as Parameters<typeof Link>[0]["href"]}
                    className="hover:text-foreground underline"
                  >
                    {chunks}
                  </Link>
                ),
                privacy: (chunks) => (
                  <Link
                    href={privacyHref as Parameters<typeof Link>[0]["href"]}
                    className="hover:text-foreground underline"
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
