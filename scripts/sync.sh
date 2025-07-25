#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

source "$SCRIPT_DIR/nvm-use.sh"

# Function to clean up dependencies
cleanup_dependencies() {
    cd "$ROOT_DIR"
    yarn cache clean
    rm -rf node_modules
    rm -rf **/node_modules
    rm yarn.lock
    yarn install
}

# Function to build a package
build_package() {
    local package_name=$1
    cd "$ROOT_DIR/$package_name"
    yarn install
    yarn build
    cd "$ROOT_DIR"
}

# Function to install example dependencies
install_example() {
    local example_name=$1
    cd "$ROOT_DIR/examples/$example_name"
    npm install
    cd "$ROOT_DIR"
}

nvm_use

# Main execution
cleanup_dependencies

# Build all packages
build_package "@trycourier/courier-js"
build_package "@trycourier/courier-ui-core"
build_package "@trycourier/courier-ui-inbox"
build_package "@trycourier/courier-react"

# Install example dependencies
install_example "next-latest"
