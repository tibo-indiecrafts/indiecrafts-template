/* eslint-disable -- Acme Pro upstream verbatim, kept as-is */
import Image from "next/image";
import { Container } from "@/components/ui-primitives/grid-2-about-container";
import { YCombinator } from "@/components/ui-primitives/svgs/grid-2-about-y-combinator";
import { Sequoia } from "@/components/ui-primitives/svgs/grid-2-about-sequoia";
import { Salesforce } from "@/components/ui-primitives/svgs/grid-2-about-salesforce";

type Investor = {
  name: string;
  avatar: string;
  role: string;
};

const investors: Investor[] = [
  {
    name: "Shadcn",
    avatar: "https://avatars.githubusercontent.com/u/124599?v=4",
    role: "Creator, Shadcn UI",
  },
  {
    name: "Guillermo Rauch",
    avatar: "https://avatars.githubusercontent.com/u/13041?v=4",
    role: "Founder, CEO - Vercel",
  },
  {
    name: "Adam Wathan",
    avatar: "https://avatars.githubusercontent.com/u/4323180?v=4",
    role: "CEO - Tailwind Labs",
  },
  {
    name: "Lee Robinson",
    avatar: "https://avatars.githubusercontent.com/u/9113740?v=4",
    role: "VP of Developer Education - Cursor",
  },
  {
    name: "Tobias Lütke",
    avatar: "https://avatars.githubusercontent.com/u/347?v=4",
    role: "Founder, Shopify",
  },
  {
    name: "Brandon Eich",
    avatar: "https://avatars.githubusercontent.com/u/313317?v=4",
    role: "Founder, Brave Browser",
  },
  {
    name: "Thomas Paul Mann",
    avatar: "https://avatars.githubusercontent.com/u/12066405?v=4",
    role: "Co-Founder, Raycast",
  },
  {
    name: "Paul Copplestone",
    avatar: "https://avatars.githubusercontent.com/u/10214025?v=4",
    role: "Co-Founder, Supabase",
  },
  {
    name: "Dylan Field",
    avatar: "https://avatars.githubusercontent.com/u/159643?v=4",
    role: "Founder, CEO - Figma",
  },
];

export function InvestorsSection() {
  return (
    <section>
      <Container asGrid>
        <div className="grid grid-cols-10 gap-px">
          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>

          <div className="col-span-full grid grid-cols-2 gap-px sm:col-span-8 @md:grid-cols-3">
            <div data-grid-content className="col-span-full p-6 @4xl:p-12">
              <h2 className="text-muted-foreground text-balance">Investors</h2>
              <p className="text-foreground mt-6 max-w-2xl text-xl font-medium text-balance">
                We're proud to be supported by leading venture capital firms and visionary
                angel investors.
              </p>
            </div>

            <div
              data-grid-content
              className="flex items-center justify-center p-6 @4xl:px-12"
            >
              <YCombinator className="size-8 rounded" />
            </div>
            <div
              data-grid-content
              className="flex items-center justify-center p-6 @4xl:px-12"
            >
              <Sequoia className="h-4 w-auto" />
            </div>
            <div
              data-grid-content
              className="flex items-center justify-center p-6 @max-md:col-span-full @4xl:px-12"
            >
              <Salesforce className="h-8 w-auto" />
            </div>
          </div>

          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>
        </div>
      </Container>
      <Container asGrid>
        <div className="grid grid-cols-10 gap-px">
          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>

          <div className="col-span-full grid gap-px sm:col-span-8 @xl:grid-cols-2 @6xl:grid-cols-3">
            <div data-grid-content className="col-span-full p-6 @4xl:p-12">
              <h2 className="text-foreground max-w-2xl text-xl font-medium text-balance">
                Individual investors
              </h2>
            </div>

            {investors.map((investor) => (
              <div
                key={investor.name}
                data-grid-content
                className="flex items-center gap-4 p-6 @xl:@max-6xl:last:col-span-2 @4xl:px-12"
              >
                <div className="before:border-foreground/15 relative size-10 shrink-0 rounded-full before:absolute before:inset-0 before:rounded-full before:border">
                  <Image
                    src={investor.avatar}
                    alt={investor.name}
                    className="size-full rounded-full"
                    width={64}
                    height={64}
                  />
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">{investor.name}</p>
                  <p className="text-muted-foreground text-sm">{investor.role}</p>
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
