"use client";

import {
  IconMicrophone,
  IconPaperclip,
  IconPlus,
  IconSearch,
  IconSend,
  IconSparkles,
  IconWaveSine,
} from "@tabler/icons-react";
import type React from "react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui-primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui-primitives/dropdown-menu";
import { Textarea } from "@/components/ui-primitives/textarea";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { ai01AttachmentItems, ai01Namespace } from "./config";
import type { AiAttachmentItem, AiBlock } from "./schema";

const ATTACHMENT_ICONS = {
  IconPaperclip,
  IconSparkles,
  IconSearch,
} as const;

/**
 * Chat composer with auto-expanding textarea, attachments dropdown,
 * and voice/send affordances. Sourced from a shadcn AI block.
 */
export default function Ai(props: Readonly<AiBlock>) {
  const [t, tr] = useScopedT(ai01Namespace);
  const items: AiAttachmentItem[] = props.attachmentItems ?? ai01AttachmentItems;
  const titleId = `${props.id}-title`;
  const [message, setMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      setMessage("");
      setIsExpanded(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
    setIsExpanded(e.target.value.length > 100 || e.target.value.includes("\n"));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <section aria-labelledby={titleId} className="w-full">
      <h2
        id={titleId}
        className="text-foreground mx-auto mb-8 max-w-2xl px-1 text-center text-2xl leading-9 font-semibold text-balance whitespace-pre-wrap"
      >
        {tr(props.titleKey, "title")}
      </h2>

      <form onSubmit={handleSubmit} className="group/composer w-full">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="sr-only"
          onChange={() => {}}
          aria-hidden="true"
          tabIndex={-1}
        />

        <div
          className={cn(
            "border-border dark:bg-muted/50 mx-auto w-full max-w-2xl cursor-text overflow-clip border bg-transparent bg-clip-padding p-2.5 shadow-lg transition-[border-radius] duration-200 ease-out",
            isExpanded
              ? "grid [grid-template-columns:1fr] [grid-template-rows:auto_1fr_auto] rounded-3xl [grid-template-areas:'header'_'primary'_'footer']"
              : "grid [grid-template-columns:auto_1fr_auto] [grid-template-rows:auto_1fr_auto] rounded-3xl [grid-template-areas:'header_header_header'_'leading_primary_trailing'_'._footer_.']",
          )}
        >
          <div
            className={cn("flex min-h-14 items-center overflow-x-hidden px-1.5", {
              "mb-0 px-2 py-1": isExpanded,
              "-my-2.5": !isExpanded,
            })}
            style={{ gridArea: "primary" }}
          >
            <div className="max-h-52 flex-1 overflow-auto">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder={t("placeholder")}
                className="placeholder:text-muted-foreground scrollbar-thin min-h-0 resize-none rounded-none border-0 p-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-transparent"
                rows={1}
              />
            </div>
          </div>

          <div
            className={cn("flex", { hidden: isExpanded })}
            style={{ gridArea: "leading" }}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="hover:bg-accent rounded-full ring-0 outline-none"
                  aria-label={t("addAttachments")}
                >
                  <IconPlus aria-hidden="true" className="text-muted-foreground size-6" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start" className="max-w-xs rounded-2xl p-1.5">
                <DropdownMenuGroup className="space-y-1">
                  {items.map((item) => {
                    const Icon = ATTACHMENT_ICONS[item.icon];
                    return (
                      <DropdownMenuItem
                        key={item.id}
                        className="rounded-md"
                        onClick={() => {
                          if (item.id === "files") {
                            fileInputRef.current?.click();
                          }
                        }}
                      >
                        <Icon aria-hidden="true" size={20} className="opacity-60" />
                        {t(`attachments.${item.id}.label`)}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div
            className="flex items-center gap-2"
            style={{ gridArea: isExpanded ? "footer" : "trailing" }}
          >
            <div className="ms-auto flex items-center gap-1.5">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="hover:bg-accent rounded-full"
                aria-label={t("recordAudio")}
              >
                <IconMicrophone
                  aria-hidden="true"
                  className="text-muted-foreground size-5"
                />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="hover:bg-accent relative h-9 w-9 rounded-full"
                aria-label={t("audioVisualization")}
              >
                <IconWaveSine
                  aria-hidden="true"
                  className="text-muted-foreground size-5"
                />
              </Button>

              {message.trim() && (
                <Button
                  type="submit"
                  size="icon"
                  className="rounded-full"
                  aria-label={t("sendMessage")}
                >
                  <IconSend aria-hidden="true" className="size-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
