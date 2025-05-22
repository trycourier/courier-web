#!/bin/sh

# Run git checks
sh "$(dirname "$0")/check_git.sh" || exit 1

echo "Releasing package: $1"
