# Flipcash — Sunday bug hunting (process walkthrough)

**Disclaimer:** Article prepared as part of a **Flipcash** review grant. **The process is the product** — published even without a confirmed exploit.

---

## How Flipcash Works

Before we get into the hunt, you need to understand what you're actually looking at.

Flipcash is a **Solana program** that lets anyone create a custom currency with autonomous liquidity.

No LPs. No order books.

Just a **deterministic bonding curve** that prices everything automatically from day one.

Here's the full lifecycle.

**Step 1: Create a Currency.** `InitializeCurrency` creates an SPL token mint as a PDA — random 32-byte seed, 10 decimals, no freeze authority, PDA is its own mint authority. It also creates a `CurrencyConfig` PDA storing authority pubkey, mint address, name, and symbol.

**Step 2: Initialize the Pool.** `InitializePool` creates a `LiquidityPool` PDA with two vaults:

- `vault_a` — holds unsold currency tokens  
- `vault_b` — holds USDF backing  

All 21,000,000 tokens (210 trillion quarks) mint directly into `vault_a`. The pool uses USDF as base mint with a **1% sell fee**.

**Step 3: Set Metadata.** `InitializeMetadata` creates Metaplex metadata and **permanently burns the mint authority**. No more tokens can ever be minted.

### Buy Flow

User sends USDF → `vault_b`. Receives tokens from `vault_a`.

### Sell Flow

User sends tokens → `vault_a`. Receives USDF from `vault_b` minus 1% fee.

### The Bonding Curve

The core idea is simple: the more tokens that have been sold, the higher the price.

- The first token costs $0.01.  
- The last token (at 21M supply) costs $1,000,000.  

The price grows exponentially between these two points.

Computing exponentials on-chain is expensive and introduces precision issues (more on that later).

So instead, the program uses a **pre-computed lookup table** with 210,001 entries.

Each entry covers a **100-token "step"**, and within each step the price is flat:

- `DISCRETE_PRICING_TABLE[i]` — spot price at supply = `i * 100`  
- `DISCRETE_CUMULATIVE_VALUE_TABLE[i]` — total USDF cost to reach supply = `i * 100`  

Think of it as a staircase instead of a smooth curve. Each stair is 100 tokens wide, and the price jumps at every step boundary.

### No Stored Supply — Ever

There's **no `current_supply` field**.

Supply is **recomputed from `vault_a`** every instruction.

USDF backing is always `vault_b.amount() - fees_accumulated`.

Both values come fresh from vault state each call.

You can't desync stored supply from real supply if stored supply doesn't exist. This design choice kills an entire bug class before it can exist.

---

## Step 0: Read the Prior Audit Report First

**Always. Before touching a single line of code.**

**Sec3** audited commit `6c985fd` in October 2025. Nine issues total: 1 High, 3 Low, 5 Informational. Read every finding — not just the bug, but **why it existed** and **what the fix changed**.

Two findings shaped the review.

### [P1-H-01] Unsafe Rounding — High

The brine-fp library rounds to **nearest** instead of always **flooring**. Every multiply and divide applies this — so rounding errors accumulate across operations and go in unpredictable directions.

In DeFi, rounding must always favor the pool. Here it didn't.

The attacker found inputs where nearest-rounding consistently went in their favor. Pay 1 quark, get 100 tokens, sell half, recover your quark. Repeat.

The fix replaced the whole curve with a **discrete lookup table** and made buy/sell **always compute from supply = 0**. Since every computation resets to a known origin, rounding errors can't stack across transactions.

### [P1-L-01] DoS via Pre-funded Accounts — Low

`system_instruction::create_account` fails if the target already has lamports.

Vault PDAs had predictable seeds — `["treasury", pool_key, mint_key]`. An attacker could pre-fund those addresses and permanently block pool creation.

**Fix:** the transfer + allocate + assign pattern from the **Steel** library. If an account has lamports, handle them gracefully instead of reverting.

### What This Told the Reviewer

The team's blind spots were **fixed-point math precision** and **Solana account creation** edge cases.

The current code should be hardened against both, but fixes introduce new code, and new code is new attack surface.

