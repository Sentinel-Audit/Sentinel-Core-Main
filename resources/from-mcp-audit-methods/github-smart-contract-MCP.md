# GitHub MCP Server for Smart Contract Security Auditing

This guide outlines how to use the GitHub MCP server effectively for conducting smart contract security audits.

## Table of Contents
- [Reading Target Contracts](#reading-target-contracts)
- [Searching for Vulnerabilities](#searching-for-vulnerabilities)
- [Creating Structured Audit Reports](#creating-structured-audit-reports)
- [Research & Reference](#research--reference)
- [Practical Audit Workflow Examples](#practical-audit-workflow-examples)
- [Most Useful Features for Auditing](#most-useful-features-for-auditing)
- [Common Audit Patterns](#common-audit-patterns)

---

## Reading Target Contracts

### Read Contract Code Directly
- Read contract code directly from GitHub repos without cloning locally
- Navigate large codebases by reading specific files/paths
- Compare implementations across different versions or forks
- Access contracts from any public repository instantly

### Key Tools:
- `get_file_contents` - Read specific files or directories
- `get_commit` - View contract code at specific commits
- `list_branches` - Check different implementation versions

### Example Use Cases:
- Read main contract files (e.g., `Vault.sol`, `LendingPool.sol`)
- Access interface files to understand expected behavior
- Review test files to understand expected functionality
- Compare proxy vs implementation contracts

---

## Searching for Vulnerabilities

### Search Across All GitHub Repos
- Search for specific vulnerable patterns across all of GitHub
- Find similar code patterns that might have known vulnerabilities
- Search for audit reports and findings in other repos
- Discover how other protocols handle similar security concerns

### Key Tools:
- `search_code` - Search code across all GitHub repositories
- `search_issues` - Find similar vulnerabilities reported elsewhere
- `search_pull_requests` - Find fixes for known vulnerabilities

### Example Search Queries:

#### Reentrancy Patterns
```
language:Solidity "function.*external.*payable" "call.value"
```

#### Unsafe Transfer Usage
```
language:Solidity "transfer(" "payable("
```

#### Oracle Manipulation
```
language:Solidity "latestRoundData" "getPrice"
```

#### Access Control Issues
```
language:Solidity "onlyOwner" "require(msg.sender"
```

#### Liquidation Vulnerabilities
```
language:Solidity "liquidate" "collateral" "debt"
```

---

## Creating Structured Audit Reports

### Track Findings as Issues
- Create issues to track individual findings
- Add detailed descriptions with severity levels
- Link related findings together
- Track status of fixes

### Review Code with Line-Specific Comments
- Add review comments to PRs with line-specific feedback
- Create pending reviews for complex findings
- Submit comprehensive security reviews

### Submit Fixes
- Create PRs with fixes for vulnerabilities
- Include test cases demonstrating the fix
- Link PRs to related issues

### Key Tools:
- `issue_write` - Create/update issues for findings
- `pull_request_review_write` - Add detailed security review comments
- `add_comment_to_pending_review` - Add line-specific comments
- `create_pull_request` - Submit fixes
- `create_or_update_file` - Create fix implementations

---

## Research & Reference

### Compare Security Implementations
- Search for similar protocols to compare security implementations
- Find examples of secure patterns (e.g., how other protocols handle liquidations)
- Access audit reports from other contests
- Study fixes for known vulnerabilities

### Key Tools:
- `search_repositories` - Find similar protocols
- `get_file_contents` - Read secure implementations
- `list_releases` - Check version history
- `get_latest_release` - Access latest secure versions

### Example Research Workflows:

#### Finding Secure Liquidation Patterns
1. Search for protocols with liquidation mechanisms
2. Read their liquidation implementations
3. Compare with target contract
4. Identify best practices

#### Studying Known Vulnerabilities
1. Search issues for similar vulnerability types
2. Read audit reports from other contests
3. Study how vulnerabilities were fixed
4. Apply learnings to current audit

---

## Practical Audit Workflow Examples

### Example 1: Reading and Analyzing a Contract

```typescript
// 1. Read the target contract
get_file_contents(
  owner: "target-org",
  repo: "target-protocol",
  path: "contracts/Vault.sol"
)

// 2. Read related interfaces
get_file_contents(
  owner: "target-org",
  repo: "target-protocol",
  path: "interfaces/IVault.sol"
)

// 3. Check test files for expected behavior
get_file_contents(
  owner: "target-org",
  repo: "target-protocol",
  path: "test/Vault.test.sol"
)
```

### Example 2: Searching for Vulnerable Patterns

```typescript
// Search for unsafe transfer() usage
search_code(
  query: "language:Solidity transfer() payable"
)

// Search for reentrancy patterns
search_code(
  query: "language:Solidity function external payable call.value"
)

// Search for oracle manipulation risks
search_code(
  query: "language:Solidity latestRoundData getPrice oracle"
)
```

### Example 3: Creating an Audit Finding

```typescript
// Create issue for finding
issue_write(
  method: "create",
  owner: "target-org",
  repo: "target-protocol",
  title: "M-01: Unsafe transfer() usage in withdraw()",
  body: `
## Description
The contract uses transfer() which can fail for contracts without receive/fallback.

## Severity
Medium

## Location
contracts/Vault.sol:45

## Recommendation
Use call() with proper reentrancy guards or OpenZeppelin's Address.sendValue()
  `,
  labels: ["bug", "security", "medium"]
)
```

### Example 4: Submitting a Fix

```typescript
// Create branch
create_branch(
  owner: "target-org",
  repo: "target-protocol",
  branch: "fix/unsafe-transfer-usage"
)

// Create fix file
create_or_update_file(
  owner: "target-org",
  repo: "target-protocol",
  branch: "fix/unsafe-transfer-usage",
  path: "contracts/Vault.sol",
  content: "// Fixed implementation using call()",
  message: "Fix: Replace transfer() with call() for better compatibility"
)

// Create PR
create_pull_request(
  owner: "target-org",
  repo: "target-protocol",
  title: "Fix: Use call() instead of transfer()",
  head: "fix/unsafe-transfer-usage",
  base: "main",
  body: "Fixes M-01: Replaces unsafe transfer() with call() pattern"
)
```

### Example 5: Comprehensive Security Review

```typescript
// Create pending review
pull_request_review_write(
  method: "create",
  owner: "target-org",
  repo: "target-protocol",
  pullNumber: 123,
  body: "Security review findings"
)

// Add line-specific comments
add_comment_to_pending_review(
  owner: "target-org",
  repo: "target-protocol",
  pullNumber: 123,
  path: "contracts/Vault.sol",
  body: "M-01: Unsafe transfer() usage. Consider using call() instead.",
  line: 45,
  side: "RIGHT"
)

// Submit review
pull_request_review_write(
  method: "submit_pending",
  owner: "target-org",
  repo: "target-protocol",
  pullNumber: 123,
  event: "REQUEST_CHANGES",
  body: "Please address the security concerns before merging"
)
```

---

## Most Useful Features for Auditing

### 1. `search_code`
**Purpose**: Find vulnerable patterns across all of GitHub

**Use Cases**:
- Find all instances of unsafe patterns (e.g., `transfer()`, `delegatecall()`)
- Discover how other protocols implement similar features
- Locate known vulnerable code patterns

**Example**:
```typescript
search_code(
  query: "language:Solidity selfdestruct create2"
)
```

### 2. `get_file_contents`
**Purpose**: Read contracts without cloning repos

**Use Cases**:
- Quickly access contract code for analysis
- Read multiple files in parallel
- Access specific versions via commit SHA

**Example**:
```typescript
get_file_contents(
  owner: "uniswap",
  repo: "v3-core",
  path: "contracts/UniswapV3Pool.sol"
)
```

### 3. `search_issues`
**Purpose**: Find similar vulnerabilities reported elsewhere

**Use Cases**:
- Research known vulnerabilities in similar protocols
- Find audit reports from other contests
- Discover common vulnerability patterns

**Example**:
```typescript
search_issues(
  query: "reentrancy liquidation language:Solidity"
)
```

### 4. `create_pull_request`
**Purpose**: Submit fixes directly

**Use Cases**:
- Create PRs with vulnerability fixes
- Include test cases demonstrating the fix
- Link to related issues

**Example**:
```typescript
create_pull_request(
  owner: "target-org",
  repo: "target-protocol",
  title: "Fix: Critical reentrancy vulnerability",
  head: "fix/reentrancy",
  base: "main"
)
```

### 5. `pull_request_review_write`
**Purpose**: Add detailed security review comments

**Use Cases**:
- Provide comprehensive security reviews
- Add line-specific vulnerability comments
- Request changes based on security concerns

**Example**:
```typescript
pull_request_review_write(
  method: "create",
  owner: "target-org",
  repo: "target-protocol",
  pullNumber: 123,
  event: "REQUEST_CHANGES",
  body: "Security review: Multiple critical issues found"
)
```

### 6. `search_repositories`
**Purpose**: Find similar protocols for comparison

**Use Cases**:
- Discover protocols with similar functionality
- Compare security implementations
- Find reference implementations

**Example**:
```typescript
search_repositories(
  query: "lending protocol solidity defi"
)
```

---

## Common Audit Patterns

### Pattern 1: Reentrancy Analysis
1. Search for external calls in state-changing functions
2. Check for reentrancy guards
3. Compare with secure implementations
4. Document findings

### Pattern 2: Access Control Review
1. Search for access control modifiers
2. Verify all state-changing functions are protected
3. Check for missing access controls
4. Review upgradeable contract patterns

### Pattern 3: Oracle Security
1. Search for oracle usage patterns
2. Check for price manipulation protections
3. Verify staleness checks
4. Compare with Chainlink best practices

### Pattern 4: Liquidation Mechanism Review
1. Read liquidation implementation
2. Search for similar liquidation code
3. Check for known liquidation vulnerabilities
4. Verify incentive mechanisms

### Pattern 5: Token Standard Compliance
1. Verify ERC20/ERC721/ERC1155 compliance
2. Check for standard function implementations
3. Search for known token standard issues
4. Verify interface compliance

---

## Tips for Effective Auditing with GitHub MCP

1. **Use Specific Search Queries**: Be precise with your search terms to find relevant code
2. **Read Related Files**: Don't just read the main contract - check interfaces, libraries, and tests
3. **Compare Implementations**: Look at how other protocols solve similar problems
4. **Document Everything**: Create issues for all findings, even minor ones
5. **Link Related Findings**: Use issue references to connect related vulnerabilities
6. **Study Fixes**: When you find a vulnerability, search for how it was fixed elsewhere
7. **Use Version Control**: Check different branches and commits to understand evolution
8. **Leverage Audit Reports**: Search for existing audit reports on similar protocols

---

## Integration with Audit Workflow

### Pre-Audit Phase
- Read target contracts
- Research similar protocols
- Review existing audit reports
- Identify key areas of concern

### Active Auditing Phase
- Search for vulnerable patterns
- Compare with secure implementations
- Document findings as issues
- Create test cases for vulnerabilities

### Post-Audit Phase
- Create comprehensive review
- Submit fixes via PRs
- Track fix implementation
- Update findings status

---

## Resources

- [GitHub Code Search Syntax](https://docs.github.com/en/search-github/searching-on-github/searching-code)
- [GitHub Issue Search](https://docs.github.com/en/search-github/searching-on-github/searching-issues-and-pull-requests)
- [Smart Contract Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)

---

*Last Updated: 2024*
