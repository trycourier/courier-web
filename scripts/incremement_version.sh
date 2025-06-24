#!/bin/sh

# Check if package name is provided
if [ -z "$1" ]; then
  gum style --foreground 196 "Please provide package name"
  exit 1
fi

# Define the package directory
package_dir="$(dirname "$0")/../$1"

# Check if package directory exists
if [ ! -d "$package_dir" ]; then
  gum style --foreground 196 "Package directory not found: $package_dir"
  exit 1
fi

# Navigate to package directory
cd "$package_dir"

# Get current version from package.json
current_version=$(node -p "require('./package.json').version")

# Extract base version and pre-release suffix if any
base_version=$(echo "$current_version" | sed -E 's/([0-9]+\.[0-9]+\.[0-9]+).*/\1/')
pre_release=$(echo "$current_version" | sed -n -E 's/[0-9]+\.[0-9]+\.[0-9]+(.*)/\1/p')

# Split base version into components
IFS='.' read -r major minor patch <<< "$base_version"

# Calculate potential new versions
patch_version="$major.$minor.$((patch + 1))$pre_release"
minor_version="$major.$((minor + 1)).0$pre_release"
major_version="$((major + 1)).0.0$pre_release"

# Show version selection menu
selected_type=$(gum choose --header "Select version (current: $current_version)" \
  "patch (new: $patch_version)" \
  "minor (new: $minor_version)" \
  "major (new: $major_version)" \
  "custom")

# Extract version type from selection
version_type=$(echo "$selected_type" | cut -d' ' -f1)

# Increment version based on type
case "$version_type" in
  "patch")
    new_version="$patch_version"
    ;;
  "minor")
    new_version="$minor_version"
    ;;
  "major")
    new_version="$major_version"
    ;;
  "custom")
    new_version=$(gum input --header "Enter custom version (current: $current_version)" --value "$current_version")
    ;;
  *)
    gum style --foreground 196 "Invalid version type selected"
    exit 1
    ;;
esac

# Update package.json with new version
npm version "$new_version" --no-git-tag-version

# Update README.md install line if present
pkg_name=$(node -p "require('./package.json').name")
readme_file="../../${pkg_name}/README.md"
if [ -f "$readme_file" ]; then
  # Use sed for in-place replacement of the install line
  sed -i.bak -E "s|(npm i[[:space:]]+$pkg_name@)[^[:space:]'\"]+|\1$new_version|g" "$readme_file" && rm -f "$readme_file.bak"
  gum style --foreground 46 "Updated README.md install line to $pkg_name@$new_version"
else
  gum style --foreground 220 "README.md not found at $readme_file, skipping install line update"
fi

gum style --foreground 46 "Version incremented to $new_version"
