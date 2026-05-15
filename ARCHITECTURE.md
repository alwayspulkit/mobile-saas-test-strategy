# Test Architecture

## Layer map

Each directory under `tests/` is an isolated layer. Layers share only:
- `fixtures/` — hand-written test data builders
- `tools/` — shared reporters and ingestion scripts
- `.env` — environment config (never committed)

```
tests/
├── unit/            Layer 1  — Jest + RNTL — pure logic
├── component/       Layer 2  — RNTL + jest-expo — rendering
├── integration/     Layer 3  — Jest + msw — React Query hooks
├── contract/        Layer 4  — Pact — mobile ↔ Supabase contracts
├── api/             Layer 5  — Jest + supabase-js — Edge Functions
├── rls-security/    Layer 6  — Jest — RLS policy matrix
├── realtime/        Layer 7  — Jest + realtime client
├── e2e-mobile/      Layer 8  — Maestro YAML flows
├── e2e-web/         Layer 9  — Playwright — RN Web
├── visual/          Layer 10 — Playwright screenshots
├── accessibility/   Layer 11 — axe + a11y queries
├── performance-api/ Layer 12 — k6 scripts
├── performance-mob/ Layer 13 — Reassure + Flashlight
├── chaos/           Layer 14 — Toxiproxy + Maestro offline
├── auth/            Layer 15 — Playwright + Maestro OAuth
├── subscription/    Layer 16 — RevenueCat sandbox
├── i18n/            Layer 17 — locale snapshots + key linter
├── push/            Layer 18 — FCM + Maestro deep-link
├── analytics/       Layer 19 — event schema contract
└── smoke/           Layer 20 — release-gate tagged subset
```

## Results flow

```
CI job (each layer)
       │
       ▼ JUnit XML + JSON summary
tools/ingest-results/
       │
       ▼ HTTP POST
Dashboard Supabase project
       │
       ▼
Next.js dashboard  ──→  mobile-saas-test-strategy.vercel.app
```

## CI strategy

- **Every push:** anonymization check + type check
- **PR to main:** unit + component + integration + API + RLS + smoke
- **Nightly:** full suite including performance-mobile, chaos, visual
- **Release gate:** smoke + RLS + no new p95 regression

## Reporting

- Per-run detail: Allure report (artifact on each CI run)
- Trends + org-level: custom Next.js dashboard (live, always-on)
