# Curated index — `client-ideas/ai/` (local workspace)

This index describes material in the private `client-ideas` workspace. **It does not copy** large third-party trees into the public pack by default.

| Location (relative to `client-ideas/ai/`) | What it is | Public pack strategy |
|------------------------------------------|------------|------------------------|
| `90-AI-Tools-Skills-MCP-Repos.md` | Single-file curated list | **Included** as [90-ai-tools-skills-mcp-repos.md](90-ai-tools-skills-mcp-repos.md). |
| `advanced-agents/h1-brain/README.md` | Notes on **h1-brain** (HackerOne MCP server) | **Not copied** — confirm if you want a short attributed summary or only the upstream link: https://github.com/PatrikFehrenbach/h1-brain |
| `advanced-agents/ai-agent-guardrails/` | Full project: docs, TypeScript examples, threat model | **Not copied** — third-party style repo; link upstream or mirror only after license review. README: see same path in workspace. |
| `ai-education-course/AI-For-Beginners/` | Microsoft “AI For Beginners” course (notebooks, thousands of files) | **Do not vendor** into this pack — point readers to https://github.com/microsoft/AI-For-Beginners and keep license attribution there. |

## Suggested one-liners for optional future articles

- **h1-brain:** MCP server that syncs HackerOne scope and disclosed reports into SQLite for agent-assisted triage (MIT; external project).
- **ai-agent-guardrails:** Reference architecture for deterministic validation around LLM-driven financial actions (patterns + examples in repo).

Confirm with the repo owner before adding full copies of `ai-agent-guardrails` or course content to the public org repo.
