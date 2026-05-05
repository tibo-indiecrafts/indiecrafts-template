"use client";

import {
  IconAdjustmentsHorizontal,
  IconArrowUp,
  IconBrandFigma,
  IconCamera,
  IconCirclePlus,
  IconClipboard,
  IconFileUpload,
  IconHistory,
  IconLayoutDashboard,
  IconLink,
  IconPaperclip,
  IconPlayerPlay,
  IconPlus,
  IconSparkles,
  IconTemplate,
  IconX,
} from "@tabler/icons-react";
import Image from "next/image";
import type React from "react";
import { useRef, useState } from "react";
import { Badge } from "@/components/ui-primitives/badge";
import { Button } from "@/components/ui-primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui-primitives/dropdown-menu";
import { Label } from "@/components/ui-primitives/label";
import { Switch } from "@/components/ui-primitives/switch";
import { Textarea } from "@/components/ui-primitives/textarea";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import {
  ai04AttachmentActions,
  ai04Namespace,
  ai04QuickActions,
  ai04Settings,
} from "./config";
import type { AiBlock } from "./schema";

const ICONS = {
  IconPaperclip,
  IconLink,
  IconClipboard,
  IconTemplate,
  IconSparkles,
  IconPlayerPlay,
  IconHistory,
  IconCamera,
  IconBrandFigma,
  IconFileUpload,
  IconLayoutDashboard,
} as const;

type IconName = keyof typeof ICONS;

interface AttachedFile {
  id: string;
  name: string;
  file: File;
  preview?: string;
}

/**
 * Hero composer with drag-and-drop file attachments, settings
 * dropdown, and a row of quick-action buttons. Sourced from a shadcn
 * AI block.
 */
