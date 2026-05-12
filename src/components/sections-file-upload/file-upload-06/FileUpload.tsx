"use client";

import { CheckCircle, FileText, Loader2, Upload, X } from "lucide-react";
import { type ChangeEvent, type DragEvent, useRef, useState } from "react";
import { Button } from "@/components/ui-primitives/button";
import { Card } from "@/components/ui-primitives/card";
import { Progress } from "@/components/ui-primitives/progress";
import { Separator } from "@/components/ui-primitives/separator";
import { logger } from "@/lib/logger";
import { useScopedT } from "@/i18n/scoped-t";
import { fileUpload06Namespace, fileUpload06Uploads } from "./config";
import type { FileUploadBlock, FileUploadUpload } from "./schema";

export default function FileUpload(props: Readonly<FileUploadBlock>) {
  const [t, tr] = useScopedT(fileUpload06Namespace);
  const [uploads, setUploads] = useState<FileUploadUpload[]>(
    props.uploads ?? fileUpload06Uploads,
  );
  const filePickerRef = useRef<HTMLInputElement>(null);
  const dropZoneId = `${props.id}-drop-zone`;

  const openFilePicker = () => filePickerRef.current?.click();

  const onFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files;
    if (selected) logger.info("Files selected", { count: selected.length });
  };

  const onDragOver = (event: DragEvent) => {
    event.preventDefault();
  };

  const onDropFiles = (event: DragEvent) => {
    event.preventDefault();
    const dropped = event.dataTransfer.files;
    if (dropped) logger.info("Files dropped", { count: dropped.length });
  };

  const removeUploadById = (id: string) => {
    setUploads((prev) => prev.filter((file) => file.id !== id));
  };

  const activeUploads = uploads.filter((u) => u.status === "uploading");
  const completedUploads = uploads.filter((u) => u.status === "completed");

  return (
    <section
      aria-labelledby={dropZoneId}
      className="mx-auto flex w-full max-w-sm flex-col gap-y-6"
    >
      <Card
        id={dropZoneId}
        className="group hover:bg-muted/50 flex max-h-[200px] w-full cursor-pointer flex-col items-center justify-center gap-4 border-dashed py-8 text-sm shadow-none transition-colors"
        onDragOver={onDragOver}
        onDrop={onDropFiles}
        onClick={openFilePicker}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openFilePicker();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div className="grid space-y-3">
          <div className="text-muted-foreground flex items-center gap-x-2">
            <Upload aria-hidden="true" className="size-5" />
            <div>
              {tr(props.dropMessageKey, "dropPrefix")}{" "}
              <Button
                type="button"
                variant="link"
                className="text-primary h-auto p-0 font-normal"
                onClick={(e) => {
                  e.stopPropagation();
                  openFilePicker();
                }}
              >
                {t("browseFiles")}
              </Button>{" "}
              {t("dropSuffix")}
            </div>
          </div>
        </div>
        <input
          ref={filePickerRef}
          type="file"
          className="hidden"
          accept={props.accept}
          multiple
          onChange={onFileInputChange}
        />
        <span className="text-muted-foreground mt-2 block text-base/6 group-disabled:opacity-50 sm:text-xs">
          {t("supported")}
        </span>
      </Card>

      <div className="flex flex-col gap-y-4">
        {activeUploads.length > 0 && (
          <div>
            <h2 className="text-foreground mb-4 flex items-center font-mono text-lg font-normal text-balance uppercase sm:text-xs">
              <Loader2 aria-hidden="true" className="mr-1 size-4 animate-spin" />
              {t("uploadingHeading")}
            </h2>
            <div className="-mt-2 divide-y">
              {activeUploads.map((file) => (
                <div key={file.id} className="group flex items-center py-4">
                  <div className="bg-muted mr-3 grid size-10 shrink-0 place-content-center rounded border">
                    <FileText
                      aria-hidden="true"
                      className="inline size-4 group-hover:hidden"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="hidden size-4 h-auto p-0 group-hover:inline"
                      onClick={() => removeUploadById(file.id)}
                      aria-label={t("cancel")}
                    >
                      <X aria-hidden="true" className="size-4" />
                    </Button>
                  </div>
                  <div className="mb-1 flex w-full flex-col">
                    <div className="flex justify-between gap-2">
                      <span className="text-foreground text-base/6 select-none group-disabled:opacity-50 sm:text-sm/6">
                        {t(`uploads.${file.id}.name`)}
                      </span>
                      <span className="text-muted-foreground text-sm tabular-nums">
                        {file.progress}%
                      </span>
                    </div>
                    <Progress value={file.progress} className="mt-1 h-2 min-w-64" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeUploads.length > 0 && completedUploads.length > 0 && (
          <Separator className="my-0" />
        )}

        {completedUploads.length > 0 && (
          <div>
            <h2 className="text-foreground mb-4 flex items-center font-mono text-lg font-normal text-balance uppercase sm:text-xs">
              <CheckCircle aria-hidden="true" className="mr-1 size-4" />
              {t("finishedHeading")}
            </h2>
            <div className="-mt-2 divide-y">
              {completedUploads.map((file) => (
                <div key={file.id} className="group flex items-center py-4">
                  <div className="bg-muted mr-3 grid size-10 shrink-0 place-content-center rounded border">
                    <FileText
                      aria-hidden="true"
                      className="inline size-4 group-hover:hidden"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="hidden size-4 h-auto p-0 group-hover:inline"
                      onClick={() => removeUploadById(file.id)}
                      aria-label={t("remove")}
                    >
                      <X aria-hidden="true" className="size-4" />
                    </Button>
                  </div>
                  <div className="mb-1 flex w-full flex-col">
                    <div className="flex justify-between gap-2">
                      <span className="text-foreground text-base/6 select-none group-disabled:opacity-50 sm:text-sm/6">
                        {t(`uploads.${file.id}.name`)}
                      </span>
                      <span className="text-muted-foreground text-sm tabular-nums">
                        {file.progress}%
                      </span>
                    </div>
                    <Progress value={file.progress} className="mt-1 h-2 min-w-64" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
