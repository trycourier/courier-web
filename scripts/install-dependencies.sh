#!/bin/bash

# Define packages to install
packages=("gum")

# Check and install each package
for package in "${packages[@]}"; do
  if ! command -v "$package" &> /dev/null; then
    echo "📦 Installing $package..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
      brew install "$package"
    elif [[ -f /etc/debian_version ]]; then
      sudo apt-get update && sudo apt-get install -y "$package"
    elif [[ -f /etc/redhat-release ]]; then
      sudo yum install -y "$package"
    else
      echo "❌ Could not install $package. Please install it manually."
      exit 1
    fi
  fi
done