import type { JSX, SVGProps } from "react";
import { Link } from "@/i18n/routing";
import { Logo } from "@/components/layouts/_shared/logo";
import { Button } from "@/components/ui-primitives/button";
import { Input } from "@/components/ui-primitives/input";
import { Label } from "@/components/ui-primitives/label";
import { useScopedT } from "@/components/_lib/scoped-t";
import { login14Namespace } from "./config";
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

function GithubIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      aria-hidden="true"
      {...props}
    >
      <path
        fill="currentColor"
        d="M128 0C57.317 0 0 57.317 0 128c0 56.554 36.676 104.535 87.535 121.46c6.397 1.185 8.746-2.777 8.746-6.158c0-3.052-.117-13.135-.174-23.83c-35.61 7.742-43.124-15.103-43.124-15.103c-5.823-14.795-14.213-18.73-14.213-18.73c-11.613-7.944.876-7.78.876-7.78c12.853.902 19.621 13.19 19.621 13.19c11.417 19.568 29.945 13.911 37.249 10.64c1.149-8.272 4.466-13.92 8.127-17.116c-28.431-3.236-58.318-14.212-58.318-63.258c0-13.975 5-25.394 13.188-34.358c-1.329-3.224-5.71-16.242 1.24-33.874c0 0 10.749-3.44 35.21 13.121c10.21-2.836 21.16-4.258 32.038-4.307c10.878.049 21.837 1.47 32.066 4.307c24.431-16.56 35.165-13.12 35.165-13.12c6.967 17.63 2.584 30.65 1.255 33.873c8.207 8.964 13.173 20.383 13.173 34.358c0 49.163-29.944 59.988-58.447 63.157c4.591 3.972 8.682 11.762 8.682 23.704c0 17.126-.148 30.91-.148 35.126c0 3.407 2.304 7.398 8.792 6.14C219.37 232.5 256 184.537 256 128C256 57.317 198.683 0 128 0"
      />
    </svg>
  );
}

export default function Login(props: Readonly<LoginBlock>) {
  const [t, tr] = useScopedT(login14Namespace);
  const titleId = `${props.id}-title`;
  const emailId = `${props.id}-email`;
  const googleHref = props.googleHref ?? "#";
  const githubHref = props.githubHref ?? "#";
  const signupHref = props.signupHref ?? "#";
  const homeHref = props.homeHref ?? "/";
  const title = tr(props.titleKey, "title");
  const description = tr(props.descriptionKey, "description");

  return (
    <section
      aria-labelledby={titleId}
      className="bg-background flex min-h-dvh px-4 py-16 md:py-24"
    >
      <div className="bg-muted m-auto w-full max-w-sm rounded-2xl border p-8">
        <div>
          <Link
            href={homeHref as Parameters<typeof Link>[0]["href"]}
            aria-label={t("homeAriaLabel")}
          >
            <Logo className="h-6 w-fit" />
          </Link>
          <h1 id={titleId} className="mt-6 text-2xl font-medium">
            {title}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">{description}</p>
        </div>

        <form action="#" method="post" className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor={emailId} className="text-sm">
              {t("emailLabel")}
            </Label>
            <Input
              type="email"
              id={emailId}
              name="email"
              autoComplete="email"
              placeholder={t("emailPlaceholder")}
              className="bg-background"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            {t("submit")}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <hr className="flex-1" />
          <span className="text-muted-foreground text-xs">{t("separator")}</span>
          <hr className="flex-1" />
        </div>

        <div className="space-y-2">
          <Button variant="outline" className="w-full" asChild>
            <a href={googleHref}>
              <GoogleIcon className="size-4" />
              <span>{t("googleCta")}</span>
            </a>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <a href={githubHref}>
              <GithubIcon className="size-4" />
              <span>{t("githubCta")}</span>
            </a>
          </Button>
        </div>

        <p className="text-muted-foreground mt-8 text-center text-sm">
          {t("signupPrompt")}{" "}
          <Link
            href={signupHref as Parameters<typeof Link>[0]["href"]}
            className="text-primary font-medium hover:underline"
          >
            {t("signupCta")}
          </Link>
        </p>
      </div>
    </section>
  );
}
