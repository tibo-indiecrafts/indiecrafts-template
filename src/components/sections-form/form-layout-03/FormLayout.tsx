import { Button } from "@/components/ui-primitives/button";
import { Checkbox } from "@/components/ui-primitives/checkbox";
import { Field, FieldDescription, FieldLabel } from "@/components/ui-primitives/field";
import { Input } from "@/components/ui-primitives/input";
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
import { formLayout03Namespace } from "./config";
import type { FormLayoutBlock } from "./schema";

/**
 * Three-stack settings form with two-fieldset checkbox notification
 * groups (team / usage). Sourced from `@blocks-so/form-layout-03`.
 */
export default function FormLayout(props: Readonly<FormLayoutBlock>) {
  const [t, tr] = useScopedT(formLayout03Namespace);
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
                {t("teamLegend")}
              </legend>
              <FieldDescription className="mt-1 leading-6">
                {t("teamHelp")}
              </FieldDescription>
              <div className="mt-2">
                <div className="flex items-center gap-x-3 py-1">
                  <Checkbox
                    id={`${props.id}-team-requests`}
                    name="team-requests"
                    defaultChecked
                  />
                  <FieldLabel
                    htmlFor={`${props.id}-team-requests`}
                    className="font-normal"
                  >
                    {t("teamRequests")}
                  </FieldLabel>
                </div>
                <div className="flex items-center gap-x-3 py-1">
                  <Checkbox
                    id={`${props.id}-team-activity`}
                    name="team-activity-digest"
                  />
                  <FieldLabel
                    htmlFor={`${props.id}-team-activity`}
                    className="font-normal"
                  >
                    {t("teamActivityDigest")}
                  </FieldLabel>
                </div>
              </div>
            </fieldset>
            <fieldset className="mt-6">
              <legend className="text-foreground text-sm font-medium">
                {t("usageLegend")}
              </legend>
              <FieldDescription className="mt-1 leading-6">
                {t("usageHelp")}
              </FieldDescription>
              <div className="mt-2">
                <div className="flex items-center gap-x-3 py-1">
                  <Checkbox id={`${props.id}-api`} name="api-requests" />
                  <FieldLabel htmlFor={`${props.id}-api`} className="font-normal">
                    {t("apiRequests")}
                  </FieldLabel>
                </div>
                <div className="flex items-center gap-x-3 py-1">
                  <Checkbox
                    id={`${props.id}-workspace-execution`}
                    name="workspace-execution"
                  />
                  <FieldLabel
                    htmlFor={`${props.id}-workspace-execution`}
                    className="font-normal"
                  >
                    {t("workspaceExecution")}
                  </FieldLabel>
                </div>
                <div className="flex items-center gap-x-3 py-1">
                  <Checkbox
                    id={`${props.id}-query-caching`}
                    name="query-caching"
                    defaultChecked
                  />
                  <FieldLabel
                    htmlFor={`${props.id}-query-caching`}
                    className="font-normal"
                  >
                    {t("queryCaching")}
                  </FieldLabel>
                </div>
                <div className="flex items-center gap-x-3 py-1">
                  <Checkbox id={`${props.id}-storage`} name="storage" defaultChecked />
                  <FieldLabel htmlFor={`${props.id}-storage`} className="font-normal">
                    {t("storage")}
                  </FieldLabel>
                </div>
              </div>
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
