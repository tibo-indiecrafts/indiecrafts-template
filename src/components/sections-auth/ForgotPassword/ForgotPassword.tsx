import Link from "next/link";
import { useTranslations } from "next-intl";
import { LogoIcon } from "@/components/layouts/_shared/Logo";
import { Button } from "@/components/ui-primitives/button";
import { Input } from "@/components/ui-primitives/input";
import { Label } from "@/components/ui-primitives/label";
import { forgotPasswordNamespace } from "./config";

export type ForgotPasswordProps = {
  brandHref?: string;
  loginHref?: string;
};

export default function ForgotPasswordPage({
  brandHref = "/",
  loginHref = "/login",
}: ForgotPasswordProps) {
  const t = useTranslations(forgotPasswordNamespace);

  return (
    <section className="bg-muted/40 flex min-h-screen px-4 py-16 md:py-32">
      <form className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md">
        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
          <div className="text-center">
            <Link
              href={brandHref}
              aria-label={t("brandHomeLabel")}
              className="mx-auto block w-fit"
            >
              <LogoIcon />
            </Link>
            <h1 className="mt-4 mb-1 text-xl font-semibold">{t("title")}</h1>
            <p className="text-sm">{t("subtitle")}</p>
          </div>

          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="forgot-email" className="block text-sm">
                {t("emailLabel")}
              </Label>
              <Input
                type="email"
                required
                name="email"
                id="forgot-email"
                placeholder={t("emailPlaceholder")}
              />
            </div>

            <Button className="w-full" type="submit">
              {t("submit")}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">{t("footerHint")}</p>
          </div>
        </div>

        <div className="p-3">
          <p className="text-center text-sm">
            {t("remembered")}
            <Button asChild variant="link" className="px-2">
              <Link href={loginHref}>{t("loginCta")}</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  );
}
