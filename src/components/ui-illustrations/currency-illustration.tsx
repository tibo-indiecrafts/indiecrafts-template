import { Bitcoin, DollarSign, Euro, Signature, type LucideIcon } from "lucide-react";

/**
 * Three-card currency mock — BTC / USD / EURO cards fanned out with a
 * `-rotate-12` tilt and `-space-x-4` overlap. Each card shows the
 * currency icon + ticker, two ledger-row blocks of skeleton dashes,
 * and a trailing signature glyph. Tinted gradient overlay per
 * currency (blue / green / red). Pure decoration; mock copy stays
 * hardcoded per the illustration rule. Sourced from
 * `@tailark-pro/bento-1` (upstream `CurrencyIllustration`).
 */
export const CurrencyIllustration = () => {
  return (
    <div aria-hidden className="flex -space-x-4">
      <CurrencyCard icon={Bitcoin} ticker="BTC" tone="blue" />
      <CurrencyCard icon={DollarSign} ticker="USD" tone="green" />
      <CurrencyCard icon={Euro} ticker="EURO" tone="red" />
    </div>
  );
};

type CurrencyTone = "blue" | "green" | "red";

const TONE_CLASSES: Record<CurrencyTone, { gradientStart: string; text: string }> = {
  blue: {
    gradientStart: "before:from-blue-500/15",
    text: "text-blue-900 dark:text-blue-300",
  },
  green: {
    gradientStart: "before:from-green-500/15",
    text: "text-green-900 dark:text-green-300",
  },
  red: {
    gradientStart: "before:from-red-500/15",
    text: "text-red-900 dark:text-red-300",
  },
};

function CurrencyCard({
  icon: Icon,
  ticker,
  tone,
}: Readonly<{ icon: LucideIcon; ticker: string; tone: CurrencyTone }>) {
  const t = TONE_CLASSES[tone];
  return (
    <div
      className={`bg-illustration ring-border-illustration to-illustration before:border-foreground/5 relative w-16 translate-y-1 -rotate-12 space-y-2 rounded-lg p-2 shadow-md ring-1 shadow-black/6.5 [--color-border:color-mix(in_oklab,var(--color-foreground)15%,transparent)] before:absolute before:inset-0.5 before:rounded-[6px] before:border before:bg-linear-to-b before:from-25% before:to-75% before:mask-b-from-65% ${t.gradientStart}`}
    >
      <div className={`flex -translate-x-0.5 items-center gap-0.5 ${t.text}`}>
        <Icon className="size-3" />
        <span className="text-xs font-medium">{ticker}</span>
      </div>
      <div className="space-y-1.5">
        <DashRow leftWidth="w-2.5" rightWidth="w-6" />
        <DashRow leftWidth="w-2.5" rightWidth="w-6" />
      </div>
      <div className="space-y-1.5">
        <div className="bg-border h-[3px] w-full rounded-full" />
        <DashRow leftWidth="w-2/3" rightWidth="w-1/3" />
      </div>
      <Signature className="ml-auto size-3" />
    </div>
  );
}

function DashRow({
  leftWidth,
  rightWidth,
}: Readonly<{ leftWidth: string; rightWidth: string }>) {
  return (
    <div className="flex items-center gap-1">
      <div className={`bg-border h-[3px] rounded-full ${leftWidth}`} />
      <div className={`bg-border h-[3px] rounded-full ${rightWidth}`} />
    </div>
  );
}
