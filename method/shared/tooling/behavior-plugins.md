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

## Related

- Agent output style (docs, comments, commits): `.claude/rules/writing-style.md`.
- Full tooling map: `~/.claude/TOOLING.md`, `~/.claude/COMMANDS.md`.
