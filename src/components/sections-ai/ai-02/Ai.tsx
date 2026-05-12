"use client";

import {
  IconAlertTriangle,
  IconArrowUp,
  IconCloud,
  IconFileSpark,
  IconGauge,
  IconPhotoScan,
} from "@tabler/icons-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui-primitives/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui-primitives/select";
import { Textarea } from "@/components/ui-primitives/textarea";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { ai02Models, ai02Namespace, ai02Prompts } from "./config";
import type { AiBlock, AiModel } from "./schema";

const PROMPT_ICONS = {
  IconFileSpark,
  IconGauge,
  IconAlertTriangle,
} as const;

export default function Ai(props: Readonly<AiBlock>) {
  const [t] = useScopedT(ai02Namespace);
  const prompts = props.prompts ?? ai02Prompts;
  const models = props.models ?? ai02Models;
  const titleId = `${props.id}-title`;
  const initialModel = models[0];
  const [inputValue, setInputValue] = useState("");
  const [selectedModel, setSelectedModel] = useState<AiModel>(initialModel);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handlePromptClick = (prompt: string) => {
    if (inputRef.current) {
      inputRef.current.value = prompt;
      setInputValue(prompt);
      inputRef.current.focus();
    }
  };

  const handleModelChange = (value: string) => {
    const model = models.find((m) => m.value === value);
    if (model) {
      setSelectedModel(model);
    }
  };

  const renderMaxBadge = () => (
    <div className="border-border flex h-[14px] items-center gap-1.5 rounded border px-1 py-0">
      <span
        className="text-[9px] font-bold uppercase"
        style={{
          background: "linear-gradient(to right, rgb(129, 161, 193), rgb(125, 124, 155))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {t("maxBadge")}
      </span>
    </div>
  );

  return (
    <section aria-labelledby={titleId} className="flex w-full justify-center">
      <h2 id={titleId} className="sr-only">
        {t("title")}
      </h2>

      <div className="flex w-[calc(42rem-5rem)] flex-col gap-4">
        <div className="bg-card border-border flex min-h-[120px] cursor-text flex-col rounded-2xl border shadow-lg">
          <div className="relative max-h-[258px] flex-1 overflow-y-auto">
            <Textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t("placeholder")}
              className="text-foreground min-h-[48.4px] w-full resize-none border-0 bg-transparent! p-3 text-[16px] break-words whitespace-pre-wrap shadow-none transition-[padding] duration-200 ease-in-out outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <div className="flex min-h-[40px] items-center gap-2 p-2 pb-1">
            <div className="bg-muted aspect-1 flex items-center gap-1 rounded-full p-1.5 text-xs">
              <IconCloud aria-hidden="true" className="text-muted-foreground h-4 w-4" />
            </div>

            <div className="relative flex items-center">
              <Select value={selectedModel.value} onValueChange={handleModelChange}>
                <SelectTrigger className="text-muted-foreground hover:text-foreground w-fit border-none bg-transparent! p-0 text-sm shadow-none focus:ring-0">
                  <SelectValue>
                    {selectedModel.max ? (
                      <div className="flex items-center gap-1">
                        <span>{t(`models.${selectedModel.value}.name`)}</span>
                        {renderMaxBadge()}
                      </div>
                    ) : (
                      <span>{t(`models.${selectedModel.value}.name`)}</span>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      {model.max ? (
                        <div className="flex items-center gap-1">
                          <span>{t(`models.${model.value}.name`)}</span>
                          {renderMaxBadge()}
                        </div>
                      ) : (
                        <span>{t(`models.${model.value}.name`)}</span>
                      )}
                      <span className="text-muted-foreground block text-xs">
                        {t(`models.${model.value}.description`)}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground hover:text-foreground transition-colors duration-100 ease-out"
                aria-label={t("attachImages")}
              >
                <IconPhotoScan aria-hidden="true" className="h-5 w-5" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className={cn(
                  "bg-primary cursor-pointer rounded-full transition-colors duration-100 ease-out",
                  inputValue && "bg-primary hover:bg-primary/90!",
                )}
                disabled={!inputValue}
                aria-label={t("sendMessage")}
              >
                <IconArrowUp
                  aria-hidden="true"
                  className="text-primary-foreground h-4 w-4"
                />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {prompts.map((prompt) => {
            const Icon = PROMPT_ICONS[prompt.icon];
            return (
              <Button
                type="button"
                key={prompt.id}
                variant="ghost"
                className="text-foreground hover:bg-muted/30 dark:bg-muted group flex h-auto items-center gap-2 rounded-full border bg-transparent px-3 py-2 text-sm transition-colors duration-200 ease-out"
                onClick={() => handlePromptClick(t(`prompts.${prompt.id}.prompt`))}
              >
                <Icon
                  aria-hidden="true"
                  className="text-muted-foreground group-hover:text-foreground h-4 w-4 transition-colors"
                />
                <span>{t(`prompts.${prompt.id}.text`)}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
