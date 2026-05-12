/* eslint-disable -- Tailark Pro upstream verbatim, kept as-is */
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { Container } from "@/components/ui-primitives/grid-2-about-container";

type Role = {
  slug: string;
  title: string;
  location: string;
  time: "full" | "part";
  category: "engeneering" | "marketing" | "compliance" | "data" | "finance";
};

const openRoles: Role[] = [
  {
    slug: "#",
    title: "AI Engineer",
    location: "San Francisco",
    time: "full",
    category: "engeneering",
  },
  {
    slug: "#",
    title: "Design Engineer",
    location: "San Francisco",
    time: "full",
    category: "engeneering",
  },
  {
    slug: "#",
    title: "Product Engineer",
    location: "Remote",
    time: "full",
    category: "engeneering",
  },
  {
    slug: "#",
    title: "Backend Engineer",
    location: "San Francisco",
    time: "full",
    category: "engeneering",
  },
  {
    slug: "#",
    title: "Software Engineer",
    location: "New York",
    time: "full",
    category: "engeneering",
  },
  {
    slug: "#",
    title: "Marketing Manager",
    location: "New York",
    time: "full",
    category: "marketing",
  },
  {
    slug: "#",
    title: "Content Strategist",
    location: "Remote",
    time: "part",
    category: "marketing",
  },
  {
    slug: "#",
    title: "Compliance Officer",
    location: "San Francisco",
    time: "full",
    category: "compliance",
  },
  {
    slug: "#",
    title: "Regulatory Analyst",
    location: "New York",
    time: "full",
    category: "compliance",
  },
  {
    slug: "#",
    title: "Data Scientist",
    location: "Remote",
    time: "full",
    category: "data",
  },
  {
    slug: "#",
    title: "Data Analyst",
    location: "San Francisco",
    time: "full",
    category: "data",
  },
  {
    slug: "#",
    title: "Financial Analyst",
    location: "New York",
    time: "full",
    category: "finance",
  },
  {
    slug: "#",
    title: "Accountant",
    location: "San Francisco",
    time: "part",
    category: "finance",
  },
];

export function HiringSection() {
  return (
    <section>
      <Container asGrid>
        <div className="grid grid-cols-10 gap-px">
          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>

          <div className="col-span-full grid gap-px sm:col-span-8">
            <div data-grid-content className="p-6 @4xl:p-12">
              <div className="flex items-center gap-2">
                <Flame className="text-muted-foreground size-4" />
                <h2 className="text-muted-foreground text-balance">We're hiring</h2>
              </div>
              <p className="text-foreground mt-6 max-w-2xl text-xl font-medium text-balance">
                Join a small, fast-moving team building tools used by thousands of
                developers. We value craft, autonomy, and shipping.
              </p>
            </div>

            <div className="grid gap-px">
              {openRoles.map((role) => (
                <div key={role.title}>
                  <div
                    data-grid-content
                    className="hover:bg-card! relative grid gap-2 overflow-hidden rounded-xl p-4 px-6 shadow-lg shadow-transparent hover:z-1 hover:shadow-indigo-900/5 @4xl:px-12"
                  >
                    <Link
                      href={role.slug}
                      className="font-medium after:absolute after:inset-0"
                    >
                      {role.title}
                    </Link>

                    <div className="flex items-center">
                      <div>
                        <span className="text-muted-foreground">{role.location}</span>{" "}
                        <span className="text-muted-foreground">
                          <span className="capitalize">{role.time}</span>
                          -time
                        </span>
                      </div>
                      <div className="ring-border-illustration bg-card ml-auto flex h-6 items-center rounded-full px-2 shadow ring-1 shadow-black/6.5">
                        <ArrowRight className="group-hover:text-primary size-3.5 not-group-hover:opacity-50" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div data-grid-content className="p-6 @4xl:p-12">
              <p className="text-muted-foreground">
                Don't see a role that fits?{" "}
                <Link href="#" className="text-foreground underline underline-offset-4">
                  Send us a note
                </Link>{" "}
                — we're always looking for exceptional people.
              </p>
            </div>
          </div>

          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>
        </div>
      </Container>
    </section>
  );
}
