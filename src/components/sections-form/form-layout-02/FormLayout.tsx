import { Button } from "@/components/ui-primitives/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui-primitives/field";
import { Input } from "@/components/ui-primitives/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui-primitives/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui-primitives/select";
import { Separator } from "@/components/ui-primitives/separator";
import { Textarea } from "@/components/ui-primitives/textarea";
import { useScopedT } from "@/i18n/scoped-t";
import { formLayout02Namespace } from "./config";
import type { FormLayoutBlock } from "./schema";

export default function FormLayout(props: Readonly<FormLayoutBlock>) {
  const [t, tr] = useScopedT(formLayout02Namespace);
  const personalTitleId = `${props.id}-personal-title`;
  const workspaceTitleId = `${props.id}-workspace-title`;
  const notifTitleId = `${props.id}-notifications-title`;
  const firstNameId = `${props.id}-first-name`;
  const lastNameId = `${props.id}-last-name`;
  const emailId = `${props.id}-email`;
  const birthYearId = `${props.id}-birth-year`;
  const roleId = `${props.id}-role`;
  const workspaceNameId = `${props.id}-workspace-name`;
  const visibilityId = `${props.id}-visibility`;
  const workspaceDescId = `${props.id}-workspace-description`;
  const newsletterDescId = `${props.id}-newsletter-help`;

  return (
    <section
      aria-labelledby={personalTitleId}
      className="flex items-center justify-center p-10"
    >
      <form>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <h2
              id={personalTitleId}
              className="text-foreground font-semibold text-balance"
            >
              {tr(props.personalTitleKey, "personalTitle")}
            </h2>
            <p className="text-muted-foreground mt-1 text-sm leading-6 text-pretty">
              {tr(props.personalDescriptionKey, "personalDescription")}
            </p>
          </div>
          <div className="sm:max-w-3xl md:col-span-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
              <div className="col-span-full sm:col-span-3">
                <Field className="gap-2">
                  <FieldLabel htmlFor={firstNameId}>{t("firstNameLabel")}</FieldLabel>
                  <Input
                    type="text"
                    id={firstNameId}
                    name="first-name"
                    autoComplete="given-name"
                    placeholder={t("firstNamePlaceholder")}
                  />
                </Field>
              </div>
              <div className="col-span-full sm:col-span-3">
                <Field className="gap-2">
                  <FieldLabel htmlFor={lastNameId}>{t("lastNameLabel")}</FieldLabel>
                  <Input
                    type="text"
                    id={lastNameId}
                    name="last-name"
                    autoComplete="family-name"
                    placeholder={t("lastNamePlaceholder")}
                  />
                </Field>
              </div>
              <div className="col-span-full">
                <Field className="gap-2">
                  <FieldLabel htmlFor={emailId}>{t("emailLabel")}</FieldLabel>
                  <Input
                    type="email"
                    id={emailId}
                    name="email"
                    autoComplete="email"
                    placeholder={t("emailPlaceholder")}
                  />
                </Field>
              </div>
              <div className="col-span-full sm:col-span-3">
                <Field className="gap-2">
                  <FieldLabel htmlFor={birthYearId}>{t("birthYearLabel")}</FieldLabel>
                  <Input
                    type="number"
                    id={birthYearId}
                    name="year"
                    placeholder={t("birthYearPlaceholder")}
                  />
                </Field>
              </div>
              <div className="col-span-full sm:col-span-3">
                <Field className="gap-2">
                  <FieldLabel htmlFor={roleId}>{t("roleLabel")}</FieldLabel>
                  <Input
                    type="text"
                    id={roleId}
                    name="role"
                    placeholder={t("rolePlaceholder")}
                    disabled
                  />
                  <FieldDescription>{t("roleDescription")}</FieldDescription>
                </Field>
              </div>
            </div>
          </div>
        </div>
        <Separator className="my-8" />
        <div
          aria-labelledby={workspaceTitleId}
          role="group"
          className="grid grid-cols-1 gap-10 md:grid-cols-3"
        >
          <div>
            <h2
              id={workspaceTitleId}
              className="text-foreground font-semibold text-balance"
            >
              {tr(props.workspaceTitleKey, "workspaceTitle")}
            </h2>
            <p className="text-muted-foreground mt-1 text-sm leading-6 text-pretty">
              {tr(props.workspaceDescriptionKey, "workspaceDescription")}
            </p>
          </div>
          <div className="sm:max-w-3xl md:col-span-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
              <div className="col-span-full sm:col-span-3">
                <Field className="gap-2">
                  <FieldLabel htmlFor={workspaceNameId}>
                    {t("workspaceNameLabel")}
                  </FieldLabel>
                  <Input
                    type="text"
                    id={workspaceNameId}
                    name="workspace-name"
                    placeholder={t("workspaceNamePlaceholder")}
                  />
                </Field>
              </div>
              <div className="col-span-full sm:col-span-3">
                <Field className="gap-2">
                  <FieldLabel htmlFor={visibilityId}>{t("visibilityLabel")}</FieldLabel>
                  <Select name="visibility" defaultValue="private">
                    <SelectTrigger id={visibilityId}>
                      <SelectValue placeholder={t("visibilityPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">{t("visibilityPublic")}</SelectItem>
                      <SelectItem value="private">{t("visibilityPrivate")}</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <div className="col-span-full">
                <Field className="gap-2">
                  <FieldLabel htmlFor={workspaceDescId}>
                    {t("workspaceDescriptionLabel")}
                  </FieldLabel>
                  <Textarea id={workspaceDescId} name="workspace-description" rows={4} />
                  <FieldDescription>{t("workspaceDescriptionHelp")}</FieldDescription>
                </Field>
              </div>
            </div>
          </div>
        </div>
        <Separator className="my-8" />
        <div
          aria-labelledby={notifTitleId}
          role="group"
          className="grid grid-cols-1 gap-10 md:grid-cols-3"
        >
          <div>
            <h2 id={notifTitleId} className="text-foreground font-semibold text-balance">
              {tr(props.notificationsTitleKey, "notificationsTitle")}
            </h2>
            <p className="text-muted-foreground mt-1 text-sm leading-6 text-pretty">
              {tr(props.notificationsDescriptionKey, "notificationsDescription")}
            </p>
          </div>
          <div className="sm:max-w-3xl md:col-span-2">
            <fieldset>
              <legend className="text-foreground text-sm font-medium">
                {t("newsletterLegend")}
              </legend>
              <FieldDescription id={newsletterDescId} className="mt-2 leading-6">
                {t("newsletterHelp")}
              </FieldDescription>
              <RadioGroup defaultValue="never" className="mt-6">
                <div className="flex items-center gap-x-3">
                  <RadioGroupItem
                    id={`${props.id}-every-week`}
                    value="every-week"
                    aria-describedby={newsletterDescId}
                  />
                  <FieldLabel htmlFor={`${props.id}-every-week`} className="font-normal">
                    {t("everyWeek")}
                  </FieldLabel>
                </div>
                <div className="flex items-center gap-x-3">
                  <RadioGroupItem
                    id={`${props.id}-every-month`}
                    value="every-month"
                    aria-describedby={newsletterDescId}
                  />
                  <FieldLabel htmlFor={`${props.id}-every-month`} className="font-normal">
                    {t("everyMonth")}
                  </FieldLabel>
                </div>
                <div className="flex items-center gap-x-3">
                  <RadioGroupItem
                    id={`${props.id}-never`}
                    value="never"
                    aria-describedby={newsletterDescId}
                  />
                  <FieldLabel htmlFor={`${props.id}-never`} className="font-normal">
                    {t("never")}
                  </FieldLabel>
                </div>
              </RadioGroup>
            </fieldset>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="flex items-center justify-end space-x-4">
          <Button type="button" variant="outline" className="whitespace-nowrap">
            {t("cancel")}
          </Button>
          <Button type="submit" className="whitespace-nowrap">
            {t("submit")}
          </Button>
        </div>
      </form>
    </section>
  );
}
