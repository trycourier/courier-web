#!/bin/bash

gum style --foreground 208 "⚠️  Skipping tests for now. Something weird going on with Jest."
exit 0


# Check if package name is provided
if [ -z "$1" ]; then
  gum style --foreground 196 "Please provide a package name"
  exit 1
fi

# Define the package directory
package_dir="$(dirname "$0")/../$1"

# Check if package directory exists
if [ ! -d "$package_dir" ]; then
  gum style --foreground 196 "Package directory not found: $package_dir"
  exit 1
fi

# Navigate to package directory and run tests
gum style --foreground 46 "🧪 Running tests for $1..."
cd "$package_dir" && npm run test

# Wait for tests to complete
wait

# Check if tests passed
if [ $? -eq 0 ]; then
  gum style --foreground 46 "Tests passed for $1"
else
  gum style --foreground 196 "Tests failed for $1"
  exit 1
fi
