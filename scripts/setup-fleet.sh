#!/bin/bash
# setup-fleet.sh - One-click setup for 8-node Browser Fleet
# Usage: ./setup-fleet.sh

set -e

echo "🚀 OpenClaw 8-Node Browser Fleet Setup"
echo "======================================"

# Configuration
GATEWAY_TOKEN=$(grep -o '"token": "[^"]*"' /root/.openclaw/openclaw.json 2>/dev/null | head -1 | cut -d'"' -f4)
if [ -z "$GATEWAY_TOKEN" ]; then
    echo "❌ Error: Could not extract GATEWAY_TOKEN from /root/.openclaw/openclaw.json"
    echo "   Please ensure OpenClaw is configured first."
    exit 1
fi

echo "✓ Gateway token found"

# Docker containers already running - just need to connect nodes
# Check if containers exist
if ! docker ps | grep -q "openclaw-node"; then
    echo "❌ Error: Docker containers not found. Please run docker-compose first."
    exit 1
fi

echo "✓ Docker containers verified ($(docker ps | grep openclaw-node | wc -l) nodes)"

# Setup tmux session
echo ""
echo "📦 Setting up tmux session for node agents..."
tmux kill-session -t openclaw-nodes 2>/dev/null || true
tmux new-session -d -s openclaw-nodes

# Define nodes
NODES=(
    "1:openclaw-node-apex:18801"
    "2:openclaw-node-pulse:18802"
    "3:openclaw-node-aura:18803"
    "4:openclaw-node-stat:18804"
    "5:openclaw-node-ledger:18805"
    "6:openclaw-node-nexus:18806"
    "7:openclaw-node-cipher:18807"
    "8:openclaw-node-sync:18808"
)

# Launch each node agent
for NODE in "${NODES[@]}"; do
    IFS=':' read -r ID NAME PORT <<< "$NODE"
    
    echo "  → Starting $NAME (port $PORT)..."
    
    # Create config directory
    mkdir -p "/root/.openclaw-${NAME}"
    cat > "/root/.openclaw-${NAME}/openclaw.json" << CFG
{
  "browser": {
    "cdpUrl": "http://127.0.0.1:${PORT}"
  }
}
CFG
    
    # Create tmux window and start node
    tmux new-window -t "openclaw-nodes:${ID}" -n "${NAME}" 2>/dev/null || true
    tmux send-keys -t "openclaw-nodes:${ID}" \
        "OPENCLAW_CONFIG_DIR=/root/.openclaw-${NAME} OPENCLAW_GATEWAY_TOKEN=${GATEWAY_TOKEN} openclaw node run --host 127.0.0.1 --port 18789 --display-name \"${NAME}\"" C-m
    
    sleep 0.5
done

echo ""
echo "✅ All 8 node agents launched in tmux session 'openclaw-nodes'"
echo ""
echo "📊 Checking status..."
sleep 2
openclaw nodes status 2>/dev/null || echo "   (Gateway may need restart to see new nodes)"

echo ""
echo "🔧 Next steps:"
echo "   1. Check node status: openclaw nodes status"
echo "   2. View logs: tmux attach -t openclaw-nodes"
echo "   3. Pair nodes: openclaw nodes approve <device-id>"
echo ""
echo "💡 Tip: Run 'watch -n 2 openclaw nodes status' to monitor connections"
