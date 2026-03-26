# Web3 Security Repositories

This directory contains cloned repositories with comprehensive Web3 security knowledge:

1. **awesome-solana-security** - Solana security resources and vulnerabilities
2. **bounties-exploit-bugs** - Real-world exploit patterns and bug explanations
3. **awesome-move-security** - Move language (Sui/Aptos) security resources
4. **awesome-smart-contracts** - Reference implementations of major DeFi protocols
5. **blockchain-attack-vectors** - Comprehensive attack vector catalog
6. **kadenzipfel/** - Repositories by kadenzipfel:
   - **protocol-vulnerabilities-index** - **CRITICAL**: 460 vulnerability categories across 31 protocol types (auto-generated from ~10,600 DeFi security audit findings)
   - **smart-contract-vulnerabilities** - **CRITICAL**: Comprehensive collection of 39+ smart contract vulnerabilities with detailed explanations and LLM-optimized references
7. **SolidityGuard** - **CRITICAL**: Advanced Solidity/EVM smart contract security auditor with 104 vulnerability patterns, 8 tools, 100% CTF + EVMBench benchmark (120/120)
8. **solidity-fuzzing-comparison** - **CRITICAL**: Formal verification and fuzzing methods with 14 real-world challenges (Foundry, Echidna, Medusa, Halmos, Certora)

## Integration Status

All knowledge from these repositories has been extracted and integrated into cursor rules:

- `cursor-rules/solana-security.mdc` - Solana-specific vulnerabilities
- `cursor-rules/move-security.mdc` - Move language vulnerabilities  
- `cursor-rules/defi-security-exploits.mdc` - DeFi exploit patterns
- `cursor-rules/smart-contract-security.mdc` - Enhanced with additional vulnerabilities and formal verification section
- `cursor-rules/smart-contract-vulnerability-reference.mdc` - Comprehensive reference to all vulnerabilities in smart-contract-vulnerabilities repository
- `cursor-rules/formal-verification-fuzzing.mdc` - **NEW**: Comprehensive formal verification and fuzzing methods (Foundry, Echidna, Medusa, Halmos, Certora)

## kadenzipfel Repositories

### protocol-vulnerabilities-index

This is a **critical resource** for protocol-specific auditing, containing:

- **460 vulnerability categories** across 31 protocol types
- **Auto-generated** from ~10,600 DeFi security audit findings
- **Categories include**: Lending, Borrowing, AMM, DEX, Staking, Liquid Staking, Bridges, Governance, and more
- **Location**: `kadenzipfel/protocol-vulnerabilities-index/`
- **GitHub**: [kadenzipfel/protocol-vulnerabilities-index](https://github.com/kadenzipfel/protocol-vulnerabilities-index)

### smart-contract-vulnerabilities

This is a **critical resource** for audit work, containing:

- **39 vulnerability files** in `vulnerabilities/` directory with detailed explanations
- **38+ LLM-optimized reference files** in `references/` directory for quick AI lookups
- **Categories covered**:
  - Access Control (5 vulnerabilities)
  - Math (3 vulnerabilities)
  - Control Flow (6 vulnerabilities)
  - Data Handling (5 vulnerabilities)
  - Unsafe Logic (7 vulnerabilities)
  - Code Quality (11 vulnerabilities)

#### Key Features

- Each vulnerability includes: technical explanation, impact, exploit scenarios, detection methods, and mitigation strategies
- LLM-optimized references for efficient AI consumption during audits
- Real-world examples and code snippets
- **Location**: `kadenzipfel/smart-contract-vulnerabilities/`
- **GitHub**: [kadenzipfel/smart-contract-vulnerabilities](https://github.com/kadenzipfel/smart-contract-vulnerabilities)

## SolidityGuard Repository

This is a **critical resource** for automated security auditing, containing:

- **104 Vulnerability Patterns**: Comprehensive detection rules covering OWASP Smart Contract Top 10 (2025)
- **8 Security Tools**: Slither, Aderyn, Mythril, Medusa, and more
- **100% CTF Coverage**: 85/85 DeFiVulnLabs, 100% Paradigm CTF, 100% EVMBench (120/120)
- **7-Phase Deep Audit Process**: Automated scan → Verification → Parallel agents → Exploit PoC → Dynamic verification → Fuzz testing → Report
- **Exploit Case Studies**: 25+ real-world incidents with root cause analysis

### Key Features

- **OWASP Smart Contract Top 10 Coverage**: All 10 categories with specific pattern IDs
- **Multi-Tool Integration**: Combines results from multiple static and dynamic analysis tools
- **Professional Reporting**: Markdown + PDF report generation
- **Web App**: Available at [solidityguard.org](https://solidityguard.org)
- **Location**: `SolidityGuard/`
- **GitHub**: [alt-research/SolidityGuard](https://github.com/alt-research/SolidityGuard)

## solidity-fuzzing-comparison Repository

This is a **critical resource** for implementing formal verification and fuzzing during audits, containing:

- **14 Real-World Challenges**: Based on actual audit findings from Cyfrin audits
- **Tool Configurations**: Foundry, Echidna, Medusa, Certora specifications
- **Best Practices**: Writing effective invariants, guiding fuzzers, formal specifications
- **Tool Comparison**: Performance analysis of Foundry vs Echidna vs Medusa vs Halmos vs Certora

### Key Features

- **Basic and Advanced Configurations**: Unguided and guided fuzzing examples
- **Invariant Examples**: Real-world invariant patterns from audit findings
- **Certora Specifications**: Formal verification examples
- **Coverage Analysis**: Methods for generating and analyzing coverage reports
- **Tool Selection Guide**: When to use each tool

### Challenge Highlights

- **Challenge #1**: Naive Receiver - Flash loan fee draining
- **Challenge #2**: Unstoppable - DoS via balance check
- **Challenge #5**: Token Sale - Price manipulation (Medusa winner)
- **Challenge #6**: Rarely False - Stateless fuzzing (Halmos & Certora winners)
- **Challenge #8**: Omni Protocol - 16 invariants (Medusa winner)

## Usage

These repositories serve as reference material. The extracted knowledge is available in the cursor rules for use during audits:

- `cursor-rules/protocol-vulnerabilities-index.mdc` - Protocol-specific vulnerability categories
- `cursor-rules/smart-contract-vulnerability-reference.mdc` - Direct access to vulnerability documentation
- `cursor-rules/formal-verification-fuzzing.mdc` - Implementation methods for fuzzing and formal verification
