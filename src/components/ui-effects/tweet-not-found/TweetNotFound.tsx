"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { tweetNotFoundNamespace } from "./config";

export type TweetNotFoundProps = React.ComponentProps<"div">;

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
