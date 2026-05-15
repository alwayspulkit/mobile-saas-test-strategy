#!/usr/bin/env bash
# Blocks commits/PRs that leak the real product identity.
# Add any new banned string here before adding content that references it.
set -euo pipefail

BANNED_STRINGS=(
  "raveconnects"
  "RaveConnects"
  "RAVECONNECTS"
  "festivalstracker"
  "festivals_tracker"
  "festival-tracker"
  "festival_tracker"
  "com.raveconnects"
)

FOUND=0

for banned in "${BANNED_STRINGS[@]}"; do
  if grep -r -i \
       --exclude-dir=".git" \
       --exclude-dir="node_modules" \
       --exclude="package-lock.json" \
       --exclude="anonymization-check.sh" \
       --include="*.ts" --include="*.tsx" --include="*.js" \
       --include="*.json" --include="*.md" --include="*.yml" \
       --include="*.yaml" --include="*.env*" \
       --include="*.toml" \
       "$banned" . 2>/dev/null; then
    echo "❌ BANNED STRING FOUND: '$banned'"
    FOUND=1
  fi
done

if [ "$FOUND" -eq 1 ]; then
  echo ""
  echo "Anonymization check FAILED. Remove or replace all banned strings before pushing."
  exit 1
else
  echo "✅ Anonymization check passed — no banned strings found."
fi
