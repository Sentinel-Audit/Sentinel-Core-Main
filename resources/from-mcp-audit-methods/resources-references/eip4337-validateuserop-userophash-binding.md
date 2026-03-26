# EIP-4337 — `validateUserOp`: bind sender and `userOpHash`

**Tip for auditors & devs working on Account Abstraction (EIP-4337)**

When validating `validateUserOp()`:

1. **Always verify** that `userOp.sender == msg.sender` **and** that `userOpHash` is actually the hash of the **provided** `userOp`.

2. If you recover the signer from `userOpHash` but **never tie it to the actual `userOp` data**, an attacker can watch the mempool, replay the **same hash** with **modified calldata** (different recipient, different amount) and burn the session key before the real wallet gets to use it.

3. **EIP-4337** defines exactly how `userOpHash` should be constructed — `chainId`, `nonce`, `entryPoint` and the **full** `userOp` fields are all part of it. **Reconstruct it yourself. Don't trust what's passed in.**

Small check. Full compliance. Huge difference.

---

**Workspace cross-reference:** `.cursor/rules/erc4337-smart-account-mistakes.mdc` (Trail of Bits–style ERC-4337 pitfalls).
