"use client";
import { Loader } from "@/components/ui-effects/grid-1-landing-loader";
import { ResponseStream } from "@/components/ui-effects/grid-1-landing-response-stream";
import { useState, useEffect } from "react";

export const ChatIllustration = () => {
  const [isStreaming, setIsStreaming] = useState(false);

  const response = `Acme is a collection of modern UI blocks designed to accelerate the development of marketing websites. `;

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
          <div className="relative mx-auto max-w-sm">
            <div className="from-card ring-foreground/10 inset-ring-background/50 ml-auto w-fit max-w-3/4 rounded-t-2xl rounded-br rounded-bl-2xl bg-linear-to-b to-indigo-100/50 p-3 text-sm text-indigo-950 shadow-md ring-1 inset-ring shadow-indigo-600/10">
              Distinctio provident nobis repudiandae deleniti necessitatibus.
            </div>
          </div>
        </div>
        <div className="mx-auto mt-1 max-w-sm">
          <span className="text-muted-foreground block text-right text-xs">
            Sat 22 Feb
          </span>
        </div>
      </div>
      <div className="h-30">
        <div className="before:border-foreground/10 relative before:absolute before:-inset-x-12 before:inset-y-0 before:border-y before:border-dashed before:mask-x-from-75%">
          <div className="relative mx-auto max-w-sm">
            {isStreaming ? (
              <div className="from-card ring-foreground/10 inset-ring-background/50 w-fit max-w-3/4 rounded-t-2xl rounded-br-2xl rounded-bl bg-linear-to-b to-emerald-50/50 p-3 text-sm text-emerald-950 shadow-md ring-1 inset-ring shadow-emerald-600/10">
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
      </div>
    </div>
  );
};
