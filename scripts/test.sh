#!/bin/bash

# Check if package name is provided
if [ -z "$1" ]; then
  echo "❌ Please provide a package name"
  exit 1
fi

# Define the package directory
package_dir="packages/$1"

# Check if package directory exists
if [ ! -d "$package_dir" ]; then
  echo "❌ Package directory not found: $package_dir"
  exit 1
fi

# Navigate to package directory and run tests
echo "🧪 Running tests for $1..."
cd "$package_dir" && npm test

# Check if tests passed
if [ $? -eq 0 ]; then
  echo "✅ Tests passed for $1"
else
  echo "❌ Tests failed for $1"
  exit 1
fi
