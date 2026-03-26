# Sentinel — simplified finding themes (public contest context)

*Plain-language summaries of vulnerability patterns. Technical detail lives in published contest reports and internal deliverables.*

---

## ZK Sync — bridge withdrawal bug

**What we found:** A critical function in the bridge contract was supposed to return a token identifier, but it never actually set that value. It always returned zero.

**Why it is a vulnerability:** When users tried to withdraw tokens from the bridge, the system looked up the token using this identifier. Because it was always zero (invalid), the withdrawal would fail every time. Users could not move their funds.

**Business impact:** Complete denial of service for bridge withdrawals — users' tokens could get stuck.

---

## PancakeSwap — cross-chain decimal mismatch

**What we found:** When bridging tokens between chains (e.g. Arbitrum → Binance), the bridge did not account for tokens having different decimal places on each chain. USDT has 6 decimals on one chain and 18 on another, but the calculation treated them the same.

**Why it is a vulnerability:** Users could either (1) never complete a bridge transfer (their transaction would always fail), or (2) complete it but lose almost all value — e.g. bridging $60 could result in receiving the equivalent of $0.00000000006.

**Business impact:** Either total failure of bridging, or catastrophic value loss for users.

---

## Sparkyn — signature replay attack

**What we found:** The system used cryptographic signatures to authorise prize distribution. The way the signed message was built was incorrect — it did not include all the data that should be part of the signature.

**Why it is a vulnerability:** An attacker could take a valid organiser signature and use it to (1) distribute prizes to the wrong people, or (2) run the same distribution multiple times, draining funds. The attacker could also outbid the real organiser with higher gas to get their transaction processed first.

**Business impact:** Unauthorised or duplicate prize payouts; loss of funds; loss of trust.

---

## Beanstalk — three critical issues

### 1. Oracle denial of service

**What we found:** The protocol used Chainlink price feeds. When Chainlink upgrades its data feed, the internal "phase" changes and round IDs jump by a huge number. The code assumed round IDs increased step-by-step and did not handle this jump.

**Why it is a vulnerability:** After a Chainlink upgrade, any call that needed historical price data could fail for up to 24 hours. The protocol could be unusable during that window.

**Business impact:** Protocol downtime; users unable to execute trades or claim rewards.

---

### 2. Stale price data in rewards

**What we found:** The protocol allowed price data to be considered "fresh" for up to 4 hours, even though the actual feed updates roughly every hour.

**Why it is a vulnerability:** During volatile markets, rewards could be calculated using hours-old prices. Users could receive more or fewer rewards than they should based on current market conditions.

**Business impact:** Incorrect reward distribution; unfair economics; potential arbitrage or exploitation.

---

### 3. Tokens lost during chain migration

**What we found:** When users moved tokens from one chain (L1) to another (L2), the system first burned tokens on L1 and then sent a message to mint them on L2. If the L2 step failed for any reason (e.g. limits, gas), the tokens were already burned with no way to get them back.

**Why it is a vulnerability:** Users would permanently lose their tokens with no refund or recovery path.

**Business impact:** Direct loss of user funds; legal and reputational risk.

---

## Sablier — cross-chain replay of claims

**What we found:** Sablier uses Merkle trees so users can claim token streams. The claim proof did not include which chain the claim was for. The same proof could be used on multiple EVM chains.

**Why it is a vulnerability:** An attacker could watch a user’s claim on one chain and replay it on another chain before the user. The attacker would receive the tokens instead. The same could happen during a chain fork.

**Business impact:** Theft of user claims; funds sent to the wrong address or lost.
