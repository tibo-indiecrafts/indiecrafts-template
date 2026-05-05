"use client";

import { FileSpreadsheet, Upload, X } from "lucide-react";
import { Button } from "@/components/ui-primitives/button";
import { Label } from "@/components/ui-primitives/label";
import { useScopedT } from "@/i18n/scoped-t";
import { fileUpload05Namespace } from "./config";
import type { FileUploadBlock } from "./schema";

/**
 * Minimal upload form with drop zone + a static completed-upload
 * card. Sourced from `@blocks-so/file-upload-05`.
 */
export default function FileUpload(props: Readonly<FileUploadBlock>) {
  const [t, tr] = useScopedT(fileUpload05Namespace);
  const titleId = `${props.id}-title`;
  const fileId = `${props.id}-file`;

  return (
    <section
      aria-labelledby={titleId}
      className="flex w-full max-w-lg items-center justify-center sm:mx-auto sm:max-w-lg"
    >
      <form className="w-full">
        <h3 id={titleId} className="text-foreground text-lg font-semibold text-balance">
          {tr(props.titleKey, "title")}
        </h3>
        <div className="border-input mt-4 flex justify-center space-x-4 rounded-md border border-dashed px-6 py-10">
          <div className="sm:flex sm:items-center sm:gap-x-3">
            <Upload
              aria-hidden="true"
              className="text-muted-foreground mx-auto h-8 w-8 sm:mx-0 sm:h-6 sm:w-6"
            />
            <div className="text-foreground mt-4 flex text-sm leading-6 sm:mt-0">
              <p>{t("dragPrefix")}</p>
              <Label
                htmlFor={fileId}
                className="text-primary relative cursor-pointer rounded-sm pl-1 font-medium hover:underline hover:underline-offset-4"
              >
                <span>{t("chooseFile")}</span>
                <input
                  id={fileId}
                  name="file"
                  type="file"
                  accept={props.accept}
                  className="sr-only"
                />
              </Label>
              <p className="pl-1 text-pretty">{t("uploadSuffix")}</p>
            </div>
          </div>
        </div>
        <p className="text-muted-foreground mt-2 flex items-center justify-between text-xs leading-5 text-pretty">
          {t("fileInfo")}
        </p>
        <div className="bg-muted relative mt-8 rounded-lg p-3">
          <div className="absolute top-1 right-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground rounded-sm p-2"
              aria-label={t("remove")}
            >
              <X aria-hidden="true" className="size-4 shrink-0" />
            </Button>
          </div>
          <div className="flex items-center space-x-2.5">
            <span className="bg-background ring-input flex h-10 w-10 shrink-0 items-center justify-center rounded-sm shadow-sm ring-1 ring-inset">
              <FileSpreadsheet aria-hidden="true" className="text-foreground size-5" />
            </span>
            <div className="w-full">
              <p className="text-foreground text-xs font-medium text-pretty">
                {t("demoFileName")}
              </p>
              <p className="text-muted-foreground mt-0.5 flex justify-between text-xs text-pretty">
                <span>{t("demoFileSize")}</span>
                <span>{t("demoStatus")}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 flex items-center justify-end space-x-3">
          <Button type="button" variant="outline" className="whitespace-nowrap">
            {t("cancel")}
          </Button>
          <Button type="submit" className="whitespace-nowrap">
            {t("upload")}
          </Button>
        </div>
      </form>
    </section>
  );
}
