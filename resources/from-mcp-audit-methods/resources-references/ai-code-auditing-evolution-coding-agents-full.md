# AI code auditing evolution — framework-driven to coding-agent-driven (full reference)

**Source context:** Essay reflecting on AI for security / code auditing (late 2022 → early 2026), including internal CertiK AI Scan perspective. **Views in the original are the author’s own** and are not necessarily those of CertiK. Stored here for **local auditing workflow reference** only.

**§§7–12 + conclusion (full prose):** read [`ai-code-auditing-evolution-sections-7-12-complete.md`](./ai-code-auditing-evolution-sections-7-12-complete.md) — this file keeps §§1–6 complete and summarizes §§7–12 for a single-scroll overview.

**Related links mentioned in original:**

- Anthropic skill creator (Mar 2026): <https://claude.com/blog/improving-skill-creator-test-measure-and-refine-agent-skills>
- OpenAI EVMbench: <https://cdn.openai.com/evmbench/evmbench.pdf>
- Devansh — “Needle in the haystack: LLMs for vulnerability research”: <https://devansh.bearblog.dev/needle-in-the-haystack/>
- Finite Monkey Engine: <https://github.com/BradMoonUESTC/finite-monkey-engine>

---

## 1. What Has AI Code Auditing Gone Through Over the Past Three Years?

If you roughly stretch the timeline from late 2022 to early 2026, the evolution of this field can be divided into two broad phases.

The first phase was dominated by academic exploration while engineering was still in its early stage. This phase lasted roughly until before January 2025, and can itself be split into three smaller moments.

At the beginning, the field was primarily static-analysis-first. The earliest wave of work was, in essence, about getting large models involved in static code analysis. The key ideas of that period were SAST, using large models to interpret business logic, and using LLMs to help identify vulnerability context. Put simply, the core idea was that traditional static analysis would throw code structure at the model, and the model would handle business understanding. Academically, that mattered a lot because it proved for the first time that LLMs were not just useful for code generation. They could also participate in program understanding, security reasoning, and vulnerability discovery. But the limitation was obvious: most of it was still paper-style validation, far from something that could really be used as an engineering product.

Later, the field moved from static toward dynamic methods. Research expanded into more complex approaches, including dynamic analysis, symbolic execution, and tighter integration with traditional program analysis tools. The defining realization of that stage was that static analysis plus a large model was not enough. More runtime, path-level, and constraint-level information had to be brought into the loop. This was also when a number of representative works began to appear, trying from different angles to combine LLMs with traditional security analysis capabilities and push the methodology forward.

By the second half of 2024 and around January 2025, the field entered a relatively mature stage. Maturity did not mean the problem was solved. It meant the consensus had become clearer: models alone were not enough, and traditional tools alone were not enough either. The more realistic path was to combine them more tightly. At this stage, many systems began to take on clearer engineering forms. They were still complex, but they were no longer just paper demos. They were starting to look like real systems.

If I had to summarize this first phase in one sentence, it would be this: from primarily static, to dynamic augmentation, to tool-model integration.

## 2. After 2025, the Real Shift Began

If the previous phase was still mainly academic exploration and early engineering, then starting in 2025, especially from late 2025 into early 2026, the field entered a very different stage: engineering exploded.

The most visible change was that more and more teams were able to build their own "large model + security" systems. In other words, this stopped being something only a few research teams could experiment with. It became an engineering direction that could be broadly attempted, rapidly iterated, and continuously shipped.

But if you only interpret that as "more people started doing it," that still misses the real point. The actual turning point was that the methodology began to shift collectively.

Previously, many systems were organized around workflows and frameworks: using things like LangChain and LangGraph to build flows, manually preprocessing code and documents, manually managing RAG, manually wiring up SAST, AST, dynamic tools, and validation, and then encoding the whole reasoning process into a fixed pipeline.

That made sense at the time, because model capability was weaker and had to be carefully hand-held.

But once the new generation of Coding Agents appeared, the situation started to change. With tools like Claude Code, Codex, and Cursor, many people realized almost at the same moment that the information filtering, tool selection, task decomposition, and flow stitching that developers used to hard-code by hand could increasingly be handed over to the agent itself.

That is why 2026 feels like such a visible milestone. From that point on, the mainstream idea increasingly became: stop hard-coding the entire process with heavy frameworks; stop predefining every workflow step; stop obsessing over manually maintaining large amounts of preprocessing and prompt assembly logic. Instead, give the agent a clear goal, the necessary tools, and some constraints, and let it decide what to read, what to use, and how to proceed, then let it reflect and iterate on the results.

