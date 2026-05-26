import type { JSX, SVGProps } from "react";
import { Link } from "@/i18n/routing";
import { LogoIcon } from "@/components/layouts/_shared/logo";
import { Button } from "@/components/ui-primitives/button";
import { Input } from "@/components/ui-primitives/input";
import { Label } from "@/components/ui-primitives/label";
import { useScopedT } from "@/components/_lib/scoped-t";
import { login13Namespace } from "./config";
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

export default function Login(props: Readonly<LoginBlock>) {
  const [t, tr] = useScopedT(login13Namespace);
  const titleId = `${props.id}-title`;
  const emailId = `${props.id}-email`;
  const googleHref = props.googleHref ?? "#";
  const signupHref = props.signupHref ?? "#";
  const homeHref = props.homeHref ?? "/";
  const title = tr(props.titleKey, "title");
  const description = tr(props.descriptionKey, "description");

  return (
    <section aria-labelledby={titleId} className="flex min-h-dvh px-4 py-16 md:py-32">
      <form action="#" method="post" className="m-auto h-fit w-full max-w-92">
        <div className="p-6">
          <div>
            <Link
              href={homeHref as Parameters<typeof Link>[0]["href"]}
              aria-label={t("homeAriaLabel")}
            >
              <LogoIcon />
            </Link>
            <h1 id={titleId} className="mt-4 mb-1 text-xl font-semibold">
              {title}
            </h1>
            <p>{description}</p>
          </div>

          <div className="mt-6">
            <Button variant="outline" className="w-full" asChild>
              <a href={googleHref}>
                <GoogleIcon className="size-4" />
                <span>{t("googleCta")}</span>
              </a>
            </Button>
          </div>

          <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <hr className="border-dashed" />
            <span className="text-muted-foreground text-xs">{t("separator")}</span>
            <hr className="border-dashed" />
          </div>

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
              />
            </div>

            <Button type="submit" className="w-full">
              {t("submit")}
            </Button>
          </div>
        </div>

        <p className="text-accent-foreground text-center text-sm">
          {t("signupPrompt")}
          <Button asChild variant="link" className="px-2">
            <Link href={signupHref as Parameters<typeof Link>[0]["href"]}>
              {t("signupCta")}
            </Link>
          </Button>
        </p>
      </form>
    </section>
  );
}
