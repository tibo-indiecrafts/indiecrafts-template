"use client";

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
import { useScopedT } from "@/i18n/scoped-t";
import { fileUpload02Namespace } from "./config";
import type { FileUploadBlock } from "./schema";

/**
 * Minimal workspace-setup card with workspace-name + single file
 * input. Sourced from `@blocks-so/file-upload-02`.
 */
export default function FileUpload(props: Readonly<FileUploadBlock>) {
  const [t, tr] = useScopedT(fileUpload02Namespace);
  const accept = props.accept ?? ".csv,.xlsx,.xls";
  const titleId = `${props.id}-title`;
  const workspaceId = `${props.id}-workspace`;
  const fileId = `${props.id}-file`;

  return (
    <section aria-labelledby={titleId} className="w-full">
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle id={titleId}>{tr(props.titleKey, "title")}</CardTitle>
          <CardDescription>{tr(props.descriptionKey, "description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form action="#" method="POST">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor={workspaceId}>
                  {t("workspaceLabel")}{" "}
                  <span className="text-destructive">{t("required")}</span>
                </Label>
                <Input
                  type="text"
                  id={workspaceId}
                  name="workspace-name"
                  autoComplete="off"
                  placeholder={t("workspacePlaceholder")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={fileId}>
                  {t("fileLabel")}{" "}
                  <span className="text-destructive">{t("required")}</span>
                </Label>
                <Input id={fileId} name="file" type="file" accept={accept} />
                <p className="text-muted-foreground text-sm text-pretty">
                  {t("fileHelp")}
                </p>
              </div>
            </div>
            <div className="mt-8 flex justify-end space-x-3">
              <Button type="button" variant="outline">
                {t("cancel")}
              </Button>
              <Button type="submit">{t("submit")}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
