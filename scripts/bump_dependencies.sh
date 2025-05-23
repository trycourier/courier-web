#!/usr/bin/env bash

# Get the new version
new_version=$(node -p "require('$1/package.json').version")
gum style --foreground 46 "Updating peer dependencies for $1@$new_version..."

# Handle courier-js dependencies
if [[ "$1" == "@trycourier/courier-js" ]]; then
  for dep in "courier-ui-inbox" "courier-react"; do
    dep_dir="$(dirname "$0")/../@trycourier/$dep"
    if [ -d "$dep_dir" ]; then
      gum style --foreground 46 "Updating $dep peer dependency..."
      cd "$dep_dir"
      npm pkg set "dependencies.$1=$new_version"
      cd "$package_dir"
    fi
  done
fi

# Handle courier-ui-core dependencies
if [[ "$1" == "@trycourier/courier-ui-core" ]]; then
  for dep in "courier-ui-inbox" "courier-react"; do
    dep_dir="$(dirname "$0")/../@trycourier/$dep"
    if [ -d "$dep_dir" ]; then
      gum style --foreground 46 "Updating $dep peer dependency..."
      cd "$dep_dir"
      npm pkg set "dependencies.$1=$new_version"
      cd "$package_dir"
    fi
  done
fi

# Handle courier-ui-inbox dependencies
if [[ "$1" == "@trycourier/courier-ui-inbox" ]]; then
  for dep in "courier-react"; do
    dep_dir="$(dirname "$0")/../@trycourier/$dep"
    if [ -d "$dep_dir" ]; then
      gum style --foreground 46 "Updating $dep peer dependency..."
      cd "$dep_dir"
      npm pkg set "dependencies.$1=$new_version"
      cd "$package_dir"
    fi
  done
fi