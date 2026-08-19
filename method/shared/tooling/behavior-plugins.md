# Behavior plugins — concise output, least code

Two opt-in plugins shape **how an AI agent writes and codes** in this repo. Like
CodeGraph and Headroom, they are per-developer and not committed — but they are
**recommended** because they cut token cost and code bloat.

| Plugin                                                     | Governs         | Effect                                                                     |
| ---------------------------------------------------------- | --------------- | -------------------------------------------------------------------------- |
| [**caveman**](https://github.com/JuliusBrussee/caveman)    | Agent **prose** | Terse replies, ~65% fewer output tokens, technical facts kept exact        |
| [**ponytail**](https://github.com/DietrichGebert/ponytail) | Agent **code**  | Writes the least code that works — reuse first, no speculative abstraction |

They are complementary: caveman trims the words, ponytail trims the diff. Neither
touches committed prose — code, comments, commits, and docs stay normal (that is
`.claude/rules/writing-style.md`).

## Install (once per machine)

```bash
claude plugin marketplace add JuliusBrussee/caveman && claude plugin install caveman@caveman
claude plugin marketplace add DietrichGebert/ponytail && claude plugin install ponytail@ponytail
```

## Control

```
/caveman  lite | full | ultra | off      # prose terseness
/ponytail lite | full | ultra | off      # code minimalism
```

Default `full`. Turn off for a session with `off`.

## Edit-time safety scan (security-guidance)

A third opt-in behavior plugin, **[security-guidance](https://github.com/anthropics/claude-code)**
`[plugin]` (`/plugin install security-guidance@anthropic`), scans **every file edit before it lands**
for 9 vulnerability patterns — command injection · XSS · `eval()` · dangerous HTML · pickle
deserialization · `os.system` · … — blocks the edit, and explains + suggests a fix. It alerts **once
per pattern per session** (informative, not nagging). Recommended for every developer.

**Decision: run both.** `safety-net@cc-marketplace` (the wider project-safety net) **and**
`security-guidance` (the focused 9-pattern vuln scan) both run at edit-time. They can **double-warn**
on an overlapping pattern — accepted on purpose: each alerts once per pattern per session, so the
noise is bounded, and two independent scanners miss less than one. Roles:

- **`security-guidance`** = the 9 vuln patterns (injection · XSS · `eval` · dangerous HTML · pickle · `os.system` · …).
- **`safety-net`** = the wider project-safety net (whatever it uniquely catches).

Both feed **defense in depth** with the deeper `/cso` REVIEW batch
(`security-analyzer`/`security-auditor`/`penetration-tester`) + the `@indiecrafts/security` brick +
the `verify` CI gate — the edit-time plugin is the first, cheapest line, not the only one.

## Related

- Agent output style (docs, comments, commits): `.claude/rules/writing-style.md`.
- On-the-fly checks (CLI-in-a-hook, e.g. `a11y-check.mjs`): [on-the-fly checks](../../apps/web/setup/on-the-fly-checks.md).
- Full tooling map: `~/.claude/TOOLING.md`, `~/.claude/COMMANDS.md`.
