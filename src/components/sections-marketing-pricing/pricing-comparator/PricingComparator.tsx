import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Cpu, Globe, Shield, Sparkles, Zap, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui-primitives/button";
import type {
  ComparatorCell,
  ComparatorIcon,
  ComparatorTier,
  PricingComparatorBlock,
} from "./schema";

const ICONS: Record<ComparatorIcon, LucideIcon> = {
  cpu: Cpu,
  sparkles: Sparkles,
  shield: Shield,
  zap: Zap,
  globe: Globe,
};

function Check() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-4"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function PricingComparator(props: Readonly<PricingComparatorBlock>) {
  const t = useTranslations();
  const srOn = t(props.includedSrKey);
  const srOff = t(props.notIncludedSrKey);

  function renderCell(value: ComparatorCell): ReactNode {
    if (value === true) {
      return (
        <>
          <Check />
          <span className="sr-only">{srOn}</span>
        </>
      );
    }
    if (typeof value === "string") return t(value);
    return <span className="sr-only">{srOff}</span>;
  }

  return (
    <section aria-labelledby={`${props.id}-title`} className="py-16 md:py-32">
      <h2 id={`${props.id}-title`} className="sr-only">
        {t(props.tiers[1].labelKey)}
      </h2>
      <div className="mx-auto max-w-5xl px-(--gutter)">
        <div className="w-full overflow-auto lg:overflow-visible">
          <table className="w-[200vw] border-separate border-spacing-x-3 md:w-full">
            <thead className="bg-background sticky top-0">
              <tr className="*:py-4 *:text-left *:font-medium">
                <th className="lg:w-2/5">
                  <span className="sr-only">{t(props.tiers[0].labelKey)}</span>
                </th>
                {props.tiers.map((tier) => (
                  <TierHeader key={tier.id} tier={tier} />
                ))}
              </tr>
            </thead>
            <tbody className="text-sm">
              {props.groups.map((group, gi) => {
                const Icon = ICONS[group.iconKey];
                return (
                  <GroupRows
                    key={gi}
                    icon={<Icon className="size-4" aria-hidden="true" />}
                    label={t(group.labelKey)}
                    rows={group.rows.map((row) => ({
                      label: t(row.labelKey),
                      values: row.values,
                    }))}
                    renderValue={renderCell}
                  />
                );
              })}
              <tr className="*:py-6">
                <td />
                <td />
                <td className="bg-muted rounded-b-(--radius) border-none px-4" />
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function TierHeader({ tier }: { tier: ComparatorTier }) {
  const t = useTranslations();
  const isHighlighted = tier.highlighted === true;
  return (
    <th
      className={
        isHighlighted ? "bg-muted space-y-3 rounded-t-(--radius) px-4" : "space-y-3"
      }
    >
      <span className="block">{t(tier.labelKey)}</span>
      <Button asChild size="sm" variant={isHighlighted ? "default" : "outline"}>
        <a href={tier.ctaHref}>{t(tier.ctaLabelKey)}</a>
      </Button>
    </th>
  );
}

function GroupRows({
  icon,
  label,
  rows,
  renderValue,
}: {
  icon: ReactNode;
  label: string;
  rows: readonly { label: string; values: readonly ComparatorCell[] }[];
  renderValue: (value: ComparatorCell) => ReactNode;
}) {
  return (
    <>
      <tr className="*:pt-8 *:pb-3">
        <td className="flex items-center gap-2 font-medium">
          {icon}
          <span>{label}</span>
        </td>
        <td />
        <td className="bg-muted border-none px-4" />
        <td />
      </tr>
      {rows.map((row, ri) => (
        <tr key={ri} className="*:border-b *:py-3">
          <td className="text-muted-foreground">{row.label}</td>
          <td>{renderValue(row.values[0])}</td>
          <td className="bg-muted border-none px-4">
            <div className="-mb-3 border-b py-3">{renderValue(row.values[1])}</div>
          </td>
          <td>{renderValue(row.values[2])}</td>
        </tr>
      ))}
    </>
  );
}
