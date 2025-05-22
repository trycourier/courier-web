#!/usr/bin/env bash
set -euo pipefail

# ── colours ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GRN='\033[0;32m'
NC='\033[0m'

die()  { printf "${RED}❌  %s${NC}\n" "$*" >&2; exit 1; }
info() { printf "${GRN}✔  %s${NC}\n" "$*";             }

# ── prerequisite ─────────────────────────────────────────────────────────────
command -v gum &>/dev/null || die "gum is required. Please install it first."

# ── package menu ────────────────────────────────────────────────────────────
packages=(
  "@trycourier/courier-js"
  "@trycourier/courier-ui-core"
  "@trycourier/courier-ui-inbox"
  "@trycourier/courier-react"
)

selected_package=$(gum choose --header "📦 Select a package to deploy:" "${packages[@]}") || die "Operation cancelled."

# ── deployment checklist ────────────────────────────────────────────────────
deployment_steps=(
  "Run Tests:./scripts/test.sh $selected_package"
  "Release Package:./scripts/release.sh $selected_package"
)

step_names=()
for step in "${deployment_steps[@]}"; do
  step_names+=("${step%%:*}")
done

selected_steps=$(gum choose --header "📋 Select steps to execute:" --no-limit --selected='*' "${step_names[@]}") || die "Operation cancelled."

# Convert selected steps to array
IFS=$'\n' read -r -d '' -a selected <<< "$selected_steps"

# ── execution ───────────────────────────────────────────────────────────────
for step in "${deployment_steps[@]}"; do
  step_name=${step%%:*}
  cmd=${step#*:}

  if printf '%s\n' "${selected[@]}" | grep -qx "$step_name"; then
    info "Executing: $step_name"
    eval "$cmd" || die "Failed during: $step_name"
  fi
done
