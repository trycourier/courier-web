#!/usr/bin/env bash
set -euo pipefail

# ── prerequisite ─────────────────────────────────────────────────────────────
command -v gum >/dev/null 2>&1 || { gum style --foreground 196 "Gum is not installed"; exit 1; }

# ── package menu ────────────────────────────────────────────────────────────
packages=(
  "courier-js"
  "courier-ui-core"
  "courier-ui-inbox"
  "courier-react"
)

# Show a window explaining the deployment process
gum style --border normal --border-foreground 212 --padding "1 1" "$(gum style --foreground 212 "🚀 Courier Javascript Package Deployment")"

selected_package=$(gum choose --header "Select a package to deploy from @trycourier:" "${packages[@]}") || { gum style --foreground 196 "Package selection cancelled"; exit 1; }

# ── deployment checklist ────────────────────────────────────────────────────
deployment_steps=(
  "Run Tests:$(dirname "$0")/test.sh @trycourier/$selected_package"
  "Release Package:$(dirname "$0")/release.sh @trycourier/$selected_package"
)

step_names=()
for step in "${deployment_steps[@]}"; do
  step_names+=("${step%%:*}")
done

# ── select steps ───────────────────────────────────────────────────────────
selected_steps=($(gum choose --header "Select steps to perform:" --no-limit --selected='*' "${step_names[@]}")) || { gum style --foreground 196 "Deployment cancelled"; exit 1; }

gum style --foreground 46 "Selected steps:"
printf '%s\n' "${selected_steps[@]}"

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

gum style --foreground 46 "Done"
