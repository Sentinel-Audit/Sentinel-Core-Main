# Fuzzing — MCP-Audit-methods

Central index for **fuzzing strategies, invariants, and resources** across smart contract protocol types. Combines:

- **Local resources** (this repo: protocol-vulnerabilities-index, solidity-fuzzing-comparison, SolidityGuard fuzz-generator, cursor-rules)
- **External/GitHub resources** (Foundry, Echidna, Medusa, DF3NDR, Recon-Fuzz, etc.)

Use this folder when designing or extending fuzz tests so invariants and must-fuzz functions are aligned with known vulnerability categories and best practices.

---

## Structure

| Folder | Focus | Start here for |
|--------|--------|------------------|
| **00-General** | Tools, handler pattern, common invariants (solvency, access, state) | Any protocol; Foundry/Echidna setup; ghost variables |
| **01-AMM-DEX** | AMM/DEX/Liquidity Manager | Swap/liquidity invariants, rounding, slippage, permit/signature replay |
| **02-Lending** | Lending, CDP, RWA Lending | Solvency, interest accrual, liquidation, oracle |
| **03-Bridge-CrossChain** | Bridge, Cross-chain | Message replay, validator set, token locking |
| **04-NFT-Marketplace** | NFT Marketplace, NFT Lending | Listing/cancel, signature replay, royalty |
| **05-Yield-Aggregator** | Yield, Yield Aggregator, Staking Pool | Share inflation, reward accounting, slippage |

---

## Quick start (current use case: AMM)

1. Read **01-AMM-DEX/README.md** and **01-AMM-DEX/invariants-and-properties.md**.
2. Implement or extend tests using **01-AMM-DEX/must-fuzz-functions.md** and **00-General/handler-pattern.md**.
3. Cross-check edge cases with **01-AMM-DEX/strategies-and-edge-cases.md** and **web3-security-repos/kadenzipfel/protocol-vulnerabilities-index/categories/dexes/**.

---

## Local paths (in this repo)

- **Protocol vulnerability categories (by type):** `web3-security-repos/kadenzipfel/protocol-vulnerabilities-index/categories/<protocol>/`
- **Fuzz examples (Foundry/Echidna):** `web3-security-repos/solidity-fuzzing-comparison/test/`
- **Fuzz generator (handler + invariants):** `web3-security-repos/SolidityGuard/.claude/skills/solidity-guard/skills/fuzz-generator/SKILL.md`
- **Cursor rule (formal verification + fuzzing):** `cursor-rules/formal-verification-fuzzing.mdc`
- **Audit intel index:** `cursor-rules/audit-intel-index.mdc`

---

## Running fuzz tests (Limit Break AMM)

From `audits/Limit Break AMM/lbamm-hooks-and-handlers`:

```bash
# All tests including fuzz
forge test

# Fuzz suite only (permit + invariants; see 01-AMM-DEX)
forge test --match-contract FuzzSuite

# Liquidity add-then-remove fuzz (invariant #13)
forge test --match-contract ModuleLiquidityTest --match-test testFuzz_liquidity

# Invariant tests only (more runs)
forge test --match-test "invariant_" --fuzz-runs 500
```

Tests aligned with **01-AMM-DEX**: permit (deadline, nonce, amount), add-then-remove balance invariant in `ModuleLiquidityTest.testFuzz_liquidity_addThenRemove_balance_invariant`, overflow/underflow in unchecked blocks.
