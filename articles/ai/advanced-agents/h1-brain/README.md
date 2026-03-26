# h1-brain

**Repository:** https://github.com/PatrikFehrenbach/h1-brain  
**Stars:** ~222  
**License:** MIT  
**Language:** Python

## What It Is

MCP server that connects AI assistants (Claude Desktop, Claude Code, etc.) to **HackerOne**. Pulls your bug bounty history, program scopes, and report details into a local SQLite database, then exposes tools for search, analysis, and attack briefings.

Ships with a **pre-built database of 3,600+ publicly disclosed bounty-awarded reports** from HackerOne—full write-ups, weakness types, bounty amounts. The AI uses both your personal data and public knowledge to generate attack briefings.

## Primary Tool: `hack(handle)`

One call does everything:

1. Fetches fresh program scopes from HackerOne API
2. Pulls your past rewarded reports for that program
3. Cross-references your full report history for weakness patterns
4. Identifies untouched bounty-eligible assets
5. Pulls public disclosed reports for the program
6. Suggests attack vectors
7. Returns an attack briefing that puts the AI in offensive mode

## Tools Exposed via MCP

| Category | Tools |
|----------|-------|
| **Your Reports** | `search_reports`, `get_report`, `get_report_summary`, `search_programs`, `search_scopes`, `fetch_attachment` |
| **Public Disclosed** | `search_disclosed_reports`, `get_disclosed_report` |
| **Data Sync** | `fetch_rewarded_reports`, `fetch_programs`, `fetch_program_scopes` |

## Setup

**Requirements:** Python 3.10+, HackerOne API token

```bash
git clone https://github.com/PatrikFehrenbach/h1-brain.git
cd h1-brain
python -m venv venv
source venv/bin/activate   # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
```

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "h1-brain": {
      "command": "/path/to/h1-brain/venv/bin/python",
      "args": ["/path/to/h1-brain/server.py"],
      "env": {
        "H1_USERNAME": "your_hackerone_username",
        "H1_API_TOKEN": "your_api_token"
      }
    }
  }
}
```

### Claude Code

```bash
claude mcp add h1-brain \
  -e H1_USERNAME=your_hackerone_username \
  -e H1_API_TOKEN=your_api_token \
  -- /path/to/h1-brain/venv/bin/python /path/to/h1-brain/server.py
```

## First Run

1. **`fetch_rewarded_reports`** – Pull all your bounty-awarded reports
2. **`fetch_programs`** – Pull all programs you have access to

Public disclosed reports are ready to query immediately—no setup needed.

## Related Docs

- [Bug Bounty Goldfish series](https://patrikfehrenbach.com/) – Walkthrough of h1-brain and bug bounty hunting with AI
- [HackerOne API](https://api.hackerone.com/) – API docs

---

**Recorded:** 2026-02-27
