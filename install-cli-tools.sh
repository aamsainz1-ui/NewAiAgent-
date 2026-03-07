#!/bin/bash
# Install CLI tools for OpenClaw skills

echo "📦 Starting CLI tools installation..."

# Install blogwatcher
echo "1. Installing blogwatcher..."
npm install -g blogwatcher
if [ $? -eq 0 ]; then
  echo "✅ blogwatcher installed"
else
  echo "❌ blogwatcher installation failed"
fi

# Install 1password CLI
echo "2. Installing 1password CLI..."
# Download and install op CLI for Linux
OP_VERSION="1.13.1"
OP_URL="https://1password.com/downloads/command-line"
# Note: Manual installation required - download op_linux_amd64.deb
echo "⚠️  1password CLI requires manual download from:"
echo "   $OP_URL"
echo "   sudo dpkg -i op_linux_amd64.deb"
echo "   op login <your-account>"

echo ""
echo "✅ Installation complete!"
echo ""
echo "Remaining skills to enable:"
echo "- 1password: Download and install op CLI manually"
echo "- apple-notes, bear-notes, things-mac: macOS only"
echo "- discord: Configure Discord OAuth2"
echo "- slack: Connect Slack workspace"
echo "- telegram: Connect Telegram bot"
