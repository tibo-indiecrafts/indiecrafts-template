import { Flag, MessageSquare, MoreHorizontal, Paperclip } from "lucide-react";
import Image from "next/image";

const MESCHAC_AVATAR = "https://avatars.githubusercontent.com/u/47919550?v=4";
const SHADCN_AVATAR = "https://avatars.githubusercontent.com/u/124599?v=4";

/**
 * Single-column "In Progress" kanban illustration with three detailed
 * task cards (API Integration, User Testing, Documentation), each
 * showing a priority flag, an avatar stack, and message/attachment
 * counts. Used by `sections-features-expandable/features-expandable-20/`.
 * Mock copy stays hardcoded per the illustration rule. Sourced from
 * `@tailark-pro/expandable-features-20` (upstream `Kanban3Illustration`;
 * renamed to disambiguate from the existing `kanban-illustration` which
 * is the two-column In Progress / Ready for Review variant).
 */
export const KanbanTasksIllustration = () => {
  return (
    <div
      aria-hidden
      className="mask-radial-[100%_100%] mask-radial-from-75% mask-radial-at-top-left pt-1 pl-6"
    >
      <div className="bg-card/50 ring-border-illustration min-w-xs rounded-2xl p-2 shadow-xl ring-1 shadow-black/6.5">
        <div className="mb-2 flex items-center justify-between px-2 pt-1">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-amber-500" />
            <span className="text-sm font-semibold">In Progress</span>
          </div>
          <MoreHorizontal className="text-muted-foreground size-4" />
        </div>

        <div className="space-y-2 *:rounded-xl">
          <TaskCard
            title="API Integration"
            description="Connect payment gateway endpoints"
            flagTone="red"
            avatars={["meschac", "shadcn"]}
            comments={4}
            attachments={2}
          />
          <TaskCard
            title="User Testing"
            description="Run usability tests with beta users"
            flagTone="amber"
            avatars={["shadcn"]}
            comments={2}
          />
          <TaskCard
            title="Documentation"
            description="Write API reference docs"
            flagTone="muted"
            avatars={["meschac"]}
            attachments={1}
          />
        </div>
      </div>
    </div>
  );
};

type FlagTone = "red" | "amber" | "muted";
type AvatarKey = "meschac" | "shadcn";

const FLAG_CLASSES: Record<FlagTone, string> = {
  red: "fill-red-500 text-red-500",
  amber: "fill-amber-500 text-amber-500",
  muted: "text-muted-foreground",
};

const AVATAR_URLS: Record<AvatarKey, { src: string; alt: string }> = {
  meschac: { src: MESCHAC_AVATAR, alt: "Méschac Irung" },
  shadcn: { src: SHADCN_AVATAR, alt: "Shadcn" },
};

function TaskCard({
  title,
  description,
  flagTone,
  avatars,
  comments,
  attachments,
}: Readonly<{
  title: string;
  description: string;
  flagTone: FlagTone;
  avatars: readonly AvatarKey[];
  comments?: number;
  attachments?: number;
}>) {
  return (
    <div className="bg-illustration ring-border-illustration p-3 ring-1">
      <div className="mb-2 flex items-start justify-between">
        <div className="text-sm font-medium">{title}</div>
        <Flag className={`size-3.5 ${FLAG_CLASSES[flagTone]}`} />
      </div>
      <p className="text-muted-foreground mb-3 text-xs">{description}</p>
      <div className="flex items-center justify-between">
        <div className="flex -space-x-1.5">
          {avatars.map((key) => {
            const { src, alt } = AVATAR_URLS[key];
            return (
              <div
                key={key}
                className="size-5 overflow-hidden rounded-full ring-2 ring-white dark:ring-gray-800"
              >
                <Image src={src} alt={alt} width={20} height={20} />
              </div>
            );
          })}
        </div>
        <div className="text-muted-foreground flex items-center gap-2 text-[10px]">
          {comments != null ? (
            <span className="flex items-center gap-0.5">
              <MessageSquare className="size-3" />
              {comments}
            </span>
          ) : null}
          {attachments != null ? (
            <span className="flex items-center gap-0.5">
              <Paperclip className="size-3" />
              {attachments}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
