"use client";

import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState, type JSX, type SVGProps } from "react";
import { Link } from "@/i18n/routing";
import { LogoIcon } from "@/components/layouts/_shared/logo";
import { Button } from "@/components/ui-primitives/button";
import { Checkbox } from "@/components/ui-primitives/checkbox";
import { Input } from "@/components/ui-primitives/input";
import { Label } from "@/components/ui-primitives/label";
import { Separator } from "@/components/ui-primitives/separator";
import { useScopedT } from "@/i18n/scoped-t";
import { login07Namespace } from "./config";
import type { LoginBlock } from "./schema";

function GoogleIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M3.06364 7.50914C4.70909 4.24092 8.09084 2 12 2C14.6954 2 16.959 2.99095 18.6909 4.60455L15.8227 7.47274C14.7864 6.48185 13.4681 5.97727 12 5.97727C9.39542 5.97727 7.19084 7.73637 6.40455 10.1C6.2045 10.7 6.09086 11.3409 6.09086 12C6.09086 12.6591 6.2045 13.3 6.40455 13.9C7.19084 16.2636 9.39542 18.0227 12 18.0227C13.3454 18.0227 14.4909 17.6682 15.3864 17.0682C16.4454 16.3591 17.15 15.3 17.3818 14.05H12V10.1818H21.4181C21.5364 10.8363 21.6 11.5182 21.6 12.2273C21.6 15.2727 20.5091 17.8363 18.6181 19.5773C16.9636 21.1046 14.7 22 12 22C8.09084 22 4.70909 19.7591 3.06364 16.4909C2.38638 15.1409 2 13.6136 2 12C2 10.3864 2.38638 8.85911 3.06364 7.50914Z" />
    </svg>
  );
}

export default function Login(props: Readonly<LoginBlock>) {
  const [t, tr] = useScopedT(login07Namespace);
  const [isVisible, setIsVisible] = useState(false);
  const title = tr(props.titleKey, "title");
  const description = tr(props.descriptionKey, "description");
  const titleId = `${props.id}-title`;
  const emailId = `${props.id}-email`;
  const passwordId = `${props.id}-password`;
  const rememberId = `${props.id}-remember`;
  const googleHref = props.googleHref ?? "#";
  const forgotHref = props.forgotHref ?? "#";
  const signupHref = props.signupHref ?? "#";

  return (
    <section
      aria-labelledby={titleId}
      className="flex min-h-dvh items-center justify-center"
    >
      <div className="mx-auto w-full max-w-xs space-y-6">
        <div className="space-y-2 text-center">
          <LogoIcon className="mx-auto h-16 w-16" />
          <h1 id={titleId} className="text-3xl font-semibold text-balance">
            {title}
          </h1>
          <p className="text-muted-foreground text-pretty">{description}</p>
        </div>

        <form action="#" method="post" className="space-y-5">
          <Button asChild variant="outline" className="w-full justify-center gap-2">
            <a href={googleHref}>
              <GoogleIcon className="h-4 w-4" />
              {t("googleCta")}
            </a>
          </Button>

          <div className="flex items-center gap-2">
            <Separator className="flex-1" />
            <span className="text-muted-foreground text-sm">{t("separator")}</span>
            <Separator className="flex-1" />
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor={emailId}>{t("emailLabel")}</Label>
              <div className="relative mt-2.5">
                <Input
                  id={emailId}
                  name="email"
                  autoComplete="email"
                  type="email"
                  className="peer ps-9"
                  placeholder={t("emailPlaceholder")}
                  required
                />
                <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                  <Mail size={16} aria-hidden="true" />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor={passwordId}>{t("passwordLabel")}</Label>
                <Link
                  href={forgotHref as Parameters<typeof Link>[0]["href"]}
                  className="text-primary text-sm hover:underline"
                >
                  {t("forgotCta")}
                </Link>
              </div>
              <div className="relative mt-2.5">
                <Input
                  id={passwordId}
                  name="password"
                  autoComplete="current-password"
                  className="ps-9 pe-9"
                  placeholder={t("passwordPlaceholder")}
                  type={isVisible ? "text" : "password"}
                  required
                />
                <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                  <Lock size={16} aria-hidden="true" />
                </div>
                <button
                  className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  type="button"
                  onClick={() => setIsVisible((v) => !v)}
                  aria-label={isVisible ? t("hidePassword") : t("showPassword")}
                  aria-pressed={isVisible}
                  aria-controls={passwordId}
                >
                  {isVisible ? (
                    <EyeOff size={16} aria-hidden="true" />
                  ) : (
                    <Eye size={16} aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Checkbox id={rememberId} name="remember" />
              <Label htmlFor={rememberId}>{t("rememberMe")}</Label>
            </div>
          </div>

          <Button type="submit" className="w-full">
            {t("submit")}
            <ArrowRight className="h-4 w-4" />
          </Button>

          <p className="text-center text-sm">
            {t("signupPrompt")}{" "}
            <Link
              href={signupHref as Parameters<typeof Link>[0]["href"]}
              className="text-primary font-medium hover:underline"
            >
              {t("signupCta")}
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