export default function Ai(
  props: Readonly<AiBlock & { onSubmit?: (prompt: string) => void }>,
) {
  const [t, tr] = useScopedT(ai04Namespace);
  const attachmentActions = props.attachmentActions ?? ai04AttachmentActions;
  const settingsConfig = props.settings ?? ai04Settings;
  const quickActions = props.quickActions ?? ai04QuickActions;
  const titleId = `${props.id}-title`;
  const onSubmit = props.onSubmit;

  const [prompt, setPrompt] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialSettings = Object.fromEntries(
    settingsConfig.map((s) => [s.id, s.defaultValue]),
  );
  const [settings, setSettings] = useState<Record<string, boolean>>(initialSettings);

  const renderIcon = (name: IconName, size: number, className?: string) => {
    const Icon = ICONS[name];
    return <Icon aria-hidden="true" size={size} className={className} />;
  };

  const generateFileId = () => Math.random().toString(36).substring(7);
  const processFiles = (files: File[]) => {
    for (const file of files) {
      const fileId = generateFileId();
      const attachedFile: AttachedFile = {
        id: fileId,
        name: file.name,
        file,
      };

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          setAttachedFiles((prev) =>
            prev.map((f) =>
              f.id === fileId ? { ...f, preview: reader.result as string } : f,
            ),
          );
        };
        reader.readAsDataURL(file);
      }

      setAttachedFiles((prev) => [...prev, attachedFile]);
    }
  };
  const submitPrompt = () => {
    if (prompt.trim() && onSubmit) {
      onSubmit(prompt.trim());
      setPrompt("");
    }
  };
  const updateSetting = (key: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitPrompt();
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFiles(files);
    }
  };
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitPrompt();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (fileId: string) => {
    setAttachedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const settingFieldId = (key: string) => `${props.id}-setting-${key}`;

  return (
    <section aria-labelledby={titleId} className="mx-auto flex w-full flex-col gap-4">
      <h1
        id={titleId}
        className="font-heading text-foreground text-center text-[29px] font-semibold tracking-tighter text-balance text-pretty sm:text-[32px] md:text-[46px]"
      >
        {tr(props.titleKey, "title")}
      </h1>
      <p className="text-muted-foreground -mt-2 pb-4 text-center text-xl text-balance">
        {tr(props.subtitleKey, "subtitle")}
      </p>

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col content-center">
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- drag-drop file attachments are an intentional pattern on the composer surface */}
        <form
          className="focus-within:border-ring overflow-visible rounded-xl border p-2 transition-colors duration-200"
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onSubmit={handleSubmit}
        >
          {attachedFiles.length > 0 && (
            <div className="relative mb-2 flex w-fit items-center gap-2 overflow-hidden">
              {attachedFiles.map((file) => (
                <Badge
                  variant="outline"
                  className="hover:bg-accent group relative h-6 max-w-30 cursor-pointer overflow-hidden px-0 text-[13px] transition-colors"
                  key={file.id}
                >
                  <span className="flex h-full items-center gap-1.5 overflow-hidden pl-1 font-normal">
                    <div className="relative flex h-4 min-w-4 items-center justify-center">
                      {file.preview ? (
                        <Image
                          alt={file.name}
                          className="absolute inset-0 h-4 w-4 rounded border object-cover"
                          src={file.preview}
                          width={16}
                          height={16}
                        />
                      ) : (
                        <IconPaperclip
                          aria-hidden="true"
                          className="opacity-60"
                          size={12}
                        />
                      )}
                    </div>
                    <span className="inline truncate overflow-hidden pr-1.5">
                      {file.name}
                    </span>
                  </span>
                  <button
                    className="text-muted-foreground focus-visible:bg-accent focus-visible:ring-ring focus-visible:ring-offset-background absolute right-1 z-10 rounded-sm p-0.5 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2"
                    onClick={() => handleRemoveFile(file.id)}
                    type="button"
                    aria-label={t("removeFile")}
                  >
                    <IconX aria-hidden="true" size={12} />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          <Textarea
            className="max-h-50 min-h-12 resize-none rounded-none border-none bg-transparent! p-0 text-sm shadow-none focus-visible:border-transparent focus-visible:ring-0"
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={t("placeholder")}
            value={prompt}
          />

          <div className="flex items-center gap-1">
            <div className="flex items-end gap-0.5 sm:gap-1">
              <input
                className="sr-only"
                multiple
                onChange={handleFileSelect}
                ref={fileInputRef}
                type="file"
                aria-hidden="true"
                tabIndex={-1}
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="ml-[-2px] rounded-md"
                    size="icon-sm"
                    type="button"
                    variant="ghost"
                    aria-label={t("addAttachments")}
                  >
                    <IconPlus aria-hidden="true" size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="max-w-xs rounded-2xl p-1.5">
                  <DropdownMenuGroup className="space-y-1">
                    {attachmentActions.map((action) => (
                      <DropdownMenuItem
                        key={action.id}
                        className="rounded-md text-xs"
                        onClick={() => {
                          if (action.id === "files") {
                            fileInputRef.current?.click();
                          }
                        }}
                      >
                        <div className="flex items-center gap-2">
                          {renderIcon(action.icon, 16, "text-muted-foreground")}
                          <span>{t(`attachmentActions.${action.id}.label`)}</span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="rounded-md"
                    size="icon-sm"
                    type="button"
                    variant="ghost"
                    aria-label={t("adjustSettings")}
                  >
                    <IconAdjustmentsHorizontal aria-hidden="true" size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 rounded-2xl p-3">
                  <DropdownMenuGroup className="space-y-3">
                    {settingsConfig.map((setting) => {
                      const fieldId = settingFieldId(setting.id);
                      return (
                        <div
                          key={setting.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            {renderIcon(setting.icon, 16, "text-muted-foreground")}
                            <Label htmlFor={fieldId} className="text-xs">
                              {t(`settings.${setting.id}.label`)}
                            </Label>
                          </div>
                          <Switch
                            id={fieldId}
                            checked={settings[setting.id] ?? false}
                            className="scale-75"
                            onCheckedChange={(value) => updateSetting(setting.id, value)}
                          />
                        </div>
                      );
                    })}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
              <Button
                className="rounded-md"
                disabled={!prompt.trim()}
                size="icon-sm"
                type="submit"
                variant="default"
                aria-label={t("send")}
              >
                <IconArrowUp aria-hidden="true" size={16} />
              </Button>
            </div>
          </div>

          <div
            className={cn(
              "border-border bg-muted text-foreground pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-[inherit] border border-dashed text-sm transition-opacity duration-200",
              isDragOver ? "opacity-100" : "opacity-0",
            )}
          >
            <span className="flex w-full items-center justify-center gap-1 font-medium">
              <IconCirclePlus aria-hidden="true" className="min-w-4" size={16} />
              {t("dropMessage")}
            </span>
          </div>
        </form>
      </div>

      <div className="mx-auto flex min-h-0 max-w-250 shrink-0 flex-wrap items-center justify-center gap-3">
        {quickActions.map((action) => (
          <Button
            type="button"
            className="gap-2 rounded-full"
            key={action.id}
            size="sm"
            variant="outline"
          >
            {renderIcon(action.icon, 16)}
            {t(`quickActions.${action.id}.label`)}
          </Button>
        ))}
      </div>
    </section>
  );
}