In other words, the field is moving from framework-driven to Coding-Agent-driven.

There is also a sharper and more realistic judgment worth adding here. Before 2026, many companies and people, whether because of path dependence, organizational inertia, or simply lack of understanding, spent years underestimating LLMs and sometimes even dismissing them outright. Then once the direction became obvious, they suddenly wanted to stage a great leap forward, as if the entire capability stack could be caught up overnight. That shift is absurd in itself.

Because what really determines whether a company, a team, or an individual can build something useful has never been how loudly they shout today. It has always been whether they have been accumulating understanding over time. Do they really understand the tendencies, probabilities, and instability boundaries of LLMs? Do they understand when models drift, when they hallucinate, when they should be trusted, and when they must be constrained? And have they actually baked that understanding into products through repeated iteration? Without that accumulation, concentrated effort later on often produces things that look new, but are not genuinely useful.

That is exactly why understanding why this paradigm shift happened matters much more than merely repeating slogans about it. So the next question is obvious: why is the traditional framework-driven route becoming a bad default?

## 3. Why Is the Traditional Framework-Driven Route Becoming Outdated?

One judgment can be stated very directly: it is not that traditional frameworks are completely useless, but that they are no longer a good default starting point for building AI security tools today. The problem is not whether they have value. The problem is that they are increasingly ill-suited as the starting point for a new generation of systems.

The first reason is that the engineering is too heavy. Developers have to solve everything themselves: how to filter material, how to slice code, how to build RAG, how to analyze call relationships, how to insert static analysis results into the loop, how to feed those results back to the model, how to do planning, and how to do validation. Every link in the chain has to be designed, stitched together, and tuned by hand. The end result is usually the same: a huge codebase, a complex workflow, and a system where changing one thing affects everything else.

The second reason is that manual preprocessing is extremely expensive. In many old systems, the heaviest part of the pipeline was essentially deciding in advance what the agent should see and what it should not. To provide the model with a human-predefined "just right" amount of material, teams did a lot of preprocessing: retrieval, slicing, aggregation, extracting call chains, trimming path information, and so on. Those approaches were indeed necessary when model capability was weaker and the amount of readable material was more constrained. But they came with two problems. First, they were complex to engineer. Second, they often made the wrong information decision too early and dropped the key detail before the agent ever got a chance to see it. Many times, what looked like helping the agent understand the code was actually making the wrong filtering decision on the agent’s behalf.

The third reason is that once a workflow is hard-coded, it stops evolving. If you turn the whole system into a fixed flow, for example static analysis, then slicing, then one round of pre-filtering, then the model, then validation, it may look neat. But the real problem is that it becomes frozen. Once the result is bad, it becomes very hard to know what to change. Was it the prompt, retrieval, slicing, planning, or tool ordering? And once model capability changes, the whole fixed flow may become outdated at once.

So the problem with framework-driven systems is not just that they are cumbersome. The deeper problem is that they are not a natural fit for an era in which models are changing rapidly.

## 4. The Effective Method: Reproduce the Human Process First, Then Automate

If I had to compress the whole methodology into one sentence, it would be this: the essence of an agent is reproducing the human process.

One very common misunderstanding is to start by asking how the system should be built. The thing you actually need to figure out first is not what framework to use. It is how a human would do this task, which steps are essential, what information must be obtained, what experience determines result quality, and how the human and the agent should cooperate most smoothly. Only after those questions are clear does automation have a real foundation.

The practical starting point is to let humans and coding agents run the task together first. Do not try to build the final system in one shot. Let a human and the agent complete the task together first.

For example, in root cause analysis, you can begin by pulling the necessary data, then have a human work together with Cursor or Codex, compare the result against ground truth, and if the result is wrong, add more information, adjust the prompt, and change the collaboration pattern until the process works.

The same applies to white-box code auditing. Start by writing an operations guide and let the agent follow it for the first phase, such as breaking down the architecture and building an initial understanding. Then add a more detailed guide and let it continue deeper into vulnerability discovery. The human only intervenes at key points. Once the process becomes stable enough, the human can gradually be removed.

The key to this methodology is not saving effort early. It is discovering the real execution path of the task first.

Once "human + agent" can reliably get the task done, automation becomes an engineering problem. In other words, automation should not be the first step. It should be the last step.

## 5. Handbook, Skill, and Documentation Are Basically the Same Thing

Once you follow the logic above, you naturally arrive at a core question: how should human experience actually be accumulated? That is where an important concept appears: the handbook.

