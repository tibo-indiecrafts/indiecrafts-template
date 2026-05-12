import Image from "next/image";

export const UserIllustration = () => {
  return (
    <div
      aria-hidden
      className="before:bg-card before:ring-border-illustration relative mx-auto my-6 w-fit before:absolute before:inset-x-2 before:top-2 before:-bottom-2 before:rounded-2xl before:opacity-75 before:shadow before:ring-1"
    >
      <div className="bg-illustration ring-border-illustration relative flex items-center gap-2 rounded-2xl p-1 shadow-md ring-1 shadow-black/6.5 backdrop-blur">
        <div className="before:border-foreground/20 relative size-18 overflow-hidden rounded-xl shadow-md before:absolute before:inset-0 before:rounded-xl before:border">
          <Image
            src="https://avatars.githubusercontent.com/u/124599?v=4"
            alt="shadcn"
            width={136}
            height={136}
          />
        </div>
        <div className="py-1 pr-4">
          <div className="text-sm font-medium">Shadcn</div>
          <div className="mt-1.5 flex items-center gap-3">
            <div>
              <div className="text-foreground/50 text-xs">Expenses</div>
              <div className="mt-0.5 text-sm font-semibold">$32.65k</div>
            </div>
            <div className="bg-border h-7 w-px" />
            <div>
              <div className="text-foreground/50 text-xs">Income</div>
              <div className="mt-0.5 text-sm font-semibold">$2.65k</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserIllustration;
