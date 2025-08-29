#!/usr/bin/env bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

source "$SCRIPT_DIR/nvm-use.sh"

cd "$ROOT_DIR"
nvm_use

# Make sure deps are up to date
yarn install

# Build all @trycourier/* packages
yarn build-packages
