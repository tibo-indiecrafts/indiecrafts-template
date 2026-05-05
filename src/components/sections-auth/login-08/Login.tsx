"use client";

import { EyeIcon, EyeOffIcon, Key } from "lucide-react";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import { LogoIcon } from "@/components/layouts/_shared/logo";
import { Button } from "@/components/ui-primitives/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui-primitives/card";
import { Checkbox } from "@/components/ui-primitives/checkbox";
import { Input } from "@/components/ui-primitives/input";
import { Label } from "@/components/ui-primitives/label";
import { useScopedT } from "@/i18n/scoped-t";
import { login08Namespace } from "./config";
import type { LoginBlock } from "./schema";

/**
 * Branded sign-in card — logo + email + password (with visibility
 * toggle) + remember-me + SSO + reset/sign-up links. Sourced from
 * `@blocks-so/login-08`, refactored into the section pattern.
 */
export default function Login(props: Readonly<LoginBlock>) {
  const [t, tr] = useScopedT(login08Namespace);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const titleId = `${props.id}-title`;
  const emailId = `${props.id}-email`;
  const passwordId = `${props.id}-password`;
  const rememberId = `${props.id}-remember`;
  const brand = tr(props.brandKey, "brand");
  const title = tr(props.titleKey, "title", { brand });
  const description = tr(props.descriptionKey, "description");
  const resetHref = props.resetHref ?? "#";
  const ssoHref = props.ssoHref ?? "#";
  const signupHref = props.signupHref ?? "#";

  return (
    <section
      aria-labelledby={titleId}
      className="flex min-h-dvh items-center justify-center"
    >
      <Card className="mx-4 w-full max-w-md pb-0 shadow-2xs">
        <CardHeader className="mt-4 mb-2 space-y-1 text-center">
          <div className="flex justify-center">
            <LogoIcon />
          </div>
          <div>
            <h2 id={titleId} className="text-2xl font-semibold text-balance">
              {title}
            </h2>
            <p className="text-muted-foreground text-sm text-pretty">{description}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form action="#" method="post" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor={emailId}>{t("emailLabel")}</Label>
              <Input
                id={emailId}
                name="email"
                autoComplete="email"
                type="email"
                placeholder={t("emailPlaceholder")}
                required
              />
            </div>
            <div className="space-y-0">
              <div className="mb-2 flex items-center justify-between">
                <Label htmlFor={passwordId}>{t("passwordLabel")}</Label>
                <Link
                  href={resetHref as Parameters<typeof Link>[0]["href"]}
                  className="text-primary text-sm hover:underline"
                >
                  {t("resetCta")}
                </Link>
              </div>
              <div className="relative">
                <Input
                  id={passwordId}
                  name="password"
                  autoComplete="current-password"
                  className="pe-9"
                  placeholder={t("passwordPlaceholder")}
                  type={isPasswordVisible ? "text" : "password"}
                  required
                />
                <button
                  className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  type="button"
                  onClick={() => setIsPasswordVisible((v) => !v)}
                  aria-label={isPasswordVisible ? t("hidePassword") : t("showPassword")}
                  aria-pressed={isPasswordVisible}
                  aria-controls={passwordId}
                >
                  {isPasswordVisible ? (
                    <EyeOffIcon size={16} aria-hidden="true" />
                  ) : (
                    <EyeIcon size={16} aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id={rememberId} name="remember" defaultChecked />
              <Label htmlFor={rememberId} className="text-sm font-normal">
                {t("rememberMe")}
              </Label>
            </div>

            <div className="space-y-2">
              <Button type="submit" className="w-full">
                {t("submit")}
              </Button>
              <Button asChild variant="outline" className="w-full" type="button">
                <a href={ssoHref}>
                  <Key className="mr-2 h-4 w-4" />
                  {t("ssoCta")}
                </a>
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t py-4!">
          <p className="text-muted-foreground text-center text-sm text-pretty">
            {t("signupPrompt", { brand })}{" "}
            <Link
              href={signupHref as Parameters<typeof Link>[0]["href"]}
              className="text-primary hover:underline"
            >
              {t("signupCta")}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </section>
  );
}
