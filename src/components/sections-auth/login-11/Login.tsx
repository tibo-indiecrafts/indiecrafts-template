import type { JSX, SVGProps } from "react";
import { Link } from "@/i18n/routing";
import { LogoIcon } from "@/components/layouts/_shared/logo";
import { Button } from "@/components/ui-primitives/button";
import { Input } from "@/components/ui-primitives/input";
import { Label } from "@/components/ui-primitives/label";
import { useScopedT } from "@/components/_lib/scoped-t";
import { login11Namespace } from "./config";
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

function FacebookIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      aria-hidden="true"
      {...props}
    >
      <path
        fill="#1877f2"
        d="M256 128C256 57.308 198.692 0 128 0S0 57.308 0 128c0 63.888 46.808 116.843 108 126.445V165H75.5v-37H108V99.8c0-32.08 19.11-49.8 48.348-49.8C170.352 50 185 52.5 185 52.5V84h-16.14C152.959 84 148 93.867 148 103.99V128h35.5l-5.675 37H148v89.445c61.192-9.602 108-62.556 108-126.445"
      />
      <path
        fill="#fff"
        d="m177.825 165l5.675-37H148v-24.01C148 93.866 152.959 84 168.86 84H185V52.5S170.352 50 156.347 50C127.11 50 108 67.72 108 99.8V128H75.5v37H108v89.445A129 129 0 0 0 128 256a129 129 0 0 0 20-1.555V165z"
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

export default function Login(props: Readonly<LoginBlock>) {
  const [t] = useScopedT(login11Namespace);
  const titleId = `${props.id}-title`;
  const emailId = `${props.id}-email`;
  const googleHref = props.googleHref ?? "#";
  const facebookHref = props.facebookHref ?? "#";
  const microsoftHref = props.microsoftHref ?? "#";
  const signupHref = props.signupHref ?? "#";
  const homeHref = props.homeHref ?? "/";

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
              {t.rich("heading", {
                muted: (chunks) => (
                  <span className="text-muted-foreground">{chunks}</span>
                ),
              })}
            </h1>
          </div>

          <div className="mt-6 space-y-2">
            <Button variant="outline" size="default" className="w-full" asChild>
              <a href={googleHref}>
                <GoogleIcon className="size-4" />
                <span>{t("googleCta")}</span>
              </a>
            </Button>
            <Button variant="outline" size="default" className="w-full" asChild>
              <a href={facebookHref}>
                <FacebookIcon className="size-4" />
                <span>{t("facebookCta")}</span>
              </a>
            </Button>
            <Button variant="outline" size="default" className="w-full" asChild>
              <a href={microsoftHref}>
                <MicrosoftIcon className="size-4" />
                <span>{t("microsoftCta")}</span>
              </a>
            </Button>
          </div>

          <hr className="mt-6 mb-5" />

          <div className="space-y-6">
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
