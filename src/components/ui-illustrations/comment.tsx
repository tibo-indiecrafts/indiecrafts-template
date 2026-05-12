import Image from "next/image";

const SHADCN_AVATAR = "https://avatars.githubusercontent.com/u/124599?v=4";

export const CommentIllustration = () => {
  return (
    <div
      aria-hidden
      className="bg-foreground/3 ring-border-illustration max-w-2xs overflow-hidden rounded-xl shadow ring-1 shadow-black/6.5"
    >
      <div className="text-muted-foreground bg-illustration border-border-illustration -mx-px rounded-lg border-x border-b p-3 text-sm">
        <div className="mb-3 flex items-center gap-2">
          <div className="before:border-foreground/15 relative size-5 overflow-hidden rounded-full shadow shadow-black/6.5 before:absolute before:inset-0 before:rounded-full before:border">
            <Image
              src={SHADCN_AVATAR}
              alt="shadcn"
              width={32}
              height={32}
              className="rounded-full"
            />
          </div>
          <span className="text-foreground text-xs font-medium">Shadcn</span>
        </div>
        <span>Added corresponding “ghost” stroke lines for both series.</span>
      </div>

      <div className="text-muted-foreground px-3 py-2 text-xs">
        <span>Reply...</span>
      </div>
    </div>
  );
};

export default CommentIllustration;
