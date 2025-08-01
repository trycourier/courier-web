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

# ── helper vars ───────────────────────────────────────────────────────────
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"   #   /abs/path/to/scripts
package_name="$1"                                            #   @trycourier/courier-js
package_dir="$script_dir/../$package_name"                   #   ../@trycourier/courier-js

# ── check args ────────────────────────────────────────────────────────────
if [[ -z "${package_name:-}" ]]; then
  gum style --foreground 196 "Please provide package name"
  exit 1
fi

# ── ensure GitHub CLI ─────────────────────────────────────────────────────
if ! command -v gh &>/dev/null; then
  gum style --foreground 196 "GitHub CLI is not installed"
  gum style --foreground 208 "Installing GitHub CLI…"
  case "$OSTYPE" in
    darwin*)  brew install gh ;;
    linux-gnu*) sudo apt-get install -y gh ;;
    *) gum style --foreground 196 "Unsupported OS for automatic installation"; exit 1 ;;
  esac
fi

# ── read package version ──────────────────────────────────────────────────
version=$(node -p "require('$package_dir/package.json').version")

# ── current Git branch ────────────────────────────────────────────────────
current_branch=$(git branch --show-current)

# ── user confirmation ─────────────────────────────────────────────────────
gum style --foreground 208 "About to release $package_name@$version. This will:"
gum style --foreground 208 "  1. Commit & push changes"
gum style --foreground 208 "  2. Create a GitHub release"
gum style --foreground 208 "  3. Publish to npm"
gum confirm "Proceed?" || { gum style --foreground 196 "Release cancelled"; exit 1; }

# ── Git commit & push ─────────────────────────────────────────────────────
gum style --foreground 46 "Pushing changes to git…"
git add .
git commit -m "chore: release $package_name@$version" || true  # no-op if nothing to commit
git push origin "$current_branch"

# ── GitHub release ────────────────────────────────────────────────────────
gum style --foreground 46 "Creating GitHub release…"
gh release create "$package_name@v$version" \
  --title "$package_name@$version" \
  --notes "Release of $package_name@$version"

# ── npm publish ───────────────────────────────────────────────────────────
gum confirm "Ready to publish to npm?" || { gum style --foreground 196 "npm publish cancelled"; exit 1; }

pushd "$package_dir" >/dev/null
gum style --foreground 46 "Publishing $package_name@$version to npm…"
if [[ "$version" == *"-beta"* ]]; then
  npm publish --access public --tag beta
else
  npm publish --access public
fi
popd >/dev/null   # ← we are back in $script_dir

# ── success banner ────────────────────────────────────────────────────────
gum style --border normal --border-foreground 212 --padding "0 1" "$(
  gum style --foreground 212 "Package successfully published!"
  gum style --foreground 212 "👉 https://www.npmjs.com/package/$package_name"
  gum style --foreground 212 "Install with:"
  gum style --foreground 212 "   npm i $package_name@$version"
)"

# ── bump internal dependencies ────────────────────────────────────────────
bash "$script_dir/bump_dependencies.sh" "$package_name"