The **discrete curve rewrite** was the biggest change.

That's where the hunt focused.

---

## Step 1: Diff the Audited Commit vs Current HEAD

Second move: **`git diff`. Not optional.**

GitLens in VS Code — `6c985fd` as "before", current HEAD as "after". The diff showed a full curve rewrite: continuous `ExponentialCurve` gone, replaced by a discrete lookup table.

Buy/sell refactored to always pass **`current_supply = 0`**.

**New code after a fix is the highest-probability attack surface.** That's where to spend time.

---

## Building the Mental Model

Don't hunt until you have the full picture.

- Trace every flow.  
- Map every invariant.  

### Initialization Chain

Every PDA passes `check_uninitialized_pda`:

- Owner is the system program (not allocated yet)  
- Data is empty  
- Account is writable  
- Address matches derived PDA from expected seeds + program ID  

Mint PDA uses a random 32-byte seed — unpredictable address, no pre-seeding DoS.

Currency derives from mint. Pool derives from currency. Vaults derive from pool + respective mints.

### Tracing `buy_common`

`to_numeric` normalizes everything to human-readable units internally at **1e18** precision.

For USDF (6 decimals): `amount * 1e18 / 1e24`.

For currency tokens (10 decimals): scaled accordingly.

Raw on-chain amounts only convert back at the end via `from_numeric`, which **always floors** — intentional truncation that favors the protocol.

### Tracing `value_to_tokens` — The Binary Search

Given a USDF value, return the supply level on the curve.

Two paths from here:

- **Path A** — `value < cost_to_complete_start_step`  
- **Path B** — `value >= cost_to_complete_start_step`  

### Tracing `tokens_to_value` — Sell Direction

Given tokens to sell, return USDF value.

### Invariants (what must always be true)

Before hunting, write down:

- `fees_accumulated <= vault_b.amount()` — fees are a fraction of sell proceeds which come from the vault itself  
- Supply and value always recomputed from vaults — no stale state possible  
- Fee increment is atomic with token return — both happen in the same instruction  
- Vault PDAs are program-controlled — no unauthorized transfers  
- Mint authority burned after metadata init — supply is fixed forever  
- Both buy and sell compute from **supply = 0** — rounding can't accumulate  

Every attack idea gets tested against these first. **Most die here.**

---

## The 8 Attack Vectors Tried (All Dead Ends)

### Idea 1: Sandwich the Fee Burn for Arbitrage

During buy: `current_value = vault_b.amount() - fees_accumulated`. Fees deflate the apparent USDF backing — the curve sees less value, so supply looks lower, so your USDF buys more tokens.

If fees could be inflated, the next buyer gets cheaper tokens relative to real pool state. That's an arbitrage.

**The block:** fees only grow inside `sell_common`, atomic with token returns.

You can't do one without the other. Every unit of fee increase = equal unit of supply decrease. Effects cancel.

Also: `burn_fees` is permissionless. Anyone can reset the fee counter at any time. Even temporary deflation is neutralizable.

**Dead end.**

### Idea 2: Make `fees_accumulated > vault_b.amount()`

If this breaks, `vault_b.amount().checked_sub(fees_accumulated)` returns an error and buys halt — a DoS.

But fees are a percentage of sell proceeds, and sell proceeds come from `vault_b`. The fee is always a fraction of what's in the vault. **Mathematically impossible** for it to exceed the vault balance.

Even if it did somehow: `checked_sub` fails gracefully, not with a panic. Permissionless burn resets the state.

**Dead end.**

### Idea 3: Donate USDF Directly to `vault_b`

Sending USDF to `vault_b` bypasses the program. `vault_b.amount()` rises.

The next buyer sees higher `current_value` → higher supply on the curve → fewer tokens per USDF.

This **hurts the attacker** — donated value they can never recover. No profit. Accounting stays consistent; the extra USDF is real backing, just gifted.

To reach the cap via donation you'd need ~$1.14M. At the cap, `capped_in_amount = max - current_value = 0`. The next buyer pays 0 USDF and gets 0 tokens. Not a DoS — the instruction succeeds, it just does nothing.

**Dead end.**

### Idea 4: Rounding at Discrete Step Boundaries — Free Tokens?

