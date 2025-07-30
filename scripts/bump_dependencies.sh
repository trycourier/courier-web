#!/usr/bin/env bash
set -euo pipefail

########################################
# Usage: ./bump_dependencies.sh @scope/package
########################################

package_name="$1"                       # e.g. @trycourier/courier-js
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ── read the new version from THAT package’s package.json ───────────────
new_version=$(node -p "require('$1/package.json').version")
gum style --foreground 46 "Updating dependencies for $package_name@$new_version"

# helper – updates deps in every target dir passed in
update_deps () {
  local targets=("$@")                  # array of package folders (no scope)
  for target in "${targets[@]}"; do
    local dep_dir="$script_dir/../@trycourier/$target"
    if [[ -d "$dep_dir" ]]; then
      gum style --foreground 21 " ↳ $target → $package_name@$new_version"
      ( cd "$dep_dir" && npm pkg set "dependencies.$package_name=$new_version" )
    fi
  done
}

# ── route by the *source* package we just published ─────────────────────
case "$package_name" in
  "@trycourier/courier-js")
    update_deps courier-ui-inbox courier-react-components courier-react courier-react-17
    ;;
  "@trycourier/courier-ui-core")
    update_deps courier-ui-inbox courier-react-components courier-react courier-react-17
    ;;
  "@trycourier/courier-ui-inbox")
    update_deps courier-react-components courier-react courier-react-17
    ;;
  *)
    gum style --foreground 196 "No dep rules defined for $package_name"
    ;;
esac
