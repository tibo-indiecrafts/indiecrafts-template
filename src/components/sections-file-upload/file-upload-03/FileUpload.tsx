"use client";

import { File, Trash } from "lucide-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui-primitives/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui-primitives/card";
import { Input } from "@/components/ui-primitives/input";
import { Label } from "@/components/ui-primitives/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui-primitives/select";
import { Separator } from "@/components/ui-primitives/separator";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { fileUpload03Namespace, fileUpload03VisibilityOptions } from "./config";
import type { FileUploadBlock } from "./schema";

/**
 * Cloud-storage setup card with bucket-name + visibility +
 * react-dropzone drop zone. Sourced from `@blocks-so/file-upload-03`.
 */
export default function FileUpload(props: Readonly<FileUploadBlock>) {
  const [t, tr] = useScopedT(fileUpload03Namespace);
  const visibilityOptions = props.visibilityOptions ?? fileUpload03VisibilityOptions;
  const titleId = `${props.id}-title`;
  const bucketId = `${props.id}-bucket`;
  const visibilityId = `${props.id}-visibility`;
  const fileId = `${props.id}-file`;

  const [files, setFiles] = useState<File[]>([]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => setFiles(acceptedFiles),
  });

  const filesList = files.map((file) => (
    <li key={file.name} className="relative">
      <Card className="relative p-4 shadow-none">
        <div className="absolute top-1/2 right-4 -translate-y-1/2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t("removeFile")}
            onClick={() => setFiles((prev) => prev.filter((f) => f.name !== file.name))}
          >
            <Trash aria-hidden="true" className="h-5 w-5" />
          </Button>
        </div>
        <CardContent className="flex items-center space-x-3 p-0">
          <span className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-md">
            <File aria-hidden="true" className="text-foreground h-5 w-5" />
          </span>
          <div>
            <p className="text-foreground font-medium text-pretty">{file.name}</p>
            <p className="text-muted-foreground mt-0.5 text-sm text-pretty">
              {file.size} {t("bytes")}
            </p>
          </div>
        </CardContent>
      </Card>
    </li>
  ));

  return (
    <section aria-labelledby={titleId} className="w-full">
      <Card className="shadow-none sm:mx-auto sm:max-w-xl">
        <CardHeader>
          <CardTitle id={titleId}>{tr(props.titleKey, "title")}</CardTitle>
          <CardDescription>{tr(props.descriptionKey, "description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form action="#" method="post">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
              <div className="col-span-full sm:col-span-3">
                <Label htmlFor={bucketId} className="font-medium">
                  {t("bucketLabel")}
                </Label>
                <Input
                  type="text"
                  id={bucketId}
                  name="bucket-name"
                  placeholder={t("bucketPlaceholder")}
                  className="mt-2"
                />
              </div>
              <div className="col-span-full sm:col-span-3">
                <Label htmlFor={visibilityId} className="font-medium">
                  {t("visibilityLabel")}
                </Label>
                <Select defaultValue={props.defaultVisibility} disabled>
                  <SelectTrigger
                    id={visibilityId}
                    name="visibility"
                    className="mt-2 w-full"
                  >
                    <SelectValue placeholder={t("visibilityPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {visibilityOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {t(`visibility.${option.id}.label`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-muted-foreground mt-2 text-sm text-pretty">
                  {t("visibilityHelp")}
                </p>
              </div>
              <div className="col-span-full">
                <Label htmlFor={fileId} className="font-medium">
                  {t("fileLabel")}
                </Label>
                <div
                  {...getRootProps()}
                  className={cn(
                    isDragActive
                      ? "border-primary bg-primary/10 ring-primary/20 ring-2"
                      : "border-border",
                    "mt-2 flex justify-center rounded-md border border-dashed px-6 py-20 transition-colors duration-200",
                  )}
                >
                  <div>
                    <File
                      aria-hidden="true"
                      className="text-muted-foreground/80 mx-auto h-12 w-12"
                    />
                    <div className="text-muted-foreground mt-4 flex">
                      <p>{t("dragPrefix")}</p>
                      <Label
                        htmlFor={fileId}
                        className="text-primary hover:text-primary/80 relative cursor-pointer rounded-sm pl-1 font-medium hover:underline hover:underline-offset-4"
                      >
                        <span>{t("chooseFiles")}</span>
                        <input
                          {...getInputProps()}
                          id={fileId}
                          name="file-upload"
                          type="file"
                          className="sr-only"
                        />
                      </Label>
                      <p className="pl-1 text-pretty">{t("uploadSuffix")}</p>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground mt-2 text-sm leading-5 text-pretty sm:flex sm:items-center sm:justify-between">
                  <span>{t("filesAllowed")}</span>
                  <span className="pl-1 sm:pl-0">{t("maxSize")}</span>
                </p>
                {filesList.length > 0 && (
                  <>
                    <h4 className="text-foreground mt-6 font-medium text-balance">
                      {t("filesToUploadHeading")}
                    </h4>
                    <ul className="mt-4 space-y-4">{filesList}</ul>
                  </>
                )}
              </div>
            </div>
            <Separator className="my-6" />
            <div className="flex items-center justify-end space-x-3">
              <Button type="button" variant="outline">
                {t("cancel")}
              </Button>
              <Button type="submit">{t("upload")}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
