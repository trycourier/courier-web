#!/usr/bin/env bash
set -euo pipefail

# ── prerequisite ─────────────────────────────────────────────────────────────
command -v gum >/dev/null 2>&1 || { gum style --foreground 196 "Gum is not installed"; exit 1; }

# ── package menu ────────────────────────────────────────────────────────────
packages=(
  "courier-js       — Base API client and shared instance singleton"
  "courier-ui-core  — Core UI components, styles, colors etc that are shared between packages"
  "courier-ui-inbox — Inbox UI components"
  "courier-react    — React wrapper around UI components"
)

# Show a window explaining the deployment process
gum style --border normal --border-foreground 212 --padding "0 1" "$(gum style --foreground 212 "🚀 Courier Javascript Package Deployment")"

# Extract just the package name without description for the selection
selected_package=$(gum choose --header "Select a package to deploy from @trycourier:" "${packages[@]}" | cut -d' ' -f1) || { gum style --foreground 196 "Package selection cancelled"; exit 1; }

# ── deployment checklist ────────────────────────────────────────────────────
deployment_steps=(
  "Analyze Package Size:bash $(dirname "$0")/analyze.sh @trycourier/$selected_package"
  "Run Tests:bash $(dirname "$0")/test.sh @trycourier/$selected_package"
  "Release Package:bash $(dirname "$0")/release.sh @trycourier/$selected_package"
)

step_names=()
for step in "${deployment_steps[@]}"; do
  step_names+=("${step%%:*}")
done

# ── select steps ───────────────────────────────────────────────────────────
selected_steps=($(gum choose --header "Select steps to perform:" --no-limit --selected='*' "${step_names[@]}")) || { gum style --foreground 196 "Deployment cancelled"; exit 1; }

# ── execution ───────────────────────────────────────────────────────────────
for step in "${deployment_steps[@]}"; do
  step_name=${step%%:*}
  cmd=${step#*:}
  # Only execute if step was selected
  if [[ " ${selected_steps[*]} " =~ " ${step_name} " ]]; then
    gum style --foreground 46 "$step_name"
    eval "$cmd"
  fi
done

# Ask if the user wants to deploy another package
if gum confirm "Deployment steps completed. Would you like to deploy another package?"; then
  sh deploy.sh
fi
