"use client";

import { useId, useState } from "react";
import { Input } from "@indiecrafts/ui/web/input";
import { cn } from "@indiecrafts/utils/cn";

/**
 * A lightweight international phone field — a country dial-code `<select>` + a
 * national-number `<input type="tel">`. Emits an E.164-ish string
 * (`+33612345678`) via `onChange`. Validation is the caller's job (use
 * `isPhone`/`formatPhone` from `@indiecrafts/format/validate`); for strict
 * per-country rules, swap in `libphonenumber-js` there.
 *
 * Uncontrolled national part (keeps parsing simple) — pass `defaultCountry` /
 * `defaultNational` for initial values; read changes via `onChange`.
 */
export type PhoneCountry = { code: string; name: string; dial: string; flag: string };

/** A pragmatic, editable default set — EU + a few common English-speaking markets. */
export const PHONE_COUNTRIES: PhoneCountry[] = [
  { code: "FR", name: "France", dial: "33", flag: "🇫🇷" },
  { code: "BE", name: "Belgique", dial: "32", flag: "🇧🇪" },
  { code: "CH", name: "Suisse", dial: "41", flag: "🇨🇭" },
  { code: "LU", name: "Luxembourg", dial: "352", flag: "🇱🇺" },
  { code: "DE", name: "Deutschland", dial: "49", flag: "🇩🇪" },
  { code: "ES", name: "España", dial: "34", flag: "🇪🇸" },
  { code: "IT", name: "Italia", dial: "39", flag: "🇮🇹" },
  { code: "NL", name: "Nederland", dial: "31", flag: "🇳🇱" },
  { code: "PT", name: "Portugal", dial: "351", flag: "🇵🇹" },
  { code: "IE", name: "Ireland", dial: "353", flag: "🇮🇪" },
  { code: "GB", name: "United Kingdom", dial: "44", flag: "🇬🇧" },
  { code: "US", name: "United States", dial: "1", flag: "🇺🇸" },
  { code: "CA", name: "Canada", dial: "1", flag: "🇨🇦" },
];

export type PhoneInputProps = {
  onChange?: (value: string) => void;
  defaultCountry?: string;
  defaultNational?: string;
  countries?: PhoneCountry[];
  name?: string;
  id?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

export function PhoneInput({
  onChange,
  defaultCountry = "FR",
  defaultNational = "",
  countries = PHONE_COUNTRIES,
  name,
  id,
  placeholder = "6 12 34 56 78",
  required,
  disabled,
  className,
}: PhoneInputProps) {
  const uid = useId();
  const inputId = id ?? uid;
  const [country, setCountry] = useState(defaultCountry);
  const [national, setNational] = useState(defaultNational);

  const emit = (code: string, nat: string) => {
    const dial = countries.find((c) => c.code === code)?.dial ?? "";
    const digits = nat.replace(/\D/g, "");
    onChange?.(digits ? `+${dial}${digits}` : "");
  };

  return (
    <div className={cn("flex gap-2", className)}>
      <label htmlFor={`${inputId}-country`} className="sr-only">
        Country code
      </label>
      <select
        id={`${inputId}-country`}
        value={country}
        disabled={disabled}
        onChange={(e) => {
          setCountry(e.target.value);
          emit(e.target.value, national);
        }}
        className="border-input bg-background focus-visible:ring-ring h-9 shrink-0 rounded-md border px-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
      >
        {countries.map((c) => (
          <option key={c.code} value={c.code}>
            {c.flag} +{c.dial}
          </option>
        ))}
      </select>
      <Input
        id={inputId}
        name={name}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        value={national}
        onChange={(e) => {
          setNational(e.target.value);
          emit(country, e.target.value);
        }}
        className="flex-1"
      />
    </div>
  );
}
