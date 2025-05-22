#!/bin/bash
set -euo pipefail

# Install dependencies
if ! sh ./scripts/install_dependencies.sh; then
  exit 1
fi

# Run the package selection script
if ! sh ./scripts/package_selection.sh; then
  exit 1
fi
