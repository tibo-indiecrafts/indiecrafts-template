import type { TestimonialsBlock } from "./schema";

export const testimonials02Key = "testimonials-02" as const;
export const testimonials02Namespace = "blocks.testimonials-02" as const;

const ADAM_AVATAR = "https://avatars.githubusercontent.com/u/4323180?v=4";
const SHADCN_AVATAR = "https://avatars.githubusercontent.com/u/124599?v=4";
const GLODIE_AVATAR = "https://avatars.githubusercontent.com/u/99137927?v=4";

export const testimonials02Sample: Omit<TestimonialsBlock, "id"> = {
  type: "testimonials-02",
  testimonials: [
    {
      id: "tailwindcss",
      logo: "tailwindcss",
      logoClassName: "h-7 w-44",
      textKey: "blocks.testimonials-02.items.tailwindcss.text",
      avatarUrl: ADAM_AVATAR,
      nameKey: "blocks.testimonials-02.items.tailwindcss.name",
      titleKey: "blocks.testimonials-02.items.tailwindcss.title",
      resultTextKey: "blocks.testimonials-02.items.tailwindcss.result1",
      resultText2Key: "blocks.testimonials-02.items.tailwindcss.result2",
    },
    {
      id: "vercel",
      logo: "vercel",
      logoClassName: "h-7 w-30",
      textKey: "blocks.testimonials-02.items.vercel.text",
      avatarUrl: SHADCN_AVATAR,
      nameKey: "blocks.testimonials-02.items.vercel.name",
      titleKey: "blocks.testimonials-02.items.vercel.title",
      resultTextKey: "blocks.testimonials-02.items.vercel.result1",
      resultText2Key: "blocks.testimonials-02.items.vercel.result2",
    },
    {
      id: "prime",
      logo: "prime-video",
      logoClassName: "h-7 w-20",
      textKey: "blocks.testimonials-02.items.prime.text",
      avatarUrl: GLODIE_AVATAR,
      nameKey: "blocks.testimonials-02.items.prime.name",
      titleKey: "blocks.testimonials-02.items.prime.title",
      resultTextKey: "blocks.testimonials-02.items.prime.result1",
      resultText2Key: "blocks.testimonials-02.items.prime.result2",
    },
  ],
};
