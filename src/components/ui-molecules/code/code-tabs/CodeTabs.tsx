"use client";

import { motion } from "motion/react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type SVGProps,
} from "react";
import type { BundledLanguage } from "shiki/bundle/web";
import { CodeBlock } from "@/components/ui-molecules/code/code-block";
import { Gemini } from "@/components/ui-primitives/svgs/gemini";
import { GooglePaLM } from "@/components/ui-primitives/svgs/google-palm";
import { Replit } from "@/components/ui-primitives/svgs/replit";
import { VSCodium } from "@/components/ui-primitives/svgs/vs-codium";

type CodeBlockKey = "gemini" | "replit" | "vs" | "palm";

type Tab = {
  name: string;
  value: CodeBlockKey;
  lang: BundledLanguage;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const TABS: readonly Tab[] = [
  { name: "Gemini", value: "gemini", lang: "javascript", Icon: Gemini },
  { name: "Replit", value: "replit", lang: "python", Icon: Replit },
  { name: "VSCodium", value: "vs", lang: "php", Icon: VSCodium },
  { name: "Google PaLM", value: "palm", lang: "java", Icon: GooglePaLM },
];

const SAMPLES: Record<CodeBlockKey, string> = {
  gemini: `const axios = require('axios');\n\nconst response = await axios.post('https://api.example.com/data', {\n  key: 'value',\n  anotherKey: 'anotherValue',\n});\n\nconsole.log(response.data);`,
  replit: `import requests\n\nresponse = requests.post('https://api.example.com/data', json={\n    'key': 'value',\n    'anotherKey': 'anotherValue',\n})\n\nprint(response.json())`,
  vs: `<?php\n\n$ch = curl_init();\n\ncurl_setopt($ch, CURLOPT_URL, 'https://api.example.com/data');\ncurl_setopt($ch, CURLOPT_POST, 1);\ncurl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([\n    'key' => 'value',\n    'anotherKey' => 'anotherValue',\n]));\ncurl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\ncurl_setopt($ch, CURLOPT_HTTPHEADER, [\n    'Content-Type: application/json',\n]);\n\n$response = curl_exec($ch);\ncurl_close($ch);\n\necho $response;\n`,
  palm: `import java.net.HttpURLConnection;\n\nURL url = new URL("https://api.example.com/data");\nHttpURLConnection conn = (HttpURLConnection) url.openConnection();\nconn.setRequestMethod("POST");\nconn.setRequestProperty("Content-Type", "application/json");\nconn.setDoOutput(true);\n\nString jsonInputString = "{\\"key\\": \\"value\\", \\"anotherKey\\": \\"anotherValue\\"}";\n\ntry (OutputStream os = conn.getOutputStream()) {\n    byte[] input = jsonInputString.getBytes("utf-8");\n    os.write(input, 0, input.length);\n}\n\nint code = conn.getResponseCode();\nSystem.out.println("Response Code: " + code);`,
};

export default function CodeTabs() {
  const [active, setActive] = useState<CodeBlockKey>("gemini");
  const buttonRefs = useRef<Record<CodeBlockKey, HTMLButtonElement | null>>({
    gemini: null,
    replit: null,
    vs: null,
    palm: null,
  });
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const button = buttonRefs.current[active];
    const parent = button?.parentElement;
    if (!button || !parent) return;
    const parentLeft = parent.getBoundingClientRect().left;
    const buttonLeft = button.getBoundingClientRect().left;
    setIndicator({
      left: buttonLeft - parentLeft + 16,
      width: button.offsetWidth,
    });
  }, [active]);

  const activeTab = useMemo(() => TABS.find((t) => t.value === active)!, [active]);

  return (
    <div
      aria-hidden
      className="ring-border-illustration bg-illustration relative z-10 max-w-[calc(100vw-3rem)] overflow-hidden rounded-2xl border border-transparent pt-6 shadow-lg ring-1 shadow-black/6.5 backdrop-blur"
    >
      <div className="relative z-10 px-3">
        <div className="flex gap-1.5 px-3">
          <div className="bg-muted-foreground/10 border-foreground/5 size-2 rounded-full border" />
          <div className="bg-muted-foreground/10 border-foreground/5 size-2 rounded-full border" />
          <div className="bg-muted-foreground/10 border-foreground/5 size-2 rounded-full border" />
        </div>

        <div className="relative mt-4 flex gap-1">
          <motion.span
            animate={{ x: indicator.left, width: indicator.width }}
            layout
            transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
            className="bg-foreground/5 border-foreground/5 absolute inset-y-0 -left-4 flex rounded-full border"
          />

          {TABS.map(({ name, value, Icon }) => (
            <button
              key={value}
              type="button"
              ref={(el) => {
                buttonRefs.current[value] = el;
              }}
              onClick={() => setActive(value)}
              data-state={active === value ? "active" : ""}
              className="data-[state=active]:text-foreground z-10 flex h-8 items-center gap-1 rounded-full px-3 text-sm duration-150 hover:opacity-50 data-[state=active]:hover:opacity-100"
            >
              <Icon className="m-auto size-4" />
              <span className="font-medium text-nowrap">{name}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="h-76">
        <CodeBlock
          code={SAMPLES[active]}
          lang={activeTab.lang}
          maxHeight={360}
          lineNumbers
          className="-mx-1 [&_pre]:h-74 [&_pre]:min-h-[12rem] [&_pre]:rounded-xl [&_pre]:border-none [&_pre]:!bg-transparent [&_pre]:mask-y-from-85%"
        />
      </div>
    </div>
  );
}
