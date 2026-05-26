"use client";

import { HelpCircle, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui-primitives/button";
import { Card, CardContent } from "@/components/ui-primitives/card";
import { Input } from "@/components/ui-primitives/input";
import { Label } from "@/components/ui-primitives/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui-primitives/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui-primitives/tooltip";
import { useScopedT } from "@/components/_lib/scoped-t";
import { cn } from "@/lib/utils";
import { fileUpload01Leads, fileUpload01Namespace } from "./config";
import type { FileUploadBlock } from "./schema";

const DEFAULT_MAX_FILE_SIZE = 4 * 1024 * 1024;

interface UploadedFile {
  file: File;
  previewUrl: string;
  progress: number;
}

export default function FileUpload(props: Readonly<FileUploadBlock>) {
  const [t, tr] = useScopedT(fileUpload01Namespace);
  const leads = props.leads ?? fileUpload01Leads;
  const maxFileSize = props.maxFileSize ?? DEFAULT_MAX_FILE_SIZE;
  const accept = props.accept ?? "image/*";
  const titleId = `${props.id}-title`;
  const projectNameId = `${props.id}-project-name`;
  const projectLeadId = `${props.id}-project-lead`;
  const fileInputId = `${props.id}-file`;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const accepted: UploadedFile[] = [];
    for (const file of Array.from(files)) {
      if (file.size > maxFileSize) {
        window.alert(t("errors.tooLarge"));
        continue;
      }
      accepted.push({
        file,
        previewUrl: URL.createObjectURL(file),
        progress: 0,
      });
    }
    if (accepted.length === 0) return;
    setUploadedFiles((prev) => [...prev, ...accepted]);

    accepted.forEach((entry) => {
      const interval = setInterval(() => {
        setUploadedFiles((prev) =>
          prev.map((existing) => {
            if (existing.file !== entry.file) return existing;
            const next = Math.min(100, existing.progress + Math.random() * 10);
            if (next >= 100) clearInterval(interval);
            return { ...existing, progress: next };
          }),
        );
      }, 300);
    });
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (target: File) => {
    setUploadedFiles((prev) => {
      const filtered: UploadedFile[] = [];
      for (const entry of prev) {
        if (entry.file === target) {
          URL.revokeObjectURL(entry.previewUrl);
          continue;
        }
        filtered.push(entry);
      }
      return filtered;
    });
  };

  return (
    <section aria-labelledby={titleId} className="w-full">
      <Card className="bg-background mx-auto w-full max-w-lg rounded-lg p-0 shadow-md">
        <CardContent className="p-0">
          <div className="p-6 pb-4">
            <h2 id={titleId} className="text-foreground text-lg font-medium text-balance">
              {tr(props.titleKey, "title")}
            </h2>
            <p className="text-muted-foreground mt-1 text-sm text-pretty">
              {tr(props.descriptionKey, "description")}
            </p>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-4 px-6 pb-4">
            <div>
              <Label htmlFor={projectNameId} className="mb-2">
                {t("projectNameLabel")}
              </Label>
              <Input
                id={projectNameId}
                type="text"
                defaultValue={props.defaultProjectName}
              />
            </div>

            <div>
              <Label htmlFor={projectLeadId} className="mb-2">
                {t("projectLeadLabel")}
              </Label>
              <Select defaultValue={props.defaultLeadId}>
                <SelectTrigger id={projectLeadId} className="w-full ps-2">
                  <SelectValue placeholder={t("projectLeadPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {leads.map((lead) => (
                      <SelectItem key={lead.id} value={lead.id}>
                        <Image
                          alt=""
                          aria-hidden="true"
                          className="size-5 rounded"
                          height={20}
                          src={lead.avatarSrc}
                          width={20}
                        />
                        <span className="truncate">{t(`leads.${lead.id}.label`)}</span>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="px-6">
            <button
              type="button"
              className="border-border hover:bg-muted/50 flex w-full flex-col items-center justify-center rounded-md border-2 border-dashed p-8 text-center transition-colors"
              onClick={triggerFileInput}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <span className="bg-muted mb-2 rounded-full p-3">
                <Upload aria-hidden="true" className="text-muted-foreground h-5 w-5" />
              </span>
              <span className="text-foreground text-sm font-medium text-pretty">
                {t("uploadHeading")}
              </span>
              <span className="text-muted-foreground mt-1 text-sm text-pretty">
                {t("uploadHint")}
                <span className="text-primary font-medium">{t("uploadBrowse")}</span>
                {t("uploadLimit")}
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              id={fileInputId}
              className="sr-only"
              accept={accept}
              onChange={(e) => handleFileSelect(e.target.files)}
            />
          </div>

          {uploadedFiles.length > 0 && (
            <ul className="mt-4 space-y-3 px-6 pb-5">
              {uploadedFiles.map((entry) => (
                <li
                  key={entry.previewUrl}
                  className="border-border flex flex-col rounded-lg border p-2"
                >
                  <div className="flex items-center gap-2">
                    <div className="bg-muted row-span-2 flex h-14 w-18 shrink-0 items-center justify-center self-start overflow-hidden rounded-sm">
                      <Image
                        src={entry.previewUrl}
                        alt={entry.file.name}
                        width={72}
                        height={56}
                        unoptimized
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex-1 pr-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-foreground max-w-[250px] truncate text-sm">
                            {entry.file.name}
                          </span>
                          <span className="text-muted-foreground text-sm whitespace-nowrap">
                            {Math.round(entry.file.size / 1024)} KB
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="bg-transparent! hover:text-red-500"
                          onClick={() => removeFile(entry.file)}
                          aria-label={t("removeFile")}
                          type="button"
                        >
                          <Trash2 aria-hidden="true" className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
                          <div
                            className={cn("bg-primary h-full")}
                            style={{ width: `${entry.progress}%` }}
                          />
                        </div>
                        <span className="text-muted-foreground text-xs whitespace-nowrap">
                          {Math.round(entry.progress)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="border-border bg-muted flex items-center justify-between rounded-b-lg border-t px-6 py-3">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground flex items-center"
                  >
                    <HelpCircle aria-hidden="true" className="mr-1 h-4 w-4" />
                    {t("needHelp")}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-background text-foreground border py-3">
                  <div className="space-y-1">
                    <p className="text-[13px] font-medium text-pretty">
                      {t("helpHeading")}
                    </p>
                    <p className="text-muted-foreground dark:text-muted-background max-w-[200px] text-xs text-pretty">
                      {t("helpBody")}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-9 px-4 text-sm font-medium"
              >
                {t("cancel")}
              </Button>
              <Button type="submit" className="h-9 px-4 text-sm font-medium">
                {t("continue")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
