# Node Assignments - Executive Board Fleet

## Current Fleet Status (8 Nodes Deployed)

| Node Name | Role | Port | CDP URL | Status | Assigned To |
|-----------|------|------|---------|--------|-------------|
| openclaw-node-apex | CEO | 18801 | http://localhost:18801 | ⚠️ Disconnected | Apex (Chief Executive) |
| openclaw-node-pulse | CMO | 18802 | http://localhost:18802 | ⚠️ Disconnected | Pulse (Chief Marketing) |
| openclaw-node-aura | CSO | 18803 | http://localhost:18803 | ⚠️ Disconnected | Aura (Chief Customer Success) |
| openclaw-node-stat | CAO | 18804 | http://localhost:18804 | ⚠️ Disconnected | Stat (Chief Analyst) |
| openclaw-node-ledger | CFO | 18805 | http://localhost:18805 | ⚠️ Disconnected | Ledger (Chief Financial) |
| openclaw-node-nexus | COO | 18806 | http://localhost:18806 | ⚠️ Disconnected | Nexus (Chief Operations) |
| openclaw-node-cipher | CIO | 18807 | http://localhost:18807 | ⚠️ Disconnected | Cipher (Chief Intelligence) |
| openclaw-node-sync | CHRO | 18808 | http://localhost:18808 | ✅ Connected | Sync (Chief HR) |

## Active Node (Ready for Immediate Use)

**🟢 Node: openclaw-node-sync (CHRO)**
- **Port:** 18808
- **CDP URL:** http://localhost:18808
- **Status:** Connected and operational
- **Primary Use:** HR tasks, team coordination, KPI tracking

## How to Use

### Direct CDP Commands (Bypass OpenClaw pairing)
```bash
# Open a webpage
curl -X PUT http://localhost:18808/json/new?https://ufax9.com

# Take screenshot
curl -X POST http://localhost:18808/devtools/page/[PAGE_ID]/captureScreenshot

# Get page DOM
curl http://localhost:18808/json
```

### Through OpenClaw (when paired)
```bash
# Check node status
openclaw nodes status

# Invoke browser proxy
openclaw nodes invoke --node openclaw-node-sync --command browser.proxy --params '{"path":"/tabs"}'
```

## Role Responsibilities by Node

### 1. Apex (CEO) - Node 18801
- Overall strategy and coordination
- Final decision making
- Cross-department orchestration

### 2. Pulse (CMO) - Node 18802  
- Marketing campaigns
- Content creation
- SEO and competitor analysis

### 3. Cipher (CIO) - Node 18807
- Competitive intelligence
- Market research
- Data scraping

### 4. Stat (CAO) - Node 18804
- Sports analytics
- Statistical modeling
- Prediction algorithms

### 5. Ledger (CFO) - Node 18805
- Financial tracking
- ROI calculations
- Budget monitoring

### 6. Nexus (COO) - Node 18806
- Operations automation
- System monitoring
- Process optimization

### 7. Aura (CSO) - Node 18803
- Customer retention
- CRM management
- User segmentation

### 8. Sync (CHRO) - Node 18808 ⭐ ACTIVE
- Team coordination
- Task delegation
- Performance tracking

## Troubleshooting

If nodes show "disconnected":
1. Check tmux session: `tmux attach -t openclaw-nodes`
2. Restart node agents: `./scripts/setup-fleet.sh`
3. Monitor pairing: `watch -n 2 openclaw nodes pending`
