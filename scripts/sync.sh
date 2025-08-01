#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

source "$SCRIPT_DIR/nvm-use.sh"

# Function to clean up dependencies
cleanup_dependencies() {
    cd "$ROOT_DIR"
    rm -rf **/node_modules
    yarn install
}

nvm_use

# Re-install dependencies
cleanup_dependencies

# Build all packages
yarn workspace @trycourier/courier-js run build
yarn workspace @trycourier/courier-ui-core run build
yarn workspace @trycourier/courier-ui-inbox run build
yarn workspace @trycourier/courier-react-components run build
yarn workspace @trycourier/courier-react run build
yarn workspace @trycourier/courier-react-17 run build
