#!/usr/bin/env bash
set -euo pipefail

# ── prerequisite ─────────────────────────────────────────────────────────────
command -v gum >/dev/null 2>&1 || { gum style --foreground 196 "❌ Gum is not installed"; exit 1; }

# ── package menu ────────────────────────────────────────────────────────────
packages=(
  "courier-js"
  "courier-ui-core"
  "courier-ui-inbox"
  "courier-react"
)

selected_package=$(gum choose --header "📦 Select a package to deploy from @trycourier:" "${packages[@]}") || { gum style --foreground 196 "❌ Operation cancelled"; exit 1; }

# ── deployment checklist ────────────────────────────────────────────────────
deployment_steps=(
  "Run Tests:$(dirname "$0")/test.sh @trycourier/$selected_package"
  "Release Package:$(dirname "$0")/release.sh @trycourier/$selected_package"
)

step_names=()
for step in "${deployment_steps[@]}"; do
  step_names+=("${step%%:*}")
done

selected_steps=$(gum choose --header "📋 Select steps to execute:" --no-limit --selected='*' "${step_names[@]}") || { gum style --foreground 196 "❌ Operation cancelled"; exit 1; }

gum style --foreground 46 "✅ Selected steps:"
echo "${selected_steps[@]}"

# ── execution ───────────────────────────────────────────────────────────────
for step in "${deployment_steps[@]}"; do
  step_name=${step%%:*}
  cmd=${step#*:}
  gum style --foreground 46 "🚀 $step_name"
  eval "$cmd"
done
