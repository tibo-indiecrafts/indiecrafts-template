"use client";

import {
  CheckIcon,
  CopyIcon,
  ExternalLink,
  Link as LinkIcon,
  Share2,
} from "lucide-react";
import { useRef, useState } from "react";
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
import { Switch } from "@/components/ui-primitives/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui-primitives/tooltip";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { dialog09Namespace } from "./config";
import type { DialogBlock } from "./schema";

/**
 * Share & collaborate modal — comments toggle, read-only share link
 * with copy-to-clipboard, and copy / preview actions. Sourced from
 * `@blocks-so/dialog-09`.
 */
export default function Dialog(props: Readonly<DialogBlock>) {
  const [t, tr] = useScopedT(dialog09Namespace);
  const [open, setOpen] = useState(props.defaultOpen ?? false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const commentsId = `${props.id}-comments`;
  const shareLinkId = `${props.id}-share-link`;
  const shareUrl = props.shareUrl ?? "";
  const previewHref = props.previewHref ?? shareUrl;

  const handleCopy = () => {
    if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <UIDialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Share2 className="mr-2 h-4 w-4" aria-hidden="true" />
          {tr(props.triggerKey, "trigger")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{tr(props.titleKey, "title")}</DialogTitle>
          <p className="text-muted-foreground text-sm text-pretty">
            {tr(props.descriptionKey, "description")}
          </p>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor={commentsId}>
              {tr(props.commentsLabelKey, "commentsLabel")}
            </Label>
            <Switch id={commentsId} name="comments" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={shareLinkId} className="sr-only">
              {tr(props.shareLinkLabelKey, "shareLinkLabel")}
            </Label>
            <div className="relative">
              <Input
                ref={inputRef}
                id={shareLinkId}
                readOnly
                defaultValue={shareUrl}
                className="pe-9"
              />
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleCopy}
                      className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed"
                      aria-label={copied ? t("copiedShort") : t("copyToClipboard")}
                      disabled={copied}
                      type="button"
                    >
                      <div
                        className={cn(
                          "transition-[transform,opacity] duration-200 ease-out",
                          copied ? "scale-100 opacity-100" : "scale-0 opacity-0",
                        )}
                      >
                        <CheckIcon
                          className="text-primary"
                          size={16}
                          aria-hidden="true"
                        />
                      </div>
                      <div
                        className={cn(
                          "absolute transition-[transform,opacity] duration-200 ease-out",
                          copied ? "scale-0 opacity-0" : "scale-100 opacity-100",
                        )}
                      >
                        <CopyIcon size={16} aria-hidden="true" />
                      </div>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="px-2 py-1 text-xs">
                    {copied ? t("copied") : t("copyToClipboard")}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button className="flex-1 gap-2" onClick={handleCopy} type="button">
              <LinkIcon className="h-4 w-4" aria-hidden="true" />
              {tr(props.copyLinkKey, "copyLink")}
            </Button>
            <Button asChild variant="outline" className="flex-1 gap-2">
              <a href={previewHref} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                {tr(props.previewKey, "preview")}
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </UIDialog>
  );
}
