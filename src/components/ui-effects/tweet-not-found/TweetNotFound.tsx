"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { tweetNotFoundNamespace } from "./config";

export type TweetNotFoundProps = React.ComponentProps<"div">;

/**
 * The upstream `TweetNotFound` from `@/components/ui-effects/tweet-card` hardcodes
 * its "Tweet not found" copy in JSX, so wrapping the export doesn't help —
 * we re-implement the same DOM structure with the message sourced from the
 * block's translation namespace.
 */
export function TweetNotFound({ className, ...props }: TweetNotFoundProps) {
  const t = useTranslations(tweetNotFoundNamespace);
  return (
    <div
      role="alert"
      className={cn(
        "flex size-full flex-col items-center justify-center gap-2 rounded-lg border p-4",
        className,
      )}
      {...props}
    >
      <h3>{t("message")}</h3>
    </div>
  );
}
