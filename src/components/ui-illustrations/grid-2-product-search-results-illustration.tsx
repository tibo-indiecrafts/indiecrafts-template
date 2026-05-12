import { Figma } from "@/components/ui-primitives/svgs/grid-2-product-figma";
import { Drive } from "@/components/ui-primitives/svgs/grid-2-product-drive";
import Image from "next/image";

type Result = {
  title: string;
  content: string;
  filename: string;
  fileIcon: React.ReactNode;
  image: string;
};

const results: Result[] = [
  {
    title: "Hero Section Illustrations Pack",
    content:
      "A collection of 24 hand-crafted illustrations perfect for landing pages, featuring abstract shapes and gradients...",
    filename: "hero-illustrations.png",
    fileIcon: <Drive />,
    image:
      "https://images.unsplash.com/photo-1709803983276-7bcb343e3a9f?q=80&w=1276&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Acme Design System v2.0",
    content:
      "Complete documentation for colors, typography, spacing tokens, and 50+ reusable UI components...",
    filename: "acme-ds.fig",
    fileIcon: <Figma />,
    image:
      "https://images.unsplash.com/photo-1634322487121-ba84c23cbc78?q=80&w=1335&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Marketing Illustration Library",
    content:
      "Over 100 customizable vector illustrations for marketing campaigns, social media, and product showcases...",
    filename: "marketing-illustrations.png",
    fileIcon: <Drive />,
    image:
      "https://images.unsplash.com/photo-1613206468203-fa00870edf79?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export const SearchResultsIllustration = () => {
  return (
    <div className="bg-illustration ring-border-illustration divide-y overflow-hidden rounded-2xl shadow-2xl ring-1 shadow-black/15">
      {results.map((result, index) => (
        <div
          key={index}
          className="hover:bg-foreground/3 flex cursor-pointer gap-4 p-4 select-none"
        >
          <div className="relative h-fit">
            <div className="before:border-foreground/5 relative size-10 overflow-hidden rounded-lg before:absolute before:inset-0 before:rounded-lg before:border">
              <Image src={result.image} alt={result.title} width={120} height={120} />
            </div>
            <div className="bg-background absolute right-0 bottom-0 flex size-5 translate-1/2 items-center justify-center rounded-full *:size-3">
              {result.fileIcon}
            </div>
          </div>

          <div className="flex-1 space-y-1">
            <div className="line-clamp-1 font-medium">{result.title}</div>
            <span className="text-foreground block text-xs">
              From <span className="text-muted-foreground"> {result.filename}</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
