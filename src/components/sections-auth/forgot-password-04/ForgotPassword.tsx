import * as React from "react";
import { Link } from "@/i18n/routing";
import { Logo } from "@/components/layouts/_shared/logo";
import { Button } from "@/components/ui-primitives/button";
import { Input } from "@/components/ui-primitives/input";
import { Label } from "@/components/ui-primitives/label";
import { cn } from "@/lib/utils";
import { useScopedT } from "@/i18n/scoped-t";
import { forgotPassword04Namespace } from "./config";
import type { ForgotPasswordBlock } from "./schema";

const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("bg-card text-card-foreground rounded-xl border", className)}
    {...props}
  />
);

export default function ForgotPassword(props: Readonly<ForgotPasswordBlock>) {
  const [t, tr] = useScopedT(forgotPassword04Namespace);
  const titleId = `${props.id}-title`;
  const emailId = `${props.id}-email`;
  const signinHref = props.signinHref ?? "#";
  const homeHref = props.homeHref ?? "/";
  const title = tr(props.titleKey, "title");
  const description = tr(props.descriptionKey, "description");

  return (
    <section
      aria-labelledby={titleId}
      className="bg-background grid min-h-dvh grid-rows-[auto_1fr] px-4"
    >
      <div className="mx-auto w-full max-w-7xl border-b py-3">
        <Link
          href={homeHref as Parameters<typeof Link>[0]["href"]}
          aria-label={t("homeAriaLabel")}
          className="inline-block border-t-2 border-transparent py-3"
        >
          <Logo className="w-fit" />
        </Link>
      </div>

      <div className="m-auto w-full max-w-sm">
        <div className="text-center">
          <h1 id={titleId} className="text-4xl font-medium">
            {title}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">{description}</p>
        </div>
        <Card className="mt-6 p-8">
          <form action="#" method="post" className="space-y-5">
            <div className="space-y-3">
              <Label htmlFor={emailId} className="text-sm">
                {t("emailLabel")}
              </Label>
              <Input
                type="email"
                id={emailId}
                name="email"
                autoComplete="email"
                placeholder={t("emailPlaceholder")}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              {t("submit")}
            </Button>
          </form>
        </Card>

        <p className="text-muted-foreground mt-6 text-center text-sm">
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
