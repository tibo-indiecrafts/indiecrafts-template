"use client";

import { Check, CircleCheck, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui-primitives/badge";
import { Button } from "@/components/ui-primitives/button";
import { Card, CardContent } from "@/components/ui-primitives/card";
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
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { formLayout05Namespace, formLayout05Plans } from "./config";
import type { FormLayoutBlock } from "./schema";

/**
 * Design-workspace creation form — organization + workspace name +
 * region + plan-card RadioGroup, with a side panel listing plan
 * benefits. Sourced from `@blocks-so/form-layout-05`.
 */
export default function FormLayout(props: Readonly<FormLayoutBlock>) {
  const [t, tr] = useScopedT(formLayout05Namespace);
  const plans = props.plans ?? formLayout05Plans;
  const highlights = t.raw("highlights") as string[];
  const [selectedId, setSelectedId] = useState(plans[0]?.id ?? "");
  const titleId = `${props.id}-title`;
  const planLabelId = `${props.id}-plan-label`;
  const orgId = `${props.id}-organization`;
  const workspaceId = `${props.id}-workspace`;
  const regionId = `${props.id}-region`;
  const sideHref = props.sideHref ?? "/pricing";

  return (
    <section aria-labelledby={titleId} className="flex items-center justify-center p-10">
      <form className="sm:mx-auto sm:max-w-7xl">
        <h3 id={titleId} className="text-foreground text-xl font-semibold text-balance">
          {tr(props.titleKey, "title")}
        </h3>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="mt-6 lg:col-span-7">
            <div className="space-y-4 md:space-y-6">
              <div className="md:flex md:items-center md:space-x-4">
                <div className="md:w-1/4">
                  <Field className="gap-2">
                    <FieldLabel htmlFor={orgId}>{t("organizationLabel")}</FieldLabel>
                    <Select defaultValue="1">
                      <SelectTrigger id={orgId} name="organization" className="w-full">
                        <SelectValue placeholder={t("organizationPlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">{t("organization1")}</SelectItem>
                        <SelectItem value="2">{t("organization2")}</SelectItem>
                        <SelectItem value="3">{t("organization3")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
                <div className="mt-4 md:mt-0 md:w-3/4">
                  <Field className="gap-2">
                    <FieldLabel htmlFor={workspaceId}>{t("workspaceLabel")}</FieldLabel>
                    <Input id={workspaceId} name="workspace" />
                  </Field>
                </div>
              </div>
              <div>
                <Field className="gap-2">
                  <FieldLabel htmlFor={regionId}>{t("regionLabel")}</FieldLabel>
                  <Select defaultValue="iad1">
                    <SelectTrigger id={regionId} name="region">
                      <SelectValue placeholder={t("regionPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fra1">{t("regionFra1")}</SelectItem>
                      <SelectItem value="iad1">{t("regionIad1")}</SelectItem>
                      <SelectItem value="lhr1">{t("regionLhr1")}</SelectItem>
                      <SelectItem value="sfo1">{t("regionSfo1")}</SelectItem>
                      <SelectItem value="sin1">{t("regionSin1")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldDescription>{t("regionDescription")}</FieldDescription>
                </Field>
              </div>
            </div>
            <h4 id={planLabelId} className="mt-14 font-medium text-balance">
              {t("planTypeLabel")}
              <span className="text-red-500">{t("required")}</span>
            </h4>
            <RadioGroup
              aria-labelledby={planLabelId}
              value={selectedId}
              onValueChange={setSelectedId}
              className="mt-4 space-y-4"
            >
              {plans.map((plan) => {
                const planRadioId = `${props.id}-plan-${plan.id}`;
                const features = t.raw(`plans.${plan.id}.features`) as string[];
                return (
                  <div
                    key={plan.id}
                    className={cn(
                      "bg-background relative block rounded-md border transition",
                      selectedId === plan.id
                        ? "border-primary/20 ring-primary/20 ring-2"
                        : "border-border",
                    )}
                  >
                    <div className="flex items-start space-x-4 px-6 py-4">
                      <div className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center">
                        <RadioGroupItem value={plan.id} id={planRadioId} />
                      </div>
                      <div className="w-full">
                        <FieldLabel
                          htmlFor={planRadioId}
                          className="leading-6 text-pretty"
                        >
                          <span className="text-foreground font-semibold">
                            {t(`plans.${plan.id}.title`)}
                          </span>
                          {plan.isRecommended && (
                            <Badge variant="secondary" className="ml-2">
                              {t("recommended")}
                            </Badge>
                          )}
                        </FieldLabel>
                        <ul className="mt-2 space-y-1">
                          {features.map((feature, i) => (
                            <li
                              key={`${plan.id}-feature-${i}`}
                              className="flex items-center gap-2 text-sm"
                            >
                              <Check
                                className="text-muted-foreground h-4 w-4"
                                aria-hidden="true"
                              />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="border-border bg-muted flex items-center justify-between rounded-b-md border-t px-6 py-3">
                      <a
                        href={plan.href}
                        className="text-primary inline-flex items-center gap-1 text-sm hover:underline hover:underline-offset-4"
                      >
                        {t("learnMore")}
                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      </a>
                      <div>
                        <span className="text-foreground text-lg font-semibold">
                          {t(`plans.${plan.id}.price`)}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          {t("perMonth")}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </RadioGroup>
          </div>
          <div className="lg:col-span-5">
            <Card className="bg-muted shadow-none">
              <CardContent>
                <h4 className="text-foreground text-sm font-semibold text-balance">
                  {tr(props.sideTitleKey, "sideTitle")}
                </h4>
                <p className="text-muted-foreground mt-2 text-sm leading-6 text-pretty">
                  {tr(props.sideBodyKey, "sideBody")}
                </p>
                <ul className="mt-4 space-y-1">
                  {highlights.map((text, i) => (
                    <li
                      key={i}
                      className="text-foreground flex items-center space-x-2 py-1.5"
                    >
                      <CircleCheck className="text-primary h-5 w-5" aria-hidden="true" />
                      <span className="truncate text-sm">{text}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={sideHref}
                  className="text-primary mt-4 inline-flex items-center gap-1 text-sm"
                >
                  {t("learnMore")}
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
        <Separator className="my-10" />
        <div className="flex items-center justify-end space-x-4">
          <Button type="button" variant="ghost">
            {t("cancel")}
          </Button>
          <Button type="submit">{t("submit")}</Button>
        </div>
      </form>
    </section>
  );
}
