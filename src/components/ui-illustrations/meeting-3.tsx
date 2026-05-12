import { Phone, ScreenShare, Video } from "lucide-react";
import Image from "next/image";

export const Meeting3Illustration = () => {
  return (
    <div aria-hidden className="border-border/50 rounded-3xl border p-2">
      <div className="ring-border-illustration bg-card max-w-sm min-w-80 rounded-2xl p-4 shadow-xl ring-1 shadow-black/6.5">
        <Video className="ml-2 size-5 stroke-transparent *:fill-zinc-500/45 *:first:fill-zinc-500" />

        <div className="before:border-foreground/25 relative mt-3 overflow-hidden rounded-lg shadow-md shadow-black/4 before:absolute before:inset-0 before:rounded-lg before:border before:border-dotted">
          <div className="text-shadow absolute bottom-1 left-1 block rounded bg-black/20 px-1 py-0.5 text-xs text-white inset-ring-1 inset-ring-white/15 backdrop-blur">
            Maya
          </div>

          <Image
            src="https://images.unsplash.com/photo-1758598304204-5bec31342d05?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="woman in meet"
            width={800}
            height={300}
          />
        </div>
        <div className="relative flex justify-center px-3 pt-3">
          <div className="text-muted-foreground absolute top-3 bottom-0 left-2 my-auto flex h-fit gap-1 text-xs font-medium">
            5:54
          </div>

          <div className="flex gap-3">
            <div className="bg-foreground/6.5 hover:bg-foreground/10 flex h-7 w-8 cursor-pointer items-center rounded-full">
              <ScreenShare className="m-auto size-4" />
            </div>
            <div className="inset-ring-foreground/20 flex h-7 w-11 cursor-pointer items-center rounded-full bg-rose-500 shadow inset-ring-1">
              <Phone className="m-auto size-4 rotate-136 fill-white stroke-transparent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Meeting3Illustration;
