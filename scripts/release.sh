#!/bin/sh

# Run git checks
sh "$(dirname "$0")/check_git.sh" || exit 1

# Run git checks
sh "$(dirname "$0")/incremement_version.sh" "$1" || exit 1

# Run push release
sh "$(dirname "$0")/release_package.sh" "$1" || exit 1
