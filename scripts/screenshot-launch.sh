#!/bin/bash

set -euo pipefail

# Function to print styled errors with gum
function error() {
  gum style --foreground 196 "$1"
}

# Check if gum is installed
command -v gum >/dev/null 2>&1 || { echo "Gum is not installed. Do you need to run 'brew install gum'?"; exit 1; }

# Prompt user for a URL using gum input
URL=$(gum input --placeholder "https://example.com" --prompt "Paste the URL to launch in Chrome: ")

if [ -z "$URL" ]; then
  error "🚨 No URL provided. Exiting."
  exit 1
fi

gum style --border normal --border-foreground 212 --padding "0 1" "$(gum style --foreground 212 "Launching Chrome App Mode")
$(gum style --foreground 46 "$URL")"

# Launch the URL in Chrome app mode
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --app="$URL" &