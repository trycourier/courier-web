#!/bin/bash

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
gum style --foreground 46 "Running tests for $1..."
cd "$package_dir" && yarn test

# Store the exit code from npm test
test_exit_code=$?
# Check if tests passed based on the exit code
if [ $test_exit_code -eq 0 ]; then
  gum style --foreground 46 "Tests passed for $1"
else
  gum style --foreground 196 "Some tests failed for $1"
  # Ask for confirmation to continue
  if gum confirm "Continue to next step anyway?"; then
    gum style --foreground 208 "Continuing to next step..."
  else
    exit 1
  fi
fi
