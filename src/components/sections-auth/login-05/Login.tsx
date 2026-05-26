import { Link } from "@/i18n/routing";
import { LogoIcon } from "@/components/layouts/_shared/logo";
import { Button } from "@/components/ui-primitives/button";
import { Card, CardContent } from "@/components/ui-primitives/card";
import { Checkbox } from "@/components/ui-primitives/checkbox";
import { Input } from "@/components/ui-primitives/input";
import { Label } from "@/components/ui-primitives/label";
import { useScopedT } from "@/components/_lib/scoped-t";
import { login05Namespace } from "./config";
import type { LoginBlock } from "./schema";

export default function Login(props: Readonly<LoginBlock>) {
  const [t, tr] = useScopedT(login05Namespace);
  const titleId = `${props.id}-title`;
  const title = tr(props.titleKey, "title");
  const nameId = `${props.id}-name`;
  const emailId = `${props.id}-email`;
  const passwordId = `${props.id}-password`;
  const confirmId = `${props.id}-confirm-password`;
  const newsletterId = `${props.id}-newsletter`;
  const signinHref = props.signinHref ?? "#";
  const termsHref = props.termsHref ?? "#";
  const privacyHref = props.privacyHref ?? "#";

  return (
    <section
      aria-labelledby={titleId}
      className="flex min-h-dvh items-center justify-center"
    >
      <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <LogoIcon className="text-foreground mx-auto h-10 w-10" />
          <h3
            id={titleId}
            className="text-foreground mt-2 text-center text-lg font-bold text-balance"
          >
            {title}
          </h3>
        </div>

        <Card className="mt-4 shadow-2xs sm:mx-auto sm:w-full sm:max-w-md">
          <CardContent>
            <form action="#" method="post" className="space-y-4">
              <div>
                <Label htmlFor={nameId} className="text-foreground text-sm font-medium">
                  {t("nameLabel")}
                </Label>
                <Input
                  type="text"
                  id={nameId}
                  name="name"
                  autoComplete="name"
                  placeholder={t("namePlaceholder")}
                  className="mt-2"
                  required
                />
              </div>

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
                <Label
                  htmlFor={passwordId}
                  className="text-foreground text-sm font-medium"
                >
                  {t("passwordLabel")}
                </Label>
                <Input
                  type="password"
                  id={passwordId}
                  name="password"
                  autoComplete="new-password"
                  placeholder={t("passwordPlaceholder")}
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label
                  htmlFor={confirmId}
                  className="text-foreground text-sm font-medium"
                >
                  {t("confirmLabel")}
                </Label>
                <Input
                  type="password"
                  id={confirmId}
                  name="confirm-password"
                  autoComplete="new-password"
                  placeholder={t("confirmPlaceholder")}
                  className="mt-2"
                  required
                />
              </div>

              <div className="mt-2 flex items-start">
                <div className="flex h-6 items-center">
                  <Checkbox id={newsletterId} name="newsletter" className="size-4" />
                </div>
                <Label
                  htmlFor={newsletterId}
                  className="text-muted-foreground ml-3 text-sm leading-6"
                >
                  {t("newsletter")}
                </Label>
              </div>

              <Button type="submit" className="mt-4 w-full py-2 font-medium">
                {t("submit")}
              </Button>

              <p className="text-muted-foreground text-center text-xs text-pretty">
                {t.rich("legal", {
                  terms: (chunks) => (
                    <Link
                      href={termsHref as Parameters<typeof Link>[0]["href"]}
                      className="text-primary hover:text-primary/90 capitalize"
                    >
                      {chunks}
                    </Link>
                  ),
                  privacy: (chunks) => (
                    <Link
                      href={privacyHref as Parameters<typeof Link>[0]["href"]}
                      className="text-primary hover:text-primary/90 capitalize"
                    >
                      {chunks}
                    </Link>
                  ),
                })}
              </p>
            </form>
          </CardContent>
        </Card>

        <p className="text-muted-foreground mt-6 text-center text-sm text-pretty">
          {t("signinPrompt")}{" "}
          <Link
            href={signinHref as Parameters<typeof Link>[0]["href"]}
            className="text-primary hover:text-primary/90 font-medium"
          >
            {t("signinCta")}
          </Link>
        </p>
      </div>
    </section>
  );
}
