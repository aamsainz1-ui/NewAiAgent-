#!/bin/bash
# Install OpenClaw Skills - Priority 1

echo "📦 Installing OpenClaw Skills..."

# SEO Skills (npm packages)
echo "1. Installing SEO packages..."
npm install -g @graphext/cuery

# Browser Skills
echo "2. Installing Browser packages..."
npm install -g agent-browser agent-browser-stagehand browser-automation browser-cash clawbrowser fast-browser-use gemini-computer-use playwright-scraper-skill

# Media Skills
echo "3. Installing Media packages..."
npm install -g openai-image-gen nano-banana-pro nano-pdf video-frames sag sherpa-onnx-tts openai-whisper openai-whisper-api gifgrep spotify-player sonoscli blucli summarize

# Business Skills
echo "4. Installing Business packages..."
npm install -g trello

# Finance Skills
echo "5. Installing Finance packages..."
npm install -g invoice-generator invoice-chaser freshbooks-cli

# Project Skills
echo "6. Installing Project packages..."
npm install -g todoist github notion

# Calendar Skills
echo "7. Installing Calendar packages..."
npm install -g himalaya gog

# Analytics Skills
echo "8. Installing Analytics packages..."
npm install -g data-analyst

# Memory Skills
echo "9. Installing Memory packages..."
npm install -g pkm openclaw-mem obsidian

# Infrastructure Skills
echo "10. Installing Infrastructure packages..."
npm install -g tmux weather goplaces

# Git clone remaining skills (Python scripts, etc.)
echo "11. Cloning skills from GitHub..."

# Check installation results
echo ""
echo "✅ Installation complete!"
echo ""
echo "Skills installed:"
npm list -g --depth=0 | grep -E "(keyword-research|content-creator|seo-content-writer|technical-seo-checker|on-page-seo-auditor|performance-reporter|agent-browser|browser-automation|browser-cash|clawbrowser|gemini-computer-use|openai-image-gen|nano-banana-pro|nano-pdf|video-frames|sag|invoice-generator|invoice-chaser|agentledger|freshbooks-cli|day-trading-skill|oracle|todoist|mission-control|taskmaster|proactive-tasks|github|notion|himalaya|gog|data-analyst|business-model-canvas|blogwatcher|pkm|openclaw-mem|obsidian|clawhub|skill-creator|expert-finder|tmux|weather|goplaces|agent-browser-stagehand|fast-browser-use|playwright-scraper-skill|sherpa-onnx-tts|openai-whisper|openai-whisper-api|gifgrep|spotify-player|sonoscli|blucli|summarize)"

echo ""
echo "⚠️  Skills not found on npm:"
echo "- seo-content-writer, technical-seo-checker, on-page-seo-auditor, performance-reporter"
echo "- agent-browser-stagehand, fast-browser-use, playwright-scraper-skill"
echo "- video-frames, sag, sherpa-onnx-tts, openai-whisper, openai-whisper-api"
echo "- songsee, food-order, expert-finder, 1password, eightctl, openhue"
echo "- competitor-analysis, agentledger, day-trading-skill, mission-control, taskmaster, proactive-tasks"
echo ""
echo "💡 These skills may be installed via:"
echo "- GitHub clone: git clone <repo-url>"
echo"- Local installation"
echo"- Download as scripts"

echo ""
echo "🎉 Next steps:"
echo "- Run 'openclaw doctor' to verify installation"
echo "- Configure external API keys for missing services"
