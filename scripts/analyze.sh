#!/bin/bash

set -euo pipefail

# Root dir so we can safely return later
ROOT_DIR=$(pwd)

# Function to print styled errors with gum
function error() {
  gum style --foreground 196 "$1"
}

# Function to print styled success messages
function success() {
  gum style --foreground 46 "$1"
}

# Check if gum is installed
command -v gum >/dev/null 2>&1 || { echo "Gum is not installed."; exit 1; }

# Check if package name is provided
if [ $# -eq 0 ]; then
  error "🚨 Please provide a package name as the first argument."
  exit 1
fi

PACKAGE_NAME=$1
TARGET_DIR="$(dirname "$0")/../$1"

# Ensure the target has a vite config
if [ ! -d "$TARGET_DIR" ] || [ ! -f "$TARGET_DIR/vite.config.ts" ]; then
  error "⏭ Skipping '$PACKAGE_NAME' — no Vite project found at: $TARGET_DIR"
  exit 1
fi

cd "$TARGET_DIR"

# Clean build output
[ -d "dist" ] && rm -rf dist

# Build
npm run build

# Check for bundle output
BUNDLE_FILE=$(find ./dist -type f -name "*.js" | head -n 1)

if [ -f "$BUNDLE_FILE" ]; then
  # Get size in bytes
  SIZE_BYTES=$(stat -f%z "$BUNDLE_FILE" 2>/dev/null || stat -c%s "$BUNDLE_FILE")
  SIZE_KB=$(echo "scale=2; $SIZE_BYTES / 1024" | bc)
  
  # Get gzip size in bytes
  GZIP_BYTES=$(gzip -c "$BUNDLE_FILE" | wc -c)
  GZIP_KB=$(echo "scale=2; $GZIP_BYTES / 1024" | bc)

  gum style --border normal --border-foreground 212 --padding "0 1" "$(gum style --foreground 212 "$PACKAGE_NAME")
$(gum style --foreground 46 "${SIZE_BYTES} bytes") ($(gum style --foreground 46 "${SIZE_KB} KB"))"
else
  error "No JavaScript bundle found in dist/"
fi