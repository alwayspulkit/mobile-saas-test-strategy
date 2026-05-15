# EventFlow — System Under Test Overview

> EventFlow is the anonymized name for a real production SaaS. All identifiers,
> URLs, and keys in this repo refer to test environments only.

## What it is

EventFlow is a cross-platform social events app (iOS, Android, web) that lets
users discover events, track attendance, and connect with other attendees.
It is a live product with real users.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                        │
│   React Native 0.83 + Expo ~55 (iOS / Android / web)   │
│   React Navigation 6 · TanStack React Query 5           │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS / WebSocket
┌────────────────────────▼────────────────────────────────┐
│                    Supabase (BaaS)                      │
│  PostgreSQL · Row-Level Security · Auth · Realtime      │
│  Storage · Edge Functions (Deno)                        │
└────────────────────────┬────────────────────────────────┘
                         │
        ┌────────────────┼──────────────────┐
        ▼                ▼                  ▼
  ┌──────────┐   ┌────────────┐   ┌──────────────────┐
  │ Firebase │   │ RevenueCat │   │ OAuth Providers  │
  │ Analytics│   │ IAP / Subs │   │ Google · Apple   │
  │ FCM Push │   │ Sandbox    │   │                  │
  └──────────┘   └────────────┘   └──────────────────┘
```

## Key user journeys (risk-ranked)

| # | Journey | Risk | Frequency |
|---|---------|------|-----------|
| 1 | Subscription purchase + restore | Critical (money) | Medium |
| 2 | Sign-up / OAuth login | Critical (auth) | High |
| 3 | Browse + save events | Core value | Very high |
| 4 | Invite + connect with friends | Core social | High |
| 5 | Push notification → deep link | Engagement | Medium |
| 6 | Offline browse (cached events) | Mobile reliability | Medium |

## Test environments

| Environment | Purpose | Notes |
|---|---|---|
| Supabase test project | All automated tests | Separate from production — never share keys |
| RevenueCat sandbox | Subscription tests | StoreKit sandbox (iOS) / Play Billing test (Android) |
| Google/Apple OAuth sandbox | Auth flow tests | Use dedicated test accounts |
| FCM test project | Push tests | Separate Firebase project |

## What we do NOT test here

- Production data (never accessed in this repo)
- Third-party provider internals (RevenueCat, Firebase) — only our integration points
- App Store / Play Store review flows
