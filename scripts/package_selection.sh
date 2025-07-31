#!/usr/bin/env bash
set -euo pipefail

# Check if gum is installed
if ! command -v gum >/dev/null 2>&1; then
  echo "Error: Gum is not installed. Please run 'brew install gum'"
  exit 1
fi

# Define available packages
packages=(
  "courier-js       — Base API client and shared instance singleton"
  "courier-ui-core  — Core UI components, styles, colors etc that are shared between packages"
  "courier-ui-inbox — Inbox UI components"
  "courier-react    — React wrapper around UI components"
  "courier-react-17 — React 17 wrapper around UI components"
)

# Display deployment header
echo "🚀 Courier Javascript Package Deployment"

# Get package selection from user
selected_package=$(gum choose --header "Select a package to deploy from @trycourier:" "${packages[@]}" | cut -d' ' -f1) || {
  echo "Error: Package selection cancelled"
  exit 1
}

# Define deployment steps
deployment_steps=(
  "Analyze Package Size:bash $(dirname "$0")/analyze.sh @trycourier/$selected_package"
  "Run Tests:bash $(dirname "$0")/test.sh @trycourier/$selected_package"
  "Release Package:bash $(dirname "$0")/release.sh @trycourier/$selected_package"
)

# Extract step names
step_names=()
for step in "${deployment_steps[@]}"; do
  step_names+=("${step%%:*}")
done

# Get step selection from user
selected_steps=($(gum choose --header "Select steps to perform:" --no-limit --selected='*' "${step_names[@]}")) || {
  echo "Error: Deployment cancelled"
  exit 1
}

# Execute selected steps
for step in "${deployment_steps[@]}"; do
  step_name=${step%%:*}
  cmd=${step#*:}
  if [[ " ${selected_steps[*]} " =~ " ${step_name} " ]]; then
    echo "Running: $step_name"
    eval "$cmd"
  fi
done

# Prompt for another deployment
if gum confirm "Deployment steps completed. Would you like to deploy another package?"; then
  sh deploy.sh
fi
