# mobile-saas-test-strategy

Production-grade QE strategy for **EventFlow** — a cross-platform iOS / Android / web
events SaaS built on React Native, Expo, Supabase, and RevenueCat.
Anonymized from a real production app I have full authorization to test.

> 📄 [STRATEGY.md](./STRATEGY.md) · 🏗 [Architecture](./ARCHITECTURE.md) · 📋 [Chapter Playbook](./CHAPTER-PLAYBOOK.md)
>
> 🔗 **Live dashboard:** _coming in month 1_ — [see roadmap](#roadmap)

---

## What this repo demonstrates

| Signal | Where to look |
|---|---|
| 20-layer test pyramid designed for a real mobile + web SUT | [STRATEGY.md §3](./STRATEGY.md) + `tests/` |
| Row-Level-Security policy testing (rare for Supabase apps) | `tests/rls-security/` + [ADR](./docs/adr/) |
| Subscription / IAP correctness (RevenueCat sandbox) | `tests/subscription/` |
| Cross-platform parity gates (iOS / Android / web) | `.github/workflows/ci.yml` |
| Custom quality dashboard (built on the same stack as the SUT) | `dashboard/` |
| Inherited test debt paid down, documented, prevented | [STRATEGY.md §5](./STRATEGY.md) |
| Quality Chapter playbook — scales beyond one team | [CHAPTER-PLAYBOOK.md](./CHAPTER-PLAYBOOK.md) |
| Anonymization leak-prevention gate | `tools/anonymization-check.sh` |

---

## Quick navigation

```
tests/unit/            Layer 1  — Jest + RNTL
tests/component/       Layer 2  — RNTL + jest-expo
tests/integration/     Layer 3  — Jest + msw
tests/contract/        Layer 4  — Pact
tests/api/             Layer 5  — Jest + supabase-js
tests/rls-security/    Layer 6  — RLS policy matrix ← differentiator
tests/e2e-mobile/      Layer 8  — Maestro (iOS + Android)
tests/e2e-web/         Layer 9  — Playwright
tests/subscription/    Layer 16 — RevenueCat sandbox
tests/smoke/           Layer 20 — Release-gate subset
dashboard/                      — Next.js quality dashboard
```

---

## Running locally

```bash
# Prerequisites: Node 20, npm
cp .env.example .env   # fill in your test Supabase project keys
npm install

# Individual layers
npm run test:unit
npm run test:rls
npm run test:e2e:web

# Anonymization check
npm run anonymization:check
```

---

## Roadmap

| Month | Ships |
|---|---|
| 1 | Repo skeleton · anonymization gate · 8 test-layer scaffold · dashboard MVP |
| 2 | All starter layers with real tests · CI matrix green · RevenueCat layer |
| 3 | Pact contract tests · STRATEGY.md §§6–11 · CHAPTER-PLAYBOOK.md v1 |
| 4 | Mobile perf (Reassure + Flashlight) · dashboard MTTD + runtime panels |
| 5 | Chaos/offline · analytics contract · STRATEGY.md §12 (org scaling) |
| 6 | `rls-coverage` CLI published to npm · final strategy pass · profile update |

---

## About

Built by [Pulkit Chaturvedi](https://github.com/alwayspulkit) — Quality Chapter Lead and Senior SDET.
Writing on quality engineering: [Substack](https://substack.com/@pulkitchaturvedi).
