"use client";

import { useState } from "react";
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
import { useScopedT } from "@/components/_lib/scoped-t";
import { formLayout04Plans, formLayout04Namespace } from "./config";
import type { FormLayoutBlock } from "./schema";

export default function FormLayout(props: Readonly<FormLayoutBlock>) {
  const [t, tr] = useScopedT(formLayout04Namespace);
  const plans = props.plans ?? formLayout04Plans;
  const [selectedId, setSelectedId] = useState(plans[0]?.id ?? "");
  const titleId = `${props.id}-title`;
  const firstNameId = `${props.id}-first-name`;
  const lastNameId = `${props.id}-last-name`;
  const emailId = `${props.id}-email`;
  const companyId = `${props.id}-company`;
  const sizeId = `${props.id}-size`;
  const packageHeadingId = `${props.id}-package-label`;

  return (
    <section aria-labelledby={titleId} className="flex items-center justify-center p-10">
      <div className="sm:mx-auto sm:max-w-2xl">
        <h3 id={titleId} className="text-foreground text-lg font-semibold text-balance">
          {tr(props.titleKey, "title")}
        </h3>
        <p className="text-muted-foreground mt-1 text-sm leading-6 text-pretty">
          {tr(props.descriptionKey, "description")}
        </p>
        <form action="#" method="post" className="mt-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
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
                  required
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
                <FieldLabel htmlFor={emailId}>
                  {t("emailLabel")}
                  <span className="text-red-500">{t("required")}</span>
                </FieldLabel>
                <Input
                  type="email"
                  id={emailId}
                  name="email"
                  autoComplete="email"
                  required
                  placeholder={t("emailPlaceholder")}
                />
              </Field>
            </div>
            <div className="col-span-full sm:col-span-3">
              <Field className="gap-2">
                <FieldLabel htmlFor={companyId}>{t("companyLabel")}</FieldLabel>
                <Input
                  type="text"
                  id={companyId}
                  name="company"
                  autoComplete="organization"
                  placeholder={t("companyPlaceholder")}
                />
              </Field>
            </div>
            <div className="col-span-full sm:col-span-3">
              <Field className="gap-2">
                <FieldLabel htmlFor={sizeId}>{t("sizeLabel")}</FieldLabel>
                <Select>
                  <SelectTrigger id={sizeId} name="size">
                    <SelectValue placeholder={t("sizePlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-9">{t("sizeSmall")}</SelectItem>
                    <SelectItem value="10-50">{t("sizeMedium")}</SelectItem>
                    <SelectItem value="50-250">{t("sizeLarge")}</SelectItem>
                    <SelectItem value="250+">{t("sizeXlarge")}</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Separator className="col-span-full my-4" />
            <div className="col-span-full">
              <FieldLabel
                id={packageHeadingId}
                className="text-foreground mb-4 block font-semibold"
              >
                {t("packageLabel")}
              </FieldLabel>

              <RadioGroup
                aria-labelledby={packageHeadingId}
                className="grid grid-cols-1 gap-5 sm:grid-cols-3"
                value={selectedId}
                onValueChange={setSelectedId}
              >
                {plans.map((plan) => {
                  const planRadioId = `${props.id}-plan-${plan.id}`;
                  return (
                    <div
                      key={plan.id}
                      className="border-input has-data-[state=checked]:border-ring relative flex flex-col gap-2 rounded-md border p-4 shadow-xs outline-none"
                    >
                      <div className="flex justify-between">
                        <RadioGroupItem
                          id={planRadioId}
                          value={plan.id}
                          className="order-1 after:absolute after:inset-0"
                        />
                        <FieldLabel
                          htmlFor={planRadioId}
                          className="text-foreground block text-sm font-medium"
                        >
                          {t(`plans.${plan.id}.title`)}
                        </FieldLabel>
                      </div>
                      <div className="flex h-full flex-col justify-between">
                        <p className="text-muted-foreground mt-1 text-sm text-pretty">
                          {t(`plans.${plan.id}.description`)}
                        </p>
                        <span className="text-foreground mt-4 block text-sm font-medium">
                          {t(`plans.${plan.id}.users`)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </RadioGroup>

              <FieldDescription className="mt-2!">
                <sup>1</sup> {t("footnoteOne")}
              </FieldDescription>
              <FieldDescription className="mt-1">
                <sup>2</sup> {t("footnoteTwo")}
              </FieldDescription>
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
