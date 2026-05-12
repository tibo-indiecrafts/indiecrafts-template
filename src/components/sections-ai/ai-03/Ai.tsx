"use client";

import {
  IconBolt,
  IconChevronDown,
  IconCircle,
  IconCircleDashed,
  IconCloud,
  IconCode,
  IconDeviceLaptop,
  IconHistory,
  IconPaperclip,
  IconPlus,
  IconProgress,
  IconRobot,
  IconSend,
  IconUser,
  IconWand,
  IconWorld,
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
import {
  ai03Agents,
  ai03Attachments,
  ai03Models,
  ai03Namespace,
  ai03Performances,
} from "./config";
import type { AiBlock } from "./schema";

const ICONS = {
  IconPaperclip,
  IconCode,
  IconWorld,
  IconHistory,
  IconDeviceLaptop,
  IconCloud,
  IconUser,
  IconRobot,
  IconCircle,
  IconProgress,
  IconCircleDashed,
} as const;

type IconName = keyof typeof ICONS;

export default function Ai(props: Readonly<AiBlock>) {
  const [t] = useScopedT(ai03Namespace);
  const attachments = props.attachments ?? ai03Attachments;
  const models = props.models ?? ai03Models;
  const agents = props.agents ?? ai03Agents;
  const performances = props.performances ?? ai03Performances;
  const titleId = `${props.id}-title`;
  const [input, setInput] = useState("");
  const [selectedModelId, setSelectedModelId] = useState(models[0].id);
  const [selectedAgentId, setSelectedAgentId] = useState(agents[0].id);
  const [selectedPerformanceId, setSelectedPerformanceId] = useState(performances[0].id);
  const [autoMode, setAutoMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      // submit is a no-op in this demo block
    }
  };

  const renderIcon = (name: IconName, size: number) => {
    const Icon = ICONS[name];
    return <Icon aria-hidden="true" size={size} className="opacity-60" />;
  };

  return (
    <section aria-labelledby={titleId} className="w-xl">
      <h2 id={titleId} className="sr-only">
        {t("title")}
      </h2>

      <div className="bg-background border-border overflow-hidden rounded-2xl border">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="sr-only"
          onChange={() => {}}
          aria-hidden="true"
          tabIndex={-1}
        />

        <div className="grow px-3 pt-3 pb-2">
          <form onSubmit={handleSubmit}>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("placeholder")}
              className="text-foreground placeholder-muted-foreground max-h-[25vh] min-h-10 w-full resize-none border-0 border-none bg-transparent! p-0 text-sm shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              rows={1}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = `${target.scrollHeight}px`;
              }}
            />
          </form>
        </div>

        <div className="mb-2 flex items-center justify-between px-2">
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="border-border hover:bg-accent h-7 w-7 rounded-full border p-0"
                  aria-label={t("addAttachments")}
                >
                  <IconPlus aria-hidden="true" className="size-3" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start" className="max-w-xs rounded-2xl p-1.5">
                <DropdownMenuGroup className="space-y-1">
                  {attachments.map((item) => (
                    <DropdownMenuItem
                      key={item.id}
                      className="rounded-[calc(1rem-6px)] text-xs"
                      onClick={() => {
                        if (item.id === "files") {
                          fileInputRef.current?.click();
                        }
                      }}
                    >
                      {renderIcon(item.icon, 16)}
                      {t(`attachments.${item.id}.label`)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setAutoMode(!autoMode)}
              className={cn(
                "border-border hover:bg-accent h-7 rounded-full border px-2",
                {
                  "bg-primary/10 text-primary border-primary/30": autoMode,
                  "text-muted-foreground": !autoMode,
                },
              )}
            >
              <IconWand aria-hidden="true" className="size-3" />
              <span className="text-xs">{t("auto")}</span>
            </Button>
          </div>

          <div>
            <Button
              type="submit"
              disabled={!input.trim()}
              className="bg-primary size-7 rounded-full p-0 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={handleSubmit}
              aria-label={t("send")}
            >
              <IconSend aria-hidden="true" className="fill-primary size-3" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-0 pt-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="hover:bg-accent text-muted-foreground h-6 rounded-full border border-transparent px-2 text-xs"
            >
              <IconDeviceLaptop aria-hidden="true" className="size-3" />
              <span>{t(`models.${selectedModelId}.label`)}</span>
              <IconChevronDown aria-hidden="true" className="size-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="bg-popover border-border max-w-xs rounded-2xl p-1.5"
          >
            <DropdownMenuGroup className="space-y-1">
              {models.map((m) => (
                <DropdownMenuItem
                  key={m.id}
                  className="rounded-[calc(1rem-6px)] text-xs"
                  onClick={() => setSelectedModelId(m.id)}
                >
                  {renderIcon(m.icon, 16)}
                  {t(`models.${m.id}.label`)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="hover:bg-accent text-muted-foreground h-6 rounded-full border border-transparent px-2 text-xs"
            >
              <IconUser aria-hidden="true" className="size-3" />
              <span>{t(`agents.${selectedAgentId}.label`)}</span>
              <IconChevronDown aria-hidden="true" className="size-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="bg-popover border-border max-w-xs rounded-2xl p-1.5"
          >
            <DropdownMenuGroup className="space-y-1">
              {agents.map((a) => (
                <DropdownMenuItem
                  key={a.id}
                  className="rounded-[calc(1rem-6px)] text-xs"
                  onClick={() => setSelectedAgentId(a.id)}
                >
                  {renderIcon(a.icon, 16)}
                  {t(`agents.${a.id}.label`)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="hover:bg-accent text-muted-foreground h-6 rounded-full border border-transparent px-2 text-xs"
            >
              <IconBolt aria-hidden="true" className="size-3" />
              <span>{t(`performances.${selectedPerformanceId}.label`)}</span>
              <IconChevronDown aria-hidden="true" className="size-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="bg-popover border-border max-w-xs rounded-2xl p-1.5"
          >
            <DropdownMenuGroup className="space-y-1">
              {performances.map((p) => (
                <DropdownMenuItem
                  key={p.id}
                  className="rounded-[calc(1rem-6px)] text-xs"
                  onClick={() => setSelectedPerformanceId(p.id)}
                >
                  {renderIcon(p.icon, 16)}
                  {t(`performances.${p.id}.label`)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex-1" />
      </div>
    </section>
  );
}
