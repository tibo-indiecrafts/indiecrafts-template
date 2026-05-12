/* eslint-disable -- Tailark Pro upstream illustration kept verbatim */

import { CornerDownLeft } from "lucide-react";
import { Figma } from "@/components/ui-primitives/svgs/figma";
import { MicrosoftExcel } from "@/components/ui-primitives/svgs/microsoft-excel";
import { MicrosoftWord } from "@/components/ui-primitives/svgs/microsoft-word";

type Result = {
  icon: React.ReactNode;
  text: string;
};

export const AiMentionsIllustration = () => {
  const results: Result[] = [
    { icon: <Figma className="size-4" />, text: "design-system.fig" },
    { icon: <MicrosoftExcel className="size-4" />, text: "april-report.xlsx" },
    { icon: <MicrosoftWord className="size-4" />, text: "annual-summary.docx" },
    { icon: <MicrosoftExcel className="size-4" />, text: "budget-2024.xlsx" },
    { icon: <MicrosoftWord className="size-4" />, text: "meeting-notes.docx" },
  ];
  return (
    <div aria-hidden className="min-w-2xs">
      <div className="ring-border-illustration text-muted-foreground relative rounded-lg p-3 text-xs ring-1">
        Welcome to our platform. We're excited to have you here.{" "}
        <span className="relative w-fit items-center">
          <span className="absolute inset-0 h-5 -translate-y-0.5 bg-linear-to-r via-indigo-500/15 to-emerald-500/15" />
          <span>Send @</span>
          <span className="bg-foreground absolute inset-y-0 -right-px inline-block h-5 w-[1.5px] -translate-y-0.5 animate-pulse" />
        </span>
      </div>

      <div className="bg-illustration ring-border-illustration mt-2 overflow-hidden rounded-xl shadow-lg ring-1 shadow-black/6.5">
        <div className="divide-y">
          {results.map((result, index) => (
            <div
              key={index}
              className="hover:bg-foreground/5 group/result flex cursor-pointer items-center gap-2 px-3 py-2.5 transition-colors"
            >
              <div className="not-group-hover:/result:text-muted-foreground flex gap-1.5">
                <div className="[&>svg]:size-3.5">{result.icon}</div>
                <div className="flex-1 text-xs">{result.text}</div>
              </div>
              <div className="bg-background ring-border-illustration text-muted-foreground ml-auto flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] ring-1 not-group-first/result:hidden">
                <CornerDownLeft className="size-2.5" />
                Tab
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs">
        <div className="text-muted-foreground">3 suggestions</div>
        <div className="text-muted-foreground flex items-center gap-1">
          <span className="bg-background ring-border-illustration rounded px-1 ring-1">
            ↑
          </span>
          <span className="bg-background ring-border-illustration rounded px-1 ring-1">
            ↓
          </span>
          to navigate
        </div>
      </div>
    </div>
  );
};

export default AiMentionsIllustration;
