import { Button } from "@/components/ui-primitives/button";
import { Input } from "@/components/ui-primitives/input";
import { Label } from "@/components/ui-primitives/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui-primitives/select";
import { Textarea } from "@/components/ui-primitives/textarea";
import { Link } from "@/i18n/routing";
import { useScopedT } from "@/components/_lib/scoped-t";
import { enterpriseFormNamespace, enterpriseFormPrivacyHref } from "./config";

export const Enterprise = () => {
  const [t] = useScopedT(enterpriseFormNamespace);

  return (
    <div className="relative">
      <div aria-hidden className="absolute -inset-6 mask-b-from-50% px-6 pt-4">
        <div className="bg-card/75 ring-border size-full rounded-t-2xl shadow-xl ring-1 shadow-black/10" />
      </div>
      <form action="" className="relative space-y-6 p-8 *:space-y-3 **:[&>label]:block">
        <div className="grid gap-3 *:space-y-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="enterprise-name">{t("fullName")}</Label>
            <Input type="text" id="enterprise-name" required />
          </div>
          <div>
            <Label htmlFor="enterprise-email">{t("workEmail")}</Label>
            <Input type="email" id="enterprise-email" required />
          </div>
        </div>

        <div>
          <Label htmlFor="enterprise-country">{t("country")}</Label>
          <Select>
            <SelectTrigger
              id="enterprise-country"
              className="not-focus:ring-foreground/10! dark:bg-foreground/5 bg-card border-transparent shadow-sm ring-1"
            >
              <SelectValue placeholder={t("countryPlaceholder")} />
            </SelectTrigger>
            <SelectContent className="ring-border border-transparent ring-1">
              <SelectItem value="dr-congo">{t("options.country.drCongo")}</SelectItem>
              <SelectItem value="us">{t("options.country.us")}</SelectItem>
              <SelectItem value="fr">{t("options.country.fr")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="enterprise-website">{t("website")}</Label>
          <div className="relative">
            <Input
              type="url"
              id="enterprise-website"
              className="pl-16"
              placeholder={t("websitePlaceholder")}
            />
            <span className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm">
              https://
            </span>
          </div>
        </div>

        <div>
          <Label htmlFor="enterprise-job">{t("jobFunction")}</Label>
          <Select>
            <SelectTrigger
              id="enterprise-job"
              className="not-focus:ring-foreground/10! bg-card dark:bg-foreground/5 border-transparent shadow-sm ring-1"
            >
              <SelectValue placeholder={t("jobFunctionPlaceholder")} />
            </SelectTrigger>
            <SelectContent className="ring-border border-transparent ring-1">
              <SelectItem value="finance">{t("options.job.finance")}</SelectItem>
              <SelectItem value="education">{t("options.job.education")}</SelectItem>
              <SelectItem value="legal">{t("options.job.legal")}</SelectItem>
              <SelectItem value="more">{t("options.job.more")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="enterprise-msg">{t("message")}</Label>
          <Textarea id="enterprise-msg" rows={3} />
        </div>

        <div className="grid gap-6 sm:grid-cols-[1fr_auto]">
          <p className="text-muted-foreground text-sm">
            {t.rich("consent", {
              link: (chunks) => (
                <Link
                  href={enterpriseFormPrivacyHref as Parameters<typeof Link>[0]["href"]}
                  className="text-primary underline"
                >
                  {chunks}
                </Link>
              ),
            })}
          </p>
          <Button className="max-sm:row-start-1">{t("submit")}</Button>
        </div>
      </form>
    </div>
  );
};
