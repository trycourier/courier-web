#!/bin/bash

# Check if gum is installed, if not install it
if ! command -v gum &> /dev/null; then
    gum style --foreground 196 "gum is not installed. Please install gum: https://github.com/charmbracelet/gum"
    exit 1
fi

# Check if qrencode is installed, if not install it
if ! command -v qrencode &> /dev/null; then
    gum style --foreground 226 "Installing qrencode..."
    brew install qrencode
fi

# Prompt for port using gum, default to 5173, styled in cyan
PORT=$(gum input --placeholder "5173" --value "5173" --prompt "$(gum style --foreground 51 'Enter localhost port: ')")
PORT=${PORT:-5173}

# Get the IP address
IP=$(ipconfig getifaddr en0)
if [ -z "$IP" ]; then
    IP=$(ipconfig getifaddr en1)
fi

# Create the URL with the selected port
URL="http://${IP}:${PORT}"

# Display the URL
gum style --foreground 33 "URL: $URL"

# Generate and display QR code
qrencode -t ANSI "$URL"
