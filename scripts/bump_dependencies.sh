#!/usr/bin/env bash
set -euo pipefail

########################################
# Usage: ./bump_dependencies.sh @scope/package
########################################

# e.g. @trycourier/courier-js
package_name="$1"
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ── read the new version from THAT package’s package.json ───────────────
new_version=$(node -p "require('$1/package.json').version")
gum style --foreground 46 "Updating dependencies for $package_name@$new_version"

# helper – updates deps in every target dir passed in
update_deps () {
  # array of package folders (no scope)
  local targets=("$@")
  for target in "${targets[@]}"; do
    update_all_deps_for_package "$target" "$package_name" "$new_version"
  done
}

# Usage: update_all_deps_for_package courier-ui-inbox @trycourier/courier-js 2.0.0
# For a given target, package name, and version, update dependencies, devDependencies, and/or peerDependencies if present
update_all_deps_for_package () {
  local target="$1"
  local package_name="$2"
  local package_version="$3"
  local dep_dir="$script_dir/../@trycourier/$target"

  # Return early if dep_dir does not exist
  [[ -d "$dep_dir" ]] || return

  local pkg_json="$dep_dir/package.json"
  # Return early if package.json does not exist
  [[ -f "$pkg_json" ]] || return

  local updated=0

  # Check and update dependencies
  if node -e "const p=require('$pkg_json');process.exit(p.dependencies && p.dependencies['$package_name'] ? 0 : 1)"; then
    gum style --foreground 21 " ↳ $target → dependencies.$package_name@$package_version"
    ( cd "$dep_dir" && npm pkg set "dependencies.$package_name=$package_version" )
    updated=1
  fi

  # Check and update devDependencies
  if node -e "const p=require('$pkg_json');process.exit(p.devDependencies && p.devDependencies['$package_name'] ? 0 : 1)"; then
    gum style --foreground 36 " ↳ $target → devDependencies.$package_name@$package_version"
    ( cd "$dep_dir" && npm pkg set "devDependencies.$package_name=$package_version" )
    updated=1
  fi

  # Check and update peerDependencies
  if node -e "const p=require('$pkg_json');process.exit(p.peerDependencies && p.peerDependencies['$package_name'] ? 0 : 1)"; then
    gum style --foreground 99 " ↳ $target → peerDependencies.$package_name@$package_version"
    ( cd "$dep_dir" && npm pkg set "peerDependencies.$package_name=$package_version" )
    updated=1
  fi

  if [[ $updated -eq 0 ]]; then
    gum style --foreground 244 " ↳ $target: $package_name not found in dependencies"
  fi
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
  "@trycourier/courier-react-components")
    update_deps courier-react courier-react-17
    ;;
  *)
    gum style --foreground 196 "No dep rules defined for $package_name"
    ;;
esac
