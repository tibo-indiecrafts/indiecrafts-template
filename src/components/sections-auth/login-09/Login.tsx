"use client";

import { BarChart, Code, Eye, EyeOff, User } from "lucide-react";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import { LogoIcon } from "@/components/layouts/_shared/logo";
import { Button } from "@/components/ui-primitives/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui-primitives/card";
import { Checkbox } from "@/components/ui-primitives/checkbox";
import { Input } from "@/components/ui-primitives/input";
import { Label } from "@/components/ui-primitives/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui-primitives/select";
import { useScopedT } from "@/components/_lib/scoped-t";
import { login09Namespace } from "./config";
import type { LoginBlock } from "./schema";

export default function Login(props: Readonly<LoginBlock>) {
  const [t, tr] = useScopedT(login09Namespace);
  const [showPassword, setShowPassword] = useState(false);
  const title = tr(props.titleKey, "title");
  const description = tr(props.descriptionKey, "description");
  const titleId = `${props.id}-title`;
  const roleId = `${props.id}-role`;
  const firstNameId = `${props.id}-first-name`;
  const lastNameId = `${props.id}-last-name`;
  const usernameId = `${props.id}-username`;
  const emailId = `${props.id}-email`;
  const passwordId = `${props.id}-password`;
  const termsId = `${props.id}-terms`;
  const signinHref = props.signinHref ?? "#";
  const termsHref = props.termsHref ?? "#";
  const conditionsHref = props.conditionsHref ?? "#";

  return (
    <section
      aria-labelledby={titleId}
      className="flex min-h-dvh items-center justify-center"
    >
      <div className="w-full max-w-md">
        <Card className="border-none pb-0 shadow-lg">
          <CardHeader className="flex flex-col items-center space-y-1.5 pt-6 pb-4">
            <LogoIcon className="h-12 w-12" />
            <div className="flex flex-col items-center space-y-0.5">
              <h2
                id={titleId}
                className="text-foreground text-2xl font-semibold text-balance"
              >
                {title}
              </h2>
              <p className="text-muted-foreground text-pretty">{description}</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 px-8">
            <form action="#" method="post" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor={roleId}>{t("roleLabel")}</Label>
                <Select defaultValue="designer" name="role">
                  <SelectTrigger
                    id={roleId}
                    className="[&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0"
                  >
                    <SelectValue placeholder={t("rolePlaceholder")} />
                  </SelectTrigger>
                  <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0">
                    <SelectItem value="designer">
                      <User size={16} aria-hidden="true" />
                      <span className="truncate">{t("roles.designer")}</span>
                    </SelectItem>
                    <SelectItem value="developer">
                      <Code size={16} aria-hidden="true" />
                      <span className="truncate">{t("roles.developer")}</span>
                    </SelectItem>
                    <SelectItem value="manager">
                      <BarChart size={16} aria-hidden="true" />
                      <span className="truncate">{t("roles.manager")}</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={firstNameId}>{t("firstNameLabel")}</Label>
                  <Input
                    id={firstNameId}
                    name="first-name"
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={lastNameId}>{t("lastNameLabel")}</Label>
                  <Input
                    id={lastNameId}
                    name="last-name"
                    autoComplete="family-name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={usernameId}>{t("usernameLabel")}</Label>
                <Input id={usernameId} name="username" autoComplete="username" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor={emailId}>{t("emailLabel")}</Label>
                <Input
                  id={emailId}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={passwordId}>{t("passwordLabel")}</Label>
                <div className="relative">
                  <Input
                    id={passwordId}
                    name="password"
                    autoComplete="new-password"
                    type={showPassword ? "text" : "password"}
                    className="pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground absolute top-0 right-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? t("hidePassword") : t("showPassword")}
                    aria-pressed={showPassword}
                    aria-controls={passwordId}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id={termsId} name="terms" required />
                <Label htmlFor={termsId} className="text-muted-foreground text-sm">
                  {t.rich("termsAgreement", {
                    terms: (chunks) => (
                      <Link
                        href={termsHref as Parameters<typeof Link>[0]["href"]}
                        className="text-primary hover:underline"
                      >
                        {chunks}
                      </Link>
                    ),
                    conditions: (chunks) => (
                      <Link
                        href={conditionsHref as Parameters<typeof Link>[0]["href"]}
                        className="text-primary hover:underline"
                      >
                        {chunks}
                      </Link>
                    ),
                  })}
                </Label>
              </div>

              <Button type="submit" className="bg-primary text-primary-foreground w-full">
                {t("submit")}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t py-4!">
            <p className="text-muted-foreground text-center text-sm text-pretty">
              {t("signinPrompt")}{" "}
              <Link
                href={signinHref as Parameters<typeof Link>[0]["href"]}
                className="text-primary hover:underline"
              >
                {t("signinCta")}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
