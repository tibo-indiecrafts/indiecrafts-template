"use client";

import { Plus, UserRoundIcon, X } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui-primitives/avatar";
import { Button } from "@/components/ui-primitives/button";
import {
  Dialog as UIDialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui-primitives/dialog";
import { Input } from "@/components/ui-primitives/input";
import { Label } from "@/components/ui-primitives/label";
import { useScopedT } from "@/i18n/scoped-t";
import { dialog12Namespace } from "./config";
import type { DialogBlock } from "./schema";

const DEFAULT_MAX_FILE_SIZE = 1_048_576;

export default function Dialog(props: Readonly<DialogBlock>) {
  const [t, tr] = useScopedT(dialog12Namespace);
  const [open, setOpen] = useState(props.defaultOpen ?? false);
  const [authorName, setAuthorName] = useState(props.defaultAuthorName ?? "");
  const [titleValue, setTitleValue] = useState(props.defaultTitle ?? "");
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxFileSize = props.maxFileSize ?? DEFAULT_MAX_FILE_SIZE;
  const authorId = `${props.id}-author`;
  const titleId = `${props.id}-title`;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > maxFileSize) {
      window.alert(t("uploadTooLarge"));
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  return (
    <UIDialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{tr(props.triggerKey, "trigger")}</Button>
      </DialogTrigger>
      <DialogContent className="gap-0 rounded-3xl p-0 sm:max-w-lg">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="font-medium text-balance">
            {tr(props.titleKey, "title")}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 px-6 pt-4 pb-6 md:grid-cols-5">
          <div className="flex flex-col items-center justify-center md:col-span-2">
            <div className="relative mb-2">
              <Avatar className="border-muted h-24 w-24 border-2">
                <AvatarImage src={image ?? undefined} alt={t("uploadAvatarAlt")} />
                <AvatarFallback>
                  <UserRoundIcon
                    size={52}
                    className="text-muted-foreground"
                    aria-hidden="true"
                  />
                </AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="icon-sm"
                className="bg-accent hover:bg-accent border-background absolute -top-0.5 -right-0.5 rounded-full border-[3px]"
                onClick={() => {
                  if (image) {
                    setImage(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  } else {
                    triggerFileInput();
                  }
                }}
                aria-label={image ? t("uploadRemove") : t("uploadAdd")}
              >
                {image ? (
                  <X className="text-muted-foreground h-4 w-4" aria-hidden="true" />
                ) : (
                  <Plus className="text-muted-foreground h-3 w-3" aria-hidden="true" />
                )}
                <span className="sr-only">
                  {image ? t("uploadRemove") : t("uploadAdd")}
                </span>
              </Button>
            </div>

            <p className="text-center font-medium text-pretty">
              {tr(props.uploadHeadingKey, "uploadHeading")}
            </p>
            <p className="text-muted-foreground text-center text-sm text-pretty">
              {tr(props.uploadHelpKey, "uploadHelp")}
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
              aria-label={t("uploadAdd")}
            />
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={triggerFileInput}
              type="button"
            >
              {tr(props.uploadCtaKey, "uploadCta")}
            </Button>
          </div>

          <div className="flex flex-col justify-between md:col-span-3">
            <div className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor={authorId} className="flex items-center">
                  {tr(props.authorLabelKey, "authorLabel")}{" "}
                  <span className="text-primary">{t("authorRequired")}</span>
                </Label>
                <Input
                  id={authorId}
                  name="author"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center">
                  <Label htmlFor={titleId}>{tr(props.titleLabelKey, "titleLabel")}</Label>
                </div>
                <Input
                  id={titleId}
                  name="title"
                  value={titleValue}
                  onChange={(e) => setTitleValue(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)} type="button">
                {tr(props.cancelKey, "cancel")}
              </Button>
              <Button className="bg-foreground text-background hover:bg-foreground/90">
                {tr(props.submitKey, "submit")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </UIDialog>
  );
}
