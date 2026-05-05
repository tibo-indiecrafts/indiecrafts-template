import type { JSX, SVGProps } from "react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui-primitives/button";
import { Input } from "@/components/ui-primitives/input";
import { Label } from "@/components/ui-primitives/label";
import { Separator } from "@/components/ui-primitives/separator";
import { useScopedT } from "@/i18n/scoped-t";
import { login02Namespace } from "./config";
import type { LoginBlock } from "./schema";

function GoogleIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M3.06364 7.50914C4.70909 4.24092 8.09084 2 12 2C14.6954 2 16.959 2.99095 18.6909 4.60455L15.8227 7.47274C14.7864 6.48185 13.4681 5.97727 12 5.97727C9.39542 5.97727 7.19084 7.73637 6.40455 10.1C6.2045 10.7 6.09086 11.3409 6.09086 12C6.09086 12.6591 6.2045 13.3 6.40455 13.9C7.19084 16.2636 9.39542 18.0227 12 18.0227C13.3454 18.0227 14.4909 17.6682 15.3864 17.0682C16.4454 16.3591 17.15 15.3 17.3818 14.05H12V10.1818H21.4181C21.5364 10.8363 21.6 11.5182 21.6 12.2273C21.6 15.2727 20.5091 17.8363 18.6181 19.5773C16.9636 21.1046 14.7 22 12 22C8.09084 22 4.70909 19.7591 3.06364 16.4909C2.38638 15.1409 2 13.6136 2 12C2 10.3864 2.38638 8.85911 3.06364 7.50914Z" />
    </svg>
  );
}

/**
 * Email + password sign-in with Google CTA. Sourced from
 * `@blocks-so/login-02`, refactored into the section pattern: every
 * visible string resolves from `blocks.login-02.*`, the form posts to
 * the host application's auth handler.
 */
export default function Login(props: Readonly<LoginBlock>) {
  const [t, tr] = useScopedT(login02Namespace);
  const titleId = `${props.id}-title`;
  const emailId = `${props.id}-email`;
  const passwordId = `${props.id}-password`;
  const googleHref = props.googleHref ?? "#";
  const termsHref = props.termsHref ?? "#";
  const privacyHref = props.privacyHref ?? "#";
  const title = tr(props.titleKey, "title");

  return (
    <section
      aria-labelledby={titleId}
      className="flex min-h-dvh items-center justify-center"
    >
      <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2
            id={titleId}
            className="text-foreground text-center text-xl font-semibold text-balance"
          >
            {title}
          </h2>

          <form action="#" method="post" className="mt-6 space-y-4">
            <div>
              <Label htmlFor={emailId} className="text-foreground text-sm font-medium">
                {t("emailLabel")}
              </Label>
              <Input
                type="email"
                id={emailId}
                name="email"
                autoComplete="email"
                placeholder={t("emailPlaceholder")}
                className="mt-2"
                required
              />
            </div>
            <div>
              <Label htmlFor={passwordId} className="text-foreground text-sm font-medium">
                {t("passwordLabel")}
              </Label>
              <Input
                type="password"
                id={passwordId}
                name="password"
                autoComplete="current-password"
                placeholder={t("passwordPlaceholder")}
                className="mt-2"
                required
              />
            </div>
            <Button type="submit" className="mt-4 w-full py-2 font-medium">
              {t("submit")}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background text-muted-foreground px-2">
                {t("separator")}
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="flex w-full items-center justify-center space-x-2 py-2"
            asChild
          >
            <a href={googleHref}>
              <GoogleIcon className="size-5" />
              <span className="text-sm font-medium">{t("googleCta")}</span>
            </a>
          </Button>

          <p className="text-muted-foreground mt-4 text-xs text-pretty">
            {t.rich("legal", {
              terms: (chunks) => (
                <Link
                  href={termsHref as Parameters<typeof Link>[0]["href"]}
                  className="underline underline-offset-4"
                >
                  {chunks}
                </Link>
              ),
              privacy: (chunks) => (
                <Link
                  href={privacyHref as Parameters<typeof Link>[0]["href"]}
                  className="underline underline-offset-4"
                >
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </div>
      </div>
    </section>
  );
}
