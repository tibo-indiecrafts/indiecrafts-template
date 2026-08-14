"use client";

import { useState } from "react";
import { Button } from "@indiecrafts/ui/web/button";
import { CommentForm } from "@indiecrafts/blog/user-interface/post/components/CommentForm";

/**
 * Per-comment "Reply" toggle — reveals a compact `<CommentForm>` that threads
 * under `parentId` (1-level). i18n-agnostic: every label is a resolved string
 * from the server `<Comments>`.
 */
export function CommentReply({
  postId,
  parentId,
  replyLabel,
  cancelLabel,
  nameLabel,
  emailLabel,
  bodyLabel,
  consentLabel,
  submitLabel,
  successMessage,
  errorMessage,
}: {
  postId: string;
  parentId: string;
  replyLabel: string;
  cancelLabel: string;
  nameLabel: string;
  emailLabel: string;
  bodyLabel: string;
  consentLabel: string;
  submitLabel: string;
  successMessage: string;
  errorMessage: string;
}) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="text-muted-foreground -ml-2 mt-1 h-7"
        onClick={() => setOpen(true)}
      >
        {replyLabel}
      </Button>
    );
  }

  return (
    <div className="border-border/60 mt-3 border-l-2 pl-4">
      <CommentForm
        postId={postId}
        parentId={parentId}
        compact
        nameLabel={nameLabel}
        emailLabel={emailLabel}
        bodyLabel={bodyLabel}
        consentLabel={consentLabel}
        submitLabel={submitLabel}
        successMessage={successMessage}
        errorMessage={errorMessage}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="text-muted-foreground mt-2 h-7"
        onClick={() => setOpen(false)}
      >
        {cancelLabel}
      </Button>
    </div>
  );
}
