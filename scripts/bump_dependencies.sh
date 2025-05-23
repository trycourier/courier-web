#!/usr/bin/env bash

# Get the new version
new_version=$(node -p "require('$1/package.json').version")
gum style --foreground 46 "Updating peer dependencies for $1@$new_version..."

# Handle courier-js dependencies
if [[ "$1" == "@trycourier/courier-js" ]]; then
  dep_dir="$(dirname "$0")/../@trycourier/courier-ui-inbox"
  if [ -d "$dep_dir" ]; then
    gum style --foreground 46 "Updating courier-ui-inbox peer dependency..."
    cd "$dep_dir"
    npm pkg set "peerDependencies.$1=$new_version"
    cd "$package_dir"
  fi
fi

# Handle courier-ui-core dependencies
if [[ "$1" == "@trycourier/courier-ui-core" ]]; then
  dep_dir="$(dirname "$0")/../@trycourier/courier-ui-inbox"
  if [ -d "$dep_dir" ]; then
    gum style --foreground 46 "Updating courier-ui-inbox peer dependency..."
    cd "$dep_dir"
    npm pkg set "peerDependencies.$1=$new_version"
    cd "$package_dir"
  fi
fi

# Handle courier-ui-inbox dependencies
if [[ "$1" == "@trycourier/courier-ui-inbox" ]]; then
  dep_dir="$(dirname "$0")/../@trycourier/courier-react"
  if [ -d "$dep_dir" ]; then
    gum style --foreground 46 "Updating courier-react peer dependency..."
    cd "$dep_dir"
    npm pkg set "peerDependencies.$1=$new_version"
    cd "$package_dir"
  fi
fi