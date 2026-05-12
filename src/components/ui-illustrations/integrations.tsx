import { OpenAI } from "@/components/ui-primitives/svgs/open-ai";
import { Linear } from "@/components/ui-primitives/svgs/linear";
import { Vercel } from "@/components/ui-primitives/svgs/vercel";
import { Cloudflare } from "@/components/ui-primitives/svgs/cloudflare";
import { Claude } from "@/components/ui-primitives/svgs/claude";
import { Gemini } from "@/components/ui-primitives/svgs/gemini";
import { Replit } from "@/components/ui-primitives/svgs/replit";
import { VSCodium } from "@/components/ui-primitives/svgs/vs-codium";

export const Integrations = () => {
  return (
    <div>
      <div className="relative mx-auto max-w-sm">
        <div className="border-foreground/10 absolute -top-16 -bottom-64 left-0 w-1/7 border-l border-dashed" />
        <div className="border-foreground/10 absolute -top-13 -bottom-56 left-1/7 w-1/7 border-l border-dashed" />
        <div className="border-foreground/10 absolute -top-9 -bottom-52 left-2/7 w-1/7 border-l border-dashed" />
        <div className="border-foreground/10 absolute -top-6 -bottom-48 left-3/7 w-1/7 border-x border-dashed" />
        <div className="border-foreground/10 absolute -top-9 -bottom-52 left-5/7 w-1/7 border-x border-dashed" />
        <div className="border-foreground/10 absolute -top-13 -bottom-64 left-6/7 w-1/7 border-r border-dashed" />
      </div>
      <div className="before:border-foreground/10 relative mx-auto max-w-xl before:absolute before:inset-0 before:border-t before:border-dashed lg:before:mask-x-from-85%">
        <div className="*:bg-illustration *:ring-border mx-auto grid max-w-sm grid-cols-7 shadow-black/6.5 *:relative *:flex *:aspect-square *:items-center *:justify-center *:rounded-lg *:shadow-md *:ring-1">
          <div className="col-start-4">
            <Cloudflare className="size-5" />
          </div>
          <div className="col-start-6">
            <Gemini className="size-5" />
          </div>
        </div>
      </div>
      <div className="before:border-foreground/10 relative before:absolute before:inset-0 before:border-y before:border-dashed lg:before:mask-x-from-85%">
        <div className="mx-auto grid max-w-sm grid-cols-7 *:relative *:flex *:aspect-square *:items-center *:justify-center">
          <div className="bg-foreground/3 -mr-px border">
            <Vercel className="size-5" />
          </div>
          <div className="bg-foreground/3 col-start-3 -mr-px border">
            <VSCodium className="*:fill-foreground size-5" />
          </div>
          <div className="bg-illustration ring-border-illustration col-start-5 rounded-lg shadow-md ring-1 shadow-black/6.5">
            <Linear className="size-5" />
          </div>
          <div className="bg-foreground/3 col-start-7 -mb-px -ml-px border">
            <Replit className="*:fill-foreground size-5" />
          </div>
        </div>
      </div>
      <div className="before:border-foreground/10 relative mx-auto max-w-2xl before:absolute before:inset-0 before:border-b before:border-dashed lg:before:mask-x-from-85%">
        <div className="mx-auto grid max-w-sm grid-cols-7 *:relative *:flex *:aspect-square *:items-center *:justify-center">
          <div className="bg-foreground/3 col-start-2 -mt-px -mr-px border">
            <OpenAI className="size-5" />
          </div>
          <div className="bg-illustration ring-border-illustration col-start-5 rounded-lg shadow-md ring-1 shadow-black/6.5">
            <Claude className="size-5" />
          </div>
        </div>
      </div>
    </div>
  );
};
