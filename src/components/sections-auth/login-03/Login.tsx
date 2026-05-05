"use client";

import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui-primitives/button";
import { Input } from "@/components/ui-primitives/input";
import { Label } from "@/components/ui-primitives/label";
import { useScopedT } from "@/i18n/scoped-t";
import { login03Namespace } from "./config";
import type { LoginBlock } from "./schema";

/**
 * Centered email + password sign-in with a "reset password" link.
 * Sourced from `@blocks-so/login-03`, refactored into the section
 * pattern: every visible string resolves from `blocks.login-03.*`.
 */
export default function Login(props: Readonly<LoginBlock>) {
  const [t, tr] = useScopedT(login03Namespace);
  const titleId = `${props.id}-title`;
  const emailId = `${props.id}-email`;
  const passwordId = `${props.id}-password`;
  const resetHref = props.resetHref ?? "#";
  const title = tr(props.titleKey, "title");
  const description = tr(props.descriptionKey, "description");

  return (
    <section
      aria-labelledby={titleId}
      className="flex min-h-dvh items-center justify-center"
    >
      <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h3
            id={titleId}
            className="text-foreground text-center text-lg font-semibold text-balance"
          >
            {title}
          </h3>
          <p className="text-muted-foreground text-center text-sm text-pretty">
            {description}
          </p>
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
          <p className="text-muted-foreground mt-6 text-sm text-pretty">
            {t("resetPrompt")}{" "}
            <Link
              href={resetHref as Parameters<typeof Link>[0]["href"]}
              className="text-primary hover:text-primary/90 font-medium"
            >
              {t("resetCta")}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