Step functions have discontinuities at boundaries. What happens if you pay exactly `cost_to_complete_start_step + 1`?

You enter Path B. That +1 becomes:

If `end_price` is large enough, `1 / end_price` floors to 0. Buyer pays 2 extra units of USDF, gets ~same tokens as if they'd paid 2 fewer. Max loss: 1 quark per transaction. Dust.

Can this compound to `tokens_bought = 0` while paying real USDF? Only if `new_supply <= current_supply` — which requires USDF backing to decrease without a sell. Vaults are PDA-controlled. Impossible.

**Dead end.**

### Idea 5: Binary Search Off-by-One in the Guards

`value_to_tokens` guard: `start_step >= len - 1`, not `>= len`. Why the `-1`?

Because after this check, the code unconditionally accesses `DISCRETE_CUMULATIVE_VALUE_TABLE[start_step + 1]`. If `start_step` were `len - 1`, that's out of bounds. The `-1` protects this specific access.

`tokens_to_value` can use `>= len` because its `[start_step + 1]` access sits behind the `start_step == end_step` early return — it's only reached when `start_step != end_step`.

The binary search also has its own guard: `end_step >= DISCRETE_PRICING_TABLE.len()` → return `None`. Both checks correct for different reasons.

**Dead end.**

### Idea 6: Force `tokens_bought = 0` While Paying USDF

For this, you need `new_supply <= supply`:

```text
new_supply    = curve.value_to_tokens(0, capped_new_value)
supply        = recomputed from vault_a
tokens_bought = new_supply - supply  // needs to be 0
```

USDF backing would need to map to a supply level at or below current sold supply. That means tokens in circulation without proportional USDF backing — which requires:

- Remove USDF from `vault_b` without selling → impossible, PDA authority  
- Add tokens to circulation without buying → impossible, mint authority burned  
- Inflate supply reading → impossible, always recomputed live  

Fee inflation looked promising for a second. Inflate fees → `current_value` deflates → lower starting point on the curve. But fees are atomic with supply changes (Idea 1). Inflating fees = returning tokens to `vault_a` = supply decreases proportionally. Effects cancel.

**Dead end.**

### Idea 7: `from_numeric` Producing 0

`from_numeric` multiplies by `10^decimal_places` then calls `to_imprecise()`, which floors. Could the curve produce a positive internal value that floors to 0?

In theory — if `tokens_bought` as `UnsignedNumeric` is smaller than 1 quark (10^-10 tokens). The conversion floors to 0.

But `actual_in_amount_raw` — the USDF charged — is computed **before** the curve, as pure arithmetic on microUSDC values. The buyer still pays the right amount. Only token output could be dust.

And the program checks `tokens_bought_raw > 0` before the transfer. If output is 0, instruction fails — you can't pay USDF and get nothing.

**Dead end.**

### Idea 8: USDF Cap at High Supply Levels

Near the cap:

```text
let capped_in_amount = capped_new_value - current_value;
```

If `current_value == max_cumulative`, then `capped_in_amount = 0`. Buyer pays 0 USDF, gets 0 tokens. Instruction succeeds but does nothing.

DoS? You'd need to bring the pool to exactly $1.14M in USDF — real funds, donated permanently. Even then: sellers can reduce backing, new buyers re-enter. Not a real attack.

**Dead end.**

---

## Takeaways

1. **Read the prior audit report first.** It shows the team's blind spots and what changed. Sec3's report gave the full attack surface before opening the repo.  
2. **Diff the audited commit against HEAD.** New code after a fix is the highest-probability attack surface. Ten minutes of diffing told where to spend 80% of time.  
3. **Build the mental model before hunting.** Trace every flow. Map every invariant. Most dead ends die at the invariant stage — not during testing.  
4. **Document every dead end.** Writing out why something doesn't work forces you to verify your reasoning. Several times the reviewer caught the blocker mid-sentence. **The writing is the analysis.**  
5. **Publish when you find nothing.** Auditors who only publish wins optimize for perception. **The process doesn't change based on outcome.**

---

*Stored for MCP-Audit-methods reference; original grant context: Flipcash.*
