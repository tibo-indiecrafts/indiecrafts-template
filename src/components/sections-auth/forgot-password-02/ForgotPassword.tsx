import { Link } from "@/i18n/routing";
import { LogoIcon } from "@/components/layouts/_shared/logo";
import { Button } from "@/components/ui-primitives/button";
import { Input } from "@/components/ui-primitives/input";
import { Label } from "@/components/ui-primitives/label";
import { useScopedT } from "@/components/_lib/scoped-t";
import { forgotPassword02Namespace } from "./config";
import type { ForgotPasswordBlock } from "./schema";

export default function ForgotPassword(props: Readonly<ForgotPasswordBlock>) {
  const [t, tr] = useScopedT(forgotPassword02Namespace);
  const titleId = `${props.id}-title`;
  const emailId = `${props.id}-email`;
  const signinHref = props.signinHref ?? "#";
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
            <p className="text-sm">{description}</p>
          </div>

          <div className="mt-6 space-y-6">
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
              />
            </div>

            <Button type="submit" className="w-full">
              {t("submit")}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">{t("helper")}</p>
          </div>
        </div>

        <div className="p-3">
          <p className="text-accent-foreground text-center text-sm">
            {t("signinPrompt")}
            <Button asChild variant="link" className="px-2">
              <Link href={signinHref as Parameters<typeof Link>[0]["href"]}>
                {t("signinCta")}
              </Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  );
}