But from another angle, what people today call handbooks, skills, operation manuals, experience docs, and SOPs are all pointing at the same thing: making human experience explicit.

By 2026, many people who were originally unwilling to make experience explicit started actively writing their own skills. The same act of making experience explicit looked like writing docs in 2023, but by 2026 it looked more like writing a program that directly takes effect.

The real value of large models and agents is not that they create experience out of thin air. It is that they can efficiently execute, amplify, transfer, and reuse experience that has already been distilled.

For security teams in particular, the vulnerability samples, attack patterns, and audit experience accumulated over the years are not just background material. They are the core fuel for building agent capability.

## 6. Should We Still Use RAG, Code Slicing, and Traditional Tools?

The answer is not "throw all of them away." The answer is: they can still be used, but they should no longer sit at the center of system design.

Take RAG first. In the Coding Agent era, the more reasonable idea is this: if you genuinely need to search across a large document corpus, then add retrieval. But if the agent can already get what it needs through grep, graph tools, scripts, or file search, then there is no reason to add a heavy RAG layer on top.

The focus should not be on preassembling a standard-answer-style input for the agent. It should be on letting the agent directly access sufficiently complete and sufficiently raw material.

The same is true for code slicing. Many teams spend enormous amounts of time on slicing, only to realize in the end that the system did not become meaningfully stronger.

Traditional security tools still matter too. They are better thought of as external tools the agent can call when necessary. These capabilities can easily be exposed through MCP or similar mechanisms.

## 7. Why Is Code Auditing So Hard, While Other Directions Produce Results More Easily?

Code auditing is fundamentally a graph exploration problem, really an "unknown unknowns" problem.

A mature engineering mindset therefore should stop obsessing over whether everything has been found, and instead shift to a more practical target: convert an effectively infinite vulnerability reasoning space into a finite, reviewable, coverable task space.

Automated iteration is best suited to systems with clear phase boundaries, clear evaluation signals, sufficiently externalized state, and controlled change scope.

## 8. Evaluating AI Security Tools: Coverage, Crit, and the Difference Between "Bug Hunting" and "Auditing"

From the client’s perspective, what they really care about is often not how many more medium or low findings a tool gets on average, but whether it can avoid missing the few issues that actually determine the outcome, especially high severity flaws. For many buyers, crit hit rate is the metric that feels closest to a purchase reason.

The more accurate framing is not coverage versus crit. It is this: coverage is the foundation, and crit is what decides the game.

If the goal is finding bugs, then what you are really evaluating is a high-efficiency executor.

If the goal is auditing, then what you are really evaluating is a team that can hold the floor — planning, coverage, handbooks, checklists, verifiers, regression, and ledgers.

## 9. Why Are Web2 and Web3 So Different, Even Though Both Are Called Auditing?

In Web3, contract security, and complex financial-logic vulnerabilities, the problem gets much harder very quickly — business process flaws, fund-flow logic, economic model issues. They are highly dependent on domain knowledge and accumulated experience.

## 10. A More Suitable Implementation Approach Today

A truly effective system is not one with a locally optimal point. It is one that, as a whole, can both preserve the floor and dig deeply into the tasks that matter.

A genuinely valuable agent needs at least two things. First, an architecture that is light, loosely coupled, and replaceable enough to evolve naturally as models improve. Second, an execution process that is stable, reproducible, and preserves as many intermediate results as possible.

Automated iteration is very much like an electrical closed loop. Do not rewrite the whole system every time a problem appears.

An agent system that needs to iterate quickly should, as much as possible, be designed around a single bottleneck — most problems should converge to a small number of clearly identifiable key links.

## 11. In the Future, the Competition Will Not Just Be About Code Ability, but About Ways of Working

The real gap between teams may be who distills experience better, who designs more iterable execution paths, and who turns complex problems into natural-language programs an agent can execute.

## 12. If You Start Building AI Security Tools Today, Remember These Things

- Do not think about frameworks first. Think about needs and information accessibility first.
- Get humans and agents working together first, then automate.
- Write the experience down — handbooks, skills, SOPs, vulnerability pattern summaries.
- Prioritize tasks that close the loop easily when starting out.
- Design for the next six months, not for the last year.
- Instead of making systems heavier and heavier, it is usually better to make them lighter, more flexible, and more able to evolve alongside agent capability.

## Conclusion (one sentence)

When building AI security tools today, the most important thing is no longer how to assemble the framework, but how to distill the human analysis process and let Coding Agents reproduce, execute, and iterate on it with sufficiently rich material.

---

*End of stored reference. Original publication date in source: ~15 Mar 2026.*
