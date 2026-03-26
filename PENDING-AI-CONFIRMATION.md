# AI-related content — confirmation before `git push` to GitHub

## Already included in `sentinel-audit-public/` (no extra confirmation needed unless you want to remove them)

- `articles/ai/90-ai-tools-skills-mcp-repos.md` — Copy of `client-ideas/ai/90-AI-Tools-Skills-MCP-Repos.md` (curated links; no secrets).
- `articles/ai/CURATED-AI-SOURCES-INDEX.md` — Describes other AI paths; **does not** ship large subfolders.

## Awaiting your explicit approval before adding to the public repo

| Candidate | Why it needs a decision |
|-----------|-------------------------|
| **`advanced-agents/ai-agent-guardrails/`** (full tree) | Substantial third-party-style project; mirror only if license and maintenance story are clear. Prefer **link + short summary** in Markdown. |
| **`advanced-agents/h1-brain/README.md` only** | Safe as an attributed excerpt (points to Patrik Fehrenbach’s MIT repo); confirm you want Sentinel org to host a copy vs. link-only. |
| **`ai-education-course/AI-For-Beginners/`** | **Do not** bulk-copy into this pack (~10k+ files). Use upstream clone or link in README. |

## Recommended default

- Keep **90-ai-tools-skills-mcp-repos.md** + index.
- Add **one** short new file `articles/ai/h1-brain-overview.md` (2–3 paragraphs + link) **only if** you approve.
- For **ai-agent-guardrails**, add **links** to the GitHub repo if/when you publish it; avoid duplicating the whole codebase here unless you intend to maintain a fork.

**Action:** Reply with which rows to include (e.g. “include h1-brain overview only” / “no guardrails mirror”).
