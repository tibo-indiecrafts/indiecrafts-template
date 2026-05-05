import { Button } from "@/components/ui-primitives/button";
import { Field, FieldLabel } from "@/components/ui-primitives/field";
import { Input } from "@/components/ui-primitives/input";
import { Separator } from "@/components/ui-primitives/separator";
import { useScopedT } from "@/i18n/scoped-t";
import { formLayout01Namespace } from "./config";
import type { FormLayoutBlock } from "./schema";

/**
 * Single-card register-to-workspace form — name + email + address
 * fields + cancel/submit footer. Sourced from `@blocks-so/form-layout-01`.
 */
export default function FormLayout(props: Readonly<FormLayoutBlock>) {
  const [t, tr] = useScopedT(formLayout01Namespace);
  const titleId = `${props.id}-title`;
  const firstNameId = `${props.id}-first-name`;
  const lastNameId = `${props.id}-last-name`;
  const emailId = `${props.id}-email`;
  const addressId = `${props.id}-address`;
  const cityId = `${props.id}-city`;
  const stateId = `${props.id}-state`;
  const postalId = `${props.id}-postal`;

  return (
    <section aria-labelledby={titleId} className="flex items-center justify-center p-10">
      <div className="sm:mx-auto sm:max-w-2xl">
        <h3 id={titleId} className="text-foreground text-2xl font-semibold text-balance">
          {tr(props.titleKey, "title")}
        </h3>
        <p className="text-muted-foreground mt-1 text-sm text-pretty">
          {tr(props.descriptionKey, "description")}
        </p>
        <form action="#" method="post" className="mt-8">
          <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
            <div className="col-span-full sm:col-span-3">
              <Field className="gap-2">
                <FieldLabel htmlFor={firstNameId}>
                  {t("firstNameLabel")}
                  <span className="text-red-500">{t("required")}</span>
                </FieldLabel>
                <Input
                  type="text"
                  id={firstNameId}
                  name="first-name"
                  autoComplete="given-name"
                  placeholder={t("firstNamePlaceholder")}
                  required
                />
              </Field>
            </div>
            <div className="col-span-full sm:col-span-3">
              <Field className="gap-2">
                <FieldLabel htmlFor={lastNameId}>
                  {t("lastNameLabel")}
                  <span className="text-red-500">{t("required")}</span>
                </FieldLabel>
                <Input
                  type="text"
                  id={lastNameId}
                  name="last-name"
                  autoComplete="family-name"
                  placeholder={t("lastNamePlaceholder")}
                  required
                />
              </Field>
            </div>
            <div className="col-span-full">
              <Field className="gap-2">
                <FieldLabel htmlFor={emailId}>
                  {t("emailLabel")}
                  <span className="text-red-500">{t("required")}</span>
                </FieldLabel>
                <Input
                  type="email"
                  id={emailId}
                  name="email"
                  autoComplete="email"
                  placeholder={t("emailPlaceholder")}
                  required
                />
              </Field>
            </div>
            <div className="col-span-full">
              <Field className="gap-2">
                <FieldLabel htmlFor={addressId}>{t("addressLabel")}</FieldLabel>
                <Input
                  type="text"
                  id={addressId}
                  name="address"
                  autoComplete="street-address"
                  placeholder={t("addressPlaceholder")}
                />
              </Field>
            </div>
            <div className="col-span-full sm:col-span-2">
              <Field className="gap-2">
                <FieldLabel htmlFor={cityId}>{t("cityLabel")}</FieldLabel>
                <Input
                  type="text"
                  id={cityId}
                  name="city"
                  autoComplete="address-level2"
                  placeholder={t("cityPlaceholder")}
                />
              </Field>
            </div>
            <div className="col-span-full sm:col-span-2">
              <Field className="gap-2">
                <FieldLabel htmlFor={stateId}>{t("stateLabel")}</FieldLabel>
                <Input
                  type="text"
                  id={stateId}
                  name="state"
                  autoComplete="address-level1"
                  placeholder={t("statePlaceholder")}
                />
              </Field>
            </div>
            <div className="col-span-full sm:col-span-2">
              <Field className="gap-2">
                <FieldLabel htmlFor={postalId}>{t("postalCodeLabel")}</FieldLabel>
                <Input
                  id={postalId}
                  name="postal-code"
                  autoComplete="postal-code"
                  placeholder={t("postalCodePlaceholder")}
                />
              </Field>
            </div>
          </div>
          <Separator className="my-6" />
          <div className="flex items-center justify-end space-x-4">
            <Button type="button" variant="outline" className="whitespace-nowrap">
              {t("cancel")}
            </Button>
            <Button type="submit" className="whitespace-nowrap">
              {t("submit")}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
