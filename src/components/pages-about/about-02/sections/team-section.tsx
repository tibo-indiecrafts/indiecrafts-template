import Image from "next/image";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui-primitives/grid-2-about-container";

type Member = {
  name: string;
  position: string;
  image: string;
  decoratorColors: string;
};

const members: Member[] = [
  {
    name: "Sarah Mitchell",
    position: "Co-Founder, CEO",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1361&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    decoratorColors: "from-purple-400 via-blue-400 to-amber-500",
  },
  {
    name: "Marcus Chen",
    position: "Co-Founder, CTO",
    image:
      "https://images.unsplash.com/photo-1629559915090-ee09fc9787c1?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    decoratorColors: "from-purple-400 via-sky-400 to-emerald-500",
  },
  {
    name: "James Rodriguez",
    position: "VP of Engineering",
    image:
      "https://images.unsplash.com/flagged/photo-1595514191830-3e96a518989b?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    decoratorColors: "from-indigo-400 via-blue-400 to-teal-500",
  },
  {
    name: "Emily Watson",
    position: "Head of Product",
    image:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    decoratorColors: "from-purple-400 via-sky-400 to-emerald-500",
  },
  {
    name: "Rachel Kim",
    position: "Chief Marketing Officer",
    image:
      "https://images.unsplash.com/photo-1506863530036-1efeddceb993?q=80&w=2088&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    decoratorColors: "from-pink-400 via-blue-400 to-cyan-500",
  },
  {
    name: "Michael Foster",
    position: "Chief Financial Officer",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    decoratorColors: "from-purple-400 via-blue-400 to-amber-500",
  },
  {
    name: "Amanda Patel",
    position: "Head of Design",
    image:
      "https://images.unsplash.com/photo-1539614474468-f423a2d2270c?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    decoratorColors: "from-pink-400 via-blue-400 to-cyan-500",
  },
  {
    name: "David Thompson",
    position: "Chief Operating Officer",
    image:
      "https://images.unsplash.com/photo-1528892952291-009c663ce843?q=80&w=944&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    decoratorColors: "from-teal-400 via-cyan-400 to-blue-500",
  },
  {
    name: "Sarah Chen",
    position: "Head of Customer Success",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    decoratorColors: "from-rose-400 via-violet-400 to-indigo-500",
  },
];

export function TeamSection() {
  return (
    <section>
      <Container asGrid>
        <div className="grid grid-cols-10 gap-px">
          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>

          <div className="col-span-full grid grid-cols-2 gap-px sm:col-span-8 @3xl:grid-cols-3">
            <div data-grid-content className="col-span-full p-6 @4xl:p-12">
              <h2 className="text-muted-foreground text-balance">Leadership</h2>
              <p className="text-foreground mt-6 max-w-2xl text-xl font-medium text-balance">
                A small team of builders obsessed with craft and developer experience.
              </p>
            </div>

            {members.map((member) => (
              <div
                key={member.name}
                data-grid-content
                className="p-6 @max-3xl:last:hidden @4xl:p-12"
              >
                <div className="before:border-foreground/6.5 relative aspect-5/6 w-24 overflow-hidden rounded-2xl shadow-md shadow-black/3 before:absolute before:inset-0 before:z-1 before:rounded-2xl before:border">
                  <div
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute inset-0 z-1 size-40 rounded-full bg-linear-to-r opacity-25 mix-blend-overlay blur-2xl will-change-transform md:size-72",
                      member.decoratorColors,
                    )}
                  />
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={320}
                    height={540}
                    className="size-full object-cover grayscale"
                  />
                </div>
                <div className="space-y-0.5 pt-3">
                  <p className="text-foreground font-medium">{member.name}</p>
                  <p className="text-muted-foreground text-sm">{member.position}</p>
                </div>
              </div>
            ))}
          </div>

          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>
        </div>
      </Container>
    </section>
  );
}
