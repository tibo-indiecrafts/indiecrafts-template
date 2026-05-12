import type { JSX, SVGProps } from "react";
import { Link } from "@/i18n/routing";
import { LogoIcon } from "@/components/layouts/_shared/logo";
import { Button } from "@/components/ui-primitives/button";
import { Input } from "@/components/ui-primitives/input";
import { Label } from "@/components/ui-primitives/label";
import { Separator } from "@/components/ui-primitives/separator";
import { useScopedT } from "@/i18n/scoped-t";
import { login04Namespace } from "./config";
import type { LoginBlock } from "./schema";

function GitHubIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M12.001 2C6.47598 2 2.00098 6.475 2.00098 12C2.00098 16.425 4.86348 20.1625 8.83848 21.4875C9.33848 21.575 9.52598 21.275 9.52598 21.0125C9.52598 20.775 9.51348 19.9875 9.51348 19.15C7.00098 19.6125 6.35098 18.5375 6.15098 17.975C6.03848 17.6875 5.55098 16.8 5.12598 16.5625C4.77598 16.375 4.27598 15.9125 5.11348 15.9C5.90098 15.8875 6.46348 16.625 6.65098 16.925C7.55098 18.4375 8.98848 18.0125 9.56348 17.75C9.65098 17.1 9.91348 16.6625 10.201 16.4125C7.97598 16.1625 5.65098 15.3 5.65098 11.475C5.65098 10.3875 6.03848 9.4875 6.67598 8.7875C6.57598 8.5375 6.22598 7.5125 6.77598 6.1375C6.77598 6.1375 7.61348 5.875 9.52598 7.1625C10.326 6.9375 11.176 6.825 12.026 6.825C12.876 6.825 13.726 6.9375 14.526 7.1625C16.4385 5.8625 17.276 6.1375 17.276 6.1375C17.826 7.5125 17.476 8.5375 17.376 8.7875C18.0135 9.4875 18.401 10.375 18.401 11.475C18.401 15.3125 16.0635 16.1625 13.8385 16.4125C14.201 16.725 14.5135 17.325 14.5135 18.2625C14.5135 19.6 14.501 20.675 14.501 21.0125C14.501 21.275 14.6885 21.5875 15.1885 21.4875C19.259 20.1133 21.9999 16.2963 22.001 12C22.001 6.475 17.526 2 12.001 2Z" />
    </svg>
  );
}

function GoogleIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M3.06364 7.50914C4.70909 4.24092 8.09084 2 12 2C14.6954 2 16.959 2.99095 18.6909 4.60455L15.8227 7.47274C14.7864 6.48185 13.4681 5.97727 12 5.97727C9.39542 5.97727 7.19084 7.73637 6.40455 10.1C6.2045 10.7 6.09086 11.3409 6.09086 12C6.09086 12.6591 6.2045 13.3 6.40455 13.9C7.19084 16.2636 9.39542 18.0227 12 18.0227C13.3454 18.0227 14.4909 17.6682 15.3864 17.0682C16.4454 16.3591 17.15 15.3 17.3818 14.05H12V10.1818H21.4181C21.5364 10.8363 21.6 11.5182 21.6 12.2273C21.6 15.2727 20.5091 17.8363 18.6181 19.5773C16.9636 21.1046 14.7 22 12 22C8.09084 22 4.70909 19.7591 3.06364 16.4909C2.38638 15.1409 2 13.6136 2 12C2 10.3864 2.38638 8.85911 3.06364 7.50914Z" />
    </svg>
  );
}

export default function Login(props: Readonly<LoginBlock>) {
  const [t, tr] = useScopedT(login04Namespace);
  const titleId = `${props.id}-title`;
  const emailId = `${props.id}-email`;
  const passwordId = `${props.id}-password`;
  const signupHref = props.signupHref ?? "/signup";
  const githubHref = props.githubHref ?? "#";
  const googleHref = props.googleHref ?? "#";
  const resetHref = props.resetHref ?? "#";
  const title = tr(props.titleKey, "title");
  const brand = tr(props.brandKey, "brand");

  return (
    <section
      aria-labelledby={titleId}
      className="flex min-h-dvh items-center justify-center"
    >
      <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex items-center space-x-1.5">
            <LogoIcon className="text-foreground h-7 w-7" />
            <p className="text-foreground text-lg font-medium text-pretty">{brand}</p>
          </div>
          <h3
            id={titleId}
            className="text-foreground mt-6 text-lg font-semibold text-balance"
          >
            {title}
          </h3>
          <p className="text-muted-foreground mt-2 text-sm text-pretty">
            {t("signupPrompt")}{" "}
            <Link
              href={signupHref as Parameters<typeof Link>[0]["href"]}
              className="text-primary hover:text-primary/90 font-medium"
            >
              {t("signupCta")}
            </Link>
          </p>
          <div className="mt-8 flex flex-col items-center space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Button
              variant="outline"
              className="flex-1 items-center justify-center space-x-2 py-2"
              asChild
            >
              <a href={githubHref}>
                <GitHubIcon className="size-5" />
                <span className="text-sm font-medium">{t("githubCta")}</span>
              </a>
            </Button>
            <Button
              variant="outline"
              className="mt-2 flex-1 items-center justify-center space-x-2 py-2 sm:mt-0"
              asChild
            >
              <a href={googleHref}>
                <GoogleIcon className="size-4" />
                <span className="text-sm font-medium">{t("googleCta")}</span>
              </a>
            </Button>
          </div>

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
