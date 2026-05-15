# Mobile E2E — Maestro Flows

Tests for the EventFlow mobile app (iOS / Android) using [Maestro](https://maestro.mobile.dev/).

## Prerequisites

1. **Maestro CLI:** `curl -Ls "https://get.maestro.mobile.dev" | bash`
2. **App running** on an iOS simulator or Android emulator
3. **Test credentials** exported in your shell:
   ```bash
   export EVENTFLOW_TEST_EMAIL="your-test-account@example.com"
   export EVENTFLOW_TEST_PASSWORD="your-test-password"
   ```

## Running

```bash
# Single flow
maestro test tests/e2e-mobile/login-flow.yaml

# All flows
maestro test tests/e2e-mobile/

# With credentials inline
EVENTFLOW_TEST_EMAIL=test@example.com maestro test tests/e2e-mobile/login-flow.yaml
```

## Flows

| File | What it tests | Required state |
|---|---|---|
| `login-flow.yaml` | Email + password sign-in | Fresh app state |
| `navigation-flow.yaml` | Bottom tab navigation | Logged in |

## CI note

Maestro flows are not in the automated CI pipeline — they require a running device/simulator. Run manually before each release as part of the release-gate checklist in `docs/playbooks/release-gate.md`.
