import type { JSX, SVGProps } from "react";
import { Link } from "@/i18n/routing";
import { LogoIcon } from "@/components/layouts/_shared/logo";
import { Button } from "@/components/ui-primitives/button";
import { Input } from "@/components/ui-primitives/input";
import { Label } from "@/components/ui-primitives/label";
import { useScopedT } from "@/i18n/scoped-t";
import { login15Namespace } from "./config";
import type { LoginBlock } from "./schema";

function GoogleIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 262"
      aria-hidden="true"
      {...props}
    >
      <path
        fill="#4285f4"
        d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
      />
      <path
        fill="#34a853"
        d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
      />
      <path
        fill="#fbbc05"
        d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
      />
      <path
        fill="#eb4335"
        d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
      />
    </svg>
  );
}

function MicrosoftIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      aria-hidden="true"
      {...props}
    >
      <path fill="#f1511b" d="M121.666 121.666H0V0h121.666z" />
      <path fill="#80cc28" d="M256 121.666H134.335V0H256z" />
      <path fill="#00adef" d="M121.663 256.002H0V134.336h121.663z" />
      <path fill="#fbbc09" d="M256 256.002H134.335V134.336H256z" />
    </svg>
  );
}

/**
 * Tailark `login-2` (dusk-kit) — JSX verbatim. Centered sign-in
 * inside a `bg-muted` ring (`max-w-sm rounded border shadow-md`)
 * with a nested `bg-card -m-px rounded border p-8 pb-6` inner card;
 * the `-m-px` outdent exposes the muted ring as a hairline frame.
 * Centered logo link + heading + subtitle, email + password (inline
 * forgot link), Sign-In submit, "Or continue With" dashed-divider
 * (`grid-cols-[1fr_auto_1fr]`), 2-col Google + Microsoft OAuth.
 * Footer "Don't have an account?" sits in the muted gutter below.
 */
export default function Login(props: Readonly<LoginBlock>) {
  const [t, tr] = useScopedT(login15Namespace);
  const titleId = `${props.id}-title`;
  const emailId = `${props.id}-email`;
  const passwordId = `${props.id}-password`;
  const googleHref = props.googleHref ?? "#";
  const microsoftHref = props.microsoftHref ?? "#";
  const forgotHref = props.forgotHref ?? "#";
  const signupHref = props.signupHref ?? "#";
  const homeHref = props.homeHref ?? "/";
  const title = tr(props.titleKey, "title");
  const description = tr(props.descriptionKey, "description");

  return (
    <section aria-labelledby={titleId} className="flex min-h-dvh px-4 py-16 md:py-32">
      <form
        action="#"
        method="post"
        className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5"
      >
        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
          <div className="text-center">
            <Link
              href={homeHref as Parameters<typeof Link>[0]["href"]}
              aria-label={t("homeAriaLabel")}
              className="mx-auto block w-fit"
            >
              <LogoIcon />
            </Link>
            <h1 id={titleId} className="mt-4 mb-1 text-xl font-semibold">
              {title}
            </h1>
            <p className="text-sm">{description}</p>
          </div>

          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor={emailId} className="block text-sm">
                {t("usernameLabel")}
              </Label>
              <Input
                type="email"
                required
                name="email"
                id={emailId}
                autoComplete="email"
              />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <Label htmlFor={passwordId} className="text-sm">
                  {t("passwordLabel")}
                </Label>
                <Button asChild variant="link" size="sm">
                  <Link
                    href={forgotHref as Parameters<typeof Link>[0]["href"]}
                    className="text-sm"
                  >
                    {t("forgotCta")}
                  </Link>
                </Button>
              </div>
              <Input
                type="password"
                required
                name="password"
                id={passwordId}
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" className="w-full">
              {t("submit")}
            </Button>
          </div>

          <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <hr className="border-dashed" />
            <span className="text-muted-foreground text-xs">{t("separator")}</span>
            <hr className="border-dashed" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" asChild>
              <a href={googleHref}>
                <GoogleIcon className="size-4" />
                <span>{t("googleCta")}</span>
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href={microsoftHref}>
                <MicrosoftIcon className="size-4" />
                <span>{t("microsoftCta")}</span>
              </a>
            </Button>
          </div>
        </div>

        <div className="p-3">
          <p className="text-accent-foreground text-center text-sm">
            {t("signupPrompt")}
            <Button asChild variant="link" className="px-2">
              <Link href={signupHref as Parameters<typeof Link>[0]["href"]}>
                {t("signupCta")}
              </Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  );
}
