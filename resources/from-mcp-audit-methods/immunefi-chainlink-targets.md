# Immunefi Chainlink Target Identification Guide

## High-Priority Target Categories

### Lending Protocols

**Why**: Heavy oracle usage for liquidation calculations

**Search Terms**: lending, borrow, collateral

**Action Items**:
1. Visit https://immunefi.com/explore/
2. Search for programs with these terms
3. Check if they mention Chainlink in their scope
4. Find their GitHub repository
5. Search for `getRoundData` usage
6. Look for vulnerable patterns

---

### DEX/AMM Protocols

**Why**: Price discovery and TWAP calculations

**Search Terms**: dex, amm, swap, liquidity

**Action Items**:
1. Visit https://immunefi.com/explore/
2. Search for programs with these terms
3. Check if they mention Chainlink in their scope
4. Find their GitHub repository
5. Search for `getRoundData` usage
6. Look for vulnerable patterns

---

### Derivatives Protocols

**Why**: Critical oracle dependency for pricing

**Search Terms**: derivative, perpetual, futures, options

**Action Items**:
1. Visit https://immunefi.com/explore/
2. Search for programs with these terms
3. Check if they mention Chainlink in their scope
4. Find their GitHub repository
5. Search for `getRoundData` usage
6. Look for vulnerable patterns

---

### Yield Farming Protocols

**Why**: Asset valuation and price feeds

**Search Terms**: yield, farm, staking, vault

**Action Items**:
1. Visit https://immunefi.com/explore/
2. Search for programs with these terms
3. Check if they mention Chainlink in their scope
4. Find their GitHub repository
5. Search for `getRoundData` usage
6. Look for vulnerable patterns

---

### Stablecoin Protocols

**Why**: Oracle feeds for peg maintenance

**Search Terms**: stablecoin, peg, usd

**Action Items**:
1. Visit https://immunefi.com/explore/
2. Search for programs with these terms
3. Check if they mention Chainlink in their scope
4. Find their GitHub repository
5. Search for `getRoundData` usage
6. Look for vulnerable patterns

---

## Manual Search Process

1. **Visit Immunefi**: https://immunefi.com/explore/
2. **Filter by**:
   - Blockchain: Ethereum, Polygon, Arbitrum, etc.
   - Category: DeFi, Lending, DEX
3. **Search for**: 'Chainlink', 'oracle', 'price feed'
4. **For each program**:
   - Check if they use Chainlink
   - Find their GitHub repository
   - Use `github-chainlink-hunter.py` to scan it
   - Review for vulnerable patterns

## Vulnerable Pattern Checklist

When reviewing code, look for:

- [ ] `getRoundData(roundId - 1)` or similar arithmetic
- [ ] Loops iterating through `roundId` values
- [ ] TWAP calculations using `getRoundData` in loops
- [ ] Binary search on `roundId`
- [ ] Historical data queries
- [ ] Missing `parseIds()` or `phaseId` handling

## Quick Win Strategy

1. Focus on **lending protocols** first (highest reward potential)
2. Look for **TWAP implementations** (common vulnerable pattern)
3. Check **recently added programs** (less likely to be audited)
4. Target **high TVL protocols** (higher bounties)

