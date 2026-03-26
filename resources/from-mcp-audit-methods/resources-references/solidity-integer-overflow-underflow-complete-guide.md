# Solidity Integer Overflows and Underflows: Complete Guide for Web3 Security

This reference is stored for local audit workflow use in `MCP-Audit-methods`.

## Purpose

Integer overflow and underflow attacks historically caused severe losses in Web3. This document captures practical, audit-focused lessons from the long-form guide you provided: the BatchOverflow case, version behavior differences, modern `unchecked` risks, and prevention/testing patterns.

## What Is an Integer Overflow/Underflow Attack?

An overflow/underflow attack occurs when arithmetic exceeds the storage range of a type and wraps unexpectedly.

- Overflow: exceeds max, wraps toward zero.
- Underflow: unsigned goes below zero, wraps to max.

In smart contracts, this can bypass checks, manipulate lock logic, or distort accounting.

## Why This Class Is Dangerous

Historically, pre-0.8 Solidity wrapped silently (no revert). That made arithmetic bugs “silent killers.”

### BatchOverflow wake-up call (2018)

Classic vulnerable pattern:

```solidity
uint256 cnt = _receivers.length;
uint256 amount = uint256(cnt) * _value; // unchecked in old compilers
require(amount <= balances[msg.sender]);
```

If `cnt * _value` wraps to `0`, the check passes and recipients are credited large values while sender is barely debited.

## Version Behavior You Must Audit Explicitly

| Scenario | Pre-0.8.0 | 0.8.0+ |
|---|---|---|
| `uint8(255) + 1` | wraps to 0 | reverts |
| `uint8(0) - 1` | wraps to 255 | reverts |
| default arithmetic safety | none | built-in |

Auditors must confirm pragma + compiler settings and whether `unchecked` is used.

## Common Attack Patterns

1. Token balance/accounting manipulation.
2. Timelock bypass via overflowed lock extension.
3. Access/rate-limit bypass via underflowed counters.
4. Reward/staking multiplication overflow.

## Modern Prevention Patterns

1. Use Solidity `>=0.8.0`.
2. Treat each `unchecked` block as high-risk; justify operand bounds.
3. Add business constraints (max durations, max rates, max batch counts).
4. Validate user inputs before arithmetic.
5. Test boundary values explicitly.
6. Run static + dynamic security checks.

## `unchecked` guidance

Potentially acceptable:

- tightly bounded loop counters.
- arithmetic after strong preconditions (`a >= b` before `a-b`) and non-user-controlled bounds.

High risk:

- user-input arithmetic in balances, transfers, rewards, timelocks, or oracle-fed multiplications.

## Testing Matrix (minimum)

For critical arithmetic operations:

- below boundary, at boundary, above boundary.
- explicit checks for `MAX`, `MAX-1`, `0`, `1`.
- multiplication near overflow threshold.
- invariant checks under edge values (not only nominal values).

## Safe implementation principles

- clear bounds constants (`MAX_LOCK_EXTENSION`, max BPS, max batch size).
- CEI pattern around arithmetic/state transitions.
- events for state-changing arithmetic decisions.
- regression tests for each arithmetic bug fixed.

## Notes for legacy audits

If code is pre-0.8 and no SafeMath-like guard is present, arithmetic findings are default high-priority candidates until disproven by strict bounds.

If code is 0.8+ but uses `unchecked`, evaluate as if pre-0.8 for that block.
