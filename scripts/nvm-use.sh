#!/bin/bash

function nvm_use() {
  # Source nvm if it's not already available
  if ! type nvm &> /dev/null; then
    # Try to source nvm from common locations
    if [ -s "$HOME/.nvm/nvm.sh" ]; then
      source "$HOME/.nvm/nvm.sh"
    elif [ -s "/opt/homebrew/opt/nvm/nvm.sh" ]; then
      source "/opt/homebrew/opt/nvm/nvm.sh"
    else
      echo "Error: nvm is not installed or not available on your PATH." >&2
      echo "See https://github.com/nvm-sh/nvm#installing-and-updating" >&2
      exit 1
    fi
  fi

  # Check if nvm is now available
  if ! type nvm &> /dev/null; then
    echo "Error: Failed to load nvm after sourcing." >&2
    exit 1
  fi

  nvm use
}
