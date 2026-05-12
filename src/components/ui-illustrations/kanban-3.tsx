import { MoreHorizontal, Flag, MessageSquare, Paperclip } from "lucide-react";
import Image from "next/image";

const MESCHAC_AVATAR = "https://avatars.githubusercontent.com/u/47919550?v=4";
const SHADCN_AVATAR = "https://avatars.githubusercontent.com/u/124599?v=4";

export const Kanban3Illustration = () => {
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

        <div className="space-y-2 *:rounded-lg">
          <div className="bg-illustration ring-border-illustration p-3 shadow ring-1 shadow-black/6.5">
            <div className="mb-2 flex items-start justify-between">
              <div className="text-sm font-medium">API Integration</div>
              <Flag className="size-3.5 fill-red-500 text-red-500" />
            </div>
            <p className="text-muted-foreground mb-3 text-xs">
              Connect payment gateway endpoints
            </p>
            <div className="flex items-center justify-between">
              <div className="flex -space-x-1.5">
                <div className="size-5 overflow-hidden rounded-full ring-2 ring-white dark:ring-gray-800">
                  <Image
                    src={MESCHAC_AVATAR}
                    alt="Méschac Irung"
                    width={20}
                    height={20}
                  />
                </div>
                <div className="size-5 overflow-hidden rounded-full ring-2 ring-white dark:ring-gray-800">
                  <Image src={SHADCN_AVATAR} alt="Shadcn" width={20} height={20} />
                </div>
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-[10px]">
                <span className="flex items-center gap-0.5">
                  <MessageSquare className="size-3" />4
                </span>
                <span className="flex items-center gap-0.5">
                  <Paperclip className="size-3" />2
                </span>
              </div>
            </div>
          </div>

          <div className="bg-illustration ring-border-illustration p-3 shadow ring-1 shadow-black/6.5">
            <div className="mb-2 flex items-start justify-between">
              <div className="text-sm font-medium">User Testing</div>
              <Flag className="size-3.5 fill-amber-500 text-amber-500" />
            </div>
            <p className="text-muted-foreground mb-3 text-xs">
              Run usability tests with beta users
            </p>
            <div className="flex items-center justify-between">
              <div className="flex -space-x-1.5">
                <div className="size-5 overflow-hidden rounded-full ring-2 ring-white dark:ring-gray-800">
                  <Image src={SHADCN_AVATAR} alt="Shadcn" width={20} height={20} />
                </div>
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-[10px]">
                <span className="flex items-center gap-0.5">
                  <MessageSquare className="size-3" />2
                </span>
              </div>
            </div>
          </div>

          <div className="bg-illustration ring-border-illustration p-3 shadow ring-1 shadow-black/6.5">
            <div className="mb-2 flex items-start justify-between">
              <div className="text-sm font-medium">Documentation</div>
              <Flag className="text-muted-foreground size-3.5" />
            </div>
            <p className="text-muted-foreground mb-3 text-xs">Write API reference docs</p>
            <div className="flex items-center justify-between">
              <div className="flex -space-x-1.5">
                <div className="size-5 overflow-hidden rounded-full ring-2 ring-white dark:ring-gray-800">
                  <Image
                    src={MESCHAC_AVATAR}
                    alt="Méschac Irung"
                    width={20}
                    height={20}
                  />
                </div>
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-[10px]">
                <span className="flex items-center gap-0.5">
                  <Paperclip className="size-3" />1
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kanban3Illustration;
