import Image from "next/image";

export const UsersIllustration = () => {
  return (
    <div
      aria-hidden
      className="before:bg-card before:ring-border-illustration relative mx-auto w-fit min-w-2xs before:absolute before:inset-x-2 before:top-2 before:-bottom-2 before:rounded-2xl before:opacity-75 before:shadow before:ring-1"
    >
      <div className="bg-illustration ring-border-illustration relative flex flex-col gap-2 rounded-2xl px-5 py-4 shadow-md ring-1 shadow-black/6.5 backdrop-blur">
        <div className="text-muted-foreground text-sm">09:30 am</div>

        <div className="flex items-center -space-x-2">
          {[
            {
              src: "https://avatars.githubusercontent.com/u/47919550?v=4",
              alt: "Méschac Irung",
            },
            {
              src: "https://avatars.githubusercontent.com/u/31113941?v=4",
              alt: "Bernard Ngandu",
            },
            {
              src: "https://avatars.githubusercontent.com/u/68236786?v=4",
              alt: "Théo Balick",
            },
            {
              src: "https://avatars.githubusercontent.com/u/99137927?v=4",
              alt: "Glodie Lukose",
            },
          ].map((avatar, index) => (
            <div
              key={index}
              className="bg-background size-7 rounded-full border p-0.5 shadow shadow-zinc-950/5 *:rounded-full"
            >
              <Image
                src={avatar.src}
                className="aspect-square rounded-[calc(var(--avatar-radius)-2px)] object-cover"
                alt={avatar.alt}
                width="60"
                height="60"
              />
            </div>
          ))}
        </div>
        <div className="text-foreground text-sm font-medium">Daily Meeting</div>
      </div>
    </div>
  );
};

export default UsersIllustration;
