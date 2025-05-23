# Check if gh is installed
if ! command -v gh &> /dev/null; then
  gum style --foreground 196 "GitHub CLI is not installed"
  gum style --foreground 208 "Installing GitHub CLI..."
  if [[ "$OSTYPE" == "darwin"* ]]; then
    brew install gh
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    sudo apt-get install gh
  else
    gum style --foreground 196 "Unsupported OS for automatic installation"
    exit 1
  fi
fi

# Get package name from argument
if [ -z "$1" ]; then
  gum style --foreground 196 "Please provide package name"
  exit 1
fi

# Get version from package.json
package_dir="$(dirname "$0")/../$1"
version=$(node -p "require('$package_dir/package.json').version")

# Get current branch
current_branch=$(git branch --show-current)

# Show release confirmation
gum style --foreground 208 "About to release $1@$version. This will:"
gum style --foreground 208 "1. Push changes to git"
gum style --foreground 208 "2. Create a GitHub release"
gum style --foreground 208 "3. Publish to npm"

if ! gum confirm "Do you want to proceed with the release?"; then
  gum style --foreground 196 "Release cancelled"
  exit 1
fi

# Push changes to git
gum style --foreground 46 "Pushing changes to git..."
git add .
git commit -m "chore: release $1@$version"
git push origin "$current_branch"

# Create GitHub release
gum style --foreground 46 "Creating GitHub release for $1@$version..."
gh release create "v$version" --title "$1@$version" --notes "Release of $1@$version"

# Show npm publish confirmation
if ! gum confirm "Ready to publish to npm. Proceed?"; then
  gum style --foreground 196 "npm publish cancelled"
  exit 1
fi

# Publish to npm
gum style --foreground 46 "Publishing $1@$version to npm..."
cd "$package_dir"

# Check if version is a prerelease
if [[ "$version" == *"-"* ]]; then
  npm publish --tag beta
else
  npm publish
fi

# Show success message
gum style --border normal --border-foreground 212 --padding "0 1" "$(
  gum style --foreground 212 "Package successfully published to npm! View it here:"
  gum style --foreground 212 "👉 https://www.npmjs.com/package/$1"
  gum style --foreground 212 "To install the package, run:"
  gum style --foreground 212 "npm i $1@$version"
)"

# Bump dependencies
bash "$(dirname "$0")/bump_dependencies.sh" "$1"