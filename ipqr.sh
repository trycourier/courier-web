#!/bin/bash

# Check if qrencode is installed, if not install it
if ! command -v qrencode &> /dev/null; then
    echo "Installing qrencode..."
    brew install qrencode
fi

# Get the IP address
IP=$(ipconfig getifaddr en0)
if [ -z "$IP" ]; then
    IP=$(ipconfig getifaddr en1)
fi

# Create the URL with port 5173
URL="http://${IP}:5173"

# Display the URL
echo "URL: $URL"

# Generate and display QR code
qrencode -t ANSI "$URL"
