"use client";

import { File, FileSpreadsheet, X } from "lucide-react";
import { type ChangeEvent, type DragEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui-primitives/button";
import { Card } from "@/components/ui-primitives/card";
import { Progress } from "@/components/ui-primitives/progress";
import { useScopedT } from "@/i18n/scoped-t";
import { fileUpload04Namespace, fileUpload04ValidMimeTypes } from "./config";
import type { FileUploadBlock } from "./schema";

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

/**
 * Single-file spreadsheet upload form with progress card. Sourced
 * from `@blocks-so/file-upload-04`.
 */
export default function FileUpload(props: Readonly<FileUploadBlock>) {
  const [t, tr] = useScopedT(fileUpload04Namespace);
  const accept = props.accept ?? ".csv,.xlsx,.xls";
  const validMimeTypes = props.validMimeTypes ?? fileUpload04ValidMimeTypes;
  const titleId = `${props.id}-title`;
  const fileId = `${props.id}-file`;

  const [uploadState, setUploadState] = useState<{
    file: File | null;
    progress: number;
    uploading: boolean;
  }>({
    file: null,
    progress: 0,
    uploading: false,
  });
  const [showDemo, setShowDemo] = useState(props.showDemoCard ?? true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!validMimeTypes.includes(file.type)) {
      toast.error(t("errors.invalidType"), {
        position: "bottom-right",
        duration: 3000,
      });
      return;
    }

    setUploadState({ file, progress: 0, uploading: true });
    const interval = setInterval(() => {
      setUploadState((prev) => {
        const newProgress = prev.progress + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          return { ...prev, progress: 100, uploading: false };
        }
        return { ...prev, progress: newProgress };
      });
    }, 200);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0]);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleFile(event.dataTransfer.files?.[0]);
  };

  const resetFile = () => {
    setUploadState({ file: null, progress: 0, uploading: false });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileIcon = () => {
    if (!uploadState.file) return <File aria-hidden="true" />;
    const ext = uploadState.file.name.split(".").pop()?.toLowerCase() ?? "";
    return ["csv", "xlsx", "xls"].includes(ext) ? (
      <FileSpreadsheet aria-hidden="true" className="text-foreground h-5 w-5" />
    ) : (
      <File aria-hidden="true" className="text-foreground h-5 w-5" />
    );
  };

  const { file, progress, uploading } = uploadState;

  return (
    <section aria-labelledby={titleId} className="w-full max-w-lg">
      <form className="w-full" onSubmit={(e) => e.preventDefault()}>
        <h3 id={titleId} className="text-foreground text-lg font-semibold text-balance">
          {tr(props.titleKey, "title")}
        </h3>

        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions -- drag-drop file targets are intentional on this surface; the inner <label> opens the picker via keyboard */}
        <div
          className="border-input mt-2 flex justify-center rounded-md border border-dashed px-6 py-12"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <div>
            <File
              aria-hidden="true"
              className="text-muted-foreground mx-auto h-12 w-12"
            />
            <div className="text-muted-foreground flex text-sm leading-6">
              <p>{t("dragPrefix")}</p>
              <label
                htmlFor={fileId}
                className="text-primary relative cursor-pointer rounded-sm pl-1 font-medium hover:underline hover:underline-offset-4"
              >
                <span>{t("chooseFile")}</span>
                <input
                  id={fileId}
                  name="file"
                  type="file"
                  className="sr-only"
                  accept={accept}
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              </label>
              <p className="pl-1 text-pretty">{t("uploadSuffix")}</p>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground mt-2 text-xs leading-5 text-pretty sm:flex sm:items-center sm:justify-between">
          <span>{t("acceptedTypes")}</span>
          <span className="pl-1 sm:pl-0">{t("maxSize")}</span>
        </p>

        {!file && showDemo && (
          <Card className="bg-muted relative mt-8 gap-4 p-4 shadow-none">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-foreground absolute top-1 right-1"
              aria-label={t("remove")}
              onClick={() => setShowDemo(false)}
            >
              <X aria-hidden="true" className="h-5 w-5 shrink-0" />
            </Button>

            <div className="flex items-center space-x-2.5">
              <span className="bg-background ring-border flex h-10 w-10 shrink-0 items-center justify-center rounded-sm shadow-sm ring-1 ring-inset">
                <FileSpreadsheet aria-hidden="true" className="text-foreground h-5 w-5" />
              </span>
              <div>
                <p className="text-foreground text-xs font-medium text-pretty">
                  {t("demoFileName")}
                </p>
                <p className="text-muted-foreground mt-0.5 text-xs text-pretty">
                  {t("demoFileSize")}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Progress value={45} className="h-1.5" />
              <span className="text-muted-foreground text-xs">45%</span>
            </div>
          </Card>
        )}

        {file && (
          <Card className="bg-muted relative mt-8 gap-4 p-4 shadow-none">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-foreground absolute top-1 right-1"
              aria-label={t("remove")}
              onClick={resetFile}
            >
              <X aria-hidden="true" className="h-5 w-5 shrink-0" />
            </Button>

            <div className="flex items-center space-x-2.5">
              <span className="bg-background ring-border flex h-10 w-10 shrink-0 items-center justify-center rounded-sm shadow-sm ring-1 ring-inset">
                {getFileIcon()}
              </span>
              <div>
                <p className="text-foreground text-xs font-medium text-pretty">
                  {file.name}
                </p>
                <p className="text-muted-foreground mt-0.5 text-xs text-pretty">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Progress value={progress} className="h-1.5" />
              <span className="text-muted-foreground text-xs">{progress}%</span>
            </div>
          </Card>
        )}

        <div className="mt-8 flex items-center justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            className="whitespace-nowrap"
            onClick={resetFile}
            disabled={!file}
          >
            {t("cancel")}
          </Button>
          <Button
            type="submit"
            className="whitespace-nowrap"
            disabled={!file || uploading || progress < 100}
          >
            {t("upload")}
          </Button>
        </div>
      </form>
    </section>
  );
}
