import { defineArrayMember, defineField } from "sanity";
import { defineModule } from "../objects/define-module";

export default defineModule({
  name: "module.hero-split",
  title: "Hero (split)",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "content", title: "Content", type: "blockContent" }),
    defineField({
      name: "ctas",
      title: "Call-to-action buttons",
      type: "array",
      of: [defineArrayMember({ type: "cta" })],
      validation: (Rule) => Rule.max(2),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true, metadata: ["lqip"] },
    }),
    defineField({
      name: "imagePosition",
      title: "Image position",
      type: "string",
      options: {
        list: [
          { title: "Right", value: "right" },
          { title: "Left", value: "left" },
        ],
        layout: "radio",
      },
      initialValue: "right",
    }),
  ],
});
