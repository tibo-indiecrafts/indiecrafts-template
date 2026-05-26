import { Link } from "@/i18n/routing";
import { Logo } from "@/components/layouts/_shared/logo";
import { Button } from "@/components/ui-primitives/button";
import { Input } from "@/components/ui-primitives/input";
import { Label } from "@/components/ui-primitives/label";
import { useScopedT } from "@/components/_lib/scoped-t";
import { forgotPassword05Namespace } from "./config";
import type { ForgotPasswordBlock } from "./schema";

export default function ForgotPassword(props: Readonly<ForgotPasswordBlock>) {
  const [t, tr] = useScopedT(forgotPassword05Namespace);
  const titleId = `${props.id}-title`;
  const emailId = `${props.id}-email`;
  const signinHref = props.signinHref ?? "#";
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

        <p className="text-muted-foreground mt-8 text-center text-sm">
          {t("signinPrompt")}{" "}
          <Link
            href={signinHref as Parameters<typeof Link>[0]["href"]}
            className="text-primary font-medium hover:underline"
          >
            {t("signinCta")}
          </Link>
        </p>
      </div>
    </section>
  );
}
