# Headroom (opt-in context compression)

[Headroom](https://pypi.org/project/headroom-ai/) compresses the context sent to
an AI coding agent before it reaches the model — fewer tokens per turn, same task.
Like [CodeGraph](./codegraph.md), it's a **per-developer opt-in dev tool**: nothing
in the app, build, or CI depends on it, and it's not wired into the repo.

## Install (once per machine)

```bash
pipx install "headroom-ai[all]"   # isolated CLI (Homebrew Python blocks plain pip — PEP 668)
```

## Four modes (transparent → granular)

| Mode           | Command                                  | What                                                                                       |
| -------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------ |
| **1 · Wrap**   | `headroom wrap claude`                   | Intercepts Claude Code, compresses all context automatically. Zero code changes — easiest. |
| **2 · Proxy**  | run agents through the Headroom endpoint | Compress at the API boundary for any tool.                                                 |
| **3 · SDK**    | import in your own code                  | Compress specific payloads programmatically.                                               |
| **4 · Manual** | per-call compress                        | Granular control over what gets compressed.                                                |

Daily use: `headroom wrap claude` — then work as normal.

## Notes

- **Opt-in, not committed** — same stance as CodeGraph; keep it out of the repo /
  `.mcp.json` so client sites never depend on it.
- Verify what's loaded per session with `/context` (Claude Code).
