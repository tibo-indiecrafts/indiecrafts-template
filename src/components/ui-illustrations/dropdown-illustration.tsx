import {
  Ellipsis,
  HelpCircle,
  LogOut,
  MessageCircle,
  Plus,
  Settings,
  Settings2,
  User,
} from "lucide-react";
import Image from "next/image";
import { buttonVariants } from "@/components/ui-primitives/button";

type Account = {
  id: number;
  name: string;
  avatar: string;
};

const ACCOUNTS: readonly Account[] = [
  {
    id: 1,
    name: "Méschac Irung",
    avatar: "https://avatars.githubusercontent.com/u/47919550?v=4",
  },
  {
    id: 2,
    name: "Bernard Ng",
    avatar: "https://avatars.githubusercontent.com/u/31113941?v=4",
  },
  {
    id: 3,
    name: "Theo Ng",
    avatar: "https://avatars.githubusercontent.com/u/68236786?v=4",
  },
  {
    id: 4,
    name: "Glodie Ng",
    avatar: "https://avatars.githubusercontent.com/u/99137927?v=4",
  },
];

export const DropdownIllustration = () => {
  return (
    <div aria-hidden className="flex items-center">
      <div className="bg-muted/25 text-foreground flex items-center gap-2 border-y [mask-image:linear-gradient(to_left,hsla(0,0%,0%,1)15%,transparent_100%)] py-2 pr-1">
        <span className="text-sm">Oxymor NS</span>
        <span className="mx-4 text-sm">$39</span>
        <div
          className={buttonVariants({
            variant: "secondary",
            size: "icon",
            className: "bg-foreground/3! hover:bg-foreground/5!",
          })}
        >
          <Ellipsis className="text-foreground size-4" />
        </div>
      </div>
      <div className="-mx-4 -mt-4 [mask-image:linear-gradient(to_bottom,hsla(0,0%,0%,1)50%,transparent_100%)] p-4 pb-0">
        <div className="bg-illustration ring-border-illustration relative w-56 overflow-hidden rounded-2xl p-1 shadow-xl ring-1 shadow-black/6.5 *:cursor-pointer *:rounded-xl">
          {ACCOUNTS.map((account) => (
            <div
              key={account.id}
              className="hover:bg-foreground/5 flex items-center gap-2 px-2 py-1"
            >
              <div className="before:border-foreground/10 relative size-4 overflow-hidden rounded-full before:absolute before:inset-0 before:rounded-full before:border">
                <Image
                  src={account.avatar}
                  alt={account.name}
                  width={40}
                  height={40}
                  loading="lazy"
                />
              </div>
              <span className="text-foreground text-sm">{account.name}</span>
            </div>
          ))}

          <MenuItem icon={<Plus className="size-4" />} label="Add new account" />
          <hr className="mx-2 my-1" />
          <MenuItem icon={<Settings2 className="size-4" />} label="Preferences" />
          <hr className="mx-2 my-1" />
          <MenuItem icon={<HelpCircle className="size-4" />} label="Help" />
          <MenuItem icon={<MessageCircle className="size-4" />} label="Send feedback" />
          <hr className="mx-2 my-1" />
          <MenuItem icon={<User className="size-4" />} label="My account" />
          <MenuItem icon={<Settings className="size-4" />} label="Settings" />
          <hr className="mx-2 my-1" />
          <MenuItem icon={<LogOut className="size-4" />} label="Sign out" />
        </div>
      </div>
    </div>
  );
};

function MenuItem({ icon, label }: Readonly<{ icon: React.ReactNode; label: string }>) {
  return (
    <div className="hover:bg-foreground/5 flex h-7 items-center gap-2 px-2">
      {icon}
      <span className="text-sm">{label}</span>
    </div>
  );
}
