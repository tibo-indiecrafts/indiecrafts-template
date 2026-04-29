"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui-primitives/label";
import { SidebarInput } from "@/components/ui-primitives/sidebar";
import { searchFormNamespace } from "./config";

export type SearchFormProps = React.ComponentProps<"form"> & {
  /** Id for the input — defaults to `search`. */
  inputId?: string;
};

export function SearchForm({ inputId = "search", ...props }: SearchFormProps) {
  const t = useTranslations(searchFormNamespace);

  return (
    <form {...props}>
      <div className="relative">
        <Label htmlFor={inputId} className="sr-only">
          {t("label")}
        </Label>
        <SidebarInput id={inputId} placeholder={t("placeholder")} className="h-8 pl-7" />
        <Search
          className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none"
          aria-hidden="true"
        />
      </div>
    </form>
  );
}
