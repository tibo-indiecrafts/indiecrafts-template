"use client";
import { Loader } from "@/components/ui-molecules/ai/loader";
import { ResponseStream } from "@/components/ui-molecules/ai/response-stream";
import {
  Source,
  SourceContent,
  SourceTrigger,
} from "@/components/ui-molecules/ai/sources";
import { useState, useEffect } from "react";

/**
 * Mock AI chat conversation illustration — initial user message,
 * typing-indicator transition, and an AI response with source-card
 * citations. Used by `sections-secondary-hero/secondary-hero-01`.
 * Mock copy is decorative; treat as illustrations-only (no
 * translations).
 */
export const Chat = () => {
  const [isStreaming, setIsStreaming] = useState(false);

  const response = `Tailark is a collection of pre-built, responsive UI blocks and components designed to accelerate the development of marketing websites. `;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsStreaming(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div aria-hidden className="flex flex-col gap-6">
      <div>
        <div className="before:border-foreground/10 relative before:absolute before:inset-0 before:border-y before:border-dashed before:mask-x-from-75%">
          <div className="relative mx-auto max-w-lg">
            <div className="from-card ring-foreground/10 inset-ring-background/50 ml-auto w-fit max-w-3/4 rounded-t-2xl rounded-br rounded-bl-2xl bg-linear-to-b to-indigo-500/5 p-3 text-sm text-indigo-950 shadow-md ring-1 inset-ring shadow-indigo-600/10 selection:bg-indigo-900/10 selection:text-indigo-700 dark:text-indigo-50/65 dark:selection:text-indigo-300">
              Distinctio provident nobis repudiandae deleniti necessitatibus.
            </div>
          </div>
        </div>
        <div className="mx-auto mt-1 max-w-lg">
          <span className="text-muted-foreground block text-right text-xs">
            Sat 22 Feb
          </span>
        </div>
      </div>
      <div className="h-30">
        <div className="before:border-foreground/10 relative before:absolute before:inset-0 before:border-y before:border-dashed before:mask-x-from-75%">
          <div className="relative mx-auto max-w-lg">
            {isStreaming ? (
              <div className="from-card ring-foreground/10 inset-ring-background/50 w-fit max-w-3/4 rounded-t-2xl rounded-br-2xl rounded-bl bg-linear-to-b to-emerald-500/5 p-3 text-sm text-emerald-950 shadow-md ring-1 inset-ring shadow-emerald-600/10 selection:bg-emerald-900/10 selection:text-emerald-700 dark:text-emerald-50/65 dark:selection:text-emerald-300">
                <ResponseStream
                  textStream={response}
                  mode="typewriter"
                  className="text-sm"
                  speed={40}
                />
              </div>
            ) : (
              <div className="py-2">
                <Loader
                  variant="typing"
                  size="sm"
                  className="[--color-primary:var(--color-muted-foreground)]"
                />
              </div>
            )}
          </div>
        </div>
        <div className="mx-auto mt-2 max-w-lg">
          {isStreaming && (
            <div className="flex flex-wrap gap-2">
              <Source href="https://tailark.com">
                <SourceTrigger showFavicon />
                <SourceContent
                  title="Tailark"
                  description="Tailark is a collection of pre-built, responsive UI blocks and components designed to accelerate the development of marketing websites."
                />
              </Source>
              <Source href="https://www.google.com">
                <SourceTrigger showFavicon />
                <SourceContent
                  title="Google"
                  description="Search the world's information, including webpages, images, videos and more. Google has many special features to help you find exactly what you're looking for."
                />
              </Source>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
