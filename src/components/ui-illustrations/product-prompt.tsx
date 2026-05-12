"use client";
import { Children, useState } from "react";
import { Button } from "@/components/ui-primitives/button";
import { Textarea } from "@/components/ui-primitives/textarea";
import { cn } from "@/lib/utils";
import { ArrowUp, Palette, PlusIcon, SendIcon } from "lucide-react";
import type { ComponentProps, HTMLAttributes, KeyboardEventHandler } from "react";

const SUGGESTIONS = [
  {
    label: "Write a short story",
    prompt:
      "Write an engaging short story with a beginning, middle, and end and a surprising plot twist that challenges the protagonist's worldview.",
  },
  {
    label: "Compose a haiku",
    prompt:
      "Create a haiku capturing the subtle nuances of changing seasons, contrasting spring colors with winter stillness.",
  },
  {
    label: "Create a character",
    prompt:
      "Describe a complex character harboring a deep secret that influences every decision and reveals through introspective moments.",
  },
  {
    label: "Imagine a future",
    prompt:
      "Write a vivid scene set in a future world where technology has altered daily life — relationships, norms, identity.",
  },
  {
    label: "Explore an emotion",
    prompt:
      "Convey a moment of intense emotion vividly, without naming the emotion — let context and action speak.",
  },
  {
    label: "Write a dialogue",
    prompt:
      "Craft a dialogue between two characters with opposing viewpoints, revealing motivations and an unexpected resolution.",
  },
  {
    label: "Describe a place",
    prompt:
      "Describe a place you've never visited with rich imagery — sights, sounds, smells, and atmosphere.",
  },
];

export const ProductPrompt = ({ className }: { className?: string }) => {
  const [value, setValue] = useState("");

  return (
    <div className={cn("mx-auto w-full max-w-xl", className)}>
      <PromptShell>
        <PromptTextarea
          onChange={(e) => setValue(e.target.value)}
          value={value}
          placeholder="What should we write today?"
        />
        <PromptToolbar>
          <PromptTools>
            <PromptButton className="size-8" aria-label="Add">
              <PlusIcon size={16} aria-hidden />
            </PromptButton>
            <PromptButton className="h-8 px-2.5">
              <Palette size={16} aria-hidden />
              <span>Design</span>
            </PromptButton>
          </PromptTools>
          <PromptSubmit
            className="absolute right-1 bottom-1 size-8 shadow-black/25"
            disabled={!value}
          >
            <ArrowUp strokeWidth={3} aria-hidden />
          </PromptSubmit>
        </PromptToolbar>
      </PromptShell>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {SUGGESTIONS.map((suggestion) => (
          <Button
            key={suggestion.label}
            type="button"
            variant="outline"
            size="sm"
            className="hover:bg-card/50 dark:hover:bg-card/50 cursor-pointer rounded-full bg-transparent px-3 text-xs shadow-none transition-all active:scale-98 dark:bg-transparent"
            onClick={() => setValue(suggestion.prompt)}
          >
            {suggestion.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

const PromptShell = ({ className, ...props }: HTMLAttributes<HTMLFormElement>) => (
  <form
    className={cn(
      "bg-card ring-border-illustration relative w-full divide-y overflow-hidden rounded-xl shadow-md ring-1",
      className,
    )}
    onSubmit={(e) => e.preventDefault()}
    {...props}
  />
);

const PromptTextarea = ({
  onChange,
  className,
  ...props
}: ComponentProps<typeof Textarea>) => {
  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter") {
      if (e.nativeEvent.isComposing) return;
      if (e.shiftKey) return;
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <Textarea
      className={cn(
        "field-sizing-content max-h-[6lh] w-full resize-none rounded-none border-none bg-transparent p-3 shadow-none ring-0 outline-none focus-visible:ring-0 dark:bg-transparent",
        className,
      )}
      name="message"
      onChange={onChange}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
};

const PromptToolbar = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex items-center justify-between p-1", className)} {...props} />
);

const PromptTools = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex items-center gap-0 [&_button:first-child]:rounded-bl-xl",
      className,
    )}
    {...props}
  />
);

const PromptButton = ({
  className,
  children,
  size,
  ...props
}: ComponentProps<typeof Button>) => {
  const computedSize = size ?? (Children.count(children) > 1 ? "default" : "icon");
  return (
    <Button
      type="button"
      variant="ghost"
      size={computedSize}
      className={cn(
        "text-muted-foreground shrink-0 gap-1.5 rounded-lg",
        computedSize === "default" && "px-3",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

const PromptSubmit = ({
  className,
  children,
  ...props
}: ComponentProps<typeof Button>) => (
  <Button
    type="submit"
    size="icon"
    className={cn("gap-1.5 rounded-lg", className)}
    {...props}
  >
    {children ?? <SendIcon className="size-4" aria-hidden />}
  </Button>
);
