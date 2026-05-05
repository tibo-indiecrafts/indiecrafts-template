import type { FeaturesBlock } from "./schema";

export const features20Key = "features-20" as const;
export const features20Namespace = "blocks.features-20" as const;

export const features20Sample: Omit<FeaturesBlock, "id"> = {
  type: "features-20",
  widgets: [
    {
      kind: "icons",
      titleKey: "blocks.features-20.widgets.ides.title",
      icons: ["intellij", "vsCode", "windsurf"],
    },
    {
      kind: "icons",
      titleKey: "blocks.features-20.widgets.llms.title",
      icons: ["gemini", "claude", "openAi"],
    },
    {
      kind: "code",
      titleKey: "blocks.features-20.widgets.cli.title",
      bodyKey: "blocks.features-20.widgets.cli.body",
    },
  ],
};
