#!/bin/sh

# Check we're on main
sh "$(dirname "$0")/check_git.sh" || exit 1

# Increment the major/minor/patch version of the package
sh "$(dirname "$0")/incremement_version.sh" "$1" || exit 1

# Release to npm and create a GitHub release
sh "$(dirname "$0")/release_package.sh" "$1" || exit 1
