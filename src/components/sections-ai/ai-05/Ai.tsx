"use client";

import {
  IconAdjustmentsHorizontal,
  IconBolt,
  IconMessageCircle,
  IconPaperclip,
  IconRefresh,
} from "@tabler/icons-react";
import type { ChatStatus } from "ai";
import { useEffect, useRef, useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ui-molecules/ai/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ui-molecules/ai/message";
import {
  PromptInput,
  PromptInputButton,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ui-molecules/ai/prompt-input";
import { Button } from "@/components/ui-primitives/button";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { ai05InitialMessages, ai05Namespace, ai05Tools } from "./config";
import type { AiBlock, AiMessage } from "./schema";

const TOOL_ICONS = {
  IconPaperclip,
  IconBolt,
  IconMessageCircle,
} as const;

interface DemoMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function Ai(props: Readonly<AiBlock>) {
  const [t, tr] = useScopedT(ai05Namespace);
  const initialMessages: AiMessage[] = props.initialMessages ?? ai05InitialMessages;
  const tools = props.tools ?? ai05Tools;
  const responseCount = props.responseCount ?? 3;
  const titleId = `${props.id}-title`;

  const seed: DemoMessage[] = initialMessages.map((m) => ({
    id: m.id,
    role: m.role,
    content: t(`messages.${m.id}.content`),
  }));

  const [messages, setMessages] = useState<DemoMessage[]>(seed);
  const [inputValue, setInputValue] = useState("");
  const [status, setStatus] = useState<ChatStatus>("ready");
  const replyTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (replyTimeoutRef.current) {
        window.clearTimeout(replyTimeoutRef.current);
      }
    };
  }, []);

  const pickResponse = (index: number): string => {
    const idx = ((index % responseCount) + responseCount) % responseCount;
    return t(`responses.${idx}`);
  };

  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }

    const newMessage: DemoMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setStatus("submitted");

    replyTimeoutRef.current = window.setTimeout(() => {
      const response: DemoMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: pickResponse(messages.length),
      };

      setMessages((prev) => [...prev, response]);
      setStatus("ready");
    }, 900);
  };

  return (
    <section aria-labelledby={titleId} className="w-full px-4">
      <div className="border-border bg-card mx-auto flex h-96 w-full max-w-2xl flex-col overflow-hidden rounded-2xl border shadow-lg sm:w-3/5">
        <header className="border-border/80 flex items-center justify-between gap-4 border-b px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="space-y-1">
              <div
                id={titleId}
                className="flex items-center gap-2 text-sm font-semibold text-balance"
              >
                {tr(props.titleKey, "title")}
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-xs text-pretty">
                <span className="inline-flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  {tr(props.statusKey, "status")}
                </span>
                <span className="hidden sm:inline">
                  {tr(props.subtitleKey, "subtitle")}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-8"
              aria-label={t("refresh")}
            >
              <IconRefresh aria-hidden="true" className="size-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-8"
              aria-label={t("settings")}
            >
              <IconAdjustmentsHorizontal aria-hidden="true" className="size-4" />
            </Button>
          </div>
        </header>

        <Conversation className="bg-muted/30">
          <ConversationContent className="gap-6 pl-1">
            {messages.map((message) => (
              <Message key={message.id} from={message.role}>
                <MessageContent
                  className={cn(
                    "leading-relaxed",
                    message.role === "assistant" && "max-w-prose",
                  )}
                >
                  {message.role === "assistant" ? (
                    <MessageResponse>{message.content}</MessageResponse>
                  ) : (
                    <p className="text-pretty whitespace-pre-wrap">{message.content}</p>
                  )}
                </MessageContent>
              </Message>
            ))}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <div className="bg-background">
          <PromptInput
            onSubmit={(message) => handleSend(message.text)}
            className="[&>[data-slot=input-group]]:border-border/80 [&>[data-slot=input-group]]:focus-within:border-border/80 w-full [&>[data-slot=input-group]]:rounded-none [&>[data-slot=input-group]]:border-x-0 [&>[data-slot=input-group]]:border-t [&>[data-slot=input-group]]:border-b-0 [&>[data-slot=input-group]]:shadow-none [&>[data-slot=input-group]]:focus-within:ring-0 [&>[data-slot=input-group]]:focus-within:ring-transparent [&>[data-slot=input-group]]:focus-within:ring-offset-0 [&>[data-slot=input-group]]:focus-within:outline-none"
          >
            <PromptInputTextarea
              placeholder={t("placeholder")}
              value={inputValue}
              onChange={(event) => setInputValue(event.currentTarget.value)}
            />
            <PromptInputFooter>
              <PromptInputTools>
                {tools.map((tool) => {
                  const Icon = TOOL_ICONS[tool.icon];
                  return (
                    <PromptInputButton
                      key={tool.id}
                      aria-label={t(`tools.${tool.id}.label`)}
                    >
                      <Icon aria-hidden="true" className="size-4" />
                    </PromptInputButton>
                  );
                })}
              </PromptInputTools>
              <PromptInputSubmit
                status={status}
                disabled={!inputValue.trim() || status !== "ready"}
              />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </section>
  );
}
