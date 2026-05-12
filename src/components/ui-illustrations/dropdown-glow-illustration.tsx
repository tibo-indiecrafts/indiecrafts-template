import {
  HelpCircle,
  LogOut,
  MessageCircle,
  Plus,
  Settings,
  Settings2,
  User,
} from "lucide-react";
import Image from "next/image";

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

export const DropdownGlowIllustration = () => (
  <div aria-hidden className="relative overflow-hidden rounded-2xl bg-black p-2">
    <div className="absolute inset-0 items-center mask-r-from-50% [background:radial-gradient(150%_115%_at_50%_5%,transparent_25%,var(--color-emerald-500)_60%,var(--color-white)_100%)]" />
    <div className="absolute inset-0 items-center mask-l-from-35% [background:radial-gradient(150%_115%_at_50%_5%,transparent_25%,var(--color-sky-500)_60%,var(--color-white)_100%)]" />

    <div className="relative overflow-hidden rounded-xl border border-dashed border-white/25 bg-white/10 pt-8 shadow-lg shadow-black/20">
      <div className="absolute inset-0 bg-[radial-gradient(var(--color-white)_1px,transparent_1px)] [background-size:12px_12px] opacity-5" />
      <div className="absolute inset-0 translate-y-1/2 rounded-full border border-dotted bg-white/15" />

      <div className="flex items-center justify-center">
        <div className="-mx-4 -mt-4 mask-b-from-55% p-4 pb-0">
          <div className="bg-card border-foreground/10 relative w-56 overflow-hidden rounded-t-2xl border p-1 shadow-lg shadow-black/10 *:cursor-pointer *:rounded-xl">
            {ACCOUNTS.map((account) => (
              <div
                key={account.id}
                className="hover:bg-muted flex items-center gap-2 px-2 py-1"
              >
                <div className="size-4 overflow-hidden rounded-full">
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
    </div>
  </div>
);

function MenuItem({ icon, label }: Readonly<{ icon: React.ReactNode; label: string }>) {
  return (
    <div className="hover:bg-muted flex h-7 items-center gap-2 px-2">
      {icon}
      <span className="text-sm">{label}</span>
    </div>
  );
}
